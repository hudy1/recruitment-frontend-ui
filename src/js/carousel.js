export default function carousel() {
    const slider = document.querySelector('.slider__list');
    const slides = slider.querySelectorAll('.slider__slide');
    const indicators = document.querySelectorAll('.slider__indicator');
    const singleIndicatorRange = slides.length / indicators.length;
    let prevActiveSlide = slider.querySelector('.slider__slide--active');
    let prevActiveIndicator = null;

    slides.forEach((d, i) => d.dataset.nth = i); // set each slide number for correct indicator update

    const updateIndicators = (slide) => {
        const nth = slide.dataset.nth;
        const indicatorIndex = Math.floor(nth / singleIndicatorRange);
        const activeIndicator = indicators[indicatorIndex];
        
        if (prevActiveIndicator !== activeIndicator) {
            if (prevActiveIndicator) {
                prevActiveIndicator.classList.remove('slider__indicator--active');
            }
            activeIndicator.classList.add('slider__indicator--active');
            prevActiveIndicator = activeIndicator;
        }
    }

    const setActiveSlide = (slide) => {
        slide.classList.add('slider__slide--active');
        prevActiveSlide.classList.remove('slider__slide--active');
        prevActiveSlide = slide;
    }

    const positionSlider = (slide) => {
        const middlePoint = slider.offsetWidth / 2;
        const diff = -1 * (slide.offsetLeft - middlePoint + (slide.offsetWidth / 2));

        slider.setAttribute('style', `transform: translateX(${diff}px)`);
    }

    slider.addEventListener('click', (e) => {
        const slide = e.target.closest('.slider__slide')
        if (slide && (slide !== prevActiveSlide)) {
            positionSlider(slide);
            setActiveSlide(slide);
            updateIndicators(slide);
        }
    });

    positionSlider(prevActiveSlide); // center initial slide
    updateIndicators(prevActiveSlide); // set initial active indicator
}