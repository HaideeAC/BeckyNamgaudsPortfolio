/* ==================================
==Parallax Effect for Contact Image==
================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Select required elements
  const contactImage = document.querySelector(".contact-image");
  const contactSection = document.querySelector(".contact-section");

  // Exit if elements don't exist
  if (!contactImage || !contactSection) {
    console.log("Parallax: Required elements not found");
    return;
  }

  // Configuration with responsive adjustments
  const getSettings = () => {
    // Base settings
    const settings = {
      intensity: 3.3, // Base intensity
      initialOffset: -105, // Starting position percentage
      rangeOfMotion: 31, // Total range the image can move
    };

    // Adjust settings based on screen size
    const width = window.innerWidth;

    if (width <= 360) {
      // Extra small screens
      return {
        ...settings,
        intensity: 2.3, // Base intensity
        initialOffset: -102, // Starting position percentage
        rangeOfMotion: 46, // Total range the image can move
      };
    } else if (width <= 480) {
      // Small screens
      return {
        ...settings,
        intensity: 2.5, // Base intensity
        initialOffset: -102, // Starting position percentage
        rangeOfMotion: 43, // Total range the image can move
      };
    } else if (width <= 768) {
      // Medium screens
      return {
        ...settings,
        intensity: 2.7, // Base intensity
        initialOffset: -103, // Starting position percentage
        rangeOfMotion: 39, // Total range the image can move
      };
    } else if (width <= 900) {
      // Tablet screens
      return {
        ...settings,
        intensity: 3, // Base intensity
        initialOffset: -104, // Starting position percentage
        rangeOfMotion: 35, // Total range the image can move
      };
    }

    // Default (larger screens)
    return settings;
  };

  // Get initial settings
  let settings = getSettings();

  // Set initial position
  contactImage.style.transform = `translateY(${settings.initialOffset}%)`;

  // Function to calculate and update parallax position
  function updateParallax() {
    // Get current settings (in case screen size changed)
    settings = getSettings();

    // Get section position relative to viewport
    const rect = contactSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Only process when section is visible
    if (rect.bottom < 0 || rect.top > viewportHeight * 1.5) return;

    // Calculate how far into the viewport the section has scrolled (0 to 1)
    const visibleRatio = Math.min(
      Math.max(0, (viewportHeight - rect.top) / viewportHeight),
      1
    );

    // Calculate parallax offset based on visibility
    const offset =
      settings.initialOffset +
      visibleRatio * settings.rangeOfMotion * settings.intensity;

    // Apply transform to create parallax effect
    contactImage.style.transform = `translateY(${offset}%)`;
  }

  // Performance optimization - debounce function for resize event
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      settings = getSettings();
      updateParallax();
    }, 100);
  }

  // Performance optimization for scroll events
  let ticking = false;
  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Check if reduced motion is preferred by the user
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!prefersReducedMotion) {
    // Add event listeners only if reduced motion is not preferred
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Initialize parallax on load
    updateParallax();
  } else {
    // If user prefers reduced motion, set a static position
    contactImage.style.transform = "translateY(-40%)";
  }
});
