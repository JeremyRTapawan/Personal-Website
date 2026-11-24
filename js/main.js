/* ============================================================
   Jeremy Tapawan · Cybersecurity Portfolio — main.js
   Scroll reveal, mobile menu, screenshot gallery, contact form
   ============================================================ */

document.documentElement.classList.remove('no-js');

/* ── YEAR ── */
document.getElementById('yr').textContent = new Date().getFullYear();

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach(el => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => observer.observe(el));
}

/* ── NAV: ACTIVE LINK + MOBILE MENU ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#nav-menu a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 90) current = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
}, { passive: true });

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
function setMenu(open) {
  navMenu.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
navToggle.addEventListener('click', () => setMenu(!navMenu.classList.contains('open')));
navLinks.forEach(a => a.addEventListener('click', () => setMenu(false)));

/* ── RESUME BUTTON: hide until resume/Jeremy_Tapawan_Resume.pdf exists ── */
const resumeBtn = document.getElementById('resume-btn');
if (resumeBtn) {
  fetch(resumeBtn.getAttribute('href'), { method: 'HEAD' })
    .then(res => { if (!res.ok) resumeBtn.hidden = true; })
    .catch(() => { resumeBtn.hidden = true; });
}

/* ── SCREENSHOT GALLERY ──
   Images come from the project READMEs on GitHub. To add one, add an
   entry with its image URL and a one-line caption. */
const GH = 'https://github.com/user-attachments/assets/';
const GALLERIES = {
  siem: {
    title: 'SIEM Home Lab (Mini SOC)',
    items: [
      { src: 'img/siem-triggered-alerts.jpg', caption: 'Both scheduled detections firing in Splunk: SSH brute force and Windows failed login.' },
      { src: 'img/siem-failed-logon-4625.jpg', caption: 'Searching for Windows failed logons (Event ID 4625), a common sign of password guessing.' },
      { src: 'img/siem-logs-ingested.jpg', caption: 'Events from the forwarded endpoints arriving in Splunk, confirming log collection works end to end.' },
      { src: 'img/siem-receiving-port.jpg', caption: 'Splunk set up to receive logs from Universal Forwarders on TCP port 9997.' },
    ],
  },
  ssh: {
    title: 'SSH Brute Force Detection & Alerting',
    items: [
      { src: GH + 'e6168705-3fa9-4922-b121-6fcf44c27529', caption: 'The brute-force alert triggering after the simulated attack.' },
      { src: GH + '6bcec3a9-39af-44db-acd4-f5c9e4b220dc', caption: 'Detection query: repeated failed SSH logins from the same source in a short window.' },
      { src: GH + 'd36eb0d7-c221-4dda-bc18-d3bc2cb2afec', caption: 'Alert settings: scheduled search, time window and trigger threshold.' },
      { src: GH + '435a0c67-e020-4980-92be-54209de82e90', caption: 'Failed SSH attempts in /var/log/auth.log, the raw data behind the detection.' },
    ],
  },
  vuln: {
    title: 'Virtual Network Vulnerability Assessment',
    items: [
      { src: GH + '585b9932-46b2-4786-9ebb-a611773ca326', caption: 'Lab network: Kali scanner, Windows and Ubuntu targets, all behind a pfSense firewall.' },
      { src: GH + '2dcfff46-de62-4560-b2db-a38e69c54628', caption: 'Least-privilege pfSense rules, including blocking SMB on TCP 445.' },
      { src: GH + 'db669390-75ee-455b-a9a4-a565ab928767', caption: 'Nessus scan results for the target hosts.' },
      { src: GH + 'b5e9c853-dbf7-4d24-9815-22c61fb1b5ac', caption: 'Before-and-after comparison: fewer findings once the firewall rules were applied.' },
      { src: GH + '0a1aa737-b9f9-4226-9d8b-dd2c6afd4224', caption: 'Nmap confirming only SSH is reachable and SMB is closed.' },
    ],
  },
};

const dialog = document.getElementById('gallery');
const gImg = document.getElementById('gallery-img');
const gCaption = document.getElementById('gallery-caption');
const gTitle = document.getElementById('gallery-title');
const gCount = document.getElementById('gallery-count');
let gKey = null;
let gIndex = 0;
let lastTrigger = null;

function showSlide(i) {
  const items = GALLERIES[gKey].items;
  gIndex = (i + items.length) % items.length;
  const item = items[gIndex];
  gImg.src = item.src;
  gImg.alt = item.caption;
  gCaption.textContent = item.caption;
  gCount.textContent = `${gIndex + 1} / ${items.length}`;
}

function openGallery(key, trigger) {
  if (!GALLERIES[key] || typeof dialog.showModal !== 'function') return;
  gKey = key;
  lastTrigger = trigger;
  gTitle.textContent = GALLERIES[key].title;
  showSlide(0);
  dialog.showModal();
}

document.querySelectorAll('[data-gallery]').forEach(btn => {
  btn.addEventListener('click', () => openGallery(btn.dataset.gallery, btn));
});
document.getElementById('gallery-prev').addEventListener('click', () => showSlide(gIndex - 1));
document.getElementById('gallery-next').addEventListener('click', () => showSlide(gIndex + 1));
document.getElementById('gallery-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
dialog.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') showSlide(gIndex + 1);
  if (e.key === 'ArrowLeft') showSlide(gIndex - 1);
});
dialog.addEventListener('close', () => { if (lastTrigger) lastTrigger.focus(); });

/* If a screenshot fails to load, hide it instead of showing a broken image. */
document.querySelectorAll('.project-thumb img').forEach(img => {
  const hide = () => img.closest('.project-thumb').classList.add('thumb-missing');
  if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) hide();
  img.addEventListener('error', hide);
});

/* ── CONTACT FORM ──
   Opens the visitor's email app with the message filled in, so every
   message actually reaches the inbox (no backend needed). */
const form = document.getElementById('contact-form');
const note = document.getElementById('form-note');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // Use form.elements: `form.name` would return the form's own name attribute.
  const fields = form.elements;
  const name = fields.namedItem('name').value.trim();
  const emailInput = fields.namedItem('email');
  const email = emailInput.value.trim();
  const msg = fields.namedItem('message').value.trim();

  if (!name || !email || !msg) {
    note.textContent = 'Please fill in all three fields.';
    note.classList.add('error');
    return;
  }
  if (!emailInput.checkValidity()) {
    note.textContent = 'Please enter a valid email address.';
    note.classList.add('error');
    return;
  }

  const subject = `Portfolio contact from ${name}`;
  const body = `${msg}\n\n${name}\n${email}`;
  window.location.href =
    `mailto:jeremytapawan17@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  note.classList.remove('error');
  note.textContent = "Your email app should open with the message ready. If it doesn't, email jeremytapawan17@gmail.com directly.";
});
