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

/* ── Parallax scrolling (desktop + mobile) ──────────────────────────
   Drives the hero backdrop at a slower rate than the page scroll.
   Uses transform (not background-attachment: fixed, which iOS ignores)
   and is rAF-throttled so it stays smooth on touch devices. */
(function initParallax() {
  const hero = document.querySelector(".hero");
  const backdrop = document.querySelector(".hero-backdrop");
  if (!hero || !backdrop) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reduceMotion) return;

  const SPEED = 0.4; // backdrop moves at 40% of scroll speed
  let ticking = false;

  function render() {
    ticking = false;
    const heroHeight = hero.offsetHeight || window.innerHeight;
    // Only shift while the hero is on screen, and cap the offset so the
    // 145%-tall backdrop never reveals an edge.
    const offset = Math.min(window.scrollY, heroHeight) * SPEED;
    backdrop.style.setProperty("--hero-parallax", `${offset}px`);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(render);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  render();
})();

/* ── Custom YouTube-style video player ──────────────────────────────
   play/pause, mute/unmute, seekable red progress bar, time, fullscreen. */
(function initVideoPlayers() {
  document.querySelectorAll("[data-video-player]").forEach((player) => {
    const video = player.querySelector(".vp-video");
    if (!video) return;

    const bigPlay = player.querySelector(".vp-bigplay");
    const playBtn = player.querySelector(".vp-play");
    const muteBtn = player.querySelector(".vp-mute");
    const fullBtn = player.querySelector(".vp-full");
    const progress = player.querySelector(".vp-progress");
    const fill = player.querySelector(".vp-progress-fill");
    const timeEl = player.querySelector(".vp-time");

    const fmt = (s) => {
      if (!Number.isFinite(s)) return "0:00";
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return `${m}:${sec < 10 ? "0" : ""}${sec}`;
    };

    const syncPlay = () =>
      player.classList.toggle("is-paused", video.paused);
    const syncMute = () =>
      player.classList.toggle("is-muted", video.muted || video.volume === 0);

    function togglePlay() {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }

    playBtn?.addEventListener("click", togglePlay);
    bigPlay?.addEventListener("click", togglePlay);
    video.addEventListener("click", togglePlay);
    video.addEventListener("play", syncPlay);
    video.addEventListener("pause", syncPlay);

    muteBtn?.addEventListener("click", () => {
      video.muted = !video.muted;
      if (!video.muted && video.volume === 0) video.volume = 1;
    });
    video.addEventListener("volumechange", syncMute);

    fullBtn?.addEventListener("click", () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (player.requestFullscreen) {
        player.requestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen(); // iOS Safari
      }
    });

    video.addEventListener("timeupdate", () => {
      const pct = video.duration
        ? (video.currentTime / video.duration) * 100
        : 0;
      if (fill) fill.style.width = `${pct}%`;
      if (timeEl)
        timeEl.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
    });
    video.addEventListener("loadedmetadata", () => {
      if (timeEl) timeEl.textContent = `0:00 / ${fmt(video.duration)}`;
    });

    function seek(event) {
      const rect = progress.getBoundingClientRect();
      const ratio = Math.min(
        1,
        Math.max(0, (event.clientX - rect.left) / rect.width)
      );
      if (video.duration) video.currentTime = ratio * video.duration;
    }
    progress?.addEventListener("click", seek);

    syncPlay();
    syncMute();
  });
})();

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
