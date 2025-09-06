const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');
let currentIndex = 0;
let startX = 0;
let isDragging = false;

function updateSlider() {
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

arrowRight.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlider();
});

arrowLeft.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlider();
});

slider.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  isDragging = true;
});

slider.addEventListener('touchmove', e => {
  if (!isDragging) return;
  const currentX = e.touches[0].clientX;
  const diff = startX - currentX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      currentIndex = (currentIndex + 1) % slides.length;
    } else {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    }
    updateSlider();
    isDragging = false;
  }
});

slider.addEventListener('touchend', () => {
  isDragging = false;
});

setInterval(() => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlider();
}, 5000);

// Добавленная логика для адаптации высоты на мобильной версии
window.addEventListener('load', () => {
  if (window.innerWidth <= 768) {
    let maxHeight = 0;
    const images = document.querySelectorAll('.slide-image');
    images.forEach(img => {
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      const containerWidth = slider.clientWidth;
      const scaledHeight = (naturalHeight / naturalWidth) * containerWidth;
      if (scaledHeight > maxHeight) {
        maxHeight = scaledHeight;
      }
    });
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.style.height = `${maxHeight}px`;
    slides.forEach(slide => {
      slide.style.height = `${maxHeight}px`;
    });
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth <= 768) {
    let maxHeight = 0;
    const images = document.querySelectorAll('.slide-image');
    images.forEach(img => {
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      const containerWidth = slider.clientWidth;
      const scaledHeight = (naturalHeight / naturalWidth) * containerWidth;
      if (scaledHeight > maxHeight) {
        maxHeight = scaledHeight;
      }
    });
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.style.height = `${maxHeight}px`;
    slides.forEach(slide => {
      slide.style.height = `${maxHeight}px`;
    });
  }
});
