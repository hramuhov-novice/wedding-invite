const WEDDING_DATE = new Date("2026-09-12T14:30:00");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function pad(n) {
  return String(n).padStart(2, "0");
}

function updateCountdown() {
  if (!daysEl) return;
  const diff = WEDDING_DATE - new Date();
  if (diff <= 0) {
    daysEl.textContent = "0";
    hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = "00";
    return;
  }
  daysEl.textContent = Math.floor(diff / 86400000);
  hoursEl.textContent = pad(Math.floor((diff / 3600000) % 24));
  minutesEl.textContent = pad(Math.floor((diff / 60000) % 60));
  secondsEl.textContent = pad(Math.floor((diff / 1000) % 60));
}

function initCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function showMainContent() {
  const site = document.getElementById("site");
  const pageBgWrap = document.getElementById("page-bg-wrap");
  const pageOverlay = document.getElementById("page-overlay");

  pageBgWrap?.classList.add("is-visible");
  pageBgWrap?.removeAttribute("aria-hidden");
  pageOverlay?.classList.add("is-visible");
  pageOverlay?.removeAttribute("aria-hidden");
  site?.classList.add("site--visible");
  site?.removeAttribute("aria-hidden");
  document.body.classList.remove("is-locked");
  initCountdown();
  window.scrollTo(0, 0);
}

function bindSealOpen(seal, openInvite) {
  let activated = false;

  function activate(event) {
    if (activated) return;
    if (event.type === "pointerup" && event.pointerType === "mouse" && event.button !== 0) {
      return;
    }
    activated = true;
    event.preventDefault();
    openInvite();
  }

  if (window.PointerEvent) {
    seal.addEventListener("pointerup", activate);
  }

  seal.addEventListener("click", (event) => {
    if (activated) {
      event.preventDefault();
      return;
    }
    activate(event);
  });

  seal.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate(event);
    }
  });
}

function initIntro() {
  const intro = document.getElementById("intro");
  const site = document.getElementById("site");
  const envelope = document.getElementById("envelope");
  const seal = document.getElementById("seal");
  if (!intro || !site || !envelope || !seal) {
    showMainContent();
    return;
  }

  let opened = false;
  const isMobileIntro = window.matchMedia("(max-width: 768px)").matches;
  const contentRevealMs = isMobileIntro ? 6800 : 1100;
  const introRemoveMs = isMobileIntro ? 8200 : 2400;

  function openInvite() {
    if (opened) return;
    opened = true;
    seal.disabled = true;

    const flap = envelope.querySelector(".envelope__flap");
    if (flap) {
      envelope.classList.remove("envelope--opening");
      flap.style.animation = "none";
      flap.style.webkitAnimation = "none";
      void flap.offsetHeight;
      flap.style.animation = "";
      flap.style.webkitAnimation = "";
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (flap) void flap.getBoundingClientRect();
        envelope.classList.add("envelope--opening");
        intro.classList.add("intro--opening");
      });
    });

    window.setTimeout(() => {
      intro.classList.add("intro--done");
      showMainContent();
    }, contentRevealMs);

    window.setTimeout(() => {
      intro.remove();
    }, introRemoveMs);
  }

  bindSealOpen(seal, openInvite);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initIntro);
} else {
  initIntro();
}
