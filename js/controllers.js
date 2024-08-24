var l = console.log.bind(window.console);
app.controller('HomeCtrl', function($scope, $http, $state, $filter, $stateParams, slideShowService){
  
  $("input#miniCo").minicolors({
    letterCase: 'lowercase',
    theme: 'bootstrap',
    defaultValue: '#ffffff',
    change: function(val) {
      // l(val);
      $scope.$apply(function(){
        $scope.currSlide.bg.value = val;
      })
    }
  });

  $("input#miniCoComp").minicolors({
    letterCase: 'lowercase',
    theme: 'bootstrap',
    defaultValue: '#000000',
    change: function(val) {
      // l(val);
      $scope.$apply(function(){
        $scope.currComp.color = val;
      })
    }
  });

  $scope.hidePage = false;
  $scope.showLoader = false;
  $scope.progress = 0;
  $scope.currSlide = null;
  $scope.slideIdx = -1;
  $scope.slides = [];
  $scope.newShow = {
    name: "",
    author: ""
  }

  $scope.getData = function(){
    $http({
      url: "backend/getData.php",
      method: "GET"
    }).success(function(data, status, headers, config) {
      // l(data);
      $scope.animTypes = data.animTypes;
      $scope.animTypesComp = $filter('filter')($scope.animTypes, {value_for:"all"});
      $scope.animDir   = data.animDir;
      $scope.animDirTr = $filter('filter')($scope.animDir, {value_for:"tr"});
      $scope.animDirRo = $filter('filter')($scope.animDir, {value_for:"ro"});
      $scope.animDirBl = $filter('filter')($scope.animDir, {value_for:"bl"});
      $scope.fontSizes = data.fontSizes;
      $scope.fonts     = data.fonts;
      
      if($stateParams.slides != null){
        $scope.slides = $stateParams.slides;
        $scope.selectSlide($scope.slides[0], 0);
      }
      
      // $scope.addSlide();
      // $scope.addComponent("image");
    }).error(function(data, status, headers, config) {
      l("Error with $http request");
    })
  }

  $scope.selectSlide = function(sl, idx){
    // l(sl, idx)
    $(".main-card").css("opacity", 0);

    $scope.currSlide = sl;
    $scope.slideIdx = idx;
    if(sl != null){      
      $scope.currSlide.anim.entry.type = $filter('filter')($scope.animTypes, {id:sl.anim.entry.type.id})[0];
      $scope.currSlide.anim.exit.type = $filter('filter')($scope.animTypes, {id:sl.anim.exit.type.id})[0];
      $scope.currSlide.anim.entry.dir = $filter('filter')($scope.animDir, {id:sl.anim.entry.dir.id})[0];
      $scope.currSlide.anim.exit.dir = $filter('filter')($scope.animDir, {id:sl.anim.exit.dir.id})[0];
      if( sl.bg.type == 'color' ){        
        setTimeout(function(){
          $("input#miniCo").minicolors('value', sl.bg.value);
        }, 0)
      }
    }
    $scope.selectComponent(null);
    adjustComponents();
  }
  
  $scope.addSlide = function(){
    var idx = $scope.slides.length + 1;
    var slide = {
      title: "Slide " + idx,
      bg: {
        type: "color",
        value: "#ffffff"
      },
      // bg: {
      //   type: "image",
      //   value: "upload/img/IMG388156.jpg"
      // },
      sound: {  
        name: "No Sound Selected", 
        value: ""
      },
      anim: {
        entry: {
          type: $scope.animTypes[0],
          dir: $scope.animDirTr[0]
        },
        exit: {
          type: $scope.animTypes[0],
          dir: $scope.animDirTr[1]
        }
      },
      comps: []
    }
    $scope.slides.push(slide);
    $scope.selectSlide(slide, idx - 1);
  }

  $scope.removeSlide = function(sl){
    // l(sl);
    // Remove using splice
    $scope.slides.splice($scope.slides.indexOf(sl), 1);
    $scope.selectSlide(null, -1);  
  }  

  $scope.playSlideShow = function(){
    slideShowService.create( $scope.slides, {
      w: $(".main-card").width(),
      h: $(".main-card").height()
    });    
    slideShowService.play();
  }

  $scope.stopSlideShow = function(){
    slideShowService.stop();
  }

  $scope.$watch('currSlide.bg.type', function(nv, ov){
    // l(nv, ov)
    if(nv == 'image'){      
      $("input#miniCo").attr('disabled', true);
    }else{
      $("input#miniCo").attr('disabled', false);
    }
  })  

  $scope.$watch('currSlide.anim.entry.type', function(nv, ov){
    // l(nv, ov)
    if(!angular.isUndefined(nv)){      
      if(nv.value === 'bl' || nv.value === 'st' || nv.value === 'cr'){
        $scope.currSlide.anim.entry.dir = $scope.animDirBl[0];
      }else if(nv.value !== 'ro'){
        $scope.currSlide.anim.entry.dir = $scope.animDirTr[0];
      }else{
        $scope.currSlide.anim.entry.dir = $scope.animDirRo[0];      
      }
    }
  })  

  $scope.$watch('currSlide.anim.exit.type', function(nv, ov){
    // l(nv, ov)
    if(!angular.isUndefined(nv)){      
      if(nv.value === 'bl' || nv.value === 'st' || nv.value === 'cr'){
        $scope.currSlide.anim.exit.dir = $scope.animDirBl[0];
      }else if(nv.value !== 'ro'){      
        $scope.currSlide.anim.exit.dir = $scope.animDirTr[1];
      }else{
        $scope.currSlide.anim.exit.dir = $scope.animDirRo[0];      
      }
    }
  }) 

  $scope.$watch('currComp.anim', function(nv, ov){
    // l(nv, ov)
    if(!angular.isUndefined(nv)){      
      if(nv.value !== 'ro'){   
        $scope.currComp.dir = $scope.animDirTr[0];
      }else{
        $scope.currComp.dir = $scope.animDirRo[0];      
      }
    }
  })  

  $scope.saveSlideShow = function(){
    // l($scope.slides, $scope.newShow)
    $scope.newShow.w = $(".main-card").width();
    $scope.newShow.h = $(".main-card").height();
    $("#addModal").modal('hide');
    $scope.showLoader = true;
    $http({
      url: "backend/saveSlideshow.php",
      method: "POST",
      data: {slides: $scope.slides, show:$scope.newShow},
      headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json;charset=utf-8'}
    }).success(function(data, status, headers, config) {
      l(data);
      $scope.showLoader = false;
      if(data.result){
        $scope.message = "Slideshow saved successfully!"
      }else{        
        $scope.message = "Slideshow could not be saved! Please try again later."
      }
      $("#messModal").modal('show');
    }).error(function(data, status, headers, config) {
      l("Error with $http request");
    })
  }

  $scope.uploadFile = function(type, format){
    $scope.showLoader = true;
    $scope.uploadType = {type: type, format: format};

    var fd = new FormData();
    if(type == 'slide'){
      if(format == "img"){
        fd.append("uploadedFile", $scope.currSlide.bg.file);
      }else{
        fd.append("uploadedFile", $scope.currSlide.sound.file);
      }
    }else{      
      fd.append("uploadedFile", $scope.currComp.file); 
    }
    fd.append("format", format);
    
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", uploadProgress, false)
    xhr.addEventListener("load", uploadComplete, false)
    xhr.addEventListener("error", uploadFailed, false)
    xhr.addEventListener("abort", uploadCanceled, false)
    xhr.open("POST", "backend/uploadFile.php")
    xhr.send(fd);
  }

  function uploadComplete(evt){
    // l(evt.target.response)
    $scope.$apply(function(){
      var data = JSON.parse(evt.target.response);
      // l(data);
      if($scope.uploadType.type == "slide"){
        if($scope.uploadType.format == "img"){
          $scope.currSlide.bg.value = data.path;
        }else{
          $scope.currSlide.sound.name = data.name;
          $scope.currSlide.sound.value = data.path;
        }
      }else{
        $scope.currComp.value = data.path;
      }
      $scope.uploadType = null;
      $scope.showLoader = false;       
    })
  }
  
  function uploadProgress(evt){
    $scope.$apply(function(){
      if (evt.lengthComputable) {
        $scope.progress = Math.round(evt.loaded * 100 / evt.total)
      } else {
        $scope.progress = 0;
      }
    })
  }

  function uploadFailed(evt){
    l("There was an error attempting to upload the file.")
  }

  function uploadCanceled(evt){
    l("The upload has been canceled by the user or the browser dropped the connection.")
  }

  function adjustComponents(){

    setTimeout(function(){
      $(".main-card").css("opacity", 1);
    }, 50)

    setTimeout(function(){
      // l($(".component").toArray());
      // l($scope.currSlide.comps);
      if($scope.currSlide != null){        
        var jqEl = $(".component").toArray();
        var angEl = $scope.currSlide.comps;

        angEl.forEach(function(obj, idx){
          $(jqEl[idx]).attr("data-x", obj.x);
          $(jqEl[idx]).attr("data-y", obj.y);
          $(jqEl[idx]).css({
            height: obj.height,
            width: obj.width,
            transform: "translate("+ obj.x +"px,"+ obj.y +"px)"
          });
        })
      }
    }, 0)
  }

  $scope.removeComponent = function(c){
    $(".main-card").css("opacity", 0);
    $scope.currSlide.comps.splice($scope.currSlide.comps.indexOf($scope.currComp), 1);
    $scope.selectComponent(null);
    adjustComponents();
  }
  
  $scope.selectComponent = function(c){
    $scope.currComp = c;
    if(c != null){      
      setTimeout(function(){
        $("input#miniCoComp").minicolors('value', c.color);
      }, 0)
    }
  }

  $scope.addComponent = function(type){
    
    // Removing previous interactions
    interact('.component').unset();

    var comps = $scope.currSlide.comps;    
    var comp = {
      type: type,
      name: "Component " + (comps.length + 1),
      anim: $scope.animTypes[0],
      delay: 1,
      dir: $scope.animDirTr[0],  
      x:0, y:0
    }

    comps.push(comp);
    $scope.currComp = comp;
      
    switch(type){
      case 'text':
        comp.value = "Sample Text";
        comp.color = "#000000";
        comp.size = $scope.fontSizes[0];
        comp.font = $scope.fonts[0];
        comp.style = {b:false, i: false, u:false};
        comp.height = 70;
        comp.width = 200;
      break;

      case 'image':
        comp.value = "img/img-plh.png";
        // comp.value = "img/anu.png";
        comp.height = 250;
        comp.width = 350;
      break;
    }

    // Adding interactions to all components
    interact('.component')
    .draggable({
      onmove: function(event) {
        // l(event)
        var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // counter -1 values
        x = x<0?0:x;
        y = y<0?0:y;

        // translate the element
        target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
        
        $scope.$apply(function(){
          $scope.currComp.x = x;
          $scope.currComp.y = y;
        })
      },
      restrict: {
        restriction: 'parent',
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      },
    })
    .resizable({
      // resize from all edges and corners
      edges: { left: true, right: true, bottom: true, top: true },

      // keep the edges inside the parent
      restrictEdges: {
        outer: 'parent',
        endOnly: true,
      },

      // minimum size
      restrictSize: {
        min: { width: 100, height: 50 },
      },

      inertia: true,
    })
    .on('resizemove', function (event) {
      var target = event.target,
      x = (parseFloat(target.getAttribute('data-x')) || 0),
      y = (parseFloat(target.getAttribute('data-y')) || 0);
      
      // counter -1 values
      x = x<0?0:x;
      y = y<0?0:y;
      
      // update the element's style
      target.style.width  = event.rect.width + 'px';
      target.style.height = event.rect.height + 'px';

      // translate when resizing from top or left edges
      x += event.deltaRect.left;
      y += event.deltaRect.top;

      target.style.webkitTransform = target.style.transform =
          'translate(' + x + 'px,' + y + 'px)';

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);

      $scope.$apply(function(){
        $scope.currComp.x = x;
        $scope.currComp.y = y;
        $scope.currComp.width = event.rect.width;
        $scope.currComp.height = event.rect.height;
      })
    });
  }

  $scope.goTo = function(state){
    $state.go(state, {slides: $scope.slides, ext: $scope.newShow.author});
  }

  // l($stateParams);
  if(angular.isUndefined($stateParams.ext) || $stateParams.ext == "true"){
    $scope.hidePage = true;
    $scope.message = "Please enter a name in the 'ext' parameter.<br/>Eg. /home?<b>ext=samplename</b>";
    $("#messModal").modal('show');    
  }else{  
    $scope.newShow.author = $stateParams.ext;
    $scope.getData();
  }

})
.controller('ShowCtrl', function($scope, $http, $state, $stateParams, slideShowService){

  $scope.getShows = function(){
    $scope.showLoader = true;
    $http({
      url: "backend/getSavedShows.php",
      method: "POST",
      data: {cl: $scope.cl, type:"auth"},
      headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json;charset=utf-8'}
    }).success(function(data, status, headers, config) {
      // l(data);
      $scope.shows = slideShowService.dbToJS(angular.copy(data));
      $scope.showLoader = false;
      // l($scope.shows);
    }).error(function(data, status, headers, config) {
      l("Error with $http request");
    })
  }

  $scope.playSlideShow = function(s){
    // l(s)
    
    window.open($state.href('play', {showId: s.id}), '_blank');
    
    // if(s != null){
    //   $scope.currShow = s;
    // }
    // slideShowService.create( $scope.currShow.slides, {
    //   w: $scope.currShow.w,
    //   h: $scope.currShow.h
    // });
    // slideShowService.play();
  }

  // $scope.stopSlideShow = function(){
  //   slideShowService.stop();
  // }

  $scope.deleteSlideShow = function(s){
    if(confirm('Are you sure you want to delete this slideshow?')){
      $scope.showLoader = true;
      $http({
        url: "backend/deleteSlideshow.php",
        method: "POST",
        data: {id:s.id},
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json;charset=utf-8'}
      }).success(function(data, status, headers, config) {
        // l(data);
        $scope.showLoader = false;
        if(data.result){
          $scope.message = "Slideshow deleted successfully!"
        }else{        
          $scope.message = "Slideshow could not be deleted! Please try again later."
        }
        $("#messModal").modal('show');
        $scope.getShows();
      }).error(function(data, status, headers, config) {
        l("Error with $http request");
      })
    }
  }  

  $scope.goTo = function(state){
    $state.go(state, {slides: $scope.tempSlides, ext:$scope.cl});
  }

  if(angular.isUndefined($stateParams.ext) || $stateParams.ext == "true"){
    $scope.hidePage = true;
    $scope.message = "Please enter a name in the 'ext' parameter.<br/>Eg. /home?<b>ext=samplename</b>";
    $("#messModal").modal('show');    
  }else{  
    if($stateParams.slides != null){
      $scope.tempSlides = $stateParams.slides;
    }
    $scope.cl = $stateParams.ext;
    $scope.getShows();    
  }
  
})
.controller('PlayCtrl', function($scope, $http, $state, $stateParams, slideShowService){
  
  $scope.getShowById = function(id){
    $scope.showLoader = true;
    $http({
      url: "backend/getSavedShows.php",
      method: "POST",
      data: {id: id, type:"id"},
      headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json;charset=utf-8'}
    }).success(function(data, status, headers, config) {
      // l(data);
      $scope.showLoader = false;
      if(data.length){
        $scope.shows = slideShowService.dbToJS(angular.copy(data));
        $scope.playSlideShow();        
      }else{
        $scope.message = "There are no shows saved currently with this ID.<br/>Please try a different one.";
        $("#messModal").modal('show');  
      }
    }).error(function(data, status, headers, config) {
      l("Error with $http request");
    })
  }

  $scope.playSlideShow = function(){
    var show = $scope.shows[0];
    slideShowService.create( show.slides, {
      w: show.w,
      h: show.h
    });
    slideShowService.play();
  }

  if(typeof $stateParams.showId !== "undefined"){
    // $scope.showId = $stateParams.showId;
    $scope.getShowById($stateParams.showId);
  }

})
.directive('fileModelUp', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      // l(attrs);
      var model = $parse(attrs.fileModelUp);
      var modelSetter = model.assign;
      
      element.bind('change', function(){
        scope.$apply(function(){
          modelSetter(scope, element[0].files[0]);
        });
        scope.uploadFile(attrs.upType, attrs.format);
        $("input[type='file']").val(null);
      });
    }
  }
})
.filter('noTime', function () {
  return function ( input ) {
    if(input){      
      return input.slice(0, input.length - 9);
    }
  }
})
.filter('trustedHTML', function($sce){
  return function(text) {
    return $sce.trustAsHtml(text);
  }
})