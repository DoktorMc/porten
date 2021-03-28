const $menuBtn = document.querySelector(".menu-btn");
const $menu = document.querySelector(".main_navbar-menu");

// burger menu

$menuBtn.addEventListener("click", function () {
  $menuBtn.classList.toggle("active");
  $menu.classList.toggle("active");
});

