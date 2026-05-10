/* ============================================================
   Jeremy Tapawan · Cybersecurity Portfolio
   main.js, interactivity + project documentation modal
                + media gallery (photos & videos)
   ============================================================ */

/* ── YEAR ── */
document.getElementById('yr').textContent = new Date().getFullYear();

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── NAV ACTIVE STATE ── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('nav a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) current = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--cyan)' : '';
  });
});

/* ── CONTACT FORM ── */
function handleSend() {
  const name  = document.getElementById('cname').value.trim();
  const email = document.getElementById('cemail').value.trim();
  const msg   = document.getElementById('cmsg').value.trim();
  if (!name || !email || !msg) { alert('Please fill in all fields.'); return; }
  const btn = document.querySelector('.btn-send');
  btn.textContent = 'Message Sent ✓';
  btn.style.color = btn.style.borderColor = 'var(--green)';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Message →';
    btn.style.color = btn.style.borderColor = '';
    btn.disabled = false;
  }, 3000);
}
