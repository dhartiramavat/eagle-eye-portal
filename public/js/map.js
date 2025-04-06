(function()
{
    
    try{

        
        if (navigator.geolocation) {
            
        navigator.geolocation.getCurrentPosition(showPosition);
        
        } else { 
            alert("Geolocation is not supported by this browser.");
        }
        }
        catch(error)
        {
            alert("Something went wrong");
        }
    function getLocation()
    {
        //alert("entered");
        try{

        
        if (navigator.geolocation) {
            
        navigator.geolocation.getCurrentPosition(showPosition);
        
        } else { 
            alert("Geolocation is not supported by this browser.");
        }
        }
        catch(error)
        {
            console.log("error");
        }     
    }
    function showPosition(position) {
    
        
        long=position.coords.longitude;
        lat=position.coords.latitude;
        //alert(long+lat);
        mapboxgl.accessToken = 'pk.eyJ1IjoiNTEwMDU2MTAiLCJhIjoiY2psbndoMWduMWltMTNxbDRmeGRxdXNqbSJ9.mI6QwCnYcfIr27D07hnmQA';
        var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        center:[long,lat],//long,lat
        zoom:15
        });
        var geojson = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
            type: 'Point',
            coordinates: [long,lat]
            },
            properties: {
            title: 'Mapbox',
            description: 'Washington, D.C.'
            }
        }]
    };
        geojson.features.forEach(function(marker) {

        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = 'marker';

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
        .addTo(map);        });
        map.addControl(new mapboxgl.NavigationControl());
    }
})();
