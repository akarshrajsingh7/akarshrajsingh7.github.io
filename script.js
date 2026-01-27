const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section");
const filters = document.querySelectorAll(".timeline-filter");
const posts = document.querySelectorAll(".post-card");
const filterLabel = document.getElementById("posts-filter-label");
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((section) => observer.observe(section));
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
