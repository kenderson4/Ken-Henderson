/**
 * @author Alexander Farkas
 * v. 1.22
 */


(function($) {
	if(!document.defaultView || !document.defaultView.getComputedStyle){ // IE6-IE8
		var oldCurCSS = $.curCSS;
		$.curCSS = function(elem, name, force){
			if(name === 'background-position'){
				name = 'backgroundPosition';
			}
			if(name !== 'backgroundPosition' || !elem.currentStyle || elem.currentStyle[ name ]){
				return oldCurCSS.apply(this, arguments);
			}
			var style = elem.style;
			if ( !force && style && style[ name ] ){
				return style[ name ];
			}
			return oldCurCSS(elem, 'backgroundPositionX', force) +' '+ oldCurCSS(elem, 'backgroundPositionY', force);
		};
	}
	
	var oldAnim = $.fn.animate;
	$.fn.animate = function(prop){
		if('background-position' in prop){
			prop.backgroundPosition = prop['background-position'];
			delete prop['background-position'];
		}
		if('backgroundPosition' in prop){
			prop.backgroundPosition = '('+ prop.backgroundPosition;
		}
		return oldAnim.apply(this, arguments);
	};
	
	function toArray(strg){
		strg = strg.replace(/left|top/g,'0px');
		strg = strg.replace(/right|bottom/g,'100%');
		strg = strg.replace(/([0-9\.]+)(\s|\)|$)/g,"$1px$2");
		var res = strg.match(/(-?[0-9\.]+)(px|\%|em|pt)\s(-?[0-9\.]+)(px|\%|em|pt)/);
		return [parseFloat(res[1],10),res[2],parseFloat(res[3],10),res[4]];
	}
	
	$.fx.step. backgroundPosition = function(fx) {
		if (!fx.bgPosReady) {
			var start = $.curCSS(fx.elem,'backgroundPosition');
			if(!start){//FF2 no inline-style fallback
				start = '0px 0px';
			}
			
			start = toArray(start);
			fx.start = [start[0],start[2]];
			var end = toArray(fx.end);
			fx.end = [end[0],end[2]];
			
			fx.unit = [end[1],end[3]];
			fx.bgPosReady = true;
		}
		//return;
		var nowPosX = [];
		nowPosX[0] = ((fx.end[0] - fx.start[0]) * fx.pos) + fx.start[0] + fx.unit[0];
		nowPosX[1] = ((fx.end[1] - fx.start[1]) * fx.pos) + fx.start[1] + fx.unit[1];           
		fx.elem.style.backgroundPosition = nowPosX[0]+' '+nowPosX[1];

	};
})(jQuery);
$.fn.wait = function(time, type) {
    time = time || 1000;
    type = type || "fx";
    return this.queue(type, function() {
        var self = this;
        setTimeout(function() {
            $(self).dequeue();
        }, time);
    });
};
var active_color = '#999'; // Colour of user provided text
var inactive_color = '#999'; // Colour of default text
var social_time = 500; //time in miliseconds

jQuery(document).ready(function($) {
  $('<div class="wood_shelf"></div>').insertAfter('.bookshelf_row .bookshelf_image:nth-child(4)' );
    $('#footer_soc_nav a').hover(
     function(){ $(this).stop(true).animate({'backgroundPosition' : '0px '+(64-128*($(this).parent().children().index(this)+1))+'px'} )},
     function(){ $(this).stop(true).animate({'backgroundPosition' : '0px -'+(128*($(this).parent().children().index(this)+0))+'px'} )}
  );

  $(".list_more_link").click(function () {
    $(this).next(".list_more").toggle("slow");
  });
  $('.contact_image').hover(function() {
     $(this).fadeOut(social_time,function() {
       $(this).attr('src', $(this).attr('src').replace("_bw.png", ".png")).fadeIn(social_time); 
     });
  }, function() {
     $(this).fadeOut(social_time,function() {
       $(this).attr('src', $(this).attr('src').replace(".png", "_bw.png")).fadeIn(social_time); 
     });
  });


  $("input.default-value, textarea.default-value").css("color", inactive_color);
  var default_values = new Array();                      
  $('input[type="text"], textarea').focus(function() {
      if (this.value == this.defaultValue){
      this.value = '';
          this.style.color = active_color;
  }
  if(this.value != this.defaultValue){
      this.select(); 
      this.style.color = active_color;
  }
  });
  $('input[type="text"], textarea').blur(function() {
      if (this.value == ''){
      this.value = (this.defaultValue ? this.defaultValue : '');
      this.style.color = inactive_color;
  }
  });

});