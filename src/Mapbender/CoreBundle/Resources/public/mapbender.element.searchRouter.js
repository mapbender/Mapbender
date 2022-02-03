(function($){

    $.widget('mapbender.mbSearchRouter', {
        options: {
        },
        callbackUrl: null,
        selected: null,
        highlightLayer: null,
        popup: null,
        mbMap: null,
        useDialog_: null,

        _create: function() {
            var self = this;
            this.callbackUrl = Mapbender.configuration.application.urls.element + '/' + this.element.attr('id') + '/';
            this.useDialog_ = !this.element.closest('.sideContent, .mobilePane').length;
            Mapbender.elementRegistry.waitReady('.mb-element-map').then(function(mbMap) {
                self.mbMap = mbMap;
                self._setup();
            }, function() {
                Mapbender.checkTarget('mbSearchRouter');
            });
        },

        /**
         * Remove last search results
         */
        removeLastResults: function(){
            if (this.highlightLayer) {
                this.highlightLayer.clear();
            }
            this.currentFeature = null;
        },
        _setup: function() {
            var widget = this;
            var element = widget.element;

            var routeSelect = $('select#search_routes_route', element);
            var routeCount;

            element.on('submit', '.search-forms form', function(evt) {
                evt.preventDefault();
                widget._search();
            });
            element.on('reset', '.search-forms form', function() {
                widget.removeLastResults();
            });
            // Prepare autocompletes
            $('form input[data-autocomplete="on"]', element).each(
                $.proxy(widget._setupAutocomplete, widget));
            $('form input[data-autocomplete^="custom:"]', element).each(
                $.proxy(widget._setupCustomAutocomplete, widget));

            // Listen to changes of search select (switching and forms resetting)
            routeSelect.on('change', $.proxy(this._selectSearch, this));
            routeCount = Object.keys(this.options.routes).length;
            // But if there's only one search, we actually don't need the select
            if(routeCount === 1){
                $('#search_routes_route_control_group').hide()
                    .next('hr').hide();
            }

            element.on('click', '.search-action-buttons [data-action]', function() {
                switch($(this).attr('data-action')) {
                    case ('reset'):
                        widget._reset();
                        break;
                    case ('search'):
                        widget._search();
                        break;
                }
            });

            this.highlightLayer = Mapbender.vectorLayerPool.getElementLayer(this, 0);
            $(document).on('mbmapsrschanged', this._onSrsChange.bind(this));
            this._setupResultCallback();
            this._trigger('ready');
            if (this.options.autoOpen) {
                this.open();
            }
            routeSelect.trigger('change');
        },

        defaultAction: function(callback){
            this.open(callback);
        },
        /**
         * Open popup dialog, when triggered by button; not in sidepane / mobile container
         */
        open: function(callback){
            this.callback = callback ? callback : null;
            if (this.useDialog_) {
                if(!this.popup || !this.popup.$element){
                    this.popup = new Mapbender.Popup2({
                        title: this.element.attr('data-title'),
                        draggable: true,
                        modal: false,
                        closeOnESC: false,
                        content: this.element,
                        width: this.options.width ? this.options.width : 450,
                        resizable: true,
                        height: this.options.height ? this.options.height : 500,
                        buttons: {
                            'cancel': {
                                label: Mapbender.trans('mb.actions.cancel'),
                                cssClass: 'button buttonCancel critical right',
                                callback: $.proxy(this.close, this)
                            },
                            'reset': {
                                label: Mapbender.trans('mb.actions.reset'),
                                cssClass: 'button right',
                                callback: $.proxy(this._reset, this)
                            },
                            'ok': {
                                label: Mapbender.trans("mb.actions.search"),
                                cssClass: 'button right',
                                callback: $.proxy(this._search, this)
                            }
                        }
                    });
                    this.popup.$element.on('close', $.proxy(this.close, this));
                }
                this.element.show();
            }
        },

        /**
         * Closes popup dialog.
         */
        close: function(){
            if (this.popup) {
                if (this.popup.$element) {
                    this.element.hide().appendTo($('body'));
                    this.popup.destroy();
                }
                this.popup = null;
            }
            if (this.callback) {
                (this.callback)();
                this.callback = null;
            }
        },

        /**
         * Set up result table when a search was selected.
         *
         * @param  jqEvent event Change event
         */
        _selectSearch: function(event){
            var selected = this.selected = $(event.target).val();

            $('form', this.element).each(function(){
                var form = $(this);
                if(form.attr('name') === selected) {
                    form.show();
                }else{
                    form.hide();
                }
                form.get(0).reset();
            });

            $('.search-results', this.element).empty();
            var route = this.getCurrentRoute();
            if (Mapbender.mapEngine.code === 'ol2') {
                this.highlightLayer.getNativeLayer().styleMap = this._createStyleMap(route.results.styleMap);
            } else {
                this.featureStyles = this._createStyleMap4(route.results.styleMap);
            }
        },

        /**
         * Reset current search form
         */
        _reset: function() {
            $('select#search_routes_route', this.element).change();
            this.currentFeature = null;
        },

        /**
         * Set up autocomplete widgets for all inputs with data-autcomplete="on"
         *
         * @param {*} idx
         * @param {Node} input
         */
        _setupAutocomplete: function(idx, input){
            var self = this;
            var $input = $(input);

            $input.autocomplete({
                appendTo: $input.closest('.form-group'),
                delay: $input.data('autocomplete-delay') || 500,
                minLength: $input.data('autocomplete-minlength') || 3,
                search: function(event) {
                    self._autocompleteSearch(event);
                    $input.autocomplete("close");
                },
                open: function(event, ui, t) {
                    $(event.target).data("uiAutocomplete").menu.element.outerWidth($input.outerWidth());
                },
                source: function(request, response){
                    self._autocompleteSource($input).then(function(data) {
                        response(data.results);
                    }, function() {
                        response([]);
                    });
                }
            });
        },

        /**
         * Set up autocpmplete provided by custom widget (data-autcomplete="custom:<widget>")
         *
         * @param  integer      idx   Running index
         * @param  HTMLDomNode  input Input element
         */
        _setupCustomAutocomplete: function(idx, input){
            var plugin = $(input).data('autocomplete').substr(7);
            $(input)[plugin]();
        },

        /**
         * Generate autocomplete request
         *
         * @param {jQuery} $input
         */
        _autocompleteSource: function($input) {
            var url = this.callbackUrl + this.selected + '/autocomplete';
            var formValues = this._getFormValues($input.closest('form'));
            var data = {
                key: $input.attr('name').replace(/^[^[]*\[/, '').replace(/[\]].*$/, ''),
                value: $input.val(),
                srs: this.mbMap.model.getCurrentProjectionCode(),
                extent: this.mbMap.model.getMaxExtentArray(),
                properties: formValues
            };
            return $.getJSON({
                url: url,
                data: JSON.stringify(data),
                method: 'POST'
            });
        },

        /**
         * Autocomplete search handler.
         *
         * Checks if enough time has been passed since the last search. Basically
         * this prevents an autocomplete poping up when a search is triggered by
         * keyboard.
         *
         * @param  jQuery.Event event search event
         * @param  Object       ui    n/a
         */
        _autocompleteSearch: function(event, ui,t){
            var input = $(event.target);
            var autoCompleteMenu = $(input.data("uiAutocomplete").menu.element);
            autoCompleteMenu.addClass("search-router");
        },

        /**
         * Start a search, but only after successful form validation
         */
        _search: function() {
            var form = $('form[name="' + this.selected + '"]', this.element);
            var valid = true;
            $.each($(':input[required]', form), function() {
                if('' === $(this).val()) {
                    valid = false;
                }
            });

            if (valid) {
                var formValues = this._getFormValues(form);
                var data = {
                    properties: formValues,
                    extent: this.mbMap.model.getMaxExtentArray(),
                    srs: this.mbMap.model.getCurrentProjectionCode()
                };
                var url = this.callbackUrl + this.selected + '/search';
                var self = this;
                $.getJSON({
                    url: url,
                    data: JSON.stringify(data),
                    method: 'POST'
                }).then(function(response) {
                    var features = response.features.map(function(data) {
                        var gjInput = {
                            type: 'Feature',
                            geometry: data.geometry,
                            properties: data.properties || {}
                        };
                        return self.mbMap.model.parseGeoJsonFeature(gjInput);
                    });
                    self._searchResults(features);
                });
            }
        },

        /**
         * Prepare search result table
         */
        _prepareResultTable: function(container){
            var currentRoute = this.getCurrentRoute();
            if (!currentRoute || typeof currentRoute.results.headers === 'undefined'){
                return;
            }

            var headers = currentRoute.results.headers;
            var $headers = $(document.createElement('tr'));

            var table = $(document.createElement('table')).addClass('table table-condensed table-striped table-hover');

            for (var header in headers) {
                $headers.append($(document.createElement('th')).text(headers[header]));
            }
            table.append($(document.createElement('thead')).append($headers));
            table.append($('<tbody></tbody>'));

            container.append(table);
        },

        /**
         * Update result list when search model's results property was changed
         */
        _searchResults: function(results) {
            var currentRoute = this.getCurrentRoute();
            this.removeLastResults();
            if (currentRoute && 'table' === currentRoute.results.view) {
                var container = $('.search-results', this.element);
                if($('table', container).length === 0) {
                    this._prepareResultTable(container);
                }
                this._searchResultsTable(results);
            }
            this._showResultState(results);
        },

        /**
         * Rebuilds result table with search result data.
         *
         * @param {Array} features
         */
        _searchResultsTable: function(features) {
            var currentRoute = this.getCurrentRoute();
            var headers = currentRoute.results.headers,
                table = $('.search-results table', this.element),
                tbody = $('<tbody></tbody>'),
                self = this;

            $('tbody', table).remove();
            this.removeLastResults();

            if (features.length > 0) $('.no-results', this.element).hide();

            this.highlightLayer.addNativeFeatures(features);

            for (var i = 0; i < features.length; ++i) {
                var feature = features[i];
                var row = $('<tr/>');
                row.addClass(i % 2 ? "even" : "odd");
                row.data('feature', feature);
                var props = Mapbender.mapEngine.getFeatureProperties(feature);
                Object.keys(headers).map(function(header) {
                    var d = props[header];
                    row.append($('<td>' + (d || '') + '</td>'));
                });

                tbody.append(row);
                this._highlightFeature(feature, 'default');
            }

            table.append(tbody);

            $('.search-results tbody tr')
                .on('click', function () {
                    var feature = $(this).data('feature');
                    self._highlightFeature(feature, 'select');
                    self._hideMobile();
                })
                .on('mouseenter', function () {
                    var feature = $(this).data('feature');
                    self._highlightFeature(feature, 'temporary');
                })
                .on('mouseleave', function () {
                    var feature = $(this).data('feature');
                    var styleName = feature === this.currentFeature ? 'select' : 'default';
                    self._highlightFeature(feature, styleName);
                })
            ;
        },
        _highlightFeature: function (feature, style) {
            if (style === 'select') {
                if (this.currentFeature && feature !== this.currentFeature) {
                    this._highlightFeature(this.currentFeature, 'default');
                }
                this.currentFeature = feature;
            }
            if (Mapbender.mapEngine.code === 'ol2') {
                if (feature.layer) {
                    // use built-in named "renderIntent" mechanism
                    feature.layer.drawFeature(feature, style);
                }
            } else {
                feature.setStyle(this.featureStyles[style]);
            }
        },
        _showResultState: function(results) {
            var widget = this;
            var element = widget.element;
            var table = $('.search-results table', element);
            var counter = $('.result-counter', element);

            if(0 === counter.length) {
                counter = $('<div/>', {'class': 'result-counter'})
                  .prependTo($('.search-results', element));
            }

            if(results.length > 0) {
                counter.text(Mapbender.trans('mb.core.searchrouter.result_counter', {
                    count: results.length
                }));
                table.show();
            } else {
                table.hide();
                counter.text(Mapbender.trans('mb.core.searchrouter.no_results'));
            }
        },
        _createStyleMap4: function(styles) {
            function _createSingleStyle(options) {
                var fill = new ol.style.Fill({
                    color: Mapbender.StyleUtil.svgToCssColorRule(options, 'fillColor', 'fillOpacity')
                });
                var stroke = new ol.style.Stroke({
                    color: Mapbender.StyleUtil.svgToCssColorRule(options, 'strokeColor', 'strokeOpacity'),
                    width: options.strokeWidth || 2
                });
                return new ol.style.Style({
                    image: new ol.style.Circle({
                        fill: fill,
                        stroke: stroke,
                        radius: options.pointRadius || 5
                    }),
                    fill: fill,
                    stroke: stroke
                });
            }
            return {
                default: _createSingleStyle(styles.default),
                select: _createSingleStyle(styles.select),
                temporary: _createSingleStyle(styles.temporary)
            }
        },
        _createStyleMap: function(styles) {
            var s = styles || OpenLayers.Feature.Vector.style;

            _.defaults(s['default'], OpenLayers.Feature.Vector.style['default']);

            return new OpenLayers.StyleMap(s, {
                extendDefault: true
            });
        },

        /**
         * Get current route configuration
         *
         * @returns object route configuration
         */
        getCurrentRoute: function() {
            return this.selected && this.options.routes[this.selected] || null;
        },

        /**
         * Set up result callback (zoom on click for example)
         */
        _setupResultCallback: function(){
            var routeNames = Object.keys(this.options.routes);
            var uniqueEventNames = [];
            for (var i = 0; i < routeNames.length; ++i) {
                var routeConfig = this.options.routes[routeNames[i]];
                var callbackConf = routeConfig.results && routeConfig.results.callback;
                var routeEventName = callbackConf && callbackConf.event;
                if (routeEventName && uniqueEventNames.indexOf(routeEventName) === -1) {
                    uniqueEventNames.push(routeEventName);
                }
            }
            if (uniqueEventNames.length) {
                var $anchor = $('.search-results', this.element);
                $anchor.on(uniqueEventNames.join(' '), 'tbody tr', $.proxy(this._resultCallback, this));
            }
        },

        /**
         * Result callback
         *
         * @param  jQuery.Event event Mouse event
         */
        _resultCallback: function(event) {
            var currentRoute = this.getCurrentRoute();
            var callbackConf = currentRoute && currentRoute.results && currentRoute.results.callback;
            if (!callbackConf || event.type !== callbackConf.event) {
                return;
            }
            var row = $(event.currentTarget),
                feature = row.data('feature')
            ;
            var zoomToFeatureOptions;
            if (callbackConf.options) {
                zoomToFeatureOptions = {
                    maxScale: parseInt(callbackConf.options.maxScale) || null,
                    minScale: parseInt(callbackConf.options.minScale) || null,
                    buffer: parseInt(callbackConf.options.buffer) || null
                };
            }
            this.mbMap.getModel().zoomToFeature(feature, zoomToFeatureOptions);
        },
        _onSrsChange: function(event, data) {
            if (this.highlightLayer) {
                this.highlightLayer.retransform(data.from, data.to);
            }
        },
        _getFormValues: function(form) {
            var values = {};
            _.each($(':input', form), function(input) {
                var $input = $(input);
                var name = $input.attr('name').replace(/^[^[]*\[/, '').replace(/[\]].*$/, '');
                values[name] = $input.val();
            });
            return values;
        },

        _hideMobile: function() {
            $('.mobileClose', $(this.element).closest('.mobilePane')).click();
        },

        /**
         * Get current form
         *
         * @returns {*|HTMLElement}
         */
        getCurrentForm: function() {
            var widget = this;
            return $('form[name="' + widget.selected + '"]', widget.element);
        }
    });
})(jQuery);
