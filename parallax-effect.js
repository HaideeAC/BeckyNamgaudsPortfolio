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

  console.log("Parallax: Initializing effect");

  // Configuration
  const settings = {
    intensity: 3.3, // Higher = more movement
    initialOffset: -105, // Starting position percentage
    rangeOfMotion: 31, // Total range the image can move
  };

  // Set initial position to ensure transform is working
  contactImage.style.transform = `translateY(${settings.initialOffset}%)`;

  // Function to calculate and update parallax position
  function updateParallax() {
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

  // Performance optimization for scroll events
  let ticking = false;

  // Handle scroll event with requestAnimationFrame
  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Handle window resize
  function handleResize() {
    updateParallax();
  }

  // Add event listeners
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });

  // Initialize parallax on load
  updateParallax();

  console.log("Parallax: Effect initialized");
});
