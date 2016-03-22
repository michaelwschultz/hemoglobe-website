Parse.initialize("oDwdBE6vlYoo0a12OAZ38YEO4V76hMUtBqqqKhQ4", "QdSLqJGYY6m2vscpmqA5irmUogzhAb8fDRl3Da6w");

var map;
var today = new Date();


var styles = [
  {
    stylers: [
      { hue: "#0f1d40" },
      { saturation: -40 },
      { lightness: -30 },
    ]
  }
];

function initializeMap(mapDiv) {
	var mapOptions = {
    		zoom: 2,
    		center: new google.maps.LatLng(20, -40),
        disableDefaultUI: false,
        draggable: true,
        keyboardShortcuts: false,
        scrollwheel: false,
    	mapTypeId: google.maps.MapTypeId.TERRAIN,
		styles: styles
      };

    map = new google.maps.Map(document.getElementById(mapDiv), mapOptions);
}

google.maps.Map.prototype.markers = new Array();

google.maps.Map.prototype.addMarker = function(marker) {
    this.markers[this.markers.length] = marker;
};

google.maps.Map.prototype.getMarkers = function() {
    return this.markers
};

google.maps.Map.prototype.clearMarkers = function() {
    for(var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
    }
    this.markers = new Array();
};

function dropMarkerAtPosition(i, pos, bounce) {
    setTimeout(function() {
      
      var iconBase = 'http://hemoglobe.com/img/';
      var iconShadow = new google.maps.MarkerImage(
        iconBase + 'hemoglobe_pin_shadow.png',
        null,
        null,
        new google.maps.Point(8, 24)
      );

  		var m = new google.maps.Marker({
  			position: pos,
  			map: map,
        icon: iconBase + 'hemoglobe_pin.png',
        shadow: iconShadow,
  			draggable: false
  		});

      google.maps.Map.prototype.addMarker(m);
      
      if(bounce) {
        setTimeout(function() {
          m.setAnimation(google.maps.Animation.BOUNCE);
        }, 250);
      }

  	}, i * 250);
}

function shouldBouncePinWithDate(userDate) {
    var minutesSinceLastLogin = (today.getTime() - userDate.getTime()) / 60000;
    return (minutesSinceLastLogin <= 60);
}

function plotUsersOnMapAndBounce(type, enableBounce) {
    google.maps.Map.prototype.clearMarkers()

    var query = new Parse.Query("UserProfile");

     if(type !== "All")
        query.equalTo("affectedStatus", type);

    query.find({
        success: function(results) {

            for(var i = 0; i < results.length; i++) {

                var jsonProfile = results[i].toJSON();
                var location = JSON.parse(JSON.stringify(jsonProfile.location));
                var latLng = new google.maps.LatLng(location.latitude, location.longitude);
                var shouldBounce = shouldBouncePinWithDate(new Date(jsonProfile.updatedAt));

                dropMarkerAtPosition(i, latLng, (enableBounce && shouldBounce));
            } // for
        }, // success

      error: function(error) {
          console.log("Oh noes! An error: " + error.code + " , " + error.message);
      } // error

  }); // find
}

function appendTotalUsersWithAffectedStatusToElement(type, divID) {
    var query = new Parse.Query("UserProfile");

    if(type !== "All")
        query.equalTo("affectedStatus", type);

    query.find({
        success: function(results) {
            document.getElementById(divID).innerHTML += results.length;
      }, // success
      
      error: function(error) {
          console.log("Oh noes! An error: " + error.code + " , " + error.message);
      } // error

    }); // find 
}