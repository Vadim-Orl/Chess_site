/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./source/js/gallery-lib/gallery.js":
/*!******************************************!*\
  !*** ./source/js/gallery-lib/gallery.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Gallary)\n/* harmony export */ });\nconst GallaryClassName = 'gallery';\nconst GallaryLineClassName = 'gallery-line';\nconst GallerySlideClassName = 'gallery-slide';\n\nconst NavClassName = 'navigation';\nconst NavBtnLeftClassName = 'navigation__button--left';\nconst NavBtnRightClassName = 'navigation__button--right';\n// const NavLeftButtonClassName =\nconst NavigateTogglesClassName = 'slider__toggles'\nconst NavCurrentToggleClassName = 'slider__toggle--current'\nconst DataAtributToggle = 'data-slide-num'\n\nclass Gallary {\n    constructor(element, navigate, options = {}) {\n        this.containerNode = element;\n        this.navigateNode = navigate;\n        this.currentSlide = 0;\n        this.size = element.querySelectorAll(`.${GallerySlideClassName}`).length;\n\n        this.currentSlideWasChange = false;\n        this.settings = {\n            margin: options.margin || 0,\n            hasTimer: options.hasTimer || false,\n            hasToggleText: options.hasToggleText,\n            hasToggle: options.hasToggle,\n            isSliderNotRound: options.isSliderNotRound,\n            breakpoints: options.breakpoints,\n        }\n\n        this.checkDocWidth = this.checkDocWidth.bind(this);\n        this.manageHTML = this.manageHTML.bind(this);\n        this.manageNavHTML = this.manageNavHTML.bind(this);\n\n        this.setParameters = this.setParameters.bind(this);\n        this.setEvents = this.setEvents.bind(this);\n        this.resizeGallery = this.resizeGallery.bind(this);\n\n        this.startDrag = this.startDrag.bind(this);\n        this.stopDrag = this.stopDrag.bind(this);\n        this.dragging = this.dragging.bind(this);\n\n        this.setStylePosition = this.setStylePosition.bind(this);\n        this.changeCurrentSlide =  this.changeCurrentSlide.bind(this);\n        this.nextSlide = this.nextSlide.bind(this);\n        this.startTimer = this.startTimer.bind(this);\n        this.destroyEvents = this.destroyEvents.bind(this);\n\n        this.goToRightSlide = this.goToRightSlide.bind(this);\n        this.goToLeftSlide = this.goToLeftSlide.bind(this);\n        this.goToCurrentSlide = this.goToCurrentSlide.bind(this);\n        this.changeToggles = this.changeToggles.bind(this);\n        this.changeStyleBtn = this.changeStyleBtn.bind(this);\n\n\n        this.manageHTML();\n        this.settings.hasToggle && this.manageNavHTML()\n        this.setParameters();\n        this.setEvents();\n        this.settings.hasTimer && this.startTimer();\n\n    }\n\n\n    checkDocWidth() {\n      // debugger\n      if (window.innerWidth > this.settings.breakpoints.starting &&\n        window.innerWidth < this.settings.breakpoints.ending) {\n            console.log('true -1 ')\n          return true;\n        }\n        else {\n        console.log('false -1 ')\n\n          return false;\n        }\n    }\n\n\n    manageHTML() {\n        this.lineNode = this.containerNode.querySelector(`.${GallaryLineClassName}`);\n\n        this.slideNodes = Array.from(this.lineNode.querySelectorAll(`${GallerySlideClassName}`))\n\n    }\n\n    manageNavHTML() {\n        console.log(this.navigateNode)\n        this.navLeftButton = this.navigateNode.querySelector(`.${NavBtnLeftClassName}`);\n        this.navRightButton = this.navigateNode.querySelector(`.${NavBtnRightClassName}`);\n        this.navToggles = this.navigateNode.querySelector(`.${NavigateTogglesClassName}`);\n\n        this.toggleNodes = Array.from(this.navToggles.children);\n        this.toggleNodes.map((el, index) => el.setAttribute(`${DataAtributToggle}`, (index+1)))\n\n    }\n\n    setParameters() {\n        const coordsContainer = this.containerNode.getBoundingClientRect();\n        this.width = coordsContainer.width;\n        this.maximumX = -(this.size - 1) * (this.width  + this.settings.margin)\n        this.x = -this.currentSlide * (this.width + this.settings.margin)\n        this.setStylePosition();\n    }\n\n    setEvents() {\n      console.log('set events')\n\n        this.debouncedResizeGallery = debounce(this.resizeGallery);\n        window.addEventListener('resize', this.debouncedResizeGallery);\n\n        this.lineNode.addEventListener('pointerdown', this.startDrag)\n        window.addEventListener('pointerup', this.stopDrag)\n        window.addEventListener('pointercancel', this.stopDrag)\n\n\n        this.navRightButton.addEventListener('click', this.goToRightSlide)\n        this.navLeftButton.addEventListener('click', this.goToLeftSlide)\n\n        this.settings.hasToggle && this.navToggles.addEventListener('click', this.goToCurrentSlide);\n    }\n\n    destroyEvents() {\n        window.removeEventListener('resize', this.debouncedResizeGallery);\n\n        this.lineNode.removeEventListener('pointerdown', this.startDrag)\n        window.removeEventListener('pointerup', this.stopDrag)\n        window.removeEventListener('pointercancel', this.stopDrag)\n\n\n\n        this.navRightButton.removeEventListener('click', this.goToRightSlide)\n        this.navLeftButton.removeEventListener('click', this.goToLeftSlide)\n        this.settings.hasToggle && this.navToggles.removeEventListener('click', this.goToCurrentSlide);\n    }\n\n    resizeGallery() {\n\n      console.log('resize')\n\n      if (this.checkDocWidth()) {\n        this.settings.hasTimer && this.stopTimer();\n\n        this.settings.hasTimer && this.startTimer();\n\n        this.setStyleTransition()\n        this.setParameters();\n        this.setEvents();\n        this.changeToggles();\n      } else {\n          console.log('resize')\n          this.settings.hasTimer && this.stopTimer();\n          this.resetStyleTransition();\n          this.currentSlide = 0;\n          this.setParameters();\n          this.destroyEvents()\n        }\n    }\n\n    startDrag(evt) {\n        evt.preventDefault();\n        console.log('start drag')\n        this.currentSlideWasChange = false;\n        this.settings.hasTimer && this.stopTimer();\n\n        this.clickX = evt.pageX;\n        this.startX = this.x\n        console.log(evt.pageX)\n        window.addEventListener('pointermove', this.dragging)\n    }\n\n    stopDrag() {\n        window.removeEventListener('pointermove', this.dragging);\n        console.log('stop')\n\n        this.nextSlide()\n        this.settings.hasToggle && this.changeToggles();\n        this.settings.isSliderNotRound && this.changeStyleBtn();\n    }\n\n    changeCurrentSlide(nexSlide) {\n      if (nexSlide > 0) {\n        this.currentSlide = nexSlide - 1;\n      } else {\n        if (nexSlide < 0) {\n          if (this.currentSlide === 0) {\n                this.currentSlide = this.size - 1;\n          } else {\n            this.currentSlide -= 1;\n          }\n\n        } else {\n            if (this.currentSlide === this.size - 1) {\n                this.currentSlide = 0;\n            } else {\n              this.currentSlide += 1;\n            }\n        }\n      }\n\n    }\n\n    nextSlide() {\n\n      this.settings.hasTimer && this.stopTimer();\n      this.x = -(this.currentSlide) * (this.width + this.settings.margin);\n      this.setStyleTransition();\n      this.setStylePosition();\n      this.settings.hasTimer && this.startTimer();\n    }\n\n    dragging(evt) {\n        evt.preventDefault();\n\n        this.dragX = evt.pageX\n        const dragShift = this.dragX - this.clickX;\n        const easing = dragShift / 5;\n        this.x = Math.max(Math.min(this.startX + dragShift, easing), this.maximumX + easing);\n        console.log(dragShift)\n        this.setStylePosition()\n\n        //change active slide\n        if (dragShift > 20 && dragShift > 0 && !this.currentSlideWasChange && this.currentSlide > 0) {\n            this.currentSlideWasChange = true;\n            this.currentSlide = this.currentSlide - 1;\n        }\n\n        if (dragShift < -20 && dragShift < 0 && !this.currentSlideWasChange && this.currentSlide < this.size - 1) {\n            this.currentSlideWasChange = true;\n            this.currentSlide = this.currentSlide + 1;\n        }\n    }\n\n    goToRightSlide(evt) {\n        evt.preventDefault();\n        this.changeCurrentSlide();\n        this.nextSlide();\n        this.settings.hasToggle && this.changeToggles();\n        this.settings.isSliderNotRound && this.changeStyleBtn();\n\n    }\n\n    goToLeftSlide(evt) {\n        evt.preventDefault();\n        this.changeCurrentSlide(-1);\n        this.nextSlide();\n\n        this.settings.hasToggle && this.changeToggles();\n        this.settings.isSliderNotRound && this.changeStyleBtn();\n\n        console.log('prev')\n\n    }\n\n    goToCurrentSlide(evt) {\n        evt.preventDefault();\n        const currentTogle = evt.target.dataset.slideNum;\n\n        this.changeCurrentSlide(Number(currentTogle))\n\n        this.nextSlide();\n\n        this.settings.hasToggle && this.changeToggles();\n        this.settings.isSliderNotRound && this.changeStyleBtn();\n\n    }\n\n    changeToggles() {\n        const currentToggle = this.navToggles.querySelector(`.${NavCurrentToggleClassName}`);\n        currentToggle.classList.remove(`${NavCurrentToggleClassName}`)\n        this.toggleNodes[this.currentSlide].classList.add(`${NavCurrentToggleClassName}`)\n    }\n\n    changeStyleBtn() {\n        console.log(this.currentSlide)\n        console.log(this.size)\n\n        if (this.currentSlide === 0) {\n            this.navLeftButton.classList.remove(`${NavCurrentToggleClassName}`)\n            this.navLeftButton.disabled = true;\n        } else {\n            this.navLeftButton.classList.add(`${NavCurrentToggleClassName}`)\n            this.navLeftButton.disabled = false;\n\n        }\n\n        if (this.currentSlide === this.size - 1) {\n            this.navRightButton.classList.remove(`${NavCurrentToggleClassName}`)\n            this.navRightButton.disabled = true;\n\n        } else {\n            this.navRightButton.classList.add(`${NavCurrentToggleClassName}`)\n            this.navRightButton.disabled = false;\n\n        }\n    }\n\n    // changeActiveSlide\n\n    setStylePosition() {\n        this.lineNode.style.transform = `translate3d(${this.x}px, 0, 0)`\n    }\n\n    setStyleTransition() {\n        this.lineNode.style.transition = `all 0.5s ease 0s`\n    }\n\n    resetStyleTransition() {\n        this.lineNode.style.transition = `all 0s ease 0s`\n\n    }\n\n    startTimer() {\n          this.timer = setInterval(()=> {\n          this.changeCurrentSlide();\n\n          this.nextSlide();\n          this.changeToggles();\n          this.changeStyleBtn();\n        }, 3000);\n    }\n\n    stopTimer() {\n        clearInterval(this.timer);\n    }\n}\n\n\nfunction debounce(func, time = 100) {\n    let timer;\n    return function (event) {\n        clearTimeout(timer);\n        timer = setTimeout(func, time, event)\n\n    }\n}\n\n//# sourceURL=webpack://cat-energy/./source/js/gallery-lib/gallery.js?");

/***/ }),

/***/ "./source/js/main.js":
/*!***************************!*\
  !*** ./source/js/main.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _gallery_lib_gallery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gallery-lib/gallery */ \"./source/js/gallery-lib/gallery.js\");\n\n\n// Window.resize(function() {\n\n// if(window.innerWidth < 1200) {\n//   runGallety1();\n// }\n\n// window.addEventListener('resize', runGallety1);\n\n// function runGallety1() {\n  // if(window.innerWidth < 1200) {\n\n    const t = new _gallery_lib_gallery__WEBPACK_IMPORTED_MODULE_0__[\"default\"](document.getElementById('gallery-1'), document.getElementById('gallery-1-nav'), {\n      margin: 20,\n      hasTimer: true,\n      hasToggle: true,\n      hasToggleText: false,\n      isSliderNotRound: true,\n      breakpoints: { starting: 375, ending: 1200 }\n    })\n// }\n\n// t = null\n// });\n\n\nconsole.log('hello')\n\n//# sourceURL=webpack://cat-energy/./source/js/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./source/js/main.js");
/******/ 	
/******/ })()
;