(function($){

    $.widget("mapbender.mbRedlining", {
        options: {
            target: null,
            display_type: 'dialog',
            auto_activate: false,
            deactivate_on_close: true,
            geometrytypes: ['point', 'line', 'polygon', 'rectangle', 'text'],
            paintstyles: {
                'strokeColor': '#ff0000',
                'fillColor': '#ff0000',
                'strokeWidth': '3'
            }
        },
        map: null,
        layer: null,
        activeControl: null,
        selectedFeature: null,
        geomCounter: 0,
        rowTemplate: null,
        _create: function(){
            if(!Mapbender.checkTarget("mbRedlining", this.options.target)) {
                return;
            }
            var self = this;
            this.elementUrl = Mapbender.configuration.application.urls.element + '/' + this.element.attr('id') + '/';
            Mapbender.elementRegistry.onElementReady(this.options.target, $.proxy(self._setup, self));
        },
        _setup: function(){
            this.map = $('#' + this.options.target).data('mapbenderMbMap').map.olMap;
            this.rowTemplate = this.element.find('.geometry-table tr').remove();
            var selectControl = this.map.getControlsByClass('OpenLayers.Control.SelectFeature');
            this.map.removeControl(selectControl[0]);
            if(this.options.auto_activate || this.options.display_type === 'element'){
                this.activate();
            }
            this._trigger('ready');
            this._ready();
        },
        defaultAction: function(callback){
            this.activate(callback);
        },
        activate: function(callback){
            this.callback = callback ? callback : null;
            if (!this.layer) {
                var defaultStyle = new OpenLayers.Style($.extend({}, OpenLayers.Feature.Vector.style["default"], this.options.paintstyles));
                var styleMap = new OpenLayers.StyleMap({'default': defaultStyle}, {extendDefault: true});
                this.layer = new OpenLayers.Layer.Vector('Redlining', {styleMap: styleMap});
                this.map.addLayer(this.layer);
            }
            if (this.options.display_type === 'dialog'){
                this._open();
            } else {
                this.element.removeClass('hidden');
            }
            $('.redlining-tool', this.element).on('click', $.proxy(this._newControl, this));
        },
        deactivate: function(){
            if (this.options.display_type === 'dialog'){
                this._close();
            }
            if (this.options.display_type === 'dialog' && this.options.deactivate_on_close){
                this._removeAllFeatures();
                this.callback ? this.callback.call() : this.callback = null;
            }
            $('.redlining-tool', this.element).off('click');
        },
        /**
         * deprecated
         * @param {array} callback
         */
        open: function(callback){
            this.activate(callback);
        },
        /**
         * deprecated
         */
        close: function(){
            this.deactivate();
        },
        _open: function(){
            var self = this;
            if(!this.popup || !this.popup.$element) {
                this.popup = new Mapbender.Popup2({
                    title: self.element.attr('data-title'),
                    draggable: true,
                    header: true,
                    modal: false,
                    closeButton: false,
                    closeOnESC: false,
                    content: self.element,
                    width: 500,
                    height: 380,
                    buttons: {
                        'cancel': {
                            label: Mapbender.trans('mb.core.redlining.dialog.btn.cancel'),
                            cssClass: 'button buttonCancel critical right',
                            callback: function(){
                                self.deactivate();
                            }
                        }
                    }
                });
                this.popup.$element.on('close', $.proxy(this.deactivate, this));
            } else {
                    this.popup.open(self.element);
            }
            this.element.removeClass('hidden');
        },
        _close: function(){
            if(this.popup) {
                this.element.addClass('hidden').appendTo($('body'));
                this._deactivateControl();
                if(this.popup.$element) {
                    this.popup.destroy();
                }
                this.popup = null;
            }
        },
        _newControl: function(e){
            var self = this;
            if($(e.target).hasClass('active') === true) {
                this._deactivateControl();
                return;
            }
            this._deactivateControl();
            $(e.target).addClass('active');
            switch(e.target.name)
            {
                case 'point':
                    this.activeControl = new OpenLayers.Control.DrawFeature(this.layer,
                            OpenLayers.Handler.Point, {
                                featureAdded: function(e){
                                    self._addToGeomList(e, Mapbender.trans('mb.core.redlining.geometrytype.point'));
                                }
                            });
                    break;
                case 'line':
                    this.activeControl = new OpenLayers.Control.DrawFeature(this.layer,
                            OpenLayers.Handler.Path, {
                                featureAdded: function(e){
                                    self._addToGeomList(e, Mapbender.trans('mb.core.redlining.geometrytype.line'));
                                }
                            });
                    break;
                case 'polygon':
                    this.activeControl = new OpenLayers.Control.DrawFeature(this.layer,
                            OpenLayers.Handler.Polygon, {
                                handlerOptions: {
                                    handleRightClicks: false
                                },
                                featureAdded: function(e){
                                    self._addToGeomList(e, Mapbender.trans('mb.core.redlining.geometrytype.polygon'));
                                }
                            });
                    break;
                case 'rectangle':
                    this.activeControl = new OpenLayers.Control.DrawFeature(this.layer,
                            OpenLayers.Handler.RegularPolygon, {
                                handlerOptions: {
                                    sides: 4,
                                    irregular: true,
                                    rightClick: false
                                },
                                featureAdded: function(e){
                                    self._addToGeomList(e, Mapbender.trans('mb.core.redlining.geometrytype.rectangle'));
                                }
                            });
                    break;
                case 'text':
                    $('input[name=label-text]', this.element).val('');
                    $('#redlining-text-wrapper', this.element).removeClass('hidden');
                    this.activeControl = new OpenLayers.Control.DrawFeature(this.layer,
                            OpenLayers.Handler.Point, {
                                featureAdded: function (e) {
                                    if ($('input[name=label-text]', self.element).val().trim() === '') {
                                        Mapbender.info(Mapbender.trans('mb.core.redlining.geometrytype.text.error.notext'));
                                        self._removeFeature(e);
                                    } else {
                                        e.style = self._generateTextStyle($('input[name=label-text]', this.element).val());
                                        self._addToGeomList(e, Mapbender.trans('mb.core.redlining.geometrytype.text.label'));
                                        self.layer.redraw();
                                        $('input[name=label-text]', this.element).val('');
                                    }
                                }
                            });
                    break;
            }
            this.map.addControl(this.activeControl);
            this.activeControl.activate();

        },
        _removeFeature: function(feature){
            this.layer.destroyFeatures([feature]);
        },
        _removeAllFeatures: function(){
            $('.geometry-table tr', this.element).remove();
            this.map.removeLayer(this.layer);
        },
        _deactivateControl: function(){
            if(this.selectedFeature) {
                this.activeControl.unselectFeature(this.selectedFeature);
                if (this.selectedFeature.style && this.selectedFeature.style.label) {
                    $('input[name=label-text]', this.element).off('keyup', $.proxy(this._writeText, this));
                    this.selectedFeature.style = this._setTextDefault(this.selectedFeature.style);
                    this.layer.redraw();
                }
                this.selectedFeature = null;
            }
            if(this.activeControl !== null) {
                this.activeControl.deactivate();
                this.activeControl.destroy();
                this.map.removeControl(this.activeControl);
                this.activeControl = null;
            }
            $('#redlining-text-wrapper', this.element).addClass('hidden');
            this._deactivateButton();
        },
        _deactivateButton: function(){
            $('.redlining-tool', this.element).removeClass('active');
        },
        
        _getGeomLabel: function(feature, typeLabel, featureType){
            if(featureType === 'text') {
                return typeLabel + (feature.style && feature.style.label ? ' (' + feature.style.label + ')' : '');
            } else {
                return typeLabel + ' ' + (++this.geomCounter);
            }
        },
        _addToGeomList: function(feature, typeLabel){
            var self = this;
            var activeTool = $('.redlining-tool.active', this.element).attr('name');
            var row = this.rowTemplate.clone();
            row.attr("data-id", feature.id);
            $('.geometry-name', row).text(this._getGeomLabel(feature, typeLabel, activeTool));
            var $geomtable = $('.geometry-table', this.element);
            $geomtable.append(row);
            $('.geometry-remove', $geomtable).off('click');
            $('.geometry-remove', $geomtable).on('click', $.proxy(self._removeFromGeomList, self));
            $('.geometry-edit', $geomtable).off('click');
            $('.geometry-edit', $geomtable).on('click', $.proxy(self._modifyFeature, self));
            $('.geometry-zoom', $geomtable).off('click');
            $('.geometry-zoom', $geomtable).on('click', $.proxy(self._zoomToFeature, self));
        },
        _removeFromGeomList: function(e){
            this._deactivateControl();
            var $tr = $(e.target).parents("tr:first");
            this.selectedFeature = this.layer.getFeatureById($tr.attr('data-id'));
            this._removeFeature(this.selectedFeature);
            $tr.remove();
            this.selectedFeature = null;
        },
        _modifyFeature: function(e){
            this._deactivateControl();
            this.selectedFeature = this.layer.getFeatureById($(e.target).parents("tr:first").attr('data-id'));
            if(this.selectedFeature.style && this.selectedFeature.style.label) {
                this.selectedFeature.style = this._setTextEdit(this.selectedFeature.style);
                $('input[name=label-text]', this.element).val(this.selectedFeature.style.label);
                $('#redlining-text-wrapper', this.element).removeClass('hidden');
                $('input[name=label-text]', this.element).on('keyup', $.proxy(this._writeText, this));
            }
            this.activeControl = new OpenLayers.Control.ModifyFeature(this.layer, {standalone: true});
            this.map.addControl(this.activeControl);
            this.activeControl.selectFeature(this.selectedFeature);
            this.activeControl.activate();
        },
        _zoomToFeature: function(e){
            this._deactivateControl();
            var feature = this.layer.getFeatureById($(e.target).parents("tr:first").attr('data-id'));
            var bounds = feature.geometry.getBounds();
            this.map.zoomToExtent(bounds);
        },
        _generateTextStyle: function(label){
            var style = OpenLayers.Util.applyDefaults(null, OpenLayers.Feature.Vector.style['default']);
            if (label) {
                style.label = label;
            }
            style.labelAlign = 'lm';
            style.labelXOffset = 10;
            style.pointRadius = 6;
            style.fillOpacity = 0.4;
            style.strokeOpacity = 1;
            style.strokeWidth = 2;
            return this._setTextDefault(style);
        },
        _setTextDefault: function(style){
            style.fillColor = style.strokeColor = style.fontColor = 'red';
            return style;
        },
        _setTextEdit: function(style){
            style.fillColor = style.strokeColor = style.fontColor = 'blue';
            return style;
        },
        
        _writeText: function(e) {
            if (this.selectedFeature && this.selectedFeature.style && this.selectedFeature.style.label) {
                var value;
                if ((value = $('input[name=label-text]', this.element).val().trim()) === '') {
                    Mapbender.info(Mapbender.trans('mb.core.redlining.geometrytype.text.error.notext'));
                } else {
                    this.selectedFeature.style.label = value;
                    var label = this._getGeomLabel(this.selectedFeature, Mapbender.trans('mb.core.redlining.geometrytype.text.label'), 'text');
                    $('.geometry-table tr[data-id="'+this.selectedFeature.id+'"] .geometry-name', this.element).text(label);
                    this.layer.redraw();
                }
            }
        },
        /**
         *
         */
        ready: function(callback){
            if(this.readyState === true) {
                callback();
            } else {
                this.readyCallbacks.push(callback);
            }
        },
        /**
         *
         */
        _ready: function(){
            for(callback in this.readyCallbacks) {
                callback();
                delete(this.readyCallbacks[callback]);
            }
            this.readyState = true;
        },
    });

})(jQuery);
