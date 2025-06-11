// مقداردهی اولیه
let starz = parseFloat(localStorage.getItem("starz")) || 0;
let timer = parseFloat(localStorage.getItem("timer")) || 100;
let clicks = parseInt(localStorage.getItem("clicks")) || 0;
let coins = parseInt(localStorage.getItem("coins")) || 0;

// ⭐ قدرت کلیک و هزینه ارتقا
let clickPower = parseFloat(localStorage.getItem("clickPower")) || 0.05;
let clickUpgradeCost = parseFloat(localStorage.getItem("clickUpgradeCost")) || 100;

// 🔋 انرژی و هزینه ارتقا
let energyDuration = parseInt(localStorage.getItem("energyDuration")) || 100;
let energyUpgradeCost = parseFloat(localStorage.getItem("energyUpgradeCost")) || 100;

// نرخ شارژ انرژی
let energyRechargeRate = 100 / energyDuration;

// عناصر صفحه
const display = document.getElementById("starzDisplay");
const button = document.getElementById("mineBtn");
const progressBar = document.getElementById("progressBar");

// بروزرسانی نمای ستاره
function updateDisplay() {
  display.textContent = `⭐ Starz: ${(starz % 1).toFixed(2)} / 1 (Total: ${starz.toFixed(2)})`;
  localStorage.setItem("starz", starz);
}

// بروزرسانی نوار انرژی
function updateTimer() {
  progressBar.style.width = `${timer}%`;
  localStorage.setItem("timer", timer);

  if (timer <= 0) {
    button.disabled = true;
    progressBar.classList.remove("bg-warning");
    progressBar.classList.add("bg-danger");
  } else {
    button.disabled = false;
    progressBar.classList.add("bg-warning");
    progressBar.classList.remove("bg-danger");
  }
}

// شارژ خودکار انرژی
setInterval(() => {
  if (timer < 100) {
    timer += energyRechargeRate;
    if (timer > 100) timer = 100;
    updateTimer();
    console.log("Timer:", timer);
  }
}, 1000);

// ذخیره زمان خروج برای شارژ آفلاین
window.addEventListener("beforeunload", () => {
  localStorage.setItem("lastVisit", Date.now());
});

// شارژ انرژی پس از بازگشت به بازی
window.addEventListener("load", () => {
  const lastVisit = parseInt(localStorage.getItem("lastVisit")) || Date.now();
  const now = Date.now();
  const diffInSeconds = Math.floor((now - lastVisit) / 1000);
  const energyToAdd = diffInSeconds * energyRechargeRate;

  if (timer < 100) {
    timer += energyToAdd;
    if (timer > 100) timer = 100;
    updateTimer();
  }
});

// کلیک برای کسب ستاره
button.addEventListener("click", (e) => {
  if (timer > 0) {
    starz += clickPower;
    timer -= energyRechargeRate;
    if (timer < 0) timer = 0;

    clicks++;
    localStorage.setItem("clicks", clicks);

    updateDisplay();
    updateTimer();

    const centerX = e.clientX;
    const centerY = e.clientY;
    showClickEffect(centerX, centerY, `+${clickPower.toFixed(2)}⭐`);
  }
});

// نمایش افکت کلیک
function showClickEffect(x, y, text) {
  const effect = document.createElement("div");
  effect.className = "click-effect";
  effect.textContent = text;
  effect.style.left = `${x}px`;
  effect.style.top = `${y}px`;

  document.getElementById("clickEffectContainer").appendChild(effect);

  setTimeout(() => {
    effect.remove();
  }, 1000);
}

function updateMainCoinDisplay() {
  coins = parseInt(localStorage.getItem("coins")) || 0;
  document.getElementById("main-coin-count").textContent = `🪙 Coins: ${coins}`;
}

document.getElementById('clickButton').addEventListener('click', () => {
  let clicks = parseInt(localStorage.getItem("clicks")) || 0;
  clicks++;
  localStorage.setItem("clicks", clicks);
  document.getElementById('clickCount').textContent = clicks;
});

// شروع اولیه
updateDisplay();
updateTimer();
updateMainCoinDisplay();

