function loadEventMap(){
    $.ajax({
        url: "/all_event",
        contentType: 'application/json',
        type: 'POST',
        success: function (dataR) {
            var map = new L.Map('map3', {zoom: 9, center: new L.latLng([dataR[0].location.lat,dataR[0].location.lon]) });
            map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));	//base layer
            var markersLayer = new L.LayerGroup();	//layer contain searched elements
            map.addLayer(markersLayer);


            var controlSearch = new L.Control.Search({
                position:'topright',
                layer: markersLayer,
                initial: false,
                zoom: 12,
                marker: false
            });
            map.addControl( controlSearch );
            var titleArray = []
            for(i in dataR) {
                var title = dataR[i].title,	//value searched
                    loc = dataR[i].location,		//position found
                    add = dataR[i].address
                // titleArray.push(title);
                // titleArray.push(add);
                marker = new L.Marker(new L.latLng(loc), {title: title} );//set property searched
                marker.bindPopup('title: '+ title + '<br>' + add);
                markersLayer.addLayer(marker);
            }
        },
        // the request to the server has failed. Let's show the cached data
        error: function (xhr, status, error) {
            console.log('fuck', error);
        }
    });
}

function loadAddOnMap(){
    var startlat =document.getElementById('lat').value
    var startlon = document.getElementById('lon').value
    var address = document.getElementById('address').value

    var options = {
        center: [startlat, startlon],
        zoom: 9
    }

    var map = new L.Map('map2', {zoom: 9, center: new L.latLng([startlat,startlon]) });
    map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));	//base layer
    var markersLayer = new L.LayerGroup();	//layer contain searched elements
    map.addLayer(markersLayer);

    ////////////populate map with markers from sample data

    marker = new L.Marker(new L.latLng([startlat,startlon]));//se property searched
    marker.bindPopup('Address: '+address);
    markersLayer.addLayer(marker);
}
