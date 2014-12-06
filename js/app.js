// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function () {
    function createMap(center, zoom) {
        var mapElem = document.getElementById('map');
        var map = new google.maps.Map(mapElem, {
            center: center,
            zoom: zoom
        });

        var infoWindow = new google.maps.InfoWindow();

        $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
            .done(function(data) {
                data.forEach(function(camera) {
                    var marker = new google.maps.Marker({
                        position: {
                            lat: Number(camera.location.latitude),
                            lng: Number(camera.location.longitude)
                        },
                        map: map
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        map.panTo(marker.getPosition());
                        var html = '<h2>' + camera.cameralabel + '</h2>';
                        html += '<img src="' + camera.imageurl.url + '"/>';
                        infoWindow.setContent(html);
                        infoWindow.open(map, this);
                    });

                    $('#search').bind('search keyup', function() {
                        if (camera.cameralabel.toLowerCase().indexOf(this.value.toLowerCase()) < 0) {
                            marker.setMap(null);
                        } else {
                            marker.setMap(map);
                        }
                    });
                });
                $('.error-message').css('display', 'none');
            }) // success case
            .fail(function(error) {
                $('.error-message').css('display', 'block');
            })
    } // createMap()

    var defaultCoords = {
        lat: 47.655,
        lng: -122.3080
    };

    createMap(defaultCoords, 12);
});