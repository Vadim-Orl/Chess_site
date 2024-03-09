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
        // console.log(this.containerNode)
        // debugger
        // console.log(this.containerNode);
        this.size = element.querySelectorAll(`.${GallerySlideClassName}`).length;
        this.currentSlide = 0;
        this.currentSlideWasChange = false;
        this.settings = {
            margin: options.margin || 0,
            hasTimer: options.hasTimer || false,
            hasToggleText: options.hasToggleText,
            hasToggle: options.hasToggle,
            isSliderNotRound: options.isSliderNotRound
        }


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

    manageHTML() {
        console.log(this.containerNode)
        // this.containerNode.classList.add(GallaryClassName);
        // this.containerNode.innerHTML = `
        //     <div class="${GallaryLineClassName}">
        //         ${this.containerNode.innerHTML}
        //     </div>
        // `;

        this.lineNode = this.containerNode.querySelector(`.${GallaryLineClassName}`);

        this.slideNodes = Array.from(this.lineNode.querySelectorAll(`${GallerySlideClassName}`))

        console.log('1111111111111111111')
        console.log(this.size)
        console.log(this.slideNodes)

        // this.buttonLeft =
    }

    manageNavHTML() {
        console.log(this.navigateNode)
        this.navLeftButton = this.navigateNode.querySelector(`.${NavBtnLeftClassName}`);
        this.navRightButton = this.navigateNode.querySelector(`.${NavBtnRightClassName}`);
        this.navToggles = this.navigateNode.querySelector(`.${NavigateTogglesClassName}`);

        this.toggleNodes = Array.from(this.navToggles.children);
        this.toggleNodes.map((el, index) => el.setAttribute(`${DataAtributToggle}`, index))

        console.log( this.navLeftButton)
        console.log( this.navRightButton)
        console.log( this.navToggles)
    }

    setParameters() {
        const coordsContainer = this.containerNode.getBoundingClientRect();
        this.width = coordsContainer.width;
        this.maximumX = -(this.size - 1) * (this.width  + this.settings.margin)
        this.x = -this.currentSlide * (this.width + this.settings.margin)

        this.resetStyleTransition();
        this.lineNode.style.width = `${this.size * (this.width + this.settings.margin)}px`;
        this.setStylePosition();

        Array.from(this.slideNodes).forEach((slideNode) => {
            slideNode.style.width = `${this.width}px`;
            slideNode.style.marginRight = `${this.settings.margin}px`
        });

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
        // console.log('dest')
        window.removeEventListener('resize', this.debouncedResizeGallery);
        this.lineNode.removeEventListener('pointerdown', this.startDrag)
        window.removeEventListener('pointerup', this.stopDrag)
        window.removeEventListener('pointercancel', this.stopDrag)
        this.navRightButton.removeEventListener('click', this.goToRightSlide)
        this.navLeftButton.removeEventListener('click', this.goToLeftSlide)
        this.settings.hasToggle && this.navToggles.removeEventListener('click', this.goToCurrentSlide);
    }

    resizeGallery() {
        this.setParameters();
    }

    startDrag(evt) {
        evt.preventDefault();
        // console.log('111')
        this.currentSlideWasChange = false;
        this.settings.hasTimer && this.stopTimer();

        this.clickX = evt.pageX;
        this.startX = this.x
        console.log(evt.pageX)
        this.resetStyleTransition();
        window.addEventListener('pointermove', this.dragging)
    }

    stopDrag() {
        window.removeEventListener('pointermove', this.dragging);
        console.log('stop')

        this.nextSlide()
        this.settings.hasToggle && this.changeToggles();
        this.settings.isSliderNotRound && this.changeStyleBtn();
    }

    changeCurrentSlide(nexSlide = 1) {
        // debugger
        if (nexSlide > 1) {
            this.currentSlide = nexSlide;
            return;
        }

        if (this.currentSlide === this.size - 1 && nexSlide > 0) {
            this.currentSlide = 0;
        } else {
            if (this.currentSlide === 0 && nexSlide < 0) {
                this.currentSlide = this.size - 1;
            } else {
                this.currentSlide = this.currentSlide + nexSlide;
            }
        }
    }

    nextSlide(hasTimer = false) {
        if (hasTimer) {
            this.stopTimer();
            this.changeCurrentSlide();
        }

        this.x = -(this.currentSlide) * (this.width + this.settings.margin);
        this.setStylePosition();
        this.setStyleTransition();
        this.settings.hasTimer && this.startTimer();
    }

    dragging(evt) {
        evt.preventDefault();

        console.log('111')
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
        console.log('next')
        // debugger
        this.changeCurrentSlide();
        this.nextSlide();
        this.settings.hasToggle && this.changeToggles();
        this.settings.isSliderNotRound && this.changeStyleBtn();
        // this.nextSlide();
    }

    goToLeftSlide(evt) {
        evt.preventDefault();
        this.changeCurrentSlide(-1);

        // this.setStyleTransition();
        this.nextSlide();
        this.settings.hasToggle && this.changeToggles();
        this.settings.isSliderNotRound && this.changeStyleBtn();

        // this.resetStyleTransition()
        console.log('prev')

    }

    goToCurrentSlide(evt) {
        evt.preventDefault();
        const currentTogle = evt.target.dataset.slideNum;

        console.log(currentTogle)

        this.changeCurrentSlide(Number(currentTogle))

        console.log(this.currentSlide)

        this.nextSlide();

        this.settings.hasToggle && this.changeToggles();
        this.settings.isSliderNotRound && this.changeStyleBtn();

        // console.log(this.toggleNodes.findIndex(evt.target))
    }

    changeToggles() {
        const currentToggle = this.navToggles.querySelector(`.${NavCurrentToggleClassName}`);
        currentToggle.classList.remove(`${NavCurrentToggleClassName}`)
        // NavCurrentToggleClassName
        this.toggleNodes[this.currentSlide].classList.add(`${NavCurrentToggleClassName}`)
    }

    changeStyleBtn() {
        console.log(this.currentSlide)
        console.log(this.size)

        if (this.currentSlide === 0) {
            this.navLeftButton.classList.remove(`${NavCurrentToggleClassName}`)
        } else {
            this.navLeftButton.classList.add(`${NavCurrentToggleClassName}`)

        }

        if (this.currentSlide === this.size - 1) {
            this.navRightButton.classList.remove(`${NavCurrentToggleClassName}`)
        } else {
            this.navRightButton.classList.add(`${NavCurrentToggleClassName}`)

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
        this.lineNode.style.transition = `all 0s easy 0s`

    }

    startTimer() {
        this.timer = setInterval(()=> this.nextSlide(true), 3000);
    }

    stopTimer() {
        clearInterval(this.timer);
    }
}

function wrapElementByDiv({element, className}) {
    // debugger
    const wrapperNode = document.createElement('div');
    wrapperNode.classList.add(className);

    element.parentNode.insertBefore(wrapperNode, element);
    wrapperNode.appendChild(element);

    return wrapperNode;
}

function debounce(func, time = 100) {
    let timer;
    return function (event) {
        clearTimeout(timer);
        timer = setTimeout(func, time, event)

    }
}