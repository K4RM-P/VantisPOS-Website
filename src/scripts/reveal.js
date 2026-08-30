document.documentElement.classList.add('js-reveal');

const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
);
revealEls.forEach((el) => revealObserver.observe(el));

const sections = ['features', 'pricing', 'about', 'contact']
  .map((id) => document.getElementById(id))
  .filter((el) => el !== null);
const navLinks = document.querySelectorAll('nav[aria-label="Primary"] a[href^="#"]');

if (sections.length && navLinks.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        }
      }
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );
  sections.forEach((section) => navObserver.observe(section));
}
