app.factory('slideShowService', function() {
  var tl;
  return {
    create: function(slides, origDims){
      // l(slides)

      if(!angular.isUndefined(tl)){
        delete tl;
      }
      tl = new TimelineMax({delay: .5});
      
      var parent = $(".slideshow-ctn");
      var yRatio = window.innerHeight/origDims.h;
      var xRatio = window.innerWidth/origDims.w;
      var div, aud, compDiv, span, newX, newY, newW, newH, currLbl, lastLbl;    
      
      TweenMax.set(".slideshow-end", {css:{opacity: 0}});
      TweenMax.set(".slideshow-ctn", {css:{perspective:2000}});

      parent.html("");

      slides.forEach(function(sl, idx){

        // Creating slide from the data
        div = $("<div></div>");      
        div.css({
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: slides.length - idx
        });

        // For all the 2D/3D rotations of components
        tl.set(div, {css:{perspective:2000}});

        if( sl.anim.entry.type.value !== "bl" &&
            sl.anim.entry.type.value !== "st" && 
            sl.anim.entry.type.value !== "tl" && 
            sl.anim.entry.type.value !== "cr"){
          if(sl.bg.type == "color")
            div.css("background-color", sl.bg.value);
          else{
            div.css("background-image", "url(" + sl.bg.value + ")" );
            div.css("background-size", "100% 100%" );
          }
        }
        
        parent.append(div);

        // Add vertical blind divs
        var blW = window.innerWidth/10;
        var blH = window.innerHeight;
        for(var i = 0; i < 10; i++){
          var blDiv = $("<div class='blDiv vert'></div>");
          blDiv.css({
            height: blH,
            width: blW              
          });
          
          div.append(blDiv);
          if(sl.bg.type == "image"){ 
            var blImg = $("<img/>");
            blImg.attr("src", sl.bg.value);
            blImg.css({
              height: window.innerHeight,
              width: window.innerWidth,
              left: -1*i*100 + "%"
            })

            blDiv.append(blImg);
          }else{
            blDiv.css({backgroundColor: sl.bg.value});
          }
        }

        // Add horizontal blind divs
        blW = window.innerWidth;
        blH = window.innerHeight/10;
        for(var i = 0; i < 10; i++){
          var blDiv = $("<div class='blDiv hor'></div>");
          blDiv.css({
            height: blH,
            width: blW              
          });
          
          div.append(blDiv);
          if(sl.bg.type == "image"){ 
            var blImg = $("<img/>");
            blImg.attr("src", sl.bg.value);
            blImg.css({
              height: window.innerHeight,
              width: window.innerWidth,
              top: -1*i*100 + "%"
            })

            blDiv.append(blImg);
          }else{
            blDiv.css({backgroundColor: sl.bg.value});
          }
        }

        // Add tile divs
        var noTiles = 5;
        var tlW = window.innerWidth/noTiles;
        var tlH = window.innerHeight/noTiles;
        for(var i = 0; i < noTiles; i++){
          for(var j = 0; j < noTiles; j++){
            var tlDiv = $("<div class='tlDiv'></div>");
            tlDiv.css({
              width: tlW,              
              height: tlH
            });

            if(sl.bg.type == "image"){
              var tlImg = $("<img/>");
              tlImg.attr("src", sl.bg.value);
              tlImg.css({
                height: window.innerHeight,
                width: window.innerWidth,
                top: -1*i*100 + "%",
                left: -1*j*100 + "%" 
              })

              tlDiv.append(tlImg);
            }else{
              tlDiv.css({backgroundColor: sl.bg.value});
            }

            div.append(tlDiv);
          }
        }

        // Add audio if any
        if(sl.sound.value != ""){
          // l(sl.sound);
          aud = $("<audio loop></audio>");
          aud.attr("src", sl.sound.value);
          div.append(aud);
        }

        // Adding the slide to The Timeline
        if(idx > 0){
          //To sync nth slide's entry with n-1th slide's exit
          tl.add("lb"+ idx +"en", "lb"+ (idx-1) +"ex");        
        }

        // If sound
        if(sl.sound.value != ""){
          var currAud = div.find("audio")[0];
          // l(currAud.src)
          tl.add(function(){
            currAud.play()
          }, "lb"+ idx +"en");
        }

        // Entry       
        if(sl.anim.entry.type.value == "op"){
          // Create a fade-in animation
          tl.fromTo(div, 1, {opacity:0}, {opacity:1}, "lb"+ idx +"en");
        }else if(sl.anim.entry.type.value == "tr"){
          // Create a slide-in animation
          switch(sl.anim.entry.dir.value){
            case 'l': 
              tl.fromTo(div, 1, {xPercent:"-100%"}, {xPercent:0}, "lb"+ idx +"en");
            break;

            case 'r':
              tl.fromTo(div, 1, {xPercent:"100%"}, {xPercent:0}, "lb"+ idx +"en");
            break;

            case 'u':
              tl.fromTo(div, 1, {yPercent:"-100%"}, {yPercent:0}, "lb"+ idx +"en");
            break;

            case 'd':
              tl.fromTo(div, 1, {yPercent:"100%"}, {yPercent:0}, "lb"+ idx +"en");
            break;
          }
        }else if(sl.anim.entry.type.value == "ro"){
          // Create a rotate-in animation
          switch(sl.anim.entry.type.subtype){
            case '2D':
              switch(sl.anim.entry.dir.value){
                case 'x':
                  tl.fromTo(div, 1, {rotationX:90, opacity:0}, {rotationX:0, opacity:1}, "lb"+ idx +"en");
                break;

                case 'y':
                  tl.fromTo(div, 1, {rotationY:90, opacity:0}, {rotationY:0, opacity:1}, "lb"+ idx +"en");
                break;
              }
            break;

            case '3D':
              switch(sl.anim.entry.dir.value){
                case 'x':
                  tl.fromTo(div, 1, {transformOrigin:"left 50% -500", opacity:0, rotationX:90}, {opacity:1, rotationX:0}, "lb"+ idx +"en");
                break;

                case 'y':
                  tl.fromTo(div, 1, {transformOrigin:"center 100% -800", opacity:0, rotationY:90}, {opacity:1, rotationY:0}, "lb"+ idx +"en");
                break;
              }
            break;
          }
        }else if(sl.anim.entry.type.value == "wi"){
          // Create wiggle-in animation
          switch(sl.anim.entry.dir.value){
            case 'l': 
              tl.fromTo(div, 1, {xPercent:"-100%"}, {xPercent:0, ease: Elastic.easeOut.config(1, 0.3)}, "lb"+ idx +"en");
            break;

            case 'r':
              tl.fromTo(div, 1, {xPercent:"100%"}, {xPercent:0, ease: Elastic.easeOut.config(1, 0.3)}, "lb"+ idx +"en");
            break;

            case 'u':
              tl.fromTo(div, 1, {yPercent:"-100%"}, {yPercent:0, ease: Elastic.easeOut.config(1, 0.3)}, "lb"+ idx +"en");
            break;

            case 'd':
              tl.fromTo(div, 1, {yPercent:"100%"}, {yPercent:0, ease: Elastic.easeOut.config(1, 0.3)}, "lb"+ idx +"en");
            break;
          }
        }else if(sl.anim.entry.type.value == "bo"){
          // Create a bounce-in animation
          switch(sl.anim.entry.dir.value){
            case 'l': 
              tl.fromTo(div, 1, {xPercent:"-100%"}, {xPercent:0, ease: Bounce.easeOut}, "lb"+ idx +"en");
            break;

            case 'r':
              tl.fromTo(div, 1, {xPercent:"100%"}, {xPercent:0, ease: Bounce.easeOut}, "lb"+ idx +"en");
            break;

            case 'u':
              tl.fromTo(div, 1, {yPercent:"-100%"}, {yPercent:0, ease: Bounce.easeOut}, "lb"+ idx +"en");
            break;

            case 'd':
              tl.fromTo(div, 1, {yPercent:"100%"}, {yPercent:0, ease: Bounce.easeOut}, "lb"+ idx +"en");
            break;
          }
        }else if(sl.anim.entry.type.value == "bl"){
          switch(sl.anim.entry.dir.value){
            case 'v':
              tl.staggerFromTo(div.find(".blDiv.vert"), 1, {
                transformOrigin:"center 50%",
                rotationY:90,
                opacity:0
              }, {
                display:"inline-block",
                verticalAlign: 'top',
                rotationY:0,
                opacity:1
              }, .05, "lb"+ idx +"en");
            break;

            case 'h':

              tl.staggerFromTo(div.find(".blDiv.hor"), 1, {
                transformOrigin:"center 50%",
                rotationX:90,
                opacity:0
              }, {
                display:"block",
                rotationX:0,
                opacity:1
              }, .05, "lb"+ idx +"en");
            break;
          }
        }else if(sl.anim.entry.type.value == "st"){
          switch(sl.anim.entry.dir.value){
            case 'v':
              tl.staggerFromTo(div.find(".blDiv.vert"), 1, {
                yPercent: "-100%",
                opacity:0
              }, {
                display:"inline-block",
                verticalAlign: 'top',                
                yPercent:0,
                opacity:1,
                // ease: Back.easeOut
              }, .05, "lb"+ idx +"en");
            break;

            case 'h':
              tl.staggerFromTo(div.find(".blDiv.hor"), 1, {
                xPercent: "-100%",                
                opacity:0
              }, {
                display:"block",
                xPercent:0,
                opacity:1,
                // ease: Back.easeOut
              }, .05, "lb"+ idx +"en");
            break;
          }
        }else if(sl.anim.entry.type.value == "cr"){
          switch(sl.anim.entry.dir.value){
            case 'v':
              tl.staggerFromTo(div.find(".blDiv.vert"), 1, {
                cycle:{                  
                  yPercent: function(i){
                    return i%2==0?"-100%":"100%";
                  },
                  opacity: [0]
                }
              }, {
                display:"inline-block",
                verticalAlign: 'top',                
                yPercent:0,
                opacity:1,
                // ease: Back.easeOut
              }, .05, "lb"+ idx +"en");
            break;

            case 'h':
              tl.staggerFromTo(div.find(".blDiv.hor"), 1, {
                cycle:{                  
                  xPercent: function(i){
                    return i%2==0?"-100%":"100%";
                  },
                  opacity: [0]
                }
              }, {
                display:"block",
                xPercent:0,
                opacity:1,
                // ease: Back.easeOut
              }, .05, "lb"+ idx +"en");
            break;
          }
        }else if(sl.anim.entry.type.value == "tl"){
          tl.staggerFromTo(div.find(".tlDiv"), 1, {
            opacity:0
          }, {
            display:"inline-block",
            verticalAlign: "top",
            opacity:1
          }, .05, "lb"+ idx +"en");
        }

        // Adding components
        sl.comps.forEach(function(comp, compIdx){
          if(comp.type == "image"){
            compDiv = $("<div class='component image'><img src="+comp.value+"></div>");
          }else{
            compDiv = $("<div class='component text'></div>");
            span = $("<span>"+comp.value+"</span>")
            span.css({
              textAlign: 'center',           
              color: comp.color,
              fontFamily: comp.font.value,
              fontSize: comp.size.value,
              fontWeight: comp.style.b?'bold':'normal',
              fontStyle: comp.style.i?'italic':'normal',
              textDecoration: comp.style.u?'underline':'none'
            })
            compDiv.append(span);
          }

          newX = comp.x*xRatio;
          newY = comp.y*yRatio;
          newW = comp.width*xRatio;
          newH = comp.height*yRatio;

          compDiv.css({
            visibility: "hidden",
            border: "none",
            width: newW,
            height: newH,
            transform: "translate("+newX+"px,"+newY+"px)"
          });
          
          div.append(compDiv);                  

          // Adding component animations to timeline
          if(compIdx == 0){
            lastLbl = "lb"+ idx +"en";
          }
          
          currLbl = "lb"+ idx +"en-comp"+compIdx;
          tl.add(currLbl, lastLbl + "+=" + comp.delay);

          if(comp.anim.value == "tr"){
            switch(comp.dir.value){
              case 'l':
                tl.fromTo(compDiv, 1, {
                  x: -1*newW,
                  y: newY
                }, {
                  visibility: "visible",
                  x: newX,
                  y: newY
                }, currLbl);
              break;

              case 'r':
                tl.fromTo(compDiv, 1, {
                  x: window.innerWidth,
                  y: newY
                }, {
                  visibility: "visible",
                  x: newX,
                  y: newY
                }, currLbl);
              break;

              case 'u':
                tl.fromTo(compDiv, 1, {
                  x: newX,
                  y: -1*newH
                }, {
                  visibility: "visible",
                  x: newX,
                  y: newY
                }, currLbl);
              break;

              case 'd':
                tl.fromTo(compDiv, 1, {
                  x: newX,
                  y: window.innerHeight
                }, {
                  visibility: "visible",
                  x: newX,
                  y: newY
                }, currLbl);
              break;
            }
          }else if(comp.anim.value == "op"){
            tl.fromTo(compDiv, 1, {opacity:0}, {
              visibility: "visible",
              opacity:1
            }, currLbl);
          }else if(comp.anim.value == "ro"){
            tl.set(compDiv, {css:{x:newX, y:newY}}, currLbl)
            switch(comp.anim.subtype){
              case '2D':
                switch(comp.dir.value){
                  case 'x':
                    tl.fromTo(compDiv, 1, {rotationX:90, opacity:0}, {
                      visibility: "visible",
                      rotationX:0,
                      opacity:1
                    }, currLbl);
                  break;

                  case 'y':
                    tl.fromTo(compDiv, 1, {rotationY:90, opacity:0}, {
                      visibility: "visible",
                      rotationY:0,
                      opacity:1
                    }, currLbl);
                  break;
                }
              break;

              case '3D':
                switch(comp.dir.value){
                  case 'x':
                    tl.fromTo(compDiv, 1, {
                      transformOrigin:"left 50% -500",
                      opacity:0, rotationX:90
                    }, {
                      visibility: "visible",
                      opacity:1, rotationX:0
                    }, currLbl);
                  break;

                  case 'y':
                    tl.fromTo(compDiv, 1, {
                      transformOrigin:"center 100% -800",
                      opacity:0, rotationY:90
                    }, {
                      visibility: "visible",
                      opacity:1, rotationY:0
                    }, currLbl);
                  break;
                }
              break;
            }
          }else if(comp.anim.value == "wi"){
            switch(comp.dir.value){
              case 'l':
                tl.fromTo(compDiv, 1, {
                  x: -1*newW,
                  y: newY
                }, {
                  visibility: "visible",
                  x: newX,
                  y: newY,
                  ease: Elastic.easeOut.config(1, 0.3)
                }, currLbl);
              break;

              case 'r':
                tl.fromTo(compDiv, 1, {
                  x: window.innerWidth,
                  y: newY
                }, {
                  visibility: "visible",
                  x: newX,
                  y: newY,
                  ease: Elastic.easeOut.config(1, 0.3)
                }, currLbl);
              break;

              case 'u':
                tl.fromTo(compDiv, 1, {
                  x: newX,
                  y: -1*newH
                }, {
                  visibility: "visible",
                  x: newX,
                  y: newY,
                  ease: Elastic.easeOut.config(1, 0.3)
                }, currLbl);
              break;

              case 'd':
                tl.fromTo(compDiv, 1, {
                  x: newX,
                  y: window.innerHeight
                }, {
                  visibility: "visible",
                  x: newX,
                  y: newY,
                  ease: Elastic.easeOut.config(1, 0.3)
                }, currLbl);
              break;              
            }
          }else if(comp.anim.value == "bo"){
            switch(comp.dir.value){
              case 'l':
                tl.fromTo(compDiv, 1, {
                  x: -1*newW,
                  y: newY
                }, {
                  visibility: "visible",
                  x: newX,
                  y: newY,
                  ease: Bounce.easeOut
                }, currLbl);
              break;

              case 'r':
                tl.fromTo(compDiv, 1, {
                  x: window.innerWidth,
                  y: newY
                }, {
                  visibility: "visible",
                  x: newX,
                  y: newY,
                  ease: Bounce.easeOut
                }, currLbl);
              break;

              case 'u':
                tl.fromTo(compDiv, 1, {
                  x: newX,
                  y: -1*newH
                }, {
                  visibility: "visible",
                  x: newX,
                  y: newY,
                  ease: Bounce.easeOut
                }, currLbl);
              break;

              case 'd':
                tl.fromTo(compDiv, 1, {
                  x: newX,
                  y: window.innerHeight
                }, {
                  visibility: "visible",
                  x: newX,
                  y: newY,
                  ease: Bounce.easeOut
                }, currLbl);
              break; 
            }
          }

          lastLbl = currLbl;
        })

        // Adding a pause of 3 seconds before exit (at exit label)
        tl.addPause("lb"+ idx +"ex", TweenLite.delayedCall, [3, tl.resume, null, tl]);
        
        // Exit
        if(sl.anim.exit.type.value == "op"){
          // Create a fade-out animation
          tl.to(div, 1, {opacity:0}, "lb"+ idx +"ex");
        }else if(sl.anim.exit.type.value == "tr"){
          // Create a slide-out animation
          switch(sl.anim.exit.dir.value){
            case 'l': 
              tl.to(div, 1, {xPercent:"-100%"}, "lb"+ idx +"ex");
            break;

            case 'r':
              tl.to(div, 1, {xPercent:"100%"}, "lb"+ idx +"ex");
            break;

            case 'u':
              tl.to(div, 1, {yPercent:"-100%"}, "lb"+ idx +"ex");
            break;

            case 'd':
              tl.to(div, 1, {yPercent:"100%"}, "lb"+ idx +"ex");
            break;
          }
        }else if(sl.anim.exit.type.value == "ro"){
          // Create a rotate-out animation
          switch(sl.anim.exit.type.subtype){
            case '2D':
              switch(sl.anim.exit.dir.value){
                case 'x':
                  tl.to(div, 1, {rotationX:-90, opacity:0}, "lb"+ idx +"ex");
                break;

                case 'y':
                  tl.to(div, 1, {rotationY:-90, opacity:0}, "lb"+ idx +"ex");
                break;
              }
            break;

            case '3D':
              switch(sl.anim.exit.dir.value){
                case 'x':
                  tl.to(div, 1, {transformOrigin:"left 50% -500", rotationX:-90, opacity:0}, "lb"+ idx +"ex");
                break;

                case 'y':
                  tl.to(div, 1, {transformOrigin:"center 50% -800", rotationY:-90, opacity:0}, "lb"+ idx +"ex");
                break;
              }
            break;
          }
        }else if(sl.anim.exit.type.value == "wi"){
          // Create wiggle-out animation
          switch(sl.anim.exit.dir.value){
            case 'l': 
              tl.to(div, 1, {xPercent:"-100%", ease: Elastic.easeIn.config(1, 0.3)}, "lb"+ idx +"ex");
            break;

            case 'r':
              tl.to(div, 1, {xPercent:"100%", ease: Elastic.easeIn.config(1, 0.3)}, "lb"+ idx +"ex");
            break;

            case 'u':
              tl.to(div, 1, {yPercent:"-100%", ease: Elastic.easeIn.config(1, 0.3)}, "lb"+ idx +"ex");
            break;

            case 'd':
              tl.to(div, 1, {yPercent:"100%", ease: Elastic.easeIn.config(1, 0.3)}, "lb"+ idx +"ex");
            break;
          }
        }else if(sl.anim.exit.type.value == "bo"){
          // Create bounce-out animation
          switch(sl.anim.exit.dir.value){
            case 'l': 
              tl.to(div, 1, {xPercent:"-100%", ease: Bounce.easeIn}, "lb"+ idx +"ex");
            break;

            case 'r':
              tl.to(div, 1, {xPercent:"100%", ease: Bounce.easeIn}, "lb"+ idx +"ex");
            break;

            case 'u':
              tl.to(div, 1, {yPercent:"-100%", ease: Bounce.easeIn}, "lb"+ idx +"ex");
            break;

            case 'd':
              tl.to(div, 1, {yPercent:"100%", ease: Bounce.easeIn}, "lb"+ idx +"ex");
            break;
          }
        }else if(sl.anim.exit.type.value == "bl"){
          if(sl.bg.type == "image"){
            tl.set(div, { css: { backgroundImage: "none" } } , "lb"+ idx +"ex")
          }else{
            tl.set(div, { css: { backgroundColor: "transparent" } } , "lb"+ idx +"ex")            
          }

          switch(sl.anim.exit.dir.value){
            case 'v':

              tl.set(div.find(".blDiv.hor"), { css: { display: "none" } } , "lb"+ idx +"ex")
              tl.set(div.find(".blDiv.vert"), { css: { display: "inline-block" } } , "lb"+ idx +"ex")
              tl.to(div.find(".component"), .5, { opacity: 0 }, "lb"+ idx +"ex")
              tl.staggerFromTo(div.find(".blDiv.vert"), 1, {
                transformOrigin:"center 50%",
                rotationY:0,
                opacity:1
              }, {
                rotationY:-90,
                opacity:0
              }, .05, "lb"+ idx +"ex")

            break;

            case 'h':

              tl.set(div.find(".blDiv.vert"), { css: { display: "none" } } , "lb"+ idx +"ex")
              tl.set(div.find(".blDiv.hor"), { css: { display: "block" } } , "lb"+ idx +"ex")
              tl.to(div.find(".component"), .5, { opacity: 0 }, "lb"+ idx +"ex")
              tl.staggerFromTo(div.find(".blDiv.hor"), 1, {
                transformOrigin:"center 50%",
                rotationX:0,
                opacity:1
              }, {
                rotationX:-90,
                opacity:0
              }, .05, "lb"+ idx +"ex")

            break;
          }
        }else if(sl.anim.exit.type.value == "st"){
          if(sl.bg.type == "image"){
            tl.set(div, { css: { backgroundImage: "none" } } , "lb"+ idx +"ex")
          }else{
            tl.set(div, { css: { backgroundColor: "transparent" } } , "lb"+ idx +"ex")            
          }

          switch(sl.anim.exit.dir.value){
            case 'v':

              tl.set(div.find(".blDiv.hor"), { css: { display: "none" } } , "lb"+ idx +"ex")
              tl.set(div.find(".blDiv.vert"), { css: { display: "inline-block" } } , "lb"+ idx +"ex")
              tl.to(div.find(".component"), .5, { opacity: 0 }, "lb"+ idx +"ex")
              tl.staggerFromTo(div.find(".blDiv.vert"), 1, {                
                yPercent:0,
                opacity:1
              }, {
                yPercent:"100%",
                opacity:0
              }, .05, "lb"+ idx +"ex")

            break;

            case 'h':

              tl.set(div.find(".blDiv.vert"), { css: { display: "none" } } , "lb"+ idx +"ex")
              tl.set(div.find(".blDiv.hor"), { css: { display: "block" } } , "lb"+ idx +"ex")
              tl.to(div.find(".component"), .5, { opacity: 0 }, "lb"+ idx +"ex")
              tl.staggerFromTo(div.find(".blDiv.hor"), 1, {
                xPercent:0,
                opacity:1
              }, {
                xPercent:"100%",
                opacity:0
              }, .05, "lb"+ idx +"ex")

            break;
          }
        }else if(sl.anim.exit.type.value == "cr"){
          if(sl.bg.type == "image"){
            tl.set(div, { css: { backgroundImage: "none" } } , "lb"+ idx +"ex")
          }else{
            tl.set(div, { css: { backgroundColor: "transparent" } } , "lb"+ idx +"ex")            
          }

          switch(sl.anim.exit.dir.value){
            case 'v':

              tl.set(div.find(".blDiv.hor"), { css: { display: "none" } } , "lb"+ idx +"ex")
              tl.set(div.find(".blDiv.vert"), { css: { display: "inline-block" } } , "lb"+ idx +"ex")
              tl.to(div.find(".component"), .5, { opacity: 0 }, "lb"+ idx +"ex")
              tl.staggerFromTo(div.find(".blDiv.vert"), 1, {                
                yPercent:0,
                opacity:1
              }, {
                cycle:{                  
                  yPercent: function(i){
                    return i%2==0?"-100%":"100%";
                  },
                  opacity: [0]
                }
              }, .05, "lb"+ idx +"ex")

            break;

            case 'h':

              tl.set(div.find(".blDiv.vert"), { css: { display: "none" } } , "lb"+ idx +"ex")
              tl.set(div.find(".blDiv.hor"), { css: { display: "block" } } , "lb"+ idx +"ex")
              tl.to(div.find(".component"), .5, { opacity: 0 }, "lb"+ idx +"ex")
              tl.staggerFromTo(div.find(".blDiv.hor"), 1, {
                xPercent:0,
                opacity:1
              }, {
                cycle:{                  
                  xPercent: function(i){
                    return i%2==0?"-100%":"100%";
                  },
                  opacity: [0]
                }
              }, .05, "lb"+ idx +"ex")

            break;
          }
        }else if(sl.anim.exit.type.value == "tl"){
          if(sl.bg.type == "image"){
            tl.set(div, { css: { backgroundImage: "none" } } , "lb"+ idx +"ex")
          }else{
            tl.set(div, { css: { backgroundColor: "transparent" } } , "lb"+ idx +"ex")            
          }

          tl.set(div.find(".blDiv"), { css: { display: "none" } } , "lb"+ idx +"ex")
          tl.set(div.find(".tlDiv"), { css: { display: "inline-block", verticalAlign: "top" } } , "lb"+ idx +"ex")
          tl.to(div.find(".component"), .5, { opacity: 0 }, "lb"+ idx +"ex")
          tl.staggerFromTo(div.find(".tlDiv"), 1, {
            opacity: 1
          }, {
            opacity: 0
          }, .05, "lb"+ idx +"ex");
        }

        if(sl.sound.value != ""){
          tl.add(function(){
            currAud.pause()
          }, "lb"+ idx +"ex");
        }

        endLbl = "lb"+ idx +"ex";
      });

      tl.to(".slideshow-ol", .5, {delay:.5, backgroundColor:"rgba(0,0,0,.9)"}, endLbl);
      tl.to(".slideshow-end", .5, {delay:.5, opacity:1}, endLbl);
      tl.stop();
    },
    play: function(){
      $(".slideshow-ol").fadeIn(500, function(){
        tl.play();
      });
    },
    stop: function(){
      $(".slideshow-ol").fadeOut(500, function(){
        tl.stop();
        TweenMax.set(".slideshow-ol", {css:{backgroundColor: "rgba(0,0,0,1)"}});
        TweenMax.set(".slideshow-end", {css:{opacity: 0}});
      });
    },
    dbToJS: function(shows){
      shows.forEach(function(show){
        var slides = show.slides;
        var tempSlideArr = [];

        slides.forEach(function(slide){
          var comps = slide.comps;        
          var tempCompArr = [];
          
          comps.forEach(function(comp){
            var tempComp = {
              anim: {
                name: comp.an_ent_name,
                value: comp.an_ent_value,
                subtype: comp.an_ent_subtype
              },
              delay: parseFloat(comp.delay),
              dir: {
                name: comp.an_ent_dir_name,
                value: comp.an_ent_dir_value
              },
              height: parseInt(comp.height),
              width: parseInt(comp.width),
              x: parseInt(comp.x),
              y: parseInt(comp.y),
              type: comp.type,
              value: comp.comp_value,
              color: comp.color
            }

            if(comp.type == "text"){
              tempComp.font = {
                name: comp.font_name,
                value: comp.font_value
              }
              tempComp.size = {
                name: comp.font_size_name,
                value: comp.font_size_value
              }
              tempComp.style = {
                b: comp.isBold == "0"?false:true,
                i: comp.isItalic == "0"?false:true,
                u: comp.isUnder == "0"?false:true,
              }
            }

            tempCompArr.push(tempComp);
          })        

          var tempSlide = {
            bg: {
              type: slide.bg_type,
              value: slide.bg_value
            },
            sound: {
              value: slide.sound
            },
            anim: {
              entry : {
                type: { 
                  name: slide.an_ent_name,
                  value: slide.an_ent_value,
                  subtype: slide.an_ent_subtype
                },
                dir: {
                  name: slide.an_ent_dir_name,
                  value: slide.an_ent_dir_value
                }
              },
              exit : {
                type: {
                  name: slide.an_ex_name,
                  value: slide.an_ex_value,
                  subtype: slide.an_ex_subtype
                },
                dir: {
                  name: slide.an_ex_dir_name,
                  value: slide.an_ex_dir_value
                }
              }
            },
            title: slide.title,
            comps: tempCompArr
          }

          tempSlideArr.push(tempSlide);
        })

        show.slides = tempSlideArr;
      })

      return shows;
    }
  }
})
