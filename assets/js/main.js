// Navigation scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Fade-in animation on scroll
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(el => observer.observe(el));

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');

  // Update aria-expanded for accessibility
  const isExpanded = hamburger.classList.contains('active');
  hamburger.setAttribute('aria-expanded', isExpanded);
  hamburger.setAttribute('aria-label', isExpanded ? 'メニューを閉じる' : 'メニューを開く');
});

// Close menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'メニューを開く');
  });
});

// Voice sample audio player
let currentAudio = null;
let currentButton = null;

document.querySelectorAll('.voice-tag[data-audio]').forEach(button => {
  button.addEventListener('click', function() {
    const audioSrc = this.getAttribute('data-audio');

    // If clicking the same button that's playing, stop it
    if (currentButton === this && currentAudio && !currentAudio.paused) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      this.classList.remove('playing');
      currentAudio = null;
      currentButton = null;
      return;
    }

    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      if (currentButton) {
        currentButton.classList.remove('playing');
      }
    }

    // Create and play new audio
    currentAudio = new Audio(audioSrc);
    currentButton = this;
    this.classList.add('playing');

    currentAudio.play().catch(error => {
      console.error('Audio playback failed:', error);
      this.classList.remove('playing');
    });

    // Remove playing class when audio ends
    currentAudio.addEventListener('ended', () => {
      this.classList.remove('playing');
      currentAudio = null;
      currentButton = null;
    });
  });
});
