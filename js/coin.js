let starz = parseFloat(localStorage.getItem("starz")) || 0;

// نمایش Starz فعلی در console
console.log(`Your current Starz: ${starz}`);

// تابع برای بروزرسانی نمایش Starz روی صفحه (اگر بخوای روی صفحه نمایش بدی)
function updateStarzDisplay() {
  const starzDisplay = document.getElementById("starzDisplay");
  if (starzDisplay) {
    starzDisplay.textContent = `Starz: ${Math.floor(starz)}`;
  }
}

// تابع برای بروزرسانی وضعیت دکمه‌های Claim تلگرام (کمرنگ/پررنگ)
function updateClaimButtons() {
  const claimButtons = document.querySelectorAll('button.btn-outline-light');
  claimButtons.forEach((btn, index) => {
    const key = `telegram_joined_${index + 1}`;
    const claimed = localStorage.getItem(key);
    if (claimed === new Date().toLocaleDateString()) {
      btn.classList.remove('btn-outline-light');
      btn.classList.add('btn-warning'); // رنگ پررنگ
      btn.disabled = true;
      btn.textContent = 'Claimed';
    } else {
      btn.classList.add('btn-outline-light');
      btn.classList.remove('btn-warning');
      btn.disabled = false;
      btn.textContent = 'Claim';
    }
  });

  // برای دکمه گروه تلگرام
  const groupBtn = document.querySelector('button[onclick="claimTelegramReward(\'group\')"]');
  const groupClaimed = localStorage.getItem('telegram_group_joined');
  if (groupBtn) {
    if (groupClaimed === new Date().toLocaleDateString()) {
      groupBtn.classList.remove('btn-outline-light');
      groupBtn.classList.add('btn-primary');
      groupBtn.disabled = true;
      groupBtn.textContent = 'Claimed';
    } else {
      groupBtn.classList.add('btn-outline-light');
      groupBtn.classList.remove('btn-primary');
      groupBtn.disabled = false;
      groupBtn.textContent = 'Claim';
    }
  }
}

// Daily Reward
document.getElementById("dailyBtn").addEventListener("click", () => {
  const last = localStorage.getItem("daily_reward");
  const today = new Date().toLocaleDateString();

  if (last === today) {
    document.getElementById("dailyStatus").textContent = "You already claimed your reward today!";
  } else {
    starz += 5;
    localStorage.setItem("starz", starz);
    localStorage.setItem("daily_reward", today);
    document.getElementById("dailyStatus").textContent = "+5 Starz added to your account!";
    updateStarzDisplay();
  }
});

// Daily Challenge
document.getElementById("challengeBtn").addEventListener("click", () => {
  const clicks = parseInt(localStorage.getItem("clicks")) || 0;
  const claimed = localStorage.getItem("challenge_claimed");
  const today = new Date().toLocaleDateString();

  if (claimed === today) {
    document.getElementById("challengeStatus").textContent = "You already claimed this challenge today!";
  } else if (clicks >= 50) {
    starz += 10;
    localStorage.setItem("starz", starz);
    localStorage.setItem("challenge_claimed", today);
    document.getElementById("challengeStatus").textContent = "+10 Starz for completing the challenge!";
    updateStarzDisplay();
  } else {
    document.getElementById("challengeStatus").textContent = `You need ${50 - clicks} more clicks to claim.`;
  }
});

// Telegram Channel or Group Claim
function claimTelegramReward(id) {
  const today = new Date().toLocaleDateString();
  const key = (typeof id === 'number') ? `telegram_joined_${id}` : `telegram_group_joined`;
  const statusId = (typeof id === 'number') ? "telegramStatus" : "groupStatus";

  const already = localStorage.getItem(key);
  if (already === today) {
    document.getElementById(statusId).textContent = "You already claimed today!";
  } else {
    starz += 100;
    localStorage.setItem("starz", starz);
    localStorage.setItem(key, today);
    document.getElementById(statusId).textContent = "+100 Starz added!";
    updateStarzDisplay();
    updateClaimButtons();
  }
}

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

  // بروزرسانی وضعیت دکمه‌های Claim و نمایش Starz
  updateClaimButtons();
  updateStarzDisplay();
});
