function Generator () {
    var _self = this;

    var slideLimit = 1;

    function getXZFromSlider(slider) {
      var sliderClasses = $(slider).attr('class').split(' ');
      if ($(slider).children('.face').length == 0) {
        sliderClasses = slider.parent().attr('class').split(' ');
      }
      return sliderClasses[sliderClasses.length - 1].split('_');
    }

    function emptyFunction() {};
    var draggingListener = emptyFunction;
    var clickListener = emptyFunction;
    var dragEndListener = emptyFunction;

    function getTransform(el) {
      var matrix = $(el).css('transform');
      if (matrix == null) return [0,0,0];
      if (matrix.indexOf('matrix3d') == 0) return matrix.substring(9,matrix.length-1).split(',').slice(12,15);
      else if (matrix.indexOf('matrix') == 0) return matrix.substring(7,matrix.length-1).split(',').slice(4,6).concat("0");
      else return [0,0,0]
    }

    function setTransform(el, arr_xyz, animate) {
      if (animate) $(el).css('transition','transform 0.5s ease-in-out');
      var translation = arr_xyz.join('px,') + 'px';
      $(el).css('transform', 'translate3D(' + translation + ')');
      if (animate) setTimeout(function() {$(el).css('transition','')},500);
    }

    function setRotate(X, Y) {
      if (Y >= 760) Y -= 360;
      if (Y <= 40) Y += 360;
      if (X >= 685) X -= 360;
      if (X <= -35) X += 360;
      var newRotate = 'rotateX(' + X + 'deg) rotateY(' + Y + 'deg)';
      $('.scene')[0].style.transform = newRotate;
    }

    function setColor(slider, color) {
      $(slider).each(function(slider_i) {
        $($(slider)[slider_i]).children().css('background-color',color);
      })
    }

    function setY(slider, percentage, animate) {
      var current = getTransform(slider);
      if (percentage >= slideLimit) percentage = slideLimit;
      if (percentage >= 1) percentage = 1;
      current[1] = Math.floor(- $(slider).height() * percentage);
      setTransform(slider, current, animate)
    }

    function zoom (e) {
      e.preventDefault();
      e.stopPropagation();
      
      var scrollVal = e.wheelDelta;
      var currentZoom = parseFloat($('#model3D').css('zoom'));
      var newZoom = currentZoom + scrollVal/100;
      if (newZoom < 1) newZoom = 1;
      if (newZoom > 1.6) newZoom = 2;

      $('#model3D').css('zoom',newZoom);      
    }

    function freeRotate(e) {
      e.preventDefault();
      e.stopPropagation();
      var rotateVals = $('.scene')[0].style.transform.split(' ');
      var starterX = parseInt(rotateVals[0].substring(rotateVals[0].indexOf('(')+1, rotateVals[0].indexOf('deg)')));
      var starterY = parseInt(rotateVals[1].substring(rotateVals[1].indexOf('(')+1, rotateVals[1].indexOf('deg)')));
      var Xi = (e.pageX);
      var Yi = (e.pageY);
      $("body").on('mousemove', function(e2){
        if (e2.which == 1) {
          var dragX = e2.pageX;
          var dragY = e2.pageY;
          var diffX = Xi - dragX;
          var diffY = Yi - dragY;
          var newX = starterX + diffY*0.6;
          var newY = starterY - diffX*0.4;
          setRotate(newX, newY);
        }
      });
      $("body").on('mouseup',function(e3){
        $("body").off('mousemove');
        $("body").off('mouseup');
      });
    }

    function sliderClick(e) {
      e.preventDefault();
      e.stopPropagation();
      var slider = $(e.target);
      var xzArr =  getXZFromSlider(slider);
      clickListener(xzArr[0],xzArr[1]);
    }

    function sliderDrag(e) {
      e.preventDefault();
      e.stopPropagation();
      var dragged_slider = $(e.target);
      var xzArr =  getXZFromSlider(dragged_slider);
      var slider = $('.slide.desired.' + xzArr.join('_'));
      $("body").css('cursor','-webkit-grabbing');
      $('.slide').css('cursor','-webkit-grabbing');
      var starterY = getTransform(slider)[1]/-slider.height();
      var Xi = (e.pageX);
      var Yi = (e.pageY);
      var newY;
      $("body").on('mousemove', function(e2){
        if (e2.which == 1) {
          var dragX = e2.pageX;
          var dragY = e2.pageY;
          var diffY = Yi - dragY;
          newY = starterY + diffY/(slider.height()*2);
          if (newY < 0) newY = 0;
          if (newY > 1) newY = 1;
          setY(slider,newY,false);
          draggingListener(xzArr[0], xzArr[1], newY);
        }
      });
      $("body").on('mouseup',function(e3){
        dragEndListener(xzArr[0], xzArr[1], newY);
        $("body").off('mousemove');
        $("body").off('mouseup');
        $("body").css('cursor','');
        $('.slide').css('cursor','-webkit-grab');
      });
    }

    function attachListeners () {
      $('.scene').parent().parent().on('mousewheel',function(e) {zoom(e.originalEvent)});
      $('.scene').parent().parent().on('dragstart',function(e) {freeRotate(e.originalEvent)});
      $('.scene').on('dragstart','.slide',function(e) {sliderDrag(e.originalEvent)});
      $('.scene').on('click','.slide',function(e) {sliderClick(e.originalEvent)});
    }

    function clearCanvas () {
      $('.scene').html('');
    }

    function makeCuboid (width, height, depth, x, y, z, draggable, customClass) {
      var shape = $('<div>', {
        'class':'shape cuboid ' + customClass,
        'draggable': draggable
      });
      shape.css('transform', 'translate3D(' + [-x,y,z].join('em,') + 'em)');
      shape.css('width', width  + 'em');
      shape.css('height', height + 'em');
      shape.css('margin', -height/2 + 'em 0 0 ' + -width/2 + 'em');

      var ft = $('<div>', {'class':'face ft'});
      ft.css('transform','translateZ(' + depth/2 + 'em)');

      var bk = $('<div>', {'class':'face bk'});
      bk.css('transform','translateZ(' + (0 - depth/2) + 'em) rotateY(180deg)');

      var tp = $('<div>', {'class':'face tp'});
      var bm = $('<div>', {'class':'face bm'});
      tp.css('height', depth + 'em');
      bm.css('height', depth + 'em');

      var lt = $('<div>', {'class':'face lt'});
      var rt = $('<div>', {'class':'face rt'});
      lt.css('width', depth + 'em');
      rt.css('width', depth + 'em');

      shape.append(ft,bk,tp,bm,lt,rt);
      $('.scene').append(shape);
    }

    function makeCasing (height, side_x, side_z, thickness) {
      //two small ones
      makeCuboid(thickness, height, side_x,  side_z/2 + thickness/2, 0,  0,false,'casing');
      makeCuboid(thickness, height, side_x, -(side_z/2 + thickness/2), 0,  0,false,'casing');
      //two big ones
      makeCuboid(side_z + 2* thickness, height, thickness,  0, 0, side_x/2 + thickness/2,false,'casing');
      makeCuboid(side_z + 2* thickness, height, thickness,  0, 0, -(side_x/2 + thickness/2),false,'casing');
      //bottom
      makeCuboid(side_z + 2*thickness, thickness, side_x + 2*thickness, 0, height/2 + thickness/2, 0, false, 'casing');
    }

    function makePixel (height, sideLength, x, z, x_tot, z_tot) {
      makeCuboid(sideLength, height, sideLength, 
                 z*sideLength - sideLength*(z_tot-1)/2, 0, x*sideLength - sideLength*(x_tot-1)/2,
                 true, 'slide ' + x + '_' + z);

      // only desired one is draggable
      makeCuboid(sideLength, height, sideLength, 
                 z*sideLength - sideLength*(z_tot-1)/2, 0, x*sideLength - sideLength*(x_tot-1)/2,
                 true, 'slide desired ' + x + '_' + z);
    }

    function makeGrid (x_pixels, z_pixels, height, sideLength) {
      for (x = 0; x < x_pixels; x++) {
        for (z = 0; z < z_pixels; z++) {
          makePixel(height, sideLength, x, z, x_pixels, z_pixels);
        }
      }
    }

    //functions to interface with this thing
    _self.makeHaptic = function (x_pixels, z_pixels, height, sideLength, thickness, slideRange, onDragging, onDragEnd, onSlideClick) {
      clearCanvas();
      makeGrid(x_pixels, z_pixels, height, sideLength);
      makeCasing(height, x_pixels*sideLength, z_pixels*sideLength, thickness);
      slideLimit = slideRange || 1;
      draggingListener = onDragging || emptyFunction;
      clickListener = onSlideClick || emptyFunction;
      dragEndListener = onDragEnd || emptyFunction;
      attachListeners();
    }

    _self.setDesiredPos = function (x,z,percentage,animate) {
      var id_class = x + '_' + z;
      var desired_slider = $('.' + id_class)[1];
      setY(desired_slider, percentage, animate);
    }

    _self.setPos = function (x,z,percentage,animate) {
      var id_class = x + '_' + z;
      var true_slider = $('.' + id_class)[0];
      setY(true_slider, percentage, animate);
    }

    _self.setLEDColor = function (x,z,color) {
      var id_class = x + '_' + z;
      setColor($('.' + id_class),color);
    }

    _self.setRotate = function(X,Y) {
      setRotate(X, Y);
    }
}