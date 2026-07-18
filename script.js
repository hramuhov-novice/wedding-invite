const WEDDING_DATE = new Date("2026-09-12T14:30:00");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function pad(n) { return String(n).padStart(2, "0"); }

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
function initIntro() {
  const intro = document.getElementById("intro");
  const envelope = document.getElementById("envelope");
  const seal = document.getElementById("seal");

  if (!intro || !envelope || !seal) {
    showMainContent();
    return;
  }

  // Должно совпадать с transition в CSS для .envelope__flap-wrap!
  const FLAP_OPEN_DURATION = 2200; // 2.2s — как в CSS

  let opened = false;

  seal.addEventListener("click", (event) => {
    event.preventDefault();
    if (opened) return;
    opened = true;

    seal.style.opacity = "0";
    seal.style.pointerEvents = "none";

    // Запускаем анимацию крышки
    envelope.classList.add("envelope--opening");

    // Интро начинает гаснуть чуть позже, когда крышка почти открылась
    const introFadeDelay = FLAP_OPEN_DURATION * 0.7; // ~70% анимации
    setTimeout(() => {
      intro.classList.add("intro--opening");
    }, introFadeDelay);

    // Сайт показываем ПОСЛЕ того как крышка открылась + intro fade завершился
    const totalWait = introFadeDelay + 400; // 400ms = длительность fade из CSS intro--opening
    setTimeout(() => {
      showMainContent();
      intro.remove();
    }, totalWait);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initIntro);
} else {
  initIntro();
}
/*курсор только блок
// Ультра-простой клик без лишней логики
function initIntro() {
  const intro = document.getElementById("intro");
  const envelope = document.getElementById("envelope");
  const seal = document.getElementById("seal");

  if (!intro || !envelope || !seal) {
    showMainContent();
    return;
  }

  seal.addEventListener("click", (event) => {
    event.preventDefault();
    
    // 1. Добавляем класс анимации (сработает CSS)
    envelope.classList.add("envelope--opening");
    intro.classList.add("intro--opening");
    seal.style.opacity = "0";
    seal.style.pointerEvents = "none";

    // 2. Через 1.2 секунды открываем сайт и сносим конверт
    setTimeout(() => {
      showMainContent();
      intro.remove();
    }, 1200); 
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initIntro);
} else {
  initIntro();
}
кусок*/
