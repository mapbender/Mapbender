(function($){

    $.widget("mapbender.mbRuler", {
        options: {
            type: 'line',
            precision: 2
        },
        control: null,
        segments: null,
        total: null,
        container: null,
        popup: null,
        layer: null,
        mapModel: null,

        _create: function(){
            var self = this;
            if(this.options.type !== 'line' && this.options.type !== 'area'){
                throw Mapbender.trans("mb.core.ruler.create_error");
            }
            Mapbender.elementRegistry.waitReady('.mb-element-map').then(function(mbMap) {
                self._setup(mbMap);
            }, function() {
                Mapbender.checkTarget('mbRuler');
            });
        },
        _createControl4: function() {
            var source = this.layer.getNativeLayer().getSource();
            var defaultStyleFn;
            let  createEditingStyle = function() {
                /** @type {Object<import("../geom/GeometryType.js").default, Array<Style>>} */
                const styles = {};
                const purple = [255, 0, 255, 1];
                const yellow = [255, 255, 0, 1];
                const width = 3;
                styles[ol.geom.GeometryType.POLYGON] = [
                    new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: [255, 0, 255, 0.5],
                        }),
                    }),
                ];
                styles[ol.geom.GeometryType.LINE_STRING] = [
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: purple,
                            width: width + 2,
                        }),
                    }),
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: yellow,
                            width: width,
                        }),
                    }),
                ];
                styles[ol.geom.GeometryType.POINT] = [
                    new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: width * 2,
                            fill: new ol.style.Fill({
                                color: yellow,
                            }),
                            stroke: new ol.style.Stroke({
                                color: purple,
                                width: width / 2,
                            }),
                        }),
                        zIndex: Infinity,
                    }),
                ];
                return styles;
            };

            if (ol.interaction.Draw.getDefaultStyleFunction) {
                defaultStyleFn = ol.interaction.Draw.getDefaultStyleFunction();
            } else {
                // Openlayers 6 special
                var editingStyles = createEditingStyle();
                defaultStyleFn = function(feature) {
                    return editingStyles[feature.getGeometry().getType()];
                };
            }

            var self = this;
            var controlOptions = {
                type: this.options.type === 'line' ? 'LineString' : 'Polygon',
                source: source,
                style: function(feature, resolution) {
                    var style = defaultStyleFn(feature, resolution);
                    return self._extendStyles(style, feature);
                }
            };
            var control = new ol.interaction.Draw(controlOptions);
            control.on('drawstart', function(event) {
                self._reset();
                source.clear();
                /** @var {ol.Feature} */
                var feature = event.feature;
                var geometry = feature.getGeometry();
                var nVertices = geometry.getFlatCoordinates().length;
                geometry.on('change', function() {
                    var nVerticesNow = geometry.getFlatCoordinates().length;
                    if (nVerticesNow === nVertices) {
                        // geometry change event does not have a .feature attribute like drawend, shim it
                        self._handleModify({feature: feature});
                    } else {
                        // geometry change event does not have a .feature attribute like drawend, shim it
                        self._handlePartial({feature: feature});
                        nVertices = nVerticesNow;
                    }
                });
            });
            control.on('drawend', function(event) {
                self._handleFinal({feature: event.feature});
            });
            return control;
        },
        _createControl: function() {
            var nVertices = 1;
            var self = this;
            var handlerClass, validateEventGeometry;
            if (this.options.type === 'area') {
                handlerClass = OpenLayers.Handler.Polygon;
                validateEventGeometry = function(event) {
                    // OpenLayers 2 Polygon Handler can create degenerate linear rings with too few components, and calculate a (very
                    // small) area for them. Ignore these cases.
                    return event.geometry.components[0].components.length >= 4;
                }
            } else {
                handlerClass = OpenLayers.Handler.Path;
                validateEventGeometry = function(event) {
                    return event.geometry.components.length >= 2;
                }
            }

            var control = new OpenLayers.Control.Measure(handlerClass, {
                persist: true,
                immediate: true,
                displaySystemUnits: {
                    metric: ['m']
                },
                geodesic: true
            });

            control.events.on({
                'scope': this,
                'measure': function(event) {
                    self._handleFinal(event);
                },
                'measurepartial': function(event) {
                    if (!validateEventGeometry(event)) {
                        return;
                    }
                    var nVerticesNow = event.geometry.components.length;
                    if (nVerticesNow <= 2) {
                        self._reset();
                    }
                    if (nVerticesNow !== nVertices) {
                        nVertices = nVerticesNow;
                        return self._handlePartial(event);
                    } else {
                        return self._handleModify(event);
                    }
                }
            });

            return control;
        },
        _setup: function(mbMap) {
            var self = this;
            this.mapModel = mbMap.getModel();
            this.layer = Mapbender.vectorLayerPool.getElementLayer(this, 0);
            if (Mapbender.mapEngine.code === 'ol2') {
                this.control = this._createControl();
            } else {
                /** @var {ol.layer.Vector} nativeLayer */
                var nativeLayer = this.layer.getNativeLayer();
                var defaultStyleFn = nativeLayer.getStyleFunction() || ol.style.Style.defaultFunction;
                var customStyleFn = function(feature, resolution) {
                    var styles = defaultStyleFn(feature, resolution);
                    return self._extendStyles(styles, feature);
                };
                nativeLayer.setStyle(customStyleFn);
                this.control = this._createControl4();
            }
            this.container = $('<div/>');
            this.total = $('<div/>').addClass('total-value').css({'font-weight': 'bold'});
            this.segments = $('<ul/>');
            this.container.append(this.total);
            this.container.append(this.segments);

            $(document).bind('mbmapsrschanged', $.proxy(this._mapSrsChanged, this));

            this._trigger('ready');
        },
        /**
         * Default action for mapbender element
         */
        defaultAction: function(callback){
            this.activate(callback);
        },
        _toggleControl: function(state) {
            if (Mapbender.mapEngine.code === 'ol2') {
                if (state) {
                    this.mapModel.olMap.addControl(this.control);
                    this.control.activate();
                    this.layer.customizeStyle({
                        fontSize: 9,
                        labelAlign: 'cm',
                        labelXOffset: 10,
                        label: function(feature) {
                            return feature.attributes['area'];
                        }
                    });
                    this.control.handler.layer.styleMap = this.layer.getNativeLayer().styleMap;
                } else {
                    this.control.deactivate();
                    this.mapModel.olMap.removeControl(this.control);
                }
            } else {
                if (state) {
                    this.mapModel.olMap.addInteraction(this.control);
                    this.control.setActive(true);
                    this.layer.clear();
                    this.layer.show();
                } else {
                    this.control.setActive(false);
                    this.mapModel.olMap.removeInteraction(this.control);
                    this.layer.hide();
                }
            }
        },
        activate: function(callback){
            this.callback = callback ? callback : null;
            var self = this;
            this._toggleControl(true);

            this._reset();
            if(!this.popup || !this.popup.$element){
                this.popup = new Mapbender.Popup2({
                    title: this.element.attr('data-title'),
                    modal: false,
                    draggable: true,
                    resizable: true,
                    closeOnESC: true,
                    destroyOnClose: true,
                    content: self.container,
                    width: 300,
                    height: 300,
                    buttons: {
                        'ok': {
                            label: Mapbender.trans("mb.actions.close"),
                            cssClass: 'button right',
                            callback: function(){
                                self.deactivate();
                            }
                        }
                    }
                });
                this.popup.$element.on('close', $.proxy(this.deactivate, this));
            }else{
                this.popup.open("");
            }
        },
        deactivate: function(){
            this.container.detach();
            this._toggleControl(false);
            if(this.popup && this.popup.$element){
                this.popup.destroy();
            }
            this.popup = null;
            if (this.callback) {
                (this.callback)();
                this.callback = null;
            }
        },
        _mapSrsChanged: function(event, srs){
            if (this.control) {
                this._reset();
            }
        },
        _reset: function() {
            $('>li', this.segments).remove();
            this.total.text('');
        },
        _handleModify: function(event){
            var measure = this._getMeasureFromEvent(event);
            this._updateTotal(measure, event);
            // Reveal the previously hidden segment measure if it's now different from total
            var $previous = $('>li', this.segments).first();
            if ($previous.text() !== measure) {
                $previous.show();
            }
        },
        _handlePartial: function(event) {
            if (this.options.type === 'area') {
                this._handleFinal(event);
                return;
            }
            var measure = this._getMeasureFromEvent(event);
            if (!measure) {
                return;
            }
            this._updateTotal(measure, event);
            var measureElement = $('<li/>');
            measureElement.text(measure);
            // initially hide segment entry identical to current total
            measureElement.hide();
            this.segments.prepend(measureElement);
        },
        _handleFinal: function(event){
            var measure = this._getMeasureFromEvent(event);
            this._updateTotal(measure, event);
        },
        _updateTotal: function(measure, event) {
            this.total.text(measure || '');
            if (measure && this.options.type === 'area') {
                var feature = event.feature || event.object.handler.polygon;
                this._updateAreaLabel(feature, measure || '');
            }
        },
        _getMeasureFromEvent: function(event) {
            var measure;
            if (!event.measure && event.feature) {
                measure = this._calculateFeatureSizeOl4(event.feature, this.options.type);
            } else {
                measure = event.measure;
            }
            if (!measure) {
                return null;
            }
            return this._formatMeasure(measure);
        },
        _calculateFeatureSizeOl4: function(feature, type) {
            /** @type {ol.geom.Geometry} */
            var geometry = feature.getGeometry();
            var calcOptions = {
                projection: this.mapModel.getCurrentProjectionCode()
            };
            // Openlayers 6 special: ol.Sphere namespace renamed to lowercase ol.sphere
            var sphereNamespace = (ol.Sphere || ol.sphere);
            switch (type) {
                case 'line':
                    return sphereNamespace.getLength(geometry, calcOptions);
                default:
                    console.warn("Unsupported geometry type in measure calculation", type, feature);
                    // fall through to area
                case 'area':
                    return sphereNamespace.getArea(geometry, calcOptions);
            }
        },
        /**
         * @param {(ol.Feature|OpenLayers.Feature.Vector)} feature
         * @param {String} text
         * @private
         */
        _updateAreaLabel: function(feature, text) {
            if (Mapbender.mapEngine.code === 'ol2') {
                feature.attributes['area'] = text;
                feature.layer.redraw();
            } else {
                feature.set('area', text);
            }
        },
        /**
         * Openlayers 4 only
         * @param {Array<ol.style.Style>} styles
         * @param {ol.Feature} feature
         * @private
         */
        _extendStyles: function(styles, feature) {
            var label = feature.get('area') || '';
            return styles.map(function(original) {
                var style = original.clone();
                if (!style.getText()) {
                    style.setText(new ol.style.Text());
                }
                style.getText().setText(label);
                return style;
            });
        },
        _formatMeasure: function(value) {
            var scale = 1;
            var unit;
            if (this.options.type === 'area') {
                if (value >= 10000000) {
                    scale = 1000000;
                    unit = 'km²';
                } else {
                    unit = 'm²';
                }
            } else {
                if (value > 10000) {
                    scale = 1000;
                    unit = 'km';
                } else {
                    unit = 'm';
                }
            }
            return [(value / scale).toFixed(this.options.precision), unit].join('');
        }
    });

})(jQuery);
