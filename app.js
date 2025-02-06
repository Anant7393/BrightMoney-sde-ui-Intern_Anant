
const testimonialGrid = document.querySelector('.testimonials-grid');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const mobileDotsContainer = document.querySelector('.mobile-dots');
const totalCards = testimonialCards.length;


function createMobileDots() {
    for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        mobileDotsContainer.appendChild(dot);
    }
}


let currentSlide = 0;
let isAnimating = false;
const animationDuration = 300; 


function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}


function goToSlide(slideIndex) {
    if (isAnimating || slideIndex === currentSlide) return;
    isAnimating = true;

    
    if (window.innerWidth <= 768) {
        testimonialCards.forEach((card, index) => {
            card.style.display = 'none';
            if (index === slideIndex) {
                card.style.display = 'flex';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.3s ease';
                    card.style.opacity = '1';
                }, 50);
            }
        });
    } else {
        const cardsToShow = window.innerWidth <= 1024 ? 3 : 5;
        testimonialCards.forEach((card, index) => {
            if (index >= slideIndex && index < slideIndex + cardsToShow) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    currentSlide = slideIndex;
    updateDots();

    setTimeout(() => {
        isAnimating = false;
    }, animationDuration);
}


function nextSlide() {
    const maxSlides = window.innerWidth <= 768 ? 
        totalCards - 1 : 
        totalCards - (window.innerWidth <= 1024 ? 3 : 5);
    const nextIndex = currentSlide >= maxSlides ? 0 : currentSlide + 1;
    goToSlide(nextIndex);
}


function prevSlide() {
    const maxSlides = window.innerWidth <= 768 ? 
        totalCards - 1 : 
        totalCards - (window.innerWidth <= 1024 ? 3 : 5);
    const prevIndex = currentSlide <= 0 ? maxSlides : currentSlide - 1;
    goToSlide(prevIndex);
}


let touchStartX = 0;
let touchEndX = 0;

testimonialGrid.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

testimonialGrid.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide(); 
        } else {
            prevSlide(); 
        }
    }
}


function initCarousel() {
    createMobileDots();
    
    
    if (window.innerWidth <= 768) {
        testimonialCards.forEach((card, index) => {
            card.style.display = index === 0 ? 'flex' : 'none';
        });
    } else {
        const cardsToShow = window.innerWidth <= 1024 ? 3 : 5;
        testimonialCards.forEach((card, index) => {
            card.style.display = index < cardsToShow ? 'flex' : 'none';
        });
    }

    
    setInterval(nextSlide, 5000);
}


let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        goToSlide(0)
    }, 250);
});


document.addEventListener('DOMContentLoaded', initCarousel);