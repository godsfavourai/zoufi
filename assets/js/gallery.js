/* ================= GALLERY.JS ================= */

// Sample images for the carousel (replace with your actual images)
const galleryImages = [
  {
    src: 'assets/images/gallery/2b9bd9ac-d8e6-4a41-8504-e75d2ff8259b.jpeg',
    caption: 'Living Room - Comfortable seating area'
  },
  {
    src: 'assets/images/gallery/2fc065e0-70e8-4a45-9647-30886131032f.avif',
    caption: 'Kitchen - Fully equipped'
  },
//   {
//     src: 'assets/images/735eb283-abb6-4d7a-b916-bc394eed12dc.jpeg',
//     caption: 'Bedroom - Queen size bed'
//   },
//   {
//     src: 'assets/images/1786455c-dc7a-49a7-aa14-d3dd6a1a3740.jpeg',
//     caption: 'Balcony - City views'
//   },
];

// Carousel state
let currentIndex = 0;

// Initialize carousel
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  // Populate carousel with images
  track.innerHTML = galleryImages.map((img, index) => `
    <div class="carousel-item" data-index="${index}">
      <img src="${img.src}" alt="${img.caption}" loading="lazy" />
      <div class="carousel-caption">${img.caption}</div>
    </div>
  `).join('');

  // Add click handlers for lightbox
  track.querySelectorAll('.carousel-item').forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  // Navigation buttons
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  if (prevBtn) prevBtn.addEventListener('click', () => scrollCarousel(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollCarousel(1));

  // Touch/scroll handling for smooth navigation
  let isScrolling = false;
  track.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        updateCurrentIndex();
        isScrolling = false;
      });
    }
    isScrolling = true;
  });
}

// Scroll carousel
function scrollCarousel(direction) {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  const items = track.querySelectorAll('.carousel-item');
  if (items.length === 0) return;

  currentIndex = Math.max(0, Math.min(items.length - 1, currentIndex + direction));
  
  const targetItem = items[currentIndex];
  if (targetItem) {
    targetItem.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }
}

// Update current index based on scroll position
function updateCurrentIndex() {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  const items = track.querySelectorAll('.carousel-item');
  if (items.length === 0) return;

  const trackRect = track.getBoundingClientRect();
  const center = trackRect.left + trackRect.width / 2;

  let closestIndex = 0;
  let closestDistance = Infinity;

  items.forEach((item, index) => {
    const itemRect = item.getBoundingClientRect();
    const itemCenter = itemRect.left + itemRect.width / 2;
    const distance = Math.abs(center - itemCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  currentIndex = closestIndex;
}

// Lightbox functionality
let lightboxIndex = 0;

function openLightbox(index = 0) {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  lightboxIndex = index;
  updateLightboxImage();
  
  lightbox.setAttribute('data-open', 'true');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Focus management
  const closeBtn = lightbox.querySelector('[data-close]');
  if (closeBtn) closeBtn.focus();
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  lightbox.setAttribute('data-open', 'false');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function updateLightboxImage() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || !galleryImages[lightboxIndex]) return;

  const img = lightbox.querySelector('.lb-img');
  const caption = lightbox.querySelector('.lb-caption');

  if (img) {
    img.src = galleryImages[lightboxIndex].src.replace('w=800', 'w=1600'); // Higher res for lightbox
    img.alt = galleryImages[lightboxIndex].caption;
  }
  
  if (caption) {
    caption.textContent = galleryImages[lightboxIndex].caption;
  }
}

function navigateLightbox(direction) {
  const newIndex = lightboxIndex + direction;
  if (newIndex >= 0 && newIndex < galleryImages.length) {
    lightboxIndex = newIndex;
    updateLightboxImage();
  }
}

// Lightbox event listeners
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  // Close button
  const closeBtn = lightbox.querySelector('[data-close]');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  // Navigation buttons
  const prevBtn = lightbox.querySelector('[data-prev]');
  const nextBtn = lightbox.querySelector('[data-next]');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => navigateLightbox(1));
  }

  // Click outside to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('data-open') !== 'true') return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        navigateLightbox(-1);
        break;
      case 'ArrowRight':
        navigateLightbox(1);
        break;
    }
  });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initLightbox();
});

// Re-initialize if called after DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initLightbox();
  });
} else {
  initCarousel();
  initLightbox();
}