// Mobile menu
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");

hamburger?.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("show");
  hamburger.setAttribute("aria-expanded", String(isOpen));
  mobileNav.setAttribute("aria-hidden", String(!isOpen));
});

// Close mobile nav on click
mobileNav?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    mobileNav.classList.remove("show");
    hamburger.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-hidden", "true");
  });
});

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Social links (edit these)
document.getElementById("instaLink").href = "https://instagram.com/";
document.getElementById("ytLink").href = "https://youtube.com/";
document.getElementById("xLink").href = "https://x.com/";

// Contact form (mailto without backend)
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const subject = encodeURIComponent("DevOps Boys — Updates request");
  const body = encodeURIComponent(`Hi DevOps Boys,\n\nPlease add me to updates.\n\nEmail: ${email}\n`);
  // Replace with your receiving email:
  window.location.href = `mailto:YOUR_EMAIL_HERE?subject=${subject}&body=${body}`;
});

// Counter animation
const counters = document.querySelectorAll("[data-count]");
const animateCount = (el) => {
  const target = Number(el.getAttribute("data-count") || 0);
  const duration = 900;
  const start = performance.now();
  const from = 0;

  const step = (t) => {
    const p = Math.min((t - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.floor(from + (target - from) * eased);
    el.textContent = val.toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.35 });

counters.forEach(c => io.observe(c));
