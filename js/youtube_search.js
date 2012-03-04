$().ready(function(){
  $('#form').submit(function(){
    $('#main').children('a').fadeOut(function(){
      $('#main').html('');
    });
    var query = $(this).children('input=["name"]').val();
    if(!query) return false;
    //$('#main').text('loading...');
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
        //$('#main').html('');
        var entries = json.results;
        var ids = {};
        if(!entries) return;
        $.each(entries,function(){
          if(this.entities && this.entities.urls[0]) {
            var url = this.entities.urls[0].expanded_url;
            if(url.match(/youtu\.be\/([-\w]+)/) || url.match(/v=([-\w]+)/)){
              var id = RegExp.$1;

              // id がすでに存在していたら飛ばす
              if (id in ids) return false;
              ids[id] = true;
              
              // http://img.youtube.com/vi/<insert-youtube-video-id-here>/0.jpg 
              var div = $('<div/>')
                .attr('class', 'thumbnail')
                .css('width', '80px')
                .css('height', '80px')
                .css('float', 'left')
                .css('background-image', 'url("http://img.youtube.com/vi/' + id + '/1.jpg")')
                .css('background-position', 'center center')
                .click(function () {
                  $('#player').remove();
                  var player = $('<iframe/>')
                    .attr('id', 'player')
                    .attr('class', 'youtube-player')
                    .attr('type', 'text/html')
                    .attr('width', '320')
                    .attr('height', '240')
                    .attr('src', 'http://www.youtube.com/embed/' + id + '?autoplay=1')
                    .attr('frameborder', '0')
                    .css('float', 'left');
                  $('#main').prepend(player);
                  $('#q').select();
                });
              $('#main').prepend(div);
              /*
              var a = $('<a/>').attr('href','http://youtu.be/' + id);
              a.attr('target','_blank');
              var img = $('<img/>').attr('src','http://img.youtube.com/vi/' + id + '/1.jpg');
              img.bind('load',function(){
                a.hide();
                a.append(img);
                $('#main').prepend(a);
                a.fadeIn();
              });
              var div = $('<div/>').attr('id', id);
              // Lets Flash from another domain call JavaScript
              var params = { allowScriptAccess: "always" };
              // The element id of the Flash embed
              var atts = { id: id };
              $('#main').append(div);
              swfobject.embedSWF("http://www.youtube.com/v/" + id + "?version=3&enablejsapi=1&playerapiid=player1", id, "208", "130", "9", null, null, params, atts);
              */
            }
          }
        });
      }
    });
    return false;
  });
  $('#q').focus();
});