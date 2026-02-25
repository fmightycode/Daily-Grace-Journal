
  const toggleBtn = document.getElementById("themeToggle");

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Change icon
    if (document.body.classList.contains("dark-mode")) {
      toggleBtn.textContent = "☀️";
      toggleBtn.style.backgroundColor="#212529";
      section.classList.add("dark")
    } else {
      toggleBtn.textContent = "🌙";
       toggleBtn.style.backgroundColor="green";
       section.classList.remove("dark")
    }
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

