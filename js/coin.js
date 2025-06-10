// دریافت سکه‌ها از localStorage یا مقدار پیش‌فرض 0
let coins = Number(localStorage.getItem("coins")) || 0;

// آپدیت نمایش سکه‌ها
function updateCoinDisplay() {
  const coinEl = document.getElementById("coin-count");
  if (coinEl) coinEl.textContent = coins;
}

// ذخیره سکه‌ها
function saveCoins() {
  localStorage.setItem("coins", coins);
}

// بارگذاری وضعیت کانال‌ها
function loadChannelsStatus() {
  document.querySelectorAll(".channel").forEach(channel => {
    const id = channel.getAttribute("data-id");
    const joinTime = Number(localStorage.getItem(`joined_${id}`));
    const claimed = localStorage.getItem(`claimed_${id}`) === "true";

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const joined = joinTime && (now - joinTime < oneDay);

    const joinBtn = channel.querySelector(".join-btn");
    const claimBtn = channel.querySelector(".claim-btn");
    const statusSpan = channel.querySelector(".status");

    if (claimed) {
      joinBtn.style.display = "none";
      claimBtn.style.display = "none";
      statusSpan.textContent = "Reward claimed! 🎉";
      statusSpan.className = "status claimed";
    } else if (joined) {
      joinBtn.style.display = "none";
      claimBtn.style.display = "inline-block";
      statusSpan.textContent = "You joined the channel. Claim your coins!";
      statusSpan.className = "status joined";
    } else {
      joinBtn.style.display = "inline-block";
      claimBtn.style.display = "none";
      statusSpan.textContent = "Please join the channel first.";
      statusSpan.className = "status not-joined";
    }
  });
}

// دکمه "من جوین شدم"
function joinChannel(id) {
  const now = Date.now();
  localStorage.setItem(`joined_${id}`, now.toString());
  loadChannelsStatus();
}

// دکمه "دریافت سکه"
function claimCoins(id) {
  if (localStorage.getItem(`claimed_${id}`) === "true") {
    alert("You already claimed this reward.");
    return;
  }

  const joinTime = Number(localStorage.getItem(`joined_${id}`));
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  if (!joinTime || (now - joinTime > oneDay)) {
    alert("The join time expired. Please join again.");
    localStorage.removeItem(`joined_${id}`);
    loadChannelsStatus();
    return;
  }

  coins += 100;
  saveCoins();
  updateCoinDisplay();
  localStorage.setItem(`claimed_${id}`, "true");
  alert("You have received 100 coins!");
  loadChannelsStatus();
}

// وقتی صفحه لود شد
document.addEventListener("DOMContentLoaded", () => {
  updateCoinDisplay();
  loadChannelsStatus();

  document.querySelectorAll(".channel").forEach(channel => {
    const id = channel.getAttribute("data-id");

    const joinBtn = channel.querySelector(".join-btn");
    const claimBtn = channel.querySelector(".claim-btn");

    joinBtn.addEventListener("click", () => joinChannel(id));
    claimBtn.addEventListener("click", () => claimCoins(id));
  });
});
