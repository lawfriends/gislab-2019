var osm = new ol.layer.Tile({
	title: 'OpenStreetMap',
	type: 'base',
	visible: false,
	source: new ol.source.OSM()
});

var bingRoads = new ol.layer.Tile({
	title: 'Bing Maps - Roads',
	type: 'base',
	visible: true,
	source: new ol.source.BingMaps({
		key: 'AkHprafvjnVPHZ4pzr1NpPmBYs1wx4Ybk6rfAjLFJIDRK4Sf4dWYAangV_LiySrU',
		imagerySet: 'Road'
	})
});

var bingAerial = new ol.layer.Tile({
	title: 'Bing Maps - Aerial',
	type: 'base',
	visible: false,
	source: new ol.source.BingMaps({
		key: 'AkHprafvjnVPHZ4pzr1NpPmBYs1wx4Ybk6rfAjLFJIDRK4Sf4dWYAangV_LiySrU',
		imagerySet: 'Aerial'
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
	visible: false,
	source: new ol.source.Stamen({
		layer: 'toner'
	})
});

var enhPlosQuantile = new ol.layer.Image({
	title: 'Enhanced PLOS roadlink with quantile graduated style',
	source: new ol.source.ImageWMS({
		url: 'http://localhost:8082/geoserver/wms',
		params: {'LAYERS': 'GIS_lab_2019:E-plos', 'STYLES': 'GIS_lab_2019:enh_plos_categorized_quantile'}
	}),
	visible: true
});

var enhPlosSystematica = new ol.layer.Image({
	title: 'Enhanced PLOS roadlink with the Systematica classification style',
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
	title: 'Original PLOS roadlink with the Systematica classification style',
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
	visible: true
});

var vectorSource = new ol.source.Vector({
	loader: function(extent, resolution, projection) {
		var url = 'http://localhost:8082/geoserver/GIS_lab_2019/ows?service=WFS&' +
		'version=2.0.0&request=GetFeature&typeName=GIS_lab_2019:EPICOLLECT&' +
		'outputFormat=text/javascript&srsname=EPSG:3857&' +
		'format_options=callback:loadFeatures';
		$.ajax({url: url, dataType: 'jsonp'});
	}
});

var geojsonFormat = new ol.format.GeoJSON();
function loadFeatures(response) {
	vectorSource.addFeatures(geojsonFormat.readFeatures(response));
}

var queryablePoints = new ol.layer.Vector({
	title: 'Queryable Epicollect Points',
	source: vectorSource
});

var map = new ol.Map({
	target: document.getElementById('map'),
	layers: [
	new ol.layer.Group({
		title: 'Base Maps',
		layers: [stamenToner, osm, bingRoads, bingAerial, stamenWatercolor]
	}),
	new ol.layer.Group({
		title: 'Overlay Layers',
		layers: [queryablePoints, enhPlosQuantile, enhPlosSystematica, origPlosQuantile, origPlosSystematica, epicollectPoints]
	})],
	view: new ol.View({
		center: ol.proj.fromLonLat([9.17537, 45.49559]),
		zoom: 17
	}),
	controls: ol.control.defaults().extend([
		new ol.control.ScaleLine(),
		new ol.control.FullScreen(),
		new ol.control.OverviewMap(),
		new ol.control.MousePosition({
			coordinateFormat: ol.coordinate.createStringXY(4),
			projection: 'EPSG:4326'
			})
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
		var pixel = event.pixel;
		var coord = map.getCoordinateFromPixel(pixel);
		popup.setPosition(coord);
		$(elementPopup).attr('title', 'Collected points');
		if (feature.get('2_Data_Typ')==='Number of lanes'){
			$(elementPopup).attr('data-content', '<b>Type: </b>' + feature.get('2_Data_Typ') +
				'<br><b>Value: </b>' + feature.get('3_Value'));
		}
		else if(feature.get('2_Data_Typ')==='Width of sidewalk' ||
			feature.get('2_Data_Typ')==='Width of bike lane and shoulder' || feature.get('2_Data_Typ')==='Buffer'){
			$(elementPopup).attr('data-content', '<b>Type: </b>' + feature.get('2_Data_Typ') +
				'<br><b>Value: </b>' + feature.get('3_Value') + 'm');
		}
		else{
			$(elementPopup).attr('data-content', '<b>Type: </b>' + feature.get('2_Data_Typ'));
		}
		$(elementPopup).popover({'placement': 'top', 'html': true});
		$(elementPopup).popover('show');
	}
});

map.on('pointermove', function(event) {
	if (event.dragging) {
		$(elementPopup).popover('dispose');
		return;
	}
	var pixel = map.getEventPixel(event.originalEvent);
	var hit = map.hasFeatureAtPixel(pixel);
	map.getTarget().style.cursor = hit ? 'pointer' : '';
});