
const toggleBtn = document.getElementById("themeToggle");  
const section = document.querySelector("section");

// default UI (light)
toggleBtn.textContent = "🌙";              
toggleBtn.style.backgroundColor = "green";

// restore theme ONLY if user explicitly chose dark before
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  toggleBtn.textContent = "☀️";
  toggleBtn.style.backgroundColor = "#212529";
  if (section) section.classList.add("dark");
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");

  // save user choice
  localStorage.setItem("theme", isDark ? "dark" : "light");

  if (isDark) {
    toggleBtn.textContent = "☀️";
    toggleBtn.style.backgroundColor = "#212529";
    if (section) section.classList.add("dark");
  } else {
    toggleBtn.textContent = "🌙";
    toggleBtn.style.backgroundColor = "green";
    if (section) section.classList.remove("dark");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("amen-popup");
  const popupTitle = document.getElementById("popup-title");
  const popupMsg = document.getElementById("popup-msg");
  const closeBtn = document.getElementById("close-popup");
  const amenButtons = document.querySelectorAll(".amen-btn");

  amenButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const postTitle = btn.dataset.title;
      popupTitle.textContent = "Amen 🙏";
      popupMsg.textContent = `You are blessed in Jesus Name (Amen)`;
      popup.style.display = "flex";
    });
  });

  // Close popup
  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

  // Click outside popup closes it
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.style.display = "none";
    }
  });
});


  let lastScrollTop = 0;
  const navbar = document.getElementById("mainNavbar");

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 50) {
      // Scrolling down → hide navbar
      navbar.classList.add("navbar-hidden");
      navbar.classList.add("scrolled");
    } else {
      // Scrolling up → show navbar
      navbar.classList.remove("navbar-hidden");
      navbar.classList.remove("scrolled");
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });

