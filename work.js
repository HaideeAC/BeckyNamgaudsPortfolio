// Add this to your main.js file

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

      // Filter work items
      workItems.forEach((item) => {
        if (category === "all") {
          item.style.display = "block";
          setTimeout(() => {
            item.classList.add("visible");
          }, 50);
        } else if (item.getAttribute("data-category") === category) {
          item.style.display = "block";
          setTimeout(() => {
            item.classList.add("visible");
          }, 50);
        } else {
          item.classList.remove("visible");
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });
    });
  });
});
