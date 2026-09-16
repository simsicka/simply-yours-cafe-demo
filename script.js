const header = document.querySelector("#site-header");
const menuButton = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const navLinks = primaryNav.querySelectorAll("a");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
};

const closeMenu = () => {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.querySelector(".sr-only").textContent = "Open navigation";
  primaryNav.classList.remove("is-open");
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
};

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.querySelector(".sr-only").textContent = isOpen ? "Open navigation" : "Close navigation";
  primaryNav.classList.toggle("is-open", !isOpen);
  header.classList.toggle("menu-active", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) closeMenu();
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

const revealItems = document.querySelectorAll(".reveal");

if (reduceMotion.matches || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const heroVideo = document.querySelector(".hero-video");
const HERO_LOOP_END = 3.28;

const restartHeroVideo = () => {
  if (!heroVideo) return;
  heroVideo.currentTime = 0;

  if (heroVideo.paused) {
    const playPromise = heroVideo.play();
    if (playPromise) playPromise.catch(() => {});
  }
};

const keepHeroInsideCustomLoop = () => {
  if (heroVideo && heroVideo.currentTime >= HERO_LOOP_END) {
    restartHeroVideo();
  }

  if (heroVideo && "requestVideoFrameCallback" in heroVideo) {
    heroVideo.requestVideoFrameCallback(keepHeroInsideCustomLoop);
  } else {
    window.requestAnimationFrame(keepHeroInsideCustomLoop);
  }
};

const playHeroVideo = () => {
  if (!heroVideo) return;

  heroVideo.muted = true;
  const playPromise = heroVideo.play();
  if (playPromise) playPromise.catch(() => {});
};

if (heroVideo.readyState >= 2) {
  playHeroVideo();
} else {
  heroVideo.addEventListener("canplay", playHeroVideo, { once: true });
}

heroVideo.addEventListener("timeupdate", () => {
  if (heroVideo.currentTime >= HERO_LOOP_END) restartHeroVideo();
});
heroVideo.addEventListener("ended", restartHeroVideo);
keepHeroInsideCustomLoop();
window.addEventListener("pageshow", playHeroVideo);

document.querySelectorAll("[data-placeholder-link]").forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});

document.querySelector("#year").textContent = new Date().getFullYear();
