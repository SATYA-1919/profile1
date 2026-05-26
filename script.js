(function initHamburger() {
  const header = document.getElementById("site-header");
  const nav = header?.querySelector("nav");

  if (!header || !nav) return;

  const burger = document.createElement("button");
  burger.className = "nav-burger";
  burger.type = "button";
  burger.setAttribute("aria-label", "Open navigation menu");
  burger.setAttribute("aria-expanded", "false");
  burger.innerHTML = "<span></span><span></span><span></span>";
  header.appendChild(burger);

  const scrim = document.createElement("div");
  scrim.className = "nav-scrim";
  document.body.appendChild(scrim);

  function openNav() {
    nav.classList.add("open");
    burger.classList.add("open");
    scrim.classList.add("open");
    header.classList.add("menu-open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Close navigation menu");
    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    nav.classList.remove("open");
    burger.classList.remove("open");
    scrim.classList.remove("open");
    header.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open navigation menu");
    document.body.style.overflow = "";
  }

  burger.addEventListener("click", () => {
    nav.classList.contains("open") ? closeNav() : openNav();
  });

  scrim.addEventListener("click", closeNav);

  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      closeNav();
    }
  });
})();

const header = document.getElementById("site-header");

function updateHeaderState() {
  header?.classList.toggle("scrolled", window.scrollY > 40);
}

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  },
  { rootMargin: "-38% 0px -56% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll(".project-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const details = document.getElementById(button.getAttribute("aria-controls"));
    if (!details) return;

    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    button.textContent = isOpen ? "View More" : "Show Less";
    details.hidden = isOpen;
  });
});

const modal = document.getElementById("cert-modal");
const modalImg = document.getElementById("cert-modal-img");
const modalClose = document.getElementById("cert-modal-close");
const modalBg = document.getElementById("cert-modal-backdrop");

function openModal(src) {
  if (!modal || !modalImg || !modalClose) return;

  modalImg.src = src;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  modalClose.focus();
}

function closeModal() {
  if (!modal || !modalImg) return;

  modal.classList.remove("open");
  document.body.style.overflow = "";
  modalImg.src = "";
}

document.querySelectorAll("[data-cert]").forEach((card) => {
  function activatePreview() {
    card.classList.add("is-clicked");
    window.setTimeout(() => card.classList.remove("is-clicked"), 460);
    window.setTimeout(() => openModal(card.dataset.cert), 120);
  }

  card.addEventListener("click", activatePreview);

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activatePreview();
    }
  });
});

modalClose?.addEventListener("click", closeModal);
modalBg?.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("open")) {
    closeModal();
  }
});
