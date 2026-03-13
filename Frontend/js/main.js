document.addEventListener('DOMContentLoaded', () => {
  // 1. FAQ Logica
  const faqButtons = document.querySelectorAll(".faq-question");

  faqButtons.forEach(button => {
    button.addEventListener("click", () => {
      const answer = button.nextElementSibling;
      document.querySelectorAll(".faq-answer").forEach(a => {
        if (a !== answer) a.style.maxHeight = null;
      });
      answer.style.maxHeight = answer.style.maxHeight ? null : answer.scrollHeight + "px";
    });
  });

  // 2. Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.innerHTML = navLinks.classList.contains('active') ? '&#10006;' : '&#9776;';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '&#9776;';
      });
    });
  }

  // 3. Lucide Icoontjes Initialiseren
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});