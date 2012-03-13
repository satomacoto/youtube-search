
var player_width = 480;
var player_height = 320;

/*
 * Polling the player for information
 */

// Update a particular HTML element with a new value
function updateHTML(elmId, value) {
  document.getElementById(elmId).innerHTML = value;
}

// This function is called when an error is thrown by the player
function onPlayerError(errorCode) {
  alert("An error occured of type:" + errorCode);
}

// This function is called when the player changes state
function onPlayerStateChange(newState) {
  if (newState == 0 || newState == -1) {
    getYouTube();
  }
  updateHTML("playerState", newState);
}

// Display information about the current state of the player
function updatePlayerInfo() {
  // Also check that at least one function exists since when IE unloads the
  // page, it will destroy the SWF before clearing the interval.
  if(ytplayer && ytplayer.getDuration) {
    /*
    updateHTML("videoDuration", ytplayer.getDuration());
    updateHTML("videoCurrentTime", ytplayer.getCurrentTime());
    updateHTML("bytesTotal", ytplayer.getVideoBytesTotal());
    updateHTML("startBytes", ytplayer.getVideoStartBytes());
    updateHTML("bytesLoaded", ytplayer.getVideoBytesLoaded());
    */
  }
}

// This function is automatically called by the player once it loads
function onYouTubePlayerReady(playerId) {
  ytplayer = document.getElementById("ytPlayer");
  // This causes the updatePlayerInfo function to be called every 250ms to
  // get fresh data from the player
  setInterval(updatePlayerInfo, 250);
  updatePlayerInfo();
  //ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
  ytplayer.addEventListener("onError", "onPlayerError");
}

// Loads the selected video into the player.
function loadVideo(videoID) {
  if(ytplayer) {
    try {
      ytplayer.loadVideoById(videoID);
    } catch(err) {
      console.log(err);
    }       
  }
}

// The "main method" of this sample. Called when someone clicks "Run".
function loadPlayer(videoID) {
  // The video to load
  //var videoID = "MGt25mv4-2Q"
  // Lets Flash from another domain call JavaScript
  var params = { allowScriptAccess: "always", allowFullScreen: "true" };
  // The element id of the Flash embed
  var atts = { id: "ytPlayer" };
  // All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)
  swfobject.embedSWF("http://www.youtube.com/v/" + videoID + 
                     "?version=3&enablejsapi=1&playerapiid=player1&autoplay=1&autohide=1&hd=1", 
                     "videoDiv", player_width, player_height, "9", null, null, params, atts);
}

$().ready(function(){
  $('#form').submit(function(){
    $('#main').children('a').fadeOut(function(){
      $('#main').html('');
    });
    var query = $(this).children('input=["name"]').val();
    if(!query) return false;
    $.ajax({
      url : 'http://search.twitter.com/search.json',
      data : {
        q : query + ' YouTube',
        lang : 'ja',
        rpp : '100',
        include_entities : 1
      },
      dataType : 'jsonp',
      success : function(json){
        var entries = json.results;
        if(!entries) return;

        // add row
        var divRow = $('<div/>').attr('class', 'row');
        var divQuery = $('<div/>').attr('class', 'query');
        var divItems = $('<div/>').attr('class', 'items');
        $(divRow).append(divQuery);
        $(divRow).append(divItems);
        
        // make query text div
        var divQueryText = $('<div/>')
          .attr('class', 'thumbnail')
          .html(query);
        $(divRow).hide().prependTo('#main').fadeIn();
        $(divQuery).append(divQueryText);

        // add entries
        var ids = {};
        $.each(entries,function(){
          if(this.entities && this.entities.urls[0]) {
            var url = this.entities.urls[0].expanded_url;
            if(url.match(/youtu\.be\/([-\w]+)/) || url.match(/v=([-\w]+)/)){
              var id = RegExp.$1;

              // skip id if exists 
              if (id in ids) {ids[id] +=1 ;return false;}
              ids[id] = 1;
              
              var div = $('<div/>')
                .attr('class', 'item thumbnail')
                .css({'background-image': 'url("http://img.youtube.com/vi/' + id + '/1.jpg")'})
                .click(function () {
                  // load video
                  if (typeof ytplayer == 'undefined') {
                    loadPlayer(id);
                  } else {
                    loadVideo(id);
                  }

                  $.getJSON("https://gdata.youtube.com/feeds/api/videos/" + id + "?v=2&alt=json",
                    function (data) {
                      //var info = $('<div/>')
                      //.css({'width': '480px', 'height': '20px', 'float': 'left', 'font-size': '20px'})
                      //.html(data.entry.title.$t);
                      //$(ytPlayer).after(info);
                    }
                  );
                });
              
              // add item
              $(div).hide();
              $(divItems).append(div);
              $(div).fadeIn();
            }
          }
        });
      }
    });
    return false;
  });
  $(document).click(function () {$('#q').focus();});
  $('#q').focus();
});