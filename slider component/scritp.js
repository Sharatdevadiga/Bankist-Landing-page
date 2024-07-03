// elements
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

// helper functions
function goToSlide(slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${(i - slide) * 100}%)`;
  });
}

// initial adjustments
goToSlide(0);
let curSlide = 0;
const maxSlide = slides.length;
// slider.style.overflow = 'visible';
// slider.style.transform = `scale(0.4)`;

// moving right
function nextSlide() {
  if (curSlide >= maxSlide - 1) curSlide = 0;
  else curSlide++;

  goToSlide(curSlide);
}

btnRight.addEventListener('click', () => {
  nextSlide();
});

// moving left
function prevSlide() {
  if (curSlide <= 0) curSlide = maxSlide - 1;
  else curSlide--;

  goToSlide(curSlide);
}

btnLeft.addEventListener('click', () => {
  prevSlide();
});
