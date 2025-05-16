// enhanced-scroll-zoom.js - Improving section transitions and background control

document.addEventListener("DOMContentLoaded", () => {
  // Grab all the elements we need
  const heroSection = document.getElementById("hero");
  const workSection = document.getElementById("work");
  const aboutSection = document.getElementById("about");
  const contactSection = document.getElementById("contact");
  const zoomElement = document.querySelector(".zoom-element");
  const zoomDot = document.querySelector(".zoom-dot");
  const zoomText = document.querySelector(".zoom-text");

  // Bail early if essential elements are missing
  if (!heroSection || !workSection || !zoomElement || !zoomDot || !zoomText) {
    console.warn("Zoom effect: Required elements not found");
    return;
  }

  // Create our fixed background element
  const fixedBg = document.createElement("div");
  fixedBg.className = "fixed-gradient-bg";
  document.body.appendChild(fixedBg);

  // Load GSAP and ScrollTrigger dynamically
  function fetchGSAP() {
    return new Promise((resolve, reject) => {
      const gsapScript = document.createElement("script");
      gsapScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
      gsapScript.onload = () => {
        // After GSAP loads, fetch ScrollTrigger
        const stScript = document.createElement("script");
        stScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
        stScript.onload = resolve;
        stScript.onerror = reject;
        document.head.appendChild(stScript);
      };
      gsapScript.onerror = reject;
      document.head.appendChild(gsapScript);
    });
  }

  // Start everything once GSAP is loaded
  fetchGSAP()
    .then(() => {
      // Tell GSAP to use ScrollTrigger
      gsap.registerPlugin(ScrollTrigger);

      // Set up our animations
      setupHeroAnimation();
      setupWorkSectionControls();
      setupScrollIndicator();

      // Update everything when the window resizes
      window.addEventListener("resize", () => {
        ScrollTrigger.refresh(true);
      });
    })
    .catch((err) => {
      console.error("Failed to load animation libraries:", err);
    });

  // Handle the hero-to-work zoom transition
  function setupHeroAnimation() {
    // Initially show the zoom element
    gsap.to(zoomElement, {
      opacity: 1,
      duration: 0.6,
      delay: 0.5,
    });

    // Create a timeline for the text reveal & hide
    const textReveal = gsap.timeline({ paused: true });
    textReveal
      .to(zoomText, { opacity: 0, duration: 0.01 })
      .to(zoomText, { opacity: 1, duration: 0.4, delay: 0.2 })
      .to(zoomText, { opacity: 0, duration: 0.4, delay: 0.3 });

    // Main zoom animation timeline
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "+=150%",
        scrub: 1.2, // Smoothed scrubbing
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Control text visibility based on progress
          const progress = self.progress;
          if (progress > 0.3 && progress < 0.7) {
            textReveal.progress((progress - 0.3) / 0.4);
          }

          // Near the end of the zoom, activate the fixed background
          if (progress > 0.92) {
            fixedBg.classList.add("active");
            workSection.classList.add("revealed");
          } else if (progress < 0.85) {
            fixedBg.classList.remove("active");
            workSection.classList.remove("revealed");
          }
        },
        onLeave: () => {
          heroSection.classList.remove("pin-hero");
          workSection.classList.add("scrolling-active");
          document.body.classList.add("in-work-section");
        },
        onEnterBack: () => {
          workSection.classList.remove("scrolling-active");
          document.body.classList.remove("in-work-section");
        },
      },
    });

    // Add animations to our timeline
    heroTl
      .to(zoomDot, {
        scale: 65, // First stage zoom
        duration: 0.4,
        ease: "power1.in",
      })
      .to(zoomDot, {
        scale: 250, // Final expansion
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          // Ensure fixed background is active
          if (!fixedBg.classList.contains("active")) {
            fixedBg.classList.add("active");
          }
        },
      });

    // Add a subtle parallax to the hero content
    gsap.to(".hero-content", {
      y: -80,
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  // Control when the background is visible/hidden
  function setupWorkSectionControls() {
    // Create markers for different sections of the page
    const sections = [
      { el: workSection, name: "work" },
      { el: aboutSection, name: "about" },
      { el: contactSection, name: "contact" },
    ];

    // Set up section-based visibility controls
    sections.forEach((section, index) => {
      if (!section.el) return;

      // Add markers to each section for debugging
      // (comment these out for production)
      /*
      const marker = document.createElement("div");
      marker.className = "section-marker";
      marker.textContent = section.name;
      marker.style.cssText = "position:absolute;top:0;right:0;padding:5px;background:rgba(0,0,0,0.5);color:white;z-index:1000;";
      section.el.appendChild(marker);
      */

      // Work section specific ScrollTrigger
      if (section.name === "work") {
        ScrollTrigger.create({
          trigger: section.el,
          start: "top bottom",
          end: "bottom top",
          toggleClass: { targets: document.body, className: "in-work-section" },
          onToggle: (self) => {
            if (self.isActive) {
              fixedBg.classList.add("active");
            }
          },
        });
      }

      // About section enters viewport - begin fading out work background
      if (section.name === "about") {
        ScrollTrigger.create({
          trigger: section.el,
          start: "top 25%", // Start transition when about section is 25% into viewport
          end: "top -10%", // Complete transition after about section reaches top
          scrub: 1.2,
          onEnter: () => {
            gsap.to(fixedBg, {
              opacity: 0,
              duration: 0.8,
              onComplete: () => {
                // Only remove the class after fade completes
                if (!ScrollTrigger.isInViewport(workSection)) {
                  fixedBg.classList.remove("active");
                  document.body.classList.remove("in-work-section");
                }
              },
            });
          },
          onLeaveBack: () => {
            // Re-activate when scrolling back up to work
            document.body.classList.add("in-work-section");
            fixedBg.classList.add("active");
            gsap.to(fixedBg, {
              opacity: 1,
              duration: 0.6,
            });
          },
        });
      }
    });

    // Special case: direct transition between hero and about
    // Handle edge case where user might scroll very quickly
    ScrollTrigger.create({
      trigger: aboutSection,
      start: "top bottom",
      end: "top 80%",
      onEnter: () => {
        if (!document.body.classList.contains("in-work-section")) {
          fixedBg.classList.remove("active");
        }
      },
    });

    // Add animation for work grid items
    const workItems = gsap.utils.toArray(".work-item");
    workItems.forEach((item, i) => {
      gsap.from(item, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.05 * (i % 5), // Staggered but with a pattern
        ease: "power2.out",
        scrollTrigger: {
          trigger: workSection,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    });
  }

  // Add scroll indicator to guide users
  function setupScrollIndicator() {
    setTimeout(() => {
      const scrollIndicator = document.createElement("div");
      scrollIndicator.className = "scroll-indicator";
      scrollIndicator.innerHTML = "<span></span>";
      document.body.appendChild(scrollIndicator);

      gsap.to(scrollIndicator, {
        opacity: 1,
        duration: 0.5,
        yoyo: true,
        repeat: 3,
        onComplete: () => {
          scrollIndicator.remove();
        },
      });
    }, 1500);
  }

  // Add custom scroll interaction for desktop
  if (!("ontouchstart" in window || navigator.msMaxTouchPoints)) {
    let startY,
      currentY,
      dragging = false;

    heroSection.addEventListener("mousedown", (e) => {
      startY = e.clientY;
      dragging = true;
    });

    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      currentY = e.clientY;
      const diff = (startY - currentY) * 0.6;
      if (diff > 0) {
        window.scrollTo({
          top: diff,
          behavior: "auto",
        });
      }
    });

    window.addEventListener("mouseup", () => {
      dragging = false;
    });
  }
});
