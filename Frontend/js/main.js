// Select all FAQ question buttons
const faqButtons = document.querySelectorAll(".faq-question");

faqButtons.forEach(button => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;

    // Collapse all other answers first
    document.querySelectorAll(".faq-answer").forEach(a => {
      if (a !== answer) {
        a.style.maxHeight = null;
      }
    });

    // Toggle current answer
    if (answer.style.maxHeight) {
      answer.style.maxHeight = null; // collapse
    } else {
      answer.style.maxHeight = answer.scrollHeight + "px"; // expand
    }
  });
});

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});