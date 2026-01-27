const navLinks = document.querySelectorAll(".nav-link");
const filters = document.querySelectorAll(".timeline-filter");
const posts = document.querySelectorAll(".post-card");
const filterLabel = document.getElementById("posts-filter-label");
const yearEl = document.getElementById("year");
const currentPage = document.body.dataset.page;

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (currentPage) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.page === currentPage);
  });
}

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const month = filter.dataset.month;

    filters.forEach((item) => item.classList.remove("active"));
    filter.classList.add("active");

    posts.forEach((post) => {
      const showAll = month === "all";
      const matches = post.dataset.month === month;
      post.style.display = showAll || matches ? "block" : "none";
    });

    if (filterLabel) {
      filterLabel.textContent =
        month === "all" ? "Showing: All posts" : `Showing: ${filter.textContent}`;
    }
  });
});
