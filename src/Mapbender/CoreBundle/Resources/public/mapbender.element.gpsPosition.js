/**
 *
 * @author Arne Schubert <atd.schubert@gmail.com>
 * @namespace mapbender.mbGpsPosition
 */
(function ($) {
    'use strict';

    $.widget("mapbender.mbGpsPosition", {
        options: {
            autoStart: false,
            follow: false,
            average: 1,
            centerOnFirstPosition: true,
            zoomToAccuracyOnFirstPosition: true
        },
        map: null,
        observer: null,
        firstPosition: true,
        stack: [],
        layer: null,
        internalProjection: null,
        metricProjection: null,
        geolocationProvider_: null,

        _create: function () {
            if (!Mapbender.checkTarget("mbGpsPosition", this.options.target)) {
                return;
            }
            this.geolocationProvider_ = navigator.geolocation || null;
            // Uncomment to use mock data
            // this.geolocationProvider_ = window.Mapbender.GeolocationMock;
            if (!this.geolocationProvider_) {
                Mapbender.error(Mapbender.trans("mb.core.gpsposition.error.notsupported"));
                throw new Error("No geolocation support");
            }

            Mapbender.elementRegistry.onElementReady(this.options.target, $.proxy(this._setup, this));
            this.options.average = Math.max(1, parseInt(this.options.average) || 1);
            this.element.on('click', $.proxy(this.toggleTracking, this));
        },

        _setup: function () {
            this.map = $('#' + this.options.target).data('mapbenderMbMap');
            this.layer = new OpenLayers.Layer.Vector();
            this.metricProjection = new OpenLayers.Projection('EPSG:900913');
            this.internalProjection = new OpenLayers.Projection("EPSG:4326");
            if (this.options.autoStart === true) {
                this.activate();
            }
        },

        _showLocation: function (position, accuracy) {
            var olmap = this.map.map.olMap;
            var features = this._getMarkerFeatures(position, accuracy);
            this.layer.removeAllFeatures();
            this.layer.addFeatures([features.point]);
            if (features.circle) {
                this.layer.addFeatures([features.circle]);
            }
            if ((this.firstPosition && this.options.centerOnFirstPosition) || this.options.follow) {
                if (features.circle && this.options.zoomToAccuracyOnFirstPosition && this.firstPosition) {
                    this.map.getModel().zoomToFeature(features.circle);
                } else {
                    if (this.firstPosition || !olmap.getExtent().containsLonLat(position)) {
                        olmap.panTo(new OpenLayers.LonLat(position.lon, position.lat));
                    }
                }
            }
            this.firstPosition = false;
            this.layer.redraw();
        },
        /**
         *
         * @param {OpenLayers.LonLat} position
         * @param {number} accuracy in meters
         * @return {Object<String, OpenLayers.Feature.Vector>}
         * @private
         */
        _getMarkerFeatures: function(position, accuracy) {
            var centerPoint = new OpenLayers.Geometry.Point(position.lon, position.lat);
            var features = {
                point: new OpenLayers.Feature.Vector(centerPoint, null, {
                    strokeColor:   "#ff0000",
                    strokeWidth:   3,
                    strokeOpacity: 1,
                    fillOpacity:   0,
                    pointRadius:   10
                })
            };
            if (accuracy) {
                var currentProj = this.map.map.olMap.getProjectionObject();
                var metricOrigin = centerPoint.clone().transform(currentProj, this.metricProjection);
                var circleGeom = OpenLayers.Geometry.Polygon.createRegularPolygon(
                    metricOrigin,
                    accuracy / 2,
                    40,
                    0
                );
                circleGeom = circleGeom.transform(this.metricProjection, currentProj);

                features.circle = new OpenLayers.Feature.Vector(circleGeom, null, {
                    fillColor: '#FFF',
                    fillOpacity: 0.5,
                    strokeWidth: 1,
                    strokeColor: '#FFF'
                });
            }
            return features;
        },

        /**
         * Toggle GPS positioning
         *
         * @returns {self}
         */
        toggleTracking: function () {
            if (this.observer) {
                this.deactivate();
            } else {
                this.activate();
            }
        },
        /**
         * @param {(*|GeolocationPosition)} position see https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition
         * @private
         */
        _handleGeolocationPosition: function(position) {
            var p = this._transformCoordinate(position.coords.longitude, position.coords.latitude);

            // Averaging: Building a queue...
            this.stack.push(p);
            if (this.stack.length > this.options.average) {
                this.stack.splice(0, 1);
            }
            var averaged = {
                lon: 0,
                lat: 0
            };
            var nEntries = this.stack.length;
            for (var i = 0; i < nEntries; ++i) {
                averaged.lon += this.stack[i].lon / nEntries;
                averaged.lat += this.stack[i].lat / nEntries;
            }
            this._showLocation(averaged, position.coords.accuracy);
        },
        /**
         * @param {(*|GeolocationPositionError)} gle see https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError
         * @private
         */
        _handleGeolocationError: function(gle) {
            Mapbender.error(Mapbender.trans("mb.core.gpsposition.error.nosignal"));
            this.deactivate();
        },
        _transformCoordinate: function(lon, lat) {
            var newProj = this.map.map.olMap.getProjectionObject(),
                p = new OpenLayers.LonLat(lon, lat);

            p.transform(this.internalProjection, newProj);
            return {
                lon: p.lon,
                lat: p.lat
            };
        },
        /**
         * Activate GPS positioning
         */
        activate: function () {
            var widget = this;
            var olmap = widget.map.map.olMap;
            olmap.addLayer(this.layer);

            if (!this.observer) {
                if (this.geolocationProvider_) {
                    this.firstPosition = true;
                    this.observer = this.geolocationProvider_.watchPosition(function success(position) {
                        widget._handleGeolocationPosition(position);
                    }, function error(gle) {
                        widget._handleGeolocationError(gle);
                    }, { enableHighAccuracy: true, maximumAge: 0 });

                    $(widget.element).parent().addClass("toolBarItemActive");
                } else {
                    Mapbender.error(Mapbender.trans("mb.core.gpsposition.error.notsupported"));
                }
            }
        },
        /**
         * Deactivate GPS positioning
         * @returns {object}
         */
        deactivate: function() {
            if (this.observer) {
                this.geolocationProvider_.clearWatch(this.observer);
                this.observer = null;
            }
            $(this.element).parent().removeClass("toolBarItemActive");

            var olmap = this.map.map.olMap;
            if (this.layer) {
                try {
                    olmap.removeLayer(this.layer);
                } catch (e) {
                    // unholy POI connection may cause multiple removal of layer
                }
            }
        },

        getGPSPosition: function(callback) {
            var widget = this;
            var olmap = widget.map.map.olMap;

            if (this.geolocationProvider_) {
                if (this.observer) {
                    this.geolocationProvider_.clearWatch(this.observer);
                    this.observer = null;
                }
                olmap.addLayer(this.layer);
                this.firstPosition = true;
                this.geolocationProvider_.getCurrentPosition(function success(position) {
                    var p = widget._transformCoordinate(position.coords.longitude, position.coords.latitude);
                    widget._showLocation(p, position.coords.accuracy);

                    if (typeof callback === 'function') {
                        callback(p);
                    }

                }, function error(msg) {
                    Mapbender.error(Mapbender.trans("mb.core.gpsposition.error.nosignal"));
                    widget.deactivate();
                }, { enableHighAccuracy: true, maximumAge: 0 });
            } else {
                Mapbender.error(Mapbender.trans("mb.core.gpsposition.error.notsupported"));
            }
        }
    });

}(jQuery));
