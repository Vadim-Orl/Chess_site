const GallaryLineClassName = 'gallery-line';
const GallerySlideClassName = 'gallery-slide';

const NavBtnLeftClassName = 'navigation__button--left';
const NavBtnRightClassName = 'navigation__button--right';
const NavigateToggleTextClassName = 'navigattion__toggle-text'

const NavigateTogglesClassName = 'slider__toggles'
const NavigateToggleClassName = 'slider__toggle'
const NavCurrentToggleClassName = 'slider__toggle--current'

const DataAtributToggle = 'data-slide-num'

export default class Gallary {
    constructor(element, navigate, options = {}) {
        this.containerNode = element;
        this.navigateNode = navigate;
        this.currentSlide = 0;
        this.countSlides = element.querySelectorAll(`.${GallerySlideClassName}`).length;
        this.firstSlide = element.querySelectorAll(`.${GallerySlideClassName}`)[0];

        this.currentSlideWasChange = false;
        this.settings = {
            margin: options.margin,
            hasTimer: options.hasTimer || false,
            hasToggleText: options.hasToggleText,
            hasToggle: options.hasToggle,
            isSliderNotRound: options.isSliderNotRound,
            breakpoints: options.breakpoints || false,
        }
        this.isTimerGo = false;

        this.checkDocWidth = this.checkDocWidth.bind(this);
        this.manageGallery = this.manageGallery.bind(this);
        this.manageNav = this.manageNav.bind(this);

        this.setParameters = this.setParameters.bind(this);
        this.setSettingParameters = this.setSettingParameters.bind(this);
        this.setEvents = this.setEvents.bind(this);
        this.resizeGallery = this.resizeGallery.bind(this);

        this.startDrag = this.startDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);
        this.dragging = this.dragging.bind(this);

        this.setStylePosition = this.setStylePosition.bind(this);
        this.changeCurrentSlide =  this.changeCurrentSlide.bind(this);

        this.nextSlide = this.nextSlide.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);

        this.destroyEvents = this.destroyEvents.bind(this);

        this.goToRightSlide = this.goToRightSlide.bind(this);
        this.goToLeftSlide = this.goToLeftSlide.bind(this);
        this.goToCurrentSlide = this.goToCurrentSlide.bind(this);
        this.changeToggles = this.changeToggles.bind(this);
        this.changeToggleText = this.changeToggleText.bind(this);
        this.changeStyleBtn = this.changeStyleBtn.bind(this);


        this.manageGallery();
        this.manageNav();

        this.setParameters();
        this.setEvents();

    }


    checkDocWidth() {
      if (!this.settings.breakpoints) {
        return true;
      }

      if (window.innerWidth > this.settings.breakpoints.starting &&
        window.innerWidth < this.settings.breakpoints.ending) {
          return true;
        }
        else {
          return false;
        }
    }


    manageGallery() {
        this.lineNode = this.containerNode.querySelector(`.${GallaryLineClassName}`);
        this.slideNodes = Array.from(this.lineNode.querySelectorAll(`${GallerySlideClassName}`))
    }


    manageNav() {
        this.navLeftButton = this.navigateNode.querySelector(`.${NavBtnLeftClassName}`);
        this.navRightButton = this.navigateNode.querySelector(`.${NavBtnRightClassName}`);
        this.navToggles = this.navigateNode.querySelector(`.${NavigateTogglesClassName}`);

        if (this.settings.hasToggle) {
          for (let i = 0; i < this.countSlides; i++) {
            const newToggle = document.createElement('button');
            newToggle.setAttribute('type', 'button');
            newToggle.classList.add(`${NavigateToggleClassName}`);

            this.navToggles.append(newToggle)
          }

          this.toggleNodes = Array.from(this.navToggles.children);
          this.toggleNodes[0].classList.add(`${NavCurrentToggleClassName}`)
          this.toggleNodes.map((el, index) => el.setAttribute(`${DataAtributToggle}`, (index + 1)))
        }

        if (this.settings.hasToggleText) {
          this.toggleText = this.navigateNode.querySelector(`.${NavigateToggleTextClassName}`);
        }

        this.changeStyleBtn();
    }

    setSettingParameters() {
      this.settings.hasToggle && this.changeToggles();
      this.settings.hasToggleText && this.changeToggleText();
      this.settings.isSliderNotRound && this.changeStyleBtn();
      this.checkDocWidth() && this.settings.hasTimer && !this.isTimerGo && this.startTimer();
    }

    setParameters() {
        const coordsContainer = this.containerNode.getBoundingClientRect();
        this.containerWidth = coordsContainer.width;

        this.counSlideInLine = Math.floor(this.containerWidth / this.firstSlide.clientWidth);

        this.countSliders = Math.ceil(this.countSlides / this.counSlideInLine);

        this.maximumX = -(this.countSliders - 1) * ((this.firstSlide.clientWidth * this.counSlideInLine)  + (this.settings.margin * this.counSlideInLine));
        this.x = -this.currentSlide * ((this.firstSlide.clientWidth * this.counSlideInLine)  + (this.settings.margin * this.counSlideInLine));

        this.setStylePosition();
        this.setSettingParameters();
    }

    setEvents() {

        this.debouncedResizeGallery = debounce(this.resizeGallery);
        window.addEventListener('resize', this.debouncedResizeGallery);

        this.lineNode.addEventListener('pointerdown', this.startDrag)
        window.addEventListener('pointerup', this.stopDrag)
        window.addEventListener('pointercancel', this.stopDrag)

        this.navRightButton.addEventListener('click', this.goToRightSlide)
        this.navLeftButton.addEventListener('click', this.goToLeftSlide)

        this.settings.hasToggle && this.navToggles.addEventListener('click', this.goToCurrentSlide);
    }

    destroyEvents() {
        window.removeEventListener('resize', this.debouncedResizeGallery);

        this.lineNode.removeEventListener('pointerdown', this.startDrag)
        window.removeEventListener('pointerup', this.stopDrag)
        window.removeEventListener('pointercancel', this.stopDrag)

        this.navRightButton.removeEventListener('click', this.goToRightSlide)
        this.navLeftButton.removeEventListener('click', this.goToLeftSlide)
        this.settings.hasToggle && this.navToggles.removeEventListener('click', this.goToCurrentSlide);
    }

    resizeGallery() {
      this.settings.hasTimer && this.isTimerGo &&  this.stopTimer();

      this.currentSlide = 0;

      if (this.checkDocWidth()) {
        this.setStyleTransition();
        this.setParameters();
        this.setEvents();

        this.settings.hasTimer && !this.isTimerGo && this.startTimer();

      } else {
          this.resetStyleTransition();
          this.x = 0;
          this.setStylePosition();
          this.destroyEvents()
        }
    }

    startDrag(evt) {
        evt.preventDefault();

        this.currentSlideWasChange = false;
        this.settings.hasTimer && this.isTimerGo && this.stopTimer();

        this.clickX = evt.pageX;
        this.startX = this.x;

        window.addEventListener('pointermove', this.dragging)
    }

    stopDrag() {
        window.removeEventListener('pointermove', this.dragging);
        this.nextSlide()
    }

    dragging(evt) {
      evt.preventDefault();

      this.dragX = evt.pageX
      const dragShift = this.dragX - this.clickX;
      const easing = dragShift / 5;
      this.x = Math.max(Math.min(this.startX + dragShift, easing), this.maximumX + easing);

      if (dragShift > 20 && dragShift > 0 && !this.currentSlideWasChange) {
        this.currentSlideWasChange = true;
        this.changeCurrentSlide(this.currentSlide - 1);
      }

      if (dragShift < -20 && dragShift < 0 && !this.currentSlideWasChange) {
        this.currentSlideWasChange = true;
        this.changeCurrentSlide(this.currentSlide + 1);
      }

      this.setStylePosition()
  }

    changeCurrentSlide(nextSlide) {
        if (nextSlide < 0) {
              if (!this.settings.isSliderNotRound || (this.settings.hasTimer && this.isTimerGo)) {
                this.currentSlide = this.countSliders - 1;
                return;
              } else {
                return;
              }
        }

        if (nextSlide > this.countSliders - 1){
              if (!this.settings.isSliderNotRound || (this.settings.hasTimer && this.isTimerGo)) {
                this.currentSlide = 0;
                return;
              } else {
                return;
            }
        }

        this.currentSlide = nextSlide;
    }

    nextSlide() {
      this.settings.hasTimer && this.isTimerGo && this.stopTimer();

      this.x = -this.currentSlide * ((this.firstSlide.clientWidth * this.counSlideInLine)  + (this.settings.margin * this.counSlideInLine));

      this.setStyleTransition();
      this.setStylePosition();

      this.setSettingParameters();
    }

    goToRightSlide(evt) {
        evt.preventDefault();
        this.changeCurrentSlide(this.currentSlide + 1);
        this.nextSlide();
    }

    goToLeftSlide(evt) {
        evt.preventDefault();
        this.changeCurrentSlide(this.currentSlide - 1);
        this.nextSlide();
    }

    goToCurrentSlide(evt) {
        evt.preventDefault();
        const currentTogle = evt.target.dataset.slideNum;

        this.changeCurrentSlide(Number(currentTogle) - 1)
        this.nextSlide();
    }

    changeToggleText() {
      this.toggleText.innerText = `${this.currentSlide + 1}/${this.countSliders}`
    }

    changeToggles() {
        const currentToggle = this.navToggles.querySelector(`.${NavCurrentToggleClassName}`);
        currentToggle.classList.remove(`${NavCurrentToggleClassName}`)
        this.toggleNodes[this.currentSlide].classList.add(`${NavCurrentToggleClassName}`)
    }

    changeStyleBtn() {
      if (!this.settings.isSliderNotRound) {
        this.navLeftButton.classList.add(`${NavCurrentToggleClassName}`);
        this.navRightButton.classList.add(`${NavCurrentToggleClassName}`);
        return;
      }

        if (this.currentSlide === 0) {
            this.navLeftButton.classList.remove(`${NavCurrentToggleClassName}`)
            this.navLeftButton.disabled = true;
        } else {
            this.navLeftButton.classList.add(`${NavCurrentToggleClassName}`)
            this.navLeftButton.disabled = false;
        }

        if (this.currentSlide === this.countSliders - 1) {
            this.navRightButton.classList.remove(`${NavCurrentToggleClassName}`)
            this.navRightButton.disabled = true;
        } else {
            this.navRightButton.classList.add(`${NavCurrentToggleClassName}`)
            this.navRightButton.disabled = false;
        }
    }

    // changeActiveSlide
    setStylePosition() {
        this.lineNode.style.transform = `translate3d(${this.x}px, 0, 0)`
    }

    setStyleTransition() {
        this.lineNode.style.transition = `all 0.5s ease 0s`
    }

    resetStyleTransition() {
        this.lineNode.style.transition = `all 0s ease 0s`

    }

    startTimer() {
      console.log('start timer')
      this.timer = setInterval(()=> {
        this.changeCurrentSlide(this.currentSlide + 1);

        this.nextSlide();
        this.changeToggles();
        this.changeStyleBtn();
      }, 3000);

      this.isTimerGo = true;
    }

    stopTimer() {
      this.isTimerGo = false;
      console.log('stop timer')
      clearInterval(this.timer);
    }
}


function debounce(func, time = 200) {
    let timer;
    return function (event) {
        clearTimeout(timer);
        timer = setTimeout(func, time, event)
    }
}