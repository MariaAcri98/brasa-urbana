/* JavaScript para actualizar el año en el pie de página
   y animar elementos al hacer scroll */

document.getElementById("year").textContent = new Date().getFullYear();

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("show");
      }, index * 120);
    }
  });
}, { threshold: 0.15 });

reveals.forEach(reveal => {
  observer.observe(reveal);
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});