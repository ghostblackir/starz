let starz = parseFloat(localStorage.getItem("starz")) || 0;
let coins = parseInt(localStorage.getItem("coins")) || 0;
let currentChannel = null;

function updateDisplay() {
  document.getElementById('starzDisplay').textContent = starz;
  document.getElementById('coinsDisplay').textContent = coins;
}

function openChannel(channelName) {
  if (localStorage.getItem(`joinedChannel_${channelName}`)) {
    alert(`❌ You already claimed for @${channelName}`);
    return;
  }

  currentChannel = channelName;
  window.open(`https://t.me/${channelName}`, '_blank');
  document.getElementById('confirmSection').style.display = 'block';
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('confirmBtn').addEventListener('click', () => {
    if (!currentChannel) return;

    starz += 100;
    localStorage.setItem("starz", starz);
    localStorage.setItem(`joinedChannel_${currentChannel}`, "true");

    alert(`🎉 You earned 100 Starz for joining @${currentChannel}!`);

    currentChannel = null;
    document.getElementById('confirmSection').style.display = 'none';
    updateDisplay();
  });

  document.getElementById('cancelBtn').addEventListener('click', () => {
    currentChannel = null;
    document.getElementById('confirmSection').style.display = 'none';
  });

  updateDisplay();
});

function claimClickReward() {
  const today = new Date().toDateString();
  const lastClickClaim = localStorage.getItem("clickRewardDate");
  let clicks = parseInt(localStorage.getItem("clicks")) || 0;

  if (clicks >= 50 && clicks <= 100 && lastClickClaim !== today) {
    const reward = Math.floor(Math.random() * 11) + 50;
    coins += reward;
    localStorage.setItem("coins", coins);
    localStorage.setItem("clickRewardDate", today);
    alert(`🎁 You earned ${reward} coins!`);
    updateDisplay();
  } else if (lastClickClaim === today) {
    alert("✅ You've already claimed today's click reward.");
  } else {
    alert("❌ You need 50 - 100 clicks today to claim this reward.");
  }
}

function claimDailyCoin() {
  const today = new Date().toDateString();
  const lastDaily = localStorage.getItem("dailyCoinDate");

  if (lastDaily !== today) {
    const dailyCoins = Math.floor(Math.random() * 6) + 25;
    coins += dailyCoins;
    localStorage.setItem("coins", coins);
    localStorage.setItem("dailyCoinDate", today);
    alert(`✨ You got ${dailyCoins} daily coins!`);
    updateDisplay();
  } else {
    alert("⏳ You've already claimed your daily coin today.");
  }
}

document.getElementById('clickButton').addEventListener('click', () => {
  let clicks = parseInt(localStorage.getItem("clicks")) || 0;
  clicks++;
  localStorage.setItem("clicks", clicks);
  document.getElementById('clickCount').textContent = clicks;
});
