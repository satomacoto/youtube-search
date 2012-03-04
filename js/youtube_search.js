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

              // skip id if exists 
              if (id in ids) return false;
              ids[id] = true;
              
              // http://img.youtube.com/vi/<insert-youtube-video-id-here>/0.jpg 
              var div = $('<div/>')
                .attr('class', 'thumbnail')
                .css({'width': '80px', 'height': '80px', 'float': 'left'})
                .css({'background-image': 'url("http://img.youtube.com/vi/' + id + '/1.jpg")', 'background-position': 'center center'})
                .click(function () {
                  $('#player').remove();
                  var player = $('<iframe/>')
                    .attr('id', 'player')
                    .attr('class', 'youtube-player')
                    .attr('type', 'text/html')
                    .attr({'width': '320', 'height': '240'})
                    .attr('src', 'http://www.youtube.com/embed/' + id + '?autoplay=1')
                    .attr('frameborder', '0')
                    .css('float', 'left');
                  $('#main').prepend(player);
                  $('#q').select();
                });
              $('#main').prepend(div);
            }
          }
        });
        var query_text = $('<div/>')
          .attr('class', 'thumbnail')
          .css({'width': '80px', 'height': '80px', 'float': 'left'})
          .css({'font-size': '40px', 'line-height': '40px', 'overflow': 'hidden'})
          //.css({'border-style': 'solid', 'border-width': '5px'})
          .html(query);
        $('#main').prepend(query_text);
      }
    });
    return false;
  });
  $('#q').focus();
});