const navLinks = document.querySelectorAll(".nav-link");
const filters = document.querySelectorAll(".timeline-filter");
const posts = document.querySelectorAll(".post-card");
const filterLabel = document.getElementById("posts-filter-label");
const yearEl = document.getElementById("year");
const currentPage = document.body.dataset.page;
const themeToggle = document.getElementById("theme-toggle");

function setTheme(theme) {
  document.body.classList.toggle("theme-dark", theme === "dark");

  if (themeToggle) {
    const isDark = theme === "dark";
    themeToggle.textContent = isDark ? "Light Theme" : "Dark Theme";
    themeToggle.setAttribute("aria-pressed", String(isDark));
  }
}

try {
  const savedTheme = localStorage.getItem("theme");
  const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(savedTheme || (preferredDark ? "dark" : "light"));
} catch (_err) {
  setTheme("light");
}

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

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("theme-dark");
    const nextTheme = isDark ? "light" : "dark";
    setTheme(nextTheme);

    try {
      localStorage.setItem("theme", nextTheme);
    } catch (_err) {
      // Ignore storage errors; theme still applies for this session.
    }
  });
}
