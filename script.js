/* ── HAMBURGER NAV (mobile only) ───────────────────────────────────
   Injects the 3-line burger button and a scrim, wires up the
   slide-in drawer. CSS handles all visual styling.
   ─────────────────────────────────────────────────────────────── */

(function initHamburger() {
  const header = document.getElementById("site-header");
  const nav    = header.querySelector("nav");

  // 1. Burger button (appended into header)
  const burger = document.createElement("button");
  burger.className = "nav-burger";
  burger.type      = "button";
  burger.setAttribute("aria-label", "Open navigation menu");
  burger.setAttribute("aria-expanded", "false");
  burger.innerHTML = "<span></span><span></span><span></span>";
  header.appendChild(burger);

  // 2. Dark scrim that sits behind the open drawer
  const scrim = document.createElement("div");
  scrim.className = "nav-scrim";
  document.body.appendChild(scrim);

  // 3. Open / close helpers
  function openNav() {
    nav.classList.add("open");
    burger.classList.add("open");
    scrim.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    nav.classList.remove("open");
    burger.classList.remove("open");
    scrim.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  burger.addEventListener("click", () =>
    nav.classList.contains("open") ? closeNav() : openNav()
  );

  // Tap scrim → close
  scrim.addEventListener("click", closeNav);

  // Tap a nav link → close (single-page nav)
  nav.querySelectorAll(".nav-link").forEach((link) =>
    link.addEventListener("click", closeNav)
  );

  // Escape key → close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) closeNav();
  });
})();

/* ── END HAMBURGER ──────────────────────────────────────────────── */


/* ── Header scroll behaviour ───────────────────────────────────── */
const header = document.getElementById("site-header");

const onScroll = () => {
  header.classList.toggle("scrolled", window.scrollY > 80);
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