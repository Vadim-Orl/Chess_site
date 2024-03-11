const GallaryClassName = 'gallery';
const GallaryLineClassName = 'gallery-line';
const GallerySlideClassName = 'gallery-slide';

const NavClassName = 'navigation';
const NavBtnLeftClassName = 'navigation__button--left';
const NavBtnRightClassName = 'navigation__button--right';
// const NavLeftButtonClassName =
const NavigateTogglesClassName = 'slider__toggles'
const NavCurrentToggleClassName = 'slider__toggle--current'
const DataAtributToggle = 'data-slide-num'

export default class Gallary {
    constructor(element, navigate, options = {}) {
        this.containerNode = element;
        this.navigateNode = navigate;
        this.currentSlide = 0;
        this.size = element.querySelectorAll(`.${GallerySlideClassName}`).length;

        this.currentSlideWasChange = false;
        this.settings = {
            margin: options.margin || 0,
            hasTimer: options.hasTimer || false,
            hasToggleText: options.hasToggleText,
            hasToggle: options.hasToggle,
            isSliderNotRound: options.isSliderNotRound,
            breakpoints: options.breakpoints,
        }

        this.checkDocWidth = this.checkDocWidth.bind(this);
        this.manageHTML = this.manageHTML.bind(this);
        this.manageNavHTML = this.manageNavHTML.bind(this);

        this.setParameters = this.setParameters.bind(this);
        this.setEvents = this.setEvents.bind(this);
        this.resizeGallery = this.resizeGallery.bind(this);

        this.startDrag = this.startDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);
        this.dragging = this.dragging.bind(this);

        this.setStylePosition = this.setStylePosition.bind(this);
        this.changeCurrentSlide =  this.changeCurrentSlide.bind(this);
        this.nextSlide = this.nextSlide.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.destroyEvents = this.destroyEvents.bind(this);

        this.goToRightSlide = this.goToRightSlide.bind(this);
        this.goToLeftSlide = this.goToLeftSlide.bind(this);
        this.goToCurrentSlide = this.goToCurrentSlide.bind(this);
        this.changeToggles = this.changeToggles.bind(this);
        this.changeStyleBtn = this.changeStyleBtn.bind(this);


        this.manageHTML();
        this.settings.hasToggle && this.manageNavHTML()
        this.setParameters();
        this.setEvents();
        this.settings.hasTimer && this.startTimer();

    }


    checkDocWidth() {
      // debugger
      if (window.innerWidth > this.settings.breakpoints.starting &&
        window.innerWidth < this.settings.breakpoints.ending) {
            console.log('true -1 ')
          return true;
        }
        else {
        console.log('false -1 ')

          return false;
        }
    }


    manageHTML() {
        this.lineNode = this.containerNode.querySelector(`.${GallaryLineClassName}`);

        this.slideNodes = Array.from(this.lineNode.querySelectorAll(`${GallerySlideClassName}`))

    }

    manageNavHTML() {
        console.log(this.navigateNode)
        this.navLeftButton = this.navigateNode.querySelector(`.${NavBtnLeftClassName}`);
        this.navRightButton = this.navigateNode.querySelector(`.${NavBtnRightClassName}`);
        this.navToggles = this.navigateNode.querySelector(`.${NavigateTogglesClassName}`);

        this.toggleNodes = Array.from(this.navToggles.children);
        this.toggleNodes.map((el, index) => el.setAttribute(`${DataAtributToggle}`, (index+1)))

    }

    setParameters() {
        const coordsContainer = this.containerNode.getBoundingClientRect();
        this.width = coordsContainer.width;
        this.maximumX = -(this.size - 1) * (this.width  + this.settings.margin)
        this.x = -this.currentSlide * (this.width + this.settings.margin)
        this.setStylePosition();
    }

    setEvents() {
      console.log('set events')

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

      console.log('resize')

      if (this.checkDocWidth()) {
        this.settings.hasTimer && this.stopTimer();

        this.settings.hasTimer && this.startTimer();

        this.setStyleTransition()
        this.setParameters();
        this.setEvents();
        this.changeToggles();
      } else {
          console.log('resize')
          this.settings.hasTimer && this.stopTimer();
          this.resetStyleTransition();
          this.currentSlide = 0;
          this.setParameters();
          this.destroyEvents()
        }
    }

    startDrag(evt) {
        evt.preventDefault();
        console.log('start drag')
        this.currentSlideWasChange = false;
        this.settings.hasTimer && this.stopTimer();

        this.clickX = evt.pageX;
        this.startX = this.x
        console.log(evt.pageX)
        window.addEventListener('pointermove', this.dragging)
    }

    stopDrag() {
        window.removeEventListener('pointermove', this.dragging);
        console.log('stop')

        this.nextSlide()
        this.settings.hasToggle && this.changeToggles();
        this.settings.isSliderNotRound && this.changeStyleBtn();
    }

    changeCurrentSlide(nexSlide) {
      if (nexSlide > 0) {
        this.currentSlide = nexSlide - 1;
      } else {
        if (nexSlide < 0) {
          if (this.currentSlide === 0) {
                this.currentSlide = this.size - 1;
          } else {
            this.currentSlide -= 1;
          }

        } else {
            if (this.currentSlide === this.size - 1) {
                this.currentSlide = 0;
            } else {
              this.currentSlide += 1;
            }
        }
      }

    }

    nextSlide() {

      this.settings.hasTimer && this.stopTimer();
      this.x = -(this.currentSlide) * (this.width + this.settings.margin);
      this.setStyleTransition();
      this.setStylePosition();
      this.settings.hasTimer && this.startTimer();
    }

    dragging(evt) {
        evt.preventDefault();

        this.dragX = evt.pageX
        const dragShift = this.dragX - this.clickX;
        const easing = dragShift / 5;
        this.x = Math.max(Math.min(this.startX + dragShift, easing), this.maximumX + easing);
        console.log(dragShift)
        this.setStylePosition()

        //change active slide
        if (dragShift > 20 && dragShift > 0 && !this.currentSlideWasChange && this.currentSlide > 0) {
            this.currentSlideWasChange = true;
            this.currentSlide = this.currentSlide - 1;
        }

        if (dragShift < -20 && dragShift < 0 && !this.currentSlideWasChange && this.currentSlide < this.size - 1) {
            this.currentSlideWasChange = true;
            this.currentSlide = this.currentSlide + 1;
        }
    }

    goToRightSlide(evt) {
        evt.preventDefault();
        this.changeCurrentSlide();
        this.nextSlide();
        this.settings.hasToggle && this.changeToggles();
        this.settings.isSliderNotRound && this.changeStyleBtn();

    }

    goToLeftSlide(evt) {
        evt.preventDefault();
        this.changeCurrentSlide(-1);
        this.nextSlide();

        this.settings.hasToggle && this.changeToggles();
        this.settings.isSliderNotRound && this.changeStyleBtn();

        console.log('prev')

    }

    goToCurrentSlide(evt) {
        evt.preventDefault();
        const currentTogle = evt.target.dataset.slideNum;

        this.changeCurrentSlide(Number(currentTogle))

        this.nextSlide();

        this.settings.hasToggle && this.changeToggles();
        this.settings.isSliderNotRound && this.changeStyleBtn();

    }

    changeToggles() {
        const currentToggle = this.navToggles.querySelector(`.${NavCurrentToggleClassName}`);
        currentToggle.classList.remove(`${NavCurrentToggleClassName}`)
        this.toggleNodes[this.currentSlide].classList.add(`${NavCurrentToggleClassName}`)
    }

    changeStyleBtn() {
        console.log(this.currentSlide)
        console.log(this.size)

        if (this.currentSlide === 0) {
            this.navLeftButton.classList.remove(`${NavCurrentToggleClassName}`)
            this.navLeftButton.disabled = true;
        } else {
            this.navLeftButton.classList.add(`${NavCurrentToggleClassName}`)
            this.navLeftButton.disabled = false;

        }

        if (this.currentSlide === this.size - 1) {
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
          this.timer = setInterval(()=> {
          this.changeCurrentSlide();

          this.nextSlide();
          this.changeToggles();
          this.changeStyleBtn();
        }, 3000);
    }

    stopTimer() {
        clearInterval(this.timer);
    }
}


function debounce(func, time = 100) {
    let timer;
    return function (event) {
        clearTimeout(timer);
        timer = setTimeout(func, time, event)

    }
}