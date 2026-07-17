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
  function bindSealOpen(seal, openInvite) {
  let activated = false;

  function activate(event) {
    if (activated) return;
    activated = true;
    event.preventDefault();
    openInvite();
  }

  // Оставляем только чистый клик — он идеально работает везде
  seal.addEventListener("click", (event) => {
    activate(event);
  });

  // Доступность для клавиатуры (Enter / Пробел)
  seal.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate(event);
    }
  });
}
/*
старый вариант 
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
*/
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

  const FLAP_OPEN_DURATION = 5500;
  const FLAP_EASING = "cubic-bezier(0.25, 0.1, 0.15, 1)";
  const FLAP_OPEN_ANGLE = -170;
  const CONTENT_REVEAL_MS = Math.round(FLAP_OPEN_DURATION * 0.8);
  const INTRO_REMOVE_MS = FLAP_OPEN_DURATION + 2000;
  const INTRO_FADE_DELAY_MS = Math.round(FLAP_OPEN_DURATION * 0.72);

  let opened = false;

  function animateFlapOpen(flapWrap) {
    if (!flapWrap) return Promise.resolve();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      flapWrap.style.transform = `rotateX(${FLAP_OPEN_ANGLE}deg)`;
      return Promise.resolve();
    }

    if (typeof flapWrap.animate !== "function") {
      return Promise.resolve();
    }

    flapWrap.getAnimations().forEach((animation) => animation.cancel());
    flapWrap.style.transform = "rotateX(0deg)";

    const animation = flapWrap.animate(
      [
        { transform: "rotateX(0deg)" },
        { transform: `rotateX(${FLAP_OPEN_ANGLE}deg)` },
      ],
      {
        duration: FLAP_OPEN_DURATION,
        easing: FLAP_EASING,
        fill: "forwards",
      }
    );

    return animation.finished
      .then(() => {
        flapWrap.style.transform = `rotateX(${FLAP_OPEN_ANGLE}deg)`;
      })
      .catch(() => {
        flapWrap.style.transform = `rotateX(${FLAP_OPEN_ANGLE}deg)`;
      });
  }
  /*вот ниже кусок что заменили*/
  function openInvite() {
  if (opened) return;
  opened = true;
  seal.disabled = true;

  const flapWrap = envelope.querySelector(".envelope__flap-wrap");

  // Устанавливаем переменную длительности
  envelope.style.setProperty("--flap-open-duration", `${FLAP_OPEN_DURATION}ms`);

  // МЫ УДАЛИЛИ ПРОБЛЕМНЫЙ intro.style.transition ОТСЮДА!
  
  requestAnimationFrame(() => {
    // Теперь эти классы гарантированно добавятся!
    envelope.classList.add("envelope--opening");
    intro.classList.add("intro--opening");

    if (flapWrap && typeof flapWrap.animate === "function") {
      envelope.classList.add("envelope--js-flap");
      animateFlapOpen(flapWrap);
    }
  });

  window.setTimeout(() => {
    intro.classList.add("intro--done");
    showMainContent();
  }, CONTENT_REVEAL_MS);

  window.setTimeout(() => {
    intro.remove();
  }, INTRO_REMOVE_MS);
}

/* предложил правки по открытию это не работало но пусть будет
  function openInvite() {
    if (opened) return;
    opened = true;
    seal.disabled = true;

    const flapWrap = envelope.querySelector(".envelope__flap-wrap");

    envelope.style.setProperty("--flap-open-duration", `${FLAP_OPEN_DURATION}ms`);
    intro.style.transition =
      `opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1) ${INTRO_FADE_DELAY_MS}ms, ` +
      `visibility 1.4s cubic-bezier(0.4, 0, 0.2, 1) ${INTRO_FADE_DELAY_MS}ms`;

    requestAnimationFrame(() => {
      envelope.classList.add("envelope--opening");
      intro.classList.add("intro--opening");

      if (flapWrap && typeof flapWrap.animate === "function") {
        envelope.classList.add("envelope--js-flap");
        animateFlapOpen(flapWrap);
      }
    });
    
    window.setTimeout(() => {
      intro.classList.add("intro--done");
      showMainContent();
    }, CONTENT_REVEAL_MS);

    window.setTimeout(() => {
      intro.remove();
    }, INTRO_REMOVE_MS);
  }
*/
  bindSealOpen(seal, openInvite);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initIntro);
} else {
  initIntro();
}
