/* ── Header scroll behaviour ───────────────────────────────────── */
const header = document.getElementById("site-header");

const onScroll = () => {
  header.classList.toggle("scrolled", window.scrollY > 40);
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ── Active nav link on scroll ─────────────────────────────────── */
const sections = document.querySelectorAll("main [id]");
const navLinks = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

/* ── Hero arrow scroll (highlights rail) ───────────────────────── */
document.querySelectorAll(".hero-arrow").forEach((btn) => {
  btn.addEventListener("click", () => {
    const rail = document.getElementById(btn.dataset.railTarget);
    if (!rail) return;
    const cardWidth = rail.querySelector(".feature-card")?.offsetWidth ?? 280;
    rail.scrollBy({ left: parseInt(btn.dataset.direction) * (cardWidth + 16), behavior: "smooth" });
  });
});

/* ── Certificate modal ──────────────────────────────────────────── */
const modal      = document.getElementById("cert-modal");
const modalImg   = document.getElementById("cert-modal-img");
const modalClose = document.getElementById("cert-modal-close");
const modalBg    = document.getElementById("cert-modal-backdrop");

function openModal(src) {
  modalImg.src = src;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  modalClose.focus();
}

function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
  modalImg.src = "";
}

// Click on any cert card
document.querySelectorAll(".cert-card").forEach((card) => {
  card.addEventListener("click", () => openModal(card.dataset.cert));

  // Keyboard: Enter or Space
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(card.dataset.cert);
    }
  });
});

// Close via button, backdrop click, or Escape key
modalClose.addEventListener("click", closeModal);
modalBg.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});