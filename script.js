const apiUrl = "http://localhost:3000";

// Mendapatkan rekomendasi ban
async function getBanRecommendations() {
  const response = await fetch(`${apiUrl}/recommend-ban`);
  const data = await response.json();
  const banRecommendations = document.getElementById("ban-recommendations");
  banRecommendations.innerHTML = data.recommendations
    .map((hero) => `<div class="hero-item">${hero}</div>`)
    .join("");
}

// Melakukan ban hero
async function banHero(isTeamBan) {
  const hero = document.getElementById("ban-hero").value;
  const response = await fetch(`${apiUrl}/ban-hero`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hero, isTeamBan }),
  });
  const data = await response.json();
  document.getElementById("team-bans").innerText = data.teamBans.join(", ");
  document.getElementById("enemy-bans").innerText = data.enemyBans.join(", ");
  getBanRecommendations();
  document.getElementById("ban-hero").value = ""; // Clear input
}

// Mendapatkan rekomendasi pick
async function getPickRecommendations(isTeamPick) {
  const response = await fetch(
    `${apiUrl}/recommend-pick?isTeamPick=${isTeamPick}`
  );
  const data = await response.json();
  const pickRecommendations = document.getElementById("pick-recommendations");
  pickRecommendations.innerHTML = data.recommendations
    .map((hero) => `<div class="hero-item">${hero}</div>`)
    .join("");
}

// Melakukan pick hero
async function pickHero(isTeamPick) {
  const hero = document.getElementById("pick-hero").value;
  const response = await fetch(`${apiUrl}/pick-hero`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hero, isTeamPick }),
  });
  const data = await response.json();

  document.getElementById("team-picks").innerText =
    data.currentPicks.team.join(", ");
  document.getElementById("enemy-picks").innerText =
    data.currentPicks.enemy.join(", ");

  // Tampilkan strategi hero
  displayHeroStrategy(data.strategy);
  getPickRecommendations(isTeamPick); // Refresh rekomendasi pick setelah pick
  document.getElementById("pick-hero").value = ""; // Clear input
}

function displayHeroStrategy(strategy) {
  const strategyContainer = document.getElementById("hero-strategy-content");
  if (strategy) {
    strategyContainer.innerHTML = `
            <h3>Strategy for ${strategy.hero}</h3>
            <p><strong>Strengths:</strong> ${strategy.strengths.join(", ")}</p>
            <p><strong>Weaknesses:</strong> ${strategy.weaknesses.join(
              ", "
            )}</p>
            ${
              strategy.tips.length
                ? `<p><strong>Tips:</strong> ${strategy.tips.join(", ")}</p>`
                : ""
            }
            ${
              strategy.warnings.length
                ? `<p><strong>Warnings:</strong> ${strategy.warnings.join(
                    ", "
                  )}</p>`
                : ""
            }
        `;
  } else {
    strategyContainer.innerHTML = "<p>No strategy available for this hero.</p>";
  }
}

// Mendapatkan counter hero
async function getCounter() {
  const hero = document.getElementById("counter-hero").value;
  const response = await fetch(`${apiUrl}/counter-hero?hero=${hero}`);
  const data = await response.json();
  document.getElementById(
    "counter-result"
  ).innerText = `Counters for ${hero}: ${data.counters.join(", ")}`;
  document.getElementById("counter-hero").value = ""; // Clear input
}

async function resetDraft() {
  const response = await fetch(`${apiUrl}/reset`, {
    method: "POST",
  });
  const data = await response.json();
  alert(data.message); // Notifikasi setelah reset berhasil

  // Kosongkan tampilan bans dan picks
  document.getElementById("team-bans").innerText = "";
  document.getElementById("enemy-bans").innerText = "";
  document.getElementById("team-picks").innerText = "";
  document.getElementById("enemy-picks").innerText = "";
  document.getElementById("hero-strategy").innerHTML = "";
  document.getElementById("counter-result").innerText = "";

  // Muat ulang rekomendasi ban dan pick
  getBanRecommendations();
  getPickRecommendations(true);
}

// Memuat rekomendasi ban dan pick saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  getBanRecommendations();
  getPickRecommendations(true); // Rekomendasi pick untuk tim
});
