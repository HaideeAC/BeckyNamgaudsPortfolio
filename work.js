// work.js - Enhanced filter functionality with smooth animations

document.addEventListener("DOMContentLoaded", () => {
  // Work section filter functionality
  const filterButtons = document.querySelectorAll(".work-filter-btn");
  const workItems = document.querySelectorAll(".work-item");

  // Set initial state - show all items
  workItems.forEach((item) => {
    item.style.display = "block";
  });

  // Add click event to each filter button
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      button.classList.add("active");

      const category = button.getAttribute("data-filter");

      // Filter work items with smooth transitions
      filterWorkItems(workItems, category);
    });
  });

  // Function to handle filtering with proper animation timing
  function filterWorkItems(items, category) {
    // First handle items that need to be hidden
    items.forEach((item) => {
      if (
        category !== "all" &&
        item.getAttribute("data-category") !== category
      ) {
        // Start fade out
        item.classList.remove("visible");
      }
    });

    // Wait for fade-out animation to complete
    setTimeout(() => {
      items.forEach((item) => {
        if (
          category === "all" ||
          item.getAttribute("data-category") === category
        ) {
          // Show the item
          item.style.display = "block";

          // Trigger reflow to ensure animation works properly
          void item.offsetWidth;

          // Fade in with slight delay for staggered effect
          setTimeout(() => {
            item.classList.add("visible");
          }, 50);
        } else {
          // Hide the item after fade-out completes
          item.style.display = "none";
        }
      });
    }, 300); // Match this to the CSS transition duration
  }

  // Check for URL hash to filter items on page load
  const checkURLHash = () => {
    const hash = window.location.hash;
    if (hash && hash.includes("filter=")) {
      const category = hash.split("filter=")[1];
      const matchingButton = document.querySelector(
        `.work-filter-btn[data-filter="${category}"]`
      );

      if (matchingButton) {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"));

        // Add active class to matching button
        matchingButton.classList.add("active");

        // Filter work items
        filterWorkItems(workItems, category);
      }
    }
  };

  // Initial check for URL hash
  checkURLHash();

  // Update filtering if hash changes
  window.addEventListener("hashchange", checkURLHash);
});
