/*
 Copyright (C) 2010 by John William Lockwood IV

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

*/
// My Library Based Slideshow and SlideShowManager

/*
APi.effects:
drop
fade
flip
flipH
flipV
fold
grow
move
rotate
scale
scaleX
scaleY
scroll
scrollElement
shake
skew
skewX
skewY
spin
transform
transformMatrix
transfomOrigin


API.ease:
sine
cosine 
tan
flicker
wobble
square
circle
pulsate
expo
quad
cube
sigmoid
sigmoid2
sigmoid3
sigmoid4
loop
bounce
swingTo
swingToFrom

*/

/*

<div id="slideShowWrapperA" class="slideshowWrapper">
<div id="slideshow1" class="slideshow">


<div class="slide">
<img src="images/slide1.jpg" alt="the first slide">
<a href="/about-us/"></a>
</div>

<div class="slide">
<img src="images/slide2.jpg" alt="the second slide">
<a href="http://www.google.com"></a>
</div>

<div class="slide">
<img src="images/slide3.jpg" alt="the third slide">
<a href="/contact-us/"></a>
</div>


<div class="nav"></div>
</div>
</div>


*/

var API,D,E,F;
API = API || {};
var global = this;





(function(){
var createElementWithAttributes,createElement,isDescendant,showElement,getEBI,getEBCS,getEBCN,getEBTN;
var setElementHtml,getEventTarget,getEventTargetRelated,getElementParentElement,forEach;  
var setStyles, setStyle,addClass,removeClass,hasClass;
function SlideShowsManager(options,slideshowOptions)
{
   var me = this;
   me.options = options || {};
   me.slideshows = [];
   createElementWithAttributes = API.createElementWithAttributes;
   createElement = API.createElement;
   setElementHtml = API.setElementHtml;
   getEventTarget = API.getEventTarget;
   getEventTargetRelated = API.getEventTargetRelated;
   getElementParentElement = API.getElementParentElement;
   isDescendant = API.isDescendant;
   showElement = API.showElement;
   getEBI = API.getEBI;
   setStyle = API.setStyle;
   setStyles = API.setStyles;
   getEBCN = API.getEBCN;
   getEBCS = API.getEBCS;
   addClass = API.addClass;
   removeClass = API.removeClass;
   hasClass = API.hasClass;
   forEach = API.forEach;
   getEBTN = API.getEBTN;
   showElement = API.showElement;
   me.stopAll_ = function()
   {
      return me.stopAll();
   }
   
   me.slideshowCN = options.slideshowCN || "slideshow";
   var slideshowEls  = getEBCN(me.slideshowCN);
   var slideshowElsArray = API.toArray(slideshowEls);
   API.forEach(slideshowElsArray, function(slideshowEl,iter)
      {
         var theOptions = slideshowOptions;
         if(me.options.idCustomOptions && me.options.idCustomOptions[slideshowEl.id])
         {
            theOptions = me.options.idCustomOptions[slideshowEl.id];
         }
         me.slideshows.push(new SlideShow(slideshowEl,theOptions));
      });
   
   
}

SlideShowsManager.prototype.stopAll = function()
{
   var me = this;
   API.forEach(me.slideshows, function(slideshow,ii)
      {
         if(slideshow && slideshow.stop)
         {
            slideshow.stop();
         }
      });
   
}

SlideShowsManager.prototype.add = function(slideshow)
{
   var me = this;
   me.slideshows.push(slideshow);
   
}
      
function SlideShow(el,options)
{
   options = options || {};
   var me = this;
   me.el = el;
   me.startTimer = null;
   me.transitionTimer = null;
   me.transitionDelay = options.transitionDelay || 15000;
   me.startDelay = options.startDelay || 5000;
   me.currentSlideNumber = 0;
   me.transition = options.transition || { effects:API.effects.fade, duration:1000 };
   me.urls = [];
   
   me.start_ = function()
   {
      return me.start();
   }
   me.transitionToNextSlide_ = function()
   {
      return me.transitionToNextSlide();
   }
   var slideEls = getEBCN("slide",el);
   me.slides = API.toArray(slideEls);
   me.slideCount = me.slides.length;
   if(me.slideCount === 0)
   {
      return
   }
   setStyle(el,"position","relative");
   API.forEach(me.slides,function(slideEl,ii)
      {
         
         if(ii===0)
         {
            setStyles(slideEl,{
               "position":"absolute",
            "top":0,"left":0,"display":"block","zIndex":me.slideCount+1000-ii});
         } else 
         {
            setStyles(slideEl,{
               "position":"absolute",
               "top":0,"left":0,"display":"none","zIndex":me.slideCount+1000-ii});
         }
         
         var url;
         var slideUrlEls = getEBTN("a",slideEl);
         var slideUrls = API.toArray(slideUrlEls);
         if(slideUrls.length > 0)
         {
            url = API.getAttribute(slideUrls[0],"href");
            me.urls.push(url);
            API.attachListener(slideEl,"click",function(eO)
               {
                  var win = API.getDocumentWindow();
                  win.location=url;
               });
         }
         
      });
   
   me.nav = {};
   me.nav.slideNavEls = [];
   var navEl;
   var navEls = getEBCN("nav",me.el);
   var navElsArray = API.toArray(navEls);
   if(API.setElementNodes &&navElsArray.length > 0)
   {
      me.nav.el = navElsArray[0];
      slideCount = me.slideCount;
      var navTempContainer = createElement("div");
      var iter=slideCount;
      while(iter>0)
      {
         var slideNavEl = createElement("a");
         setElementHtml(slideNavEl,iter);
         navTempContainer.appendChild(slideNavEl);
         iter--;
      }
      API.setElementNodes(me.nav.el, navTempContainer);
      
      me.nav.slideNavEls = API.toArray(getEBTN('a',me.nav.el));
      forEach(me.nav.slideNavEls, function(slideNavEl,iter)
         {
            API.attachListener(slideNavEl,"click",function(eO)
            {
                  me.gotoSlide(iter);
            });
         });
      
   }
   me.setActiveSlideNav(0);
   me.startTimer = setTimeout(me.start_,new Number(me.startDelay));
   
}
SlideShow.prototype.gotoSlide = function(slideNumber)
{
   var me = this;   
   if(!me.startTimer)
   {
      clearTimeout(me.transitionTimer);
   }
   
   if(me.transitionGoing)
   {
      me.goneto = true;
   }
   var fromSlideEl = me.slides[me.currentSlideNumber];
   var nextSlideNumber = (new Number(slideNumber))%me.slideCount;
   me.setActiveSlideNav(nextSlideNumber);
   var toSlideEl = me.slides[nextSlideNumber];
   me.currentSlideNumber = slideNumber;
   showElement(toSlideEl,true);
   showElement(fromSlideEl,false);
   me.reOrderWithNAtTop(slideNumber);
   if(!me.startTimer)
   {
      me.transitionTimer = setTimeout(me.transitionToNextSlide_,new Number(me.transitionDelay));
   }
   
}

SlideShow.prototype.setActiveSlideNav = function(slideNumber)
{
   var me = this;
   var slideNavEls = me.nav.slideNavEls;
   var activeSlideCN = "activeSlide";
   API.forEach(slideNavEls, function(slideNavEl,iter)
      {
         if(iter === slideNumber)
         {
            addClass(slideNavEl,activeSlideCN);
         } else
         {
            removeClass(slideNavEl,activeSlideCN);
         }
      });
};

SlideShow.prototype.reOrderWithNAtTop = function(slideNumber)
{
   var me = this;
   var slidesLength = me.slides.length;
   var last = new Number((slideNumber+slidesLength-1)%slidesLength);
   var iter = new Number(slideNumber);
   var iiter = new Number(slideNumber);
   var lastEl = me.slides[last];
   var el;
   setStyle(lastEl,"zIndex",800+slidesLength);
   while(iter!=last)
   {
      el = me.slides[iter]
      setStyle(el,"zIndex",800+slidesLength+iiter);
      iter = (iter+1)%slidesLength;
      
      iiter--;
   }
}

SlideShow.prototype.transitionToNextSlide = function()
{
   var me = this;
   var fromSlideEl = me.slides[me.currentSlideNumber];
   var nextSlideNumber = (new Number(me.currentSlideNumber+1))%me.slideCount;
   var toSlideEl = me.slides[nextSlideNumber];
   me.currentSlideNumber = nextSlideNumber;
   showElement(toSlideEl,true);
   me.transitionGoing = true;
   showElement(fromSlideEl,false,me.transition, function()
      {
         if(!me.goneto)
         {
            me.reOrderWithNAtTop(nextSlideNumber);
            me.setActiveSlideNav(nextSlideNumber);
            me.transitionTimer = setTimeout(me.transitionToNextSlide_,new Number(me.transitionDelay));
            me.transitionGoing = false;
         }
         me.goneto=false;
      });
   
}

SlideShow.prototype.start = function()
{
   var me = this;
   clearTimeout(me.startTimer);
   me.startTimer = null;
   me.transitionToNextSlide();
}

API.SlideShowsManager = SlideShowsManager;
API.SlideShow = SlideShow;


createElementWithAttributes = API.createElementWithAttributes;
createElement = API.createElement;
setElementHtml = API.setElementHtml;
getEventTarget = API.getEventTarget;
getEventTargetRelated = API.getEventTargetRelated;
getElementParentElement = API.getElementParentElement;
isDescendant = API.isDescendant;
showElement = API.showElement;
getEBI = API.getEBI;
setStyle = API.setStyle;
setStyles = API.setStyles;
getEBCN = API.getEBCN;
getEBCS = API.getEBCS;
addClass = API.addClass;
removeClass = API.removeClass;
hasClass = API.hasClass;
forEach = API.forEach;
getEBTN = API.getEBTN;


})();
