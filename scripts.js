mapboxgl.accessToken = 'pk.eyJ1IjoiZ3NlcHVsdmVkYTk2IiwiYSI6ImNrNzlmaGFvNDBzcHozZG9kOXQxNjF0bW8ifQ.P4nx2cJHuZTio2JivJyBDA';
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/light-v10',
	center: [-98, 38.88],
	minZoom: 3,
	zoom: 4
});

var zoomThreshold = 5;

var popup = new mapboxgl.Popup({
    closeButton: false
});

map.on('load', function () {
	map.addSource('cases', {
		'type': 'vector',
		'url': 'mapbox://gsepulveda96.covid'
	});

	map.addLayer({
			'id': 'state-cases',
			'source': 'cases',
			'source-layer': 'states',
			'maxzoom': zoomThreshold,
			'type': 'fill',
			'paint': {
				'fill-color': [
					'interpolate',
					['linear'],
					['get', 'infection_rate'],
					0,
					'#ffffff',
					1,
					'#fde6e6',
					10,
					'#fdc4c4',
					100,
					'#fc8b8b',
					500,
					'#d18080',
					1000,
					'#ae8080'
				],
				'fill-opacity': 0.75,
				'fill-outline-color': '#000000'
			}
		}
	);

	map.addLayer({
			'id': 'county-cases',
			'source': 'cases',
			'source-layer': 'counties',
			'minzoom': zoomThreshold,
			'type': 'fill',
			'paint': {
				'fill-color': [
					'interpolate',
					['linear'],
					['get', 'infection_rate'],
					0,
					'#ffffff',
					1,
					'#fde6e6',
					10,
					'#fdc4c4',
					100,
					'#fc8b8b',
					500,
					'#d18080',
					1000,
					'#ae8080'
				],
				'fill-opacity': 0.75,
				'fill-outline-color': '#000000'
			}
		}
	);

	map.on('mousemove', 'county-cases', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Single out the first found feature.
        var feature = e.features[0];

        // Display a popup with the name of the county
        popup.setLngLat(e.lngLat)
			.setHTML('County: ' + feature.properties.NAME + '</br>' 
					+'Population: ' + feature.properties.POPESTIMATE2019 + "</br>"
					+'Confirmed Cases: ' + feature.properties.confirmed + "</br>"
					+'Infection Rate: ' + feature.properties.infection_rate.toFixed(2) + "/100,000 People</br>"
					+'Recovered: ' + feature.properties.recovered + "</br>"
					+'Active: ' + feature.properties.active + "</br>"
					+'Deaths: ' + feature.properties.deaths)
            .addTo(map);
	});
	
	map.on('mouseleave', 'county-cases', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
	});
	
	//states
	map.on('mousemove', 'state-cases', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Single out the first found feature.
        var feature = e.features[0];

        // Display a popup with the name of the county
        popup.setLngLat(e.lngLat)
			.setHTML('State: ' + feature.properties.NAME + '</br>' 
					+'Population: ' + feature.properties.POPESTIMATE2019 + "</br>"
					+'Confirmed Cases: ' + feature.properties.confirmed + "</br>"
					+'Infection Rate: ' + feature.properties.infection_rate.toFixed(2) + "/100,000 People</br>"
					+'Recovered: ' + feature.properties.recovered + "</br>"
					+'Active: ' + feature.properties.active + "</br>"
					+'Deaths: ' + feature.properties.deaths)
            .addTo(map);
	});
	
	map.on('mouseleave', 'state-cases', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

});

var stateLegendEl = document.getElementById('state-legend');
var countyLegendEl = document.getElementById('county-legend');
map.on('zoom', function () {

	popup.remove()
	if (map.getZoom() > zoomThreshold) {
		stateLegendEl.style.display = 'none';
		countyLegendEl.style.display = 'block';
	} else {
		stateLegendEl.style.display = 'block';
		countyLegendEl.style.display = 'none';
	}
});
