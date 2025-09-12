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

// Переключение вправо
arrowRight.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlider();
});

// Переключение влево
arrowLeft.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlider();
});

// Поддержка свайпов для мобильных устройств
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

// Инициализация слайдера
updateSlider();
