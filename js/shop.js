// خواندن مقدار استارز از localStorage با کلید "starz"
let starz = parseFloat(localStorage.getItem("starz")) || 0;

const starzBalanceEl = document.getElementById("starzBalance");
const coinsContainer = document.getElementById("coinsContainer");
const premiumContainer = document.getElementById("premiumContainer");

// نرخ تبدیل ثابت: 1 دلار = 50 استارز
const STARZ_PER_USD = 50;

// دیتا کوین‌ها با قیمت بر حسب استارز
const coins = [
  { name: "Ton Coin", symbol: "TON", priceInStarz: 1000 },
  { name: "Tether", symbol: "USDT", priceInStarz: 2500 },
  { name: "Tron", symbol: "TRX", priceInStarz: 500 },
];

// گزینه‌های اشتراک پرمیوم به دلار
const premiumOptionsUSD = [
  { duration: "3 months", priceUSD: 10 },
  { duration: "6 months", priceUSD: 18 },
  { duration: "1 year", priceUSD: 30 },
];

// تبدیل قیمت پرمیوم از دلار به استارز
const premiumOptionsStarz = premiumOptionsUSD.map((option) => ({
  ...option,
  priceStarz: option.priceUSD * STARZ_PER_USD,
}));

function updateStarzDisplay() {
  starzBalanceEl.textContent = starz.toFixed(2);
  // ذخیره مقدار به صورت رشته در localStorage
  localStorage.setItem("starz", starz.toFixed(2));
}

function renderCoins() {
  coinsContainer.innerHTML = "";
  coins.forEach((coin, i) => {
    const card = document.createElement("div");
    card.className = "col-12 col-md-4";

    card.innerHTML = `
      <div class="card p-3 text-center bg-secondary text-light">
        <h5>${coin.name} (${coin.symbol})</h5>
        <p>Price: ${coin.priceInStarz.toLocaleString()} Starz</p>
        <button class="btn btn-warning buyCoinBtn" data-index="${i}" ${starz < coin.priceInStarz ? "disabled" : ""}>
          Buy
        </button>
      </div>
    `;
    coinsContainer.appendChild(card);
  });
}

function renderPremiumOptions() {
  premiumContainer.innerHTML = "";
  premiumOptionsStarz.forEach((option, i) => {
    const card = document.createElement("div");
    card.className = "col-12 col-md-4";

    card.innerHTML = `
      <div class="card p-3 text-center bg-secondary text-light">
        <h5>Premium - ${option.duration}</h5>
        <p>Price: $${option.priceUSD} (~${option.priceStarz.toLocaleString()} Starz)</p>
        <button class="btn btn-warning buyPremiumBtn" data-index="${i}" ${starz < option.priceStarz ? "disabled" : ""}>
          Buy Premium
        </button>
      </div>
    `;
    premiumContainer.appendChild(card);
  });
}

// رویداد کلیک روی دکمه خرید کوین‌ها
coinsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("buyCoinBtn")) {
    const index = e.target.dataset.index;
    const coin = coins[index];
    if (starz >= coin.priceInStarz) {
      starz -= coin.priceInStarz;
      updateStarzDisplay();
      renderCoins();
      renderPremiumOptions();
      alert(`Successfully bought ${coin.name}!`);
    } else {
      alert("Insufficient Starz!");
    }
  }
});

// رویداد کلیک روی دکمه خرید پرمیوم
premiumContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("buyPremiumBtn")) {
    const index = e.target.dataset.index;
    const option = premiumOptionsStarz[index];
    if (starz >= option.priceStarz) {
      starz -= option.priceStarz;
      updateStarzDisplay();
      renderCoins();
      renderPremiumOptions();
      alert(`Premium subscription (${option.duration}) purchased successfully!`);
      // TODO: منطق فعال سازی پرمیوم اینجا قرار بگیره
    } else {
      alert("Insufficient Starz!");
    }
  }
});


// اولین بار صفحه بارگذاری شد، نمایش مقدار استارز و رندر موارد
updateStarzDisplay();
renderCoins();
renderPremiumOptions();

window.addEventListener("load", () => {
  const lastVisit = parseInt(localStorage.getItem("lastVisit")) || Date.now();
  const now = Date.now();
  const diffInSeconds = Math.floor((now - lastVisit) / 1000);

  const energyRechargeRate = 0.1;
  let timer = parseFloat(localStorage.getItem("energyTimer")) || 100;

  const energyToAdd = diffInSeconds * energyRechargeRate;
  if (timer < 100) {
    timer += energyToAdd;
    if (timer > 100) timer = 100;
    localStorage.setItem("energyTimer", timer);
  }

  // نمایش انرژی روی صفحه اگر المان energyDisplay وجود داشته باشد
  const energyDisplay = document.getElementById("energyDisplay");
  if (energyDisplay) {
    energyDisplay.textContent = `Energy: ${Math.floor(timer)}`;
  }

  // ذخیره زمان آخرین بازدید
  localStorage.setItem("lastVisit", now);
});
