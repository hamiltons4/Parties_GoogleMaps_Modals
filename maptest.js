if (Meteor.isClient) {
  /*****************************************************************************/
/* MapDemoIndex: Lifecycle Hooks */
/*****************************************************************************/

Template.mapCanvas.rendered = function () {
    var tmpl = this;
    var searchInput = this.$('#address');

    VazcoMaps.init({}, function() {

        // gMaps.js plugin usage [ http://hpneo.github.io/gmaps/ ]

        tmpl.mapEngine = VazcoMaps.gMaps();

        tmpl.newMap = new tmpl.mapEngine({
            div: '#map-canvas',
            lat: 38.9847,
            lng: -77.1131,
        });

        tmpl.newMap.addMarker({
          lat: 38.9847,
          lng: -77.1131,
          /*
          lat: 52.22968,
          lng: 21.01223, */
          draggable: true,
          dragend: function() {
            var point = this.getPosition();
            tmpl.mapEngine.geocode({location: point, callback: function(results) {
              searchInput.val(results[0].formatted_address);
              tmpl.newMap.setCenter(results[0].geometry.location.lat(), results[0].geometry.location.lng());
            }});
          }
        });

        // or standard google maps api
        // var mapOptions = {
        //     zoom: 13
        // };
        // tmpl.newMap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    });

};


/*****************************************************************************/
/* MapDemoIndex: Event Handlers and Helpers */
/*****************************************************************************/
Template.mapCanvas.events({
  'submit form': function(e, tmpl) {
      e.preventDefault();
      var searchInput = $(e.target).find('#address');
      console.log(searchInput.val());
      //tmpl.newMap.removeMarkers();
      tmpl.mapEngine.geocode({
        address: searchInput.val(),
        callback: function(results, status) {
          if (status == 'OK') {
        
            var latlng = results[0].geometry.location;
            tmpl.newMap.setCenter(latlng.lat(), latlng.lng());
            tmpl.newMap.addMarker({
              lat: latlng.lat(),
              lng: latlng.lng(),
              click: function(e) {
               this.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
               Session.set("showCreateDialog", true); 
               //alert('You clicked in this marker');
                //$("#modalData").modal("show");
               // bootbox.alert("Hi there!");
           /*  bootbox.prompt({
               title: "What is your real name?",
               address: searchInput.val(),
               value: "makeusabrew",
               callback: function(result) {
                if (result === null) {
                  alert("Prompt dismissed");
                } else {
                  alert("Hi "+result);
                  Meets.insert({
                    title: result,
                    location: searchInput.val() });
                  
                }
                }
                });   */
                
                bootbox.dialog({
                   title: "Please Enter Pickup Details.",
                   message: '<form>' + '<label for="title">Title</label>' +
                          '<input type="text" id="textNote">' + '<br>' +
                          '<label for="date">Date</label>' +
                          '<input type="text" id="dateNote">' + '<br>' +
                          '<label for="time">Time</label>' +
                          '<input type="text" id="timeNote">' + '<br>' +
                          '<label for="whos">Who</label>' +
                          '<input type="text" id="whoNote">' +
                          '</form>',
                  buttons: {
                    success: {
                      label: "Save",
                      className: "btn-success",
                      callback: function() {
                        var title1 = $('#textNote').val();
                        var date1 = $('#dateNote').val();
                        var time1 = $('#timeNote').val();
                        var who1 = $('#whoNote').val();
                        $('#pickName').text(" " + title1);    
                        $('#pickDate').text(" " + date1);       
                        $('#pickTime').text(" " + time1);
                        $('#coming').text(" " + who1);  
                        Meets.insert({
                            title: title1,
                            date: date1,
                            time: time1,
                            person: who1,
                        });
                        
                        console.log("   " + title1);
                        console.log("   " + date1); 
                        console.log("   " + time1);
                        console.log("   " + who1);
                      }
                    }
                  }
                  
                });
                
               },

              draggable: true,
              dragend: function() {
                var point = this.getPosition();
                tmpl.mapEngine.geocode({location: point, callback: function(results) {
                  searchInput.val(results[0].formatted_address);
                  tmpl.newMap.setCenter(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                }});
              }
            });
            searchInput.val(results[0].formatted_address);
          } else {
            console.log(status);
          }
        }
      });
  }
});

/**
 * This tiny script just helps us demonstrate
 * what the various example callbacks are doing
 */
var Example = (function() {
    "use strict";

    var elem,
        hideHandler,
        that = {};

    that.init = function(options) {
        elem = $(options.selector);
    };

    that.show = function(text) {
        clearTimeout(hideHandler);

        elem.find("span").html(text);
        elem.delay(200).fadeIn().delay(4000).fadeOut();
    };

    return that;
}());

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
