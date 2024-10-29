class DraftingAssistant {
  constructor() {
    this.resetDraft();

    this.heroData = {
      Martis: {
        strengths: ["Strong in crowd control", "High sustain in fights"],
        weaknesses: ["Vulnerable to burst damage", "Weak against CC heroes"],
        tips: [
          "Use Martis to engage teamfights and disrupt enemies.",
          "Pair with high-damage heroes to maximize his CC effects.",
        ],
        warnings: [
          "Avoid prolonged fights against burst heroes.",
          "Be cautious of heroes with crowd control.",
        ],
      },
      Ling: {
        strengths: ["Highly mobile", "Excellent split push capability"],
        weaknesses: ["Weak against CC", "Resource-dependent (energy)"],
        tips: [
          "Use Ling to pressure side lanes and split push.",
          "Coordinate with your team to secure buffs for Ling.",
        ],
        warnings: [
          "Watch out for crowd control heroes.",
          "Prevent Ling from snowballing by denying jungle resources.",
        ],
      },
    };
    this.banList = [
      "Faramis",
      "Joy",
      "Ling",
      "Valentina",
      "Wanwan",
      "Estes",
      "Kaja",
      "Gloo",
    ];
    this.pickPriority = [
      "Martis",
      "Fredrinn",
      "Beatrix",
      "Lylia",
      "Kaja",
      "Gloo",
      "Valentina",
    ];
    this.heroCounters = {
      Ling: ["Khufra", "Minsitthar", "Chou"],
      Fanny: ["Khufra", "Atlas", "Saber"],
      Wanwan: ["Minsitthar", "Franco", "Phoveus"],
      Valir: ["Lancelot", "Saber", "Karina"],
    };
    this.teamBans = [];
    this.enemyBans = [];
    this.currentPicks = { team: [], enemy: [] };
  }

  // Fungsi reset yang menghapus semua data ban dan pick
  resetDraft() {
    this.teamBans = [];
    this.enemyBans = [];
    this.currentPicks = { team: [], enemy: [] };
  }

  // Menambahkan hero ke daftar ban sesuai tim (tim kita atau musuh)
  banHero(hero, isTeamBan) {
    const targetBanList = isTeamBan ? this.teamBans : this.enemyBans;

    if (
      targetBanList.includes(hero) ||
      this.teamBans.includes(hero) ||
      this.enemyBans.includes(hero)
    ) {
      return `${hero} sudah di-ban.`;
    }

    if (this.banList.includes(hero)) {
      targetBanList.push(hero);
      return `Banned ${hero} untuk ${isTeamBan ? "tim kita" : "musuh"}`;
    }

    return `${hero} tidak ada dalam daftar rekomendasi ban.`;
  }

  // Mendapatkan rekomendasi ban yang belum di-ban oleh kedua tim
  getBanRecommendation() {
    return this.banList
      .filter(
        (hero) =>
          !this.teamBans.includes(hero) && !this.enemyBans.includes(hero)
      )
      .slice(0, 3);
  }

  // Pick hero dengan saran strategi tambahan
  pickHero(hero, isTeamPick) {
    const target = isTeamPick
      ? this.currentPicks.team
      : this.currentPicks.enemy;
    if (
      !target.includes(hero) &&
      !this.currentPicks.team.includes(hero) &&
      !this.currentPicks.enemy.includes(hero)
    ) {
      target.push(hero);
      return {
        message: `${isTeamPick ? "Team" : "Enemy"} picks ${hero}`,
        strategy: this.getHeroStrategy(hero, isTeamPick), // Mengambil strategi
      };
    }
    return {
      message: `${hero} sudah diambil atau tidak tersedia.`,
      strategy: null,
    }; // Kembalikan null jika tidak ada strategi
  }

  // Mendapatkan rekomendasi pick
  getPickRecommendation(isTeamPick) {
    return this.pickPriority
      .filter(
        (hero) =>
          !this.currentPicks.team.includes(hero) &&
          !this.currentPicks.enemy.includes(hero)
      )
      .slice(0, isTeamPick ? 2 : 1); // 2 heroes for team pick, 1 for enemy
  }

  // Mendapatkan counter hero
  getCounter(hero) {
    return this.heroCounters[hero] || ["Tidak ada counter spesifik"];
  }

  // Rekomendasi strategi berdasarkan hero yang dipilih
  getHeroStrategy(hero, isTeam) {
    const heroInfo = this.heroData[hero];
    if (!heroInfo) return `No data available for ${hero}.`;

    return {
      hero,
      strengths: heroInfo.strengths,
      weaknesses: heroInfo.weaknesses,
      tips: isTeam ? heroInfo.tips : [],
      warnings: isTeam ? [] : heroInfo.warnings,
    };
  }
}

module.exports = DraftingAssistant;
