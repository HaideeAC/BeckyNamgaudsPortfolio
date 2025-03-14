/* ================================
 ======*Main JavaScript file=======
 ================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Include parallax effect script
  const parallaxScript = document.createElement("script");
  parallaxScript.src = "/parallax-effect.js";
  parallaxScript.async = false;
  document.head.appendChild(parallaxScript);

  // DOM Elements
  const header = document.querySelector("header");
  const menuToggle = document.createElement("div");
  const nav = document.querySelector("nav");
  const navLinks = document.querySelectorAll("nav a");

  // Create and add hamburger menu toggle
  menuToggle.className = "menu-toggle";
  menuToggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    `;
  document.querySelector(".header-container").appendChild(menuToggle);

  // Handle scroll event for header transformation
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Toggle mobile menu
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    nav.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  // Function to get document height
  const getDocumentHeight = () => {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  };

  // Close menu when clicking on a nav link
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Close menu if open
      if (nav.classList.contains("active")) {
        menuToggle.classList.remove("active");
        nav.classList.remove("active");
        document.body.classList.remove("menu-open");
      }

      const targetId = link.getAttribute("href");
      if (targetId.startsWith("#")) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Add delay to smooth closing before scrolling
          setTimeout(() => {
            // Get the header height for offset
            const headerHeight = header.offsetHeight;

            // Special handling for contact section to prevent extra scrolling
            if (targetId === "#contact") {
              // Calculate the maximum scroll position
              const maxScroll = getDocumentHeight() - window.innerHeight;

              // For contact section, scroll to bottom of page if it's the last section
              window.scrollTo({
                top: maxScroll,
                behavior: "smooth",
              });
            } else {
              // For other sections, use normal scrolling
              const offsetPosition = targetElement.offsetTop - headerHeight;

              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
              });
            }
          }, 300);
        }
      }
    });
  });

  // Close menu with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("active")) {
      menuToggle.classList.remove("active");
      nav.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      nav.classList.contains("active") &&
      !nav.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      menuToggle.classList.remove("active");
      nav.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });
});
