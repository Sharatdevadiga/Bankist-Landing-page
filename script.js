'use strict';

///////////////////////////////////////
// elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const navLinks = document.querySelector('.nav__links');

const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContents = document.querySelectorAll('.operations__content');

// ///////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// ///////////////////////////////
// smooth scrolling in javascript

btnScrollTo.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// // scrolling behaviour to navigation items
// // usual way
// const navLinks = document.querySelectorAll('.nav__link');
// navLinks.forEach(el => {
//   el.addEventListener('click', e => {
//     e.preventDefault();
//     const id = el.getAttribute('href');
//     console.log(id);
//     document.querySelector(`${id}`).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// using event delegation

navLinks.addEventListener('click', e => {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(`${id}`).scrollIntoView({ behavior: 'smooth' });
  }
});

// ///////////////////////////////////////
// tabbed component

// btnOperations.forEach(btn =>
//   btn.addEventListener('click', () => console.log(btn.dataset.tab))
// );
// event delegation
tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  // buttons activation
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // content activation
  tabsContents.forEach(tabContent =>
    tabContent.classList.remove('operations__content--active')
  );
  const activeContent = document.querySelector(
    `.operations__content--${clicked.dataset.tab}`
  );
  activeContent.classList.add('operations__content--active');
});

// navigation hover - blurring effect
const nav = document.querySelector('.nav');
function handleHover(e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
}

nav.addEventListener('mouseover', e => {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', e => {
  handleHover(e, 1);
});

// ///////////////////////////////////////////////
// sticky navigation
const header = document.querySelector('.header');
let navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// ///////////////////////////////////
// scroll revealing sections
const allsections = document.querySelectorAll('section');

const revealSection = (entries, observer) => {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  console.log(entry.target);
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allsections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// ///////////////////////////////////////////////////////
// lazy loading images
const lazyImages = document.querySelectorAll('img[data-src]');
const lazyLoad = (entries, observer) => {
  const entry = entries[0];

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imageObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
  rootMargin: '100px',
});
lazyImages.forEach(img => {
  imageObserver.observe(img);
});

// //////////////////////////////////////////
// slider component

// elements
function slider() {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');

  // state vatiables
  let curSlide = 0;
  let maxSlide = slides.length;

  // functions
  // go to function
  const goToSlide = slide => {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  // moving right
  const nextSlide = () => {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
  };

  // moving left
  const prevSlide = () => {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
  };

  // activating dots function
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  // creating dots

  const createDots = () => {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide=${i}></button>`
      );
    });
  };
  // initializing function
  function init() {
    goToSlide(0);
    createDots();
    activateDot(0);
  }
  init();

  // event listeners
  btnRight.addEventListener('click', () => {
    nextSlide();
  });

  btnLeft.addEventListener('click', () => {
    prevSlide();
  });

  // movement on key press
  document.addEventListener('keydown', e => {
    console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
}
slider();
// ///////////////////////////////////////
// ///////////////////////////////////////
// ///////////////////////////////////////
// selectors
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('header');
// const allSections = document.querySelectorAll('section');
// //generates Node list - non dynamic
// console.log(allSections);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// //gives the HTML collections - dynamic
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));
// // HTML collections - dynamic

// // ///////////////////////////////
// // inserting elements
// // .innerHTML, .insertAdjacentHTML

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'this is the cookiee message';
// message.innerHTML = `<p>we use cookies to improve the functionality</p> <button class="btn btn--close-cookie">Got it</button>`;

// header.append(message);
// // header.prepend(message)
// // header.after(message);
// // header.before
// // header.append(message.cloneNode(true)) - to display multiple times

// // ///////////////////////////////////
// // removing element
// document.querySelector('.btn--close-cookie').addEventListener('click', () => {
//   message.remove();
// });

// // /////////////////////////////////////
// // styles
// message.style.backgroundColor = '#ccc';
// message.style.width = '120%';
// message.style.height =
//   parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// // document.documentElement.style.setProperty('--color-primary', 'yellow');

// // ////////////////////////////////////
// // attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// logo.alt = 'bankist logo';
// console.log(logo.alt);

// console.log(logo.getAttribute('alt'));
// logo.setAttribute('alt', 'nice minimalist logo');
// console.log(logo.getAttribute('alt'));

// console.log(logo.className);

// console.log(logo.src);
// console.log(logo.getAttribute('src'));

// let link = document.querySelector('.nav__link--btn');
// console.log(link.href); //absolute
// console.log(link.getAttribute('href')); //relative

// // data attribute
// console.log(logo.dataset.versionNumber);

// // ////////////////////////////////////
// // classes
// logo.classList.add('c');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c');

// // /////////////////////////////////
// // events and eventlisteners
// // addEventListener, onevent = funcion, onevent(inline)

// const h1 = document.querySelector('h1');
// console.log(h1);
// function h1Reading() {
//   alert('you are reading H1');
//   h1.removeEventListener('onclick', h1Reading);
// }

// h1.addEventListener('mouscenter', h1Reading); //multiple func possible
// h1.onclick = h1Reading; //adds only 1 event listenet func

// setTimeout(() => {
//   h1.removeEventListener('mousecenter', h1Reading);
// });

// // ////////////////////////////////////////////
// // event propagation - capturing and bubbling
// const nav = document.querySelector('.nav');
// const navLinks = document.querySelector('.nav__links');
// const navLink = document.querySelector('.nav__link');

// function random(min, max) {
//   return Math.floor(Math.random() * (max - min)) + min;
// }

// function randomColor() {
//   return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
// }

// navLink.addEventListener('click', e => {
//   navLink.style.backgroundColor = `${randomColor()}`;
//   // e.stopPropagation();
//   console.log(e.target, e.currentTarget);
// });

// navLinks.addEventListener(
//   'click',
//   e => {
//     navLinks.style.backgroundColor = `${randomColor()}`;
//     // e.stopPropagation();
//     console.log(e.target, e.currentTarget);
//   },
//   true
// );

// nav.addEventListener(
//   'click',
//   e => {
//     nav.style.backgroundColor = `${randomColor()}`;
//     // e.stopPropagation();
//     console.log(e.target, e.currentTarget);
//   },
//   true
// );

// // ////////////////////////////////////
// // DOm traversal
// const h1 = document.querySelector('h1');
// // 1. going downwards
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = '#fff';
// h1.lastElementChild.style.color = '#fff';

// // 2. goind downward
// console.log(h1.parentElement);
// console.log(h1.parentNode);
// console.log(h1.closest('.header'));
// h1.closest('.header').style.backgroundColor = '#abcdaa';
// h1.closest('h1').style.backgroundColor = '#abcdef';

// // 3. going sideways
// console.log(h1.nextSibling); //not useful
// console.log(h1.previousSibling); //not useful
// console.log(h1.nextElementSibling);
// console.log(h1.previousElementSibling);
// console.log(h1.parentElement.children); //all siblings

// [...h1.parentElement.children].forEach(el => {
//   if (el !== h1) {
//     el.style.transform = 'scale(1.1)';
//   }
// });

//

// ///////////////////////////////////
// lifecycle dom events
document.addEventListener('DOMContentLoaded', e => {
  console.log(e);
});

window.addEventListener('load', e => {
  console.log(e);
});

window.addEventListener('beforeunload', e => {
  e.preventDefault();
  e.returnValue = '';
});
