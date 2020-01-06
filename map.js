var osm = new ol.layer.Tile({
	title: 'OpenStreetMap',
	type: 'base',
	visible: false,
	source: new ol.source.OSM()
});

var bingRoads = new ol.layer.Tile({
	title: 'Bing Maps—Roads',
	type: 'base',
	visible: false,
	source: new ol.source.BingMaps({
		key: 'AkHprafvjnVPHZ4pzr1NpPmBYs1wx4Ybk6rfAjLFJIDRK4Sf4dWYAangV_LiySrU',
		imagerySet: 'Road'
	})
});

var bingAerial = new ol.layer.Tile({
	title: 'Bing Maps—Aerial',
	type: 'base',
	visible: false,
	source: new ol.source.BingMaps({
		key: 'AkHprafvjnVPHZ4pzr1NpPmBYs1wx4Ybk6rfAjLFJIDRK4Sf4dWYAangV_LiySrU',
		imagerySet: 'Aerial'
	})
});

var bingAerialWithLabels = new ol.layer.Tile({
	title: 'Bing Maps—Aerial with Labels',
	type: 'base',
	visible: false,
	source: new ol.source.BingMaps({
		key: 'AkHprafvjnVPHZ4pzr1NpPmBYs1wx4Ybk6rfAjLFJIDRK4Sf4dWYAangV_LiySrU',
		imagerySet: 'AerialWithLabels'
	})
});

var stamenWatercolor = new ol.layer.Tile({
	title: 'Stamen Watercolor',
	type: 'base',
	visible: false,
	source: new ol.source.Stamen({
		layer: 'watercolor'
	})
});

var stamenToner = new ol.layer.Tile({
	title: 'Stamen Toner',
	type: 'base',
	visible: true,
	source: new ol.source.Stamen({
		layer: 'toner'
	})
});

// var vectorSource = new ol.source.Vector({
// 	loader: function(extent, resolution, projection) {
// 		var url = 'http://localhost:8082/geoserver/Ex_GeoServer/ows?service=WFS&' +
// 		'version=2.0.0&request=GetFeature&typeName=Ex_GeoServer:ECU_rails&' +
// 		'outputFormat=text/javascript&srsname=EPSG:3857&' +
// 		'format_options=callback:loadFeatures';
// 		$.ajax({url: url, dataType: 'jsonp'});
// 	}
// });

// var geojsonFormat = new ol.format.GeoJSON();
// function loadFeatures(response) {
// 	vectorSource.addFeatures(geojsonFormat.readFeatures(response));
// }

// var ecuadorRailways = new ol.layer.Vector({
// 	title: 'Ecuador railways',
// 	source: vectorSource,
// 	style: new ol.style.Style({
// 		stroke: new ol.style.Stroke({
// 			color: 'rgb(58, 255, 81)',
// 			width: 4
// 		})
// 	})
// });

var enhPlosQuantile = new ol.layer.Image({
	title: 'Enhanced PLOS roadlink with quantile graduated style',
	source: new ol.source.ImageWMS({
		url: 'http://localhost:8082/geoserver/wms',
		params: {'LAYERS': 'GIS_lab_2019:E-plos', 'STYLES': 'GIS_lab_2019:enh_plos_categorized_quantile'}
	}),
	visible: true
});

var enhPlosSystematica = new ol.layer.Image({
	title: 'Enhanced PLOS roadlink with the Systematica calssification style',
	source: new ol.source.ImageWMS({
		url: 'http://localhost:8082/geoserver/wms',
		params: {'LAYERS': 'GIS_lab_2019:E-plos', 'STYLES': 'GIS_lab_2019:enh_plos_systematica_classification'}
	}),
	visible: false
});

var origPlosQuantile = new ol.layer.Image({
	title: 'Original PLOS roadlink with quantile graduated style',
	source: new ol.source.ImageWMS({
		url: 'http://localhost:8082/geoserver/wms',
		params: {'LAYERS': 'GIS_lab_2019:E-plos', 'STYLES': 'GIS_lab_2019:orig_plos_categorized_quantile'}
	}),
	visible: false
});

var origPlosSystematica = new ol.layer.Image({
	title: 'Original PLOS roadlink with the Systematica calssification style',
	source: new ol.source.ImageWMS({
		url: 'http://localhost:8082/geoserver/wms',
		params: {'LAYERS': 'GIS_lab_2019:E-plos', 'STYLES': 'GIS_lab_2019:orig_plos_systematica_classification'}
	}),
	visible: false
});

var epicollectPoints = new ol.layer.Image({
	title: 'Collected points',
	source: new ol.source.ImageWMS({
		url: 'http://localhost:8082/geoserver/wms',
		params: {'LAYERS': 'GIS_lab_2019:EPICOLLECT', 'STYLES': 'GIS_lab_2019:epicollect'}
	}),
	visible: false
});

var vectorSource = new ol.source.Vector({
	loader: function(extent, resolution, projection) {
		var url = 'http://localhost:8082/geoserver/GIS_lab_2019/ows?service=WFS&' +
		'version=2.0.0&request=GetFeature&typeName=GIS_lab_2019:EPICOLLECT&' +
		'outputFormat=text/javascript&srsname=EPSG:32632&' +
		'format_options=callback:loadFeatures';
		$.ajax({url: url, dataType: 'jsonp'});
	}
});

var geojsonFormat = new ol.format.GeoJSON();
function loadFeatures(response) {
	vectorSource.addFeatures(geojsonFormat.readFeatures(response));
}

var ecuadorRailways = new ol.layer.Vector({
	title: 'Ajax Epicollect',
	source: vectorSource
});

var map = new ol.Map({
	target: document.getElementById('map'),
	layers: [
	new ol.layer.Group({
		title: 'Base Maps',
		layers: [stamenToner, osm, bingRoads, bingAerial, bingAerialWithLabels, stamenWatercolor]
	}),
	new ol.layer.Group({
		title: 'Overlay Layers',
		layers: [ecuadorRailways, enhPlosQuantile, enhPlosSystematica, origPlosQuantile, origPlosSystematica, epicollectPoints]
	})],
	view: new ol.View({
		center: ol.proj.fromLonLat([9.17537, 45.49559]),
		zoom: 17
	}),
	controls: ol.control.defaults().extend([
		new ol.control.ScaleLine(),
		new ol.control.FullScreen(),
		new ol.control.OverviewMap()
		/*new ol.control.MousePosition({
			coordinateFormat: ol.coordinate.createStringXY(4),
			projection: 'EPSG:4326'
		})*/
		])
});

var layerSwitcher = new ol.control.LayerSwitcher({});
map.addControl(layerSwitcher);

var elementPopup = document.getElementById('popup');

var popup = new ol.Overlay({
	element: elementPopup
});

map.addOverlay(popup);

map.on('click', function(event) {
	var feature = map.forEachFeatureAtPixel(event.pixel, function(feature, layer) {
		return feature;
	});
	if (feature != null) {
		console.log("feature found");
		var pixel = event.pixel;
		var coord = map.getCoordinateFromPixel(pixel);
		popup.setPosition(coord);
		$(elementPopup).attr('title', 'Ecuador railways');
		$(elementPopup).attr('data-content', '<b>Id: </b>' + feature.get('roadname'));
		$(elementPopup).popover({'placement': 'top', 'html': true});
		$(elementPopup).popover('show');
	}
});

map.on('pointermove', function(event) {
	if (event.dragging) {
		$(elementPopup).popover('destroy');
		return;
	}
	var pixel = map.getEventPixel(event.originalEvent);
	var hit = map.hasFeatureAtPixel(pixel);
	map.getTarget().style.cursor = hit ? 'pointer' : '';
});

map.on('click', function(event) {
	console.log("ciao" + map.coordinate);
	document.getElementById('get-feature-info').innerHTML = '';
	var viewResolution = (map.getView().getResolution());
	var url = ecuadorRoads.getSource().getFeatureInfoUrl(event.coordinate,
		viewResolution, 'EPSG:32632', {'INFO_FORMAT': 'text/html'});
	if (url)
		document.getElementById('get-feature-info').innerHTML = '<iframeseamless src="' + url + '"></iframe>';
});