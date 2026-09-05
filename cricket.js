// ==========================================================================
// CRICPRO ULTRA - REAL LIVE FEEDS & CRICAI PREDICTION CHATBOT CONTROLLER
// ==========================================================================

class CricProApp {
  constructor() {
    this.allMatches = [];
    this.liveMatches = [];
    this.upcomingMatches = [];
    this.featuredMatch = null;
    this.currentModalMatch = null;
    this.selectedAiMatchId = null;
    this.currentFilter = 'all';
    this.pollInterval = null;

    this.init();
  }

  async init() {
    await this.fetchMatches();
    this.startLiveScorePolling();
  }

  // ========================================================================
  // 1. DATA FETCHER & POLLER (100% REAL LIVE CRICINFO FEED)
  // ========================================================================
  async fetchApi(url, options = {}) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      console.warn('Cricket API fetch error:', url, e);
      return null;
    }
  }

  async fetchMatches() {
    const data = await this.fetchApi('/api/cricket/matches');
    if (!data || !data.live) return;

    this.liveMatches = data.live || [];
    this.upcomingMatches = data.upcoming || [];
    this.allMatches = [...this.liveMatches, ...this.upcomingMatches];

    document.getElementById('count-all-matches').textContent = this.allMatches.length;
    document.getElementById('count-live-matches').textContent = this.liveMatches.length;
    document.getElementById('count-upcoming-matches').textContent = this.upcomingMatches.length;

    this.updateMarqueeTicker();

    if (this.allMatches.length) {
      if (!this.featuredMatch) {
        this.setFeaturedMatch(this.allMatches[0]);
      }
      this.populateAiMatchDropdown();
    }

    this.renderMatchesGrid();
  }

  updateMarqueeTicker() {
    const marquee = document.getElementById('ticker-marquee');
    if (!marquee || !this.allMatches.length) return;

    const items = this.allMatches.slice(0, 8).map(m => {
      const t1 = m.team1 || {};
      const t2 = m.team2 || {};
      return `<span>🏏 ${t1.name} (${t1.score}) vs ${t2.name} (${t2.score}) — ${m.status_note || m.status}</span>`;
    });

    marquee.innerHTML = items.join(' • ');
  }

  startLiveScorePolling() {
    this.pollInterval = setInterval(() => {
      this.fetchMatches();
    }, 10000);
  }

  // ========================================================================
  // 2. FEATURED HERO ARENA RENDERER
  // ========================================================================
  setFeaturedMatch(m) {
    if (!m) return;
    this.featuredMatch = m;
    const arena = document.getElementById('hero-match-arena');
    if (!arena) return;

    const t1 = m.team1 || {};
    const t2 = m.team2 || {};
    const odds = m.odds || {};
    const isLive = m.status === 'LIVE';

    arena.innerHTML = `
      <div class="hero-match-header">
        <span class="hero-series-name"><i class="fa-solid fa-trophy"></i> ${m.series}</span>
        ${isLive ? '<span class="hero-live-indicator"><i class="fa-solid fa-circle-dot live-pulse"></i> LIVE IN-PLAY</span>' : `<span class="card-badge-status upcoming">${m.status}</span>`}
      </div>

      <div class="hero-scoreboard-grid">
        <div class="hero-team-box">
          <img src="${t1.flag}" class="hero-flag-img" alt="${t1.name}" onerror="this.src='https://flagcdn.com/w80/un.png'">
          <div>
            <div class="hero-team-name">${t1.name}</div>
            <div class="hero-team-score">${t1.score}</div>
          </div>
        </div>

        <div class="hero-vs-badge">VS</div>

        <div class="hero-team-box team2">
          <img src="${t2.flag}" class="hero-flag-img" alt="${t2.name}" onerror="this.src='https://flagcdn.com/w80/un.png'">
          <div>
            <div class="hero-team-name">${t2.name}</div>
            <div class="hero-team-score">${t2.score}</div>
          </div>
        </div>
      </div>

      <div class="hero-status-note">
        <i class="fa-solid fa-satellite-dish"></i> ${m.status_note || 'Live Score Tracked from International Feed'}
      </div>

      <!-- Win Probability Bar -->
      <div class="cric-win-meter-wrap">
        <div class="win-meter-labels">
          <span style="color:var(--cric-cyan)">${t1.short_name}: ${odds.team1_win_pct || 50}% (Odds: ${odds.team1_rate || '1.85'})</span>
          <span style="color:var(--cric-emerald)">${t2.short_name}: ${odds.team2_win_pct || 50}% (Odds: ${odds.team2_rate || '1.85'})</span>
        </div>
        <div class="win-pct-bar">
          <div class="win-pct-team1" style="width: ${odds.team1_win_pct || 50}%"></div>
          <div class="win-pct-team2" style="width: ${odds.team2_win_pct || 50}%"></div>
        </div>
      </div>

      <div class="hero-cta-button-row">
        <button class="cric-btn-hero-action primary" onclick="cric.openAiOracleForMatch('${m.id}')">
          <i class="fa-solid fa-robot"></i> Ask CricAI: Kaun Jitega?
        </button>
        <button class="cric-btn-hero-action" onclick="cric.openMatchModal('${m.id}')">
          <i class="fa-solid fa-chart-pie"></i> Match Odds & Rates
        </button>
      </div>
    `;
  }

  // ========================================================================
  // 3. MATCHES GRID RENDERER
  // ========================================================================
  renderMatchesGrid() {
    const grid = document.getElementById('cric-matches-container');
    if (!grid) return;

    let list = this.allMatches;
    if (this.currentFilter === 'live') list = this.liveMatches;
    else if (this.currentFilter === 'upcoming') list = this.upcomingMatches;

    if (!list.length) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:var(--cric-text-secondary)">No matches in this category right now.</p>';
      return;
    }

    grid.innerHTML = list.map(m => this.createMatchCardHtml(m)).join('');
  }

  createMatchCardHtml(m) {
    const t1 = m.team1 || {};
    const t2 = m.team2 || {};
    const odds = m.odds || {};
    const isLive = m.status === 'LIVE';

    return `
      <div class="cric-match-card" onclick="cric.openMatchModal('${m.id}')">
        <div class="card-top-row">
          <span class="card-series-txt">${m.series}</span>
          <span class="card-badge-status ${m.status.toLowerCase()}">${isLive ? '🔴 LIVE' : m.status}</span>
        </div>

        <div class="card-team-row">
          <div class="card-team-left">
            <img src="${t1.flag}" class="card-team-flag" onerror="this.src='https://flagcdn.com/w80/un.png'">
            <span>${t1.name}</span>
          </div>
          <span class="card-team-score">${t1.score}</span>
        </div>

        <div class="card-team-row">
          <div class="card-team-left">
            <img src="${t2.flag}" class="card-team-flag" onerror="this.src='https://flagcdn.com/w80/un.png'">
            <span>${t2.name}</span>
          </div>
          <span class="card-team-score">${t2.score}</span>
        </div>

        <div class="card-status-note">${m.status_note || 'Live Scorecard'}</div>

        <div class="card-actions-row" onclick="event.stopPropagation()">
          <button class="card-btn-action" onclick="cric.openAiOracleForMatch('${m.id}')">
            <i class="fa-solid fa-robot"></i> Ask CricAI Prediction
          </button>
          <button class="card-btn-action" onclick="cric.openMatchModal('${m.id}')">
            <i class="fa-solid fa-chart-line"></i> Odds: ${odds.team1_rate || '1.80'}
          </button>
        </div>
      </div>
    `;
  }

  filterMatches(filterKey, btnEl = null) {
    this.currentFilter = filterKey;
    document.querySelectorAll('.cric-filter-btn').forEach(btn => btn.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    this.renderMatchesGrid();
  }

  // ========================================================================
  // 4. CRICAI ORACLE MATCH PREDICTOR CHATBOT
  // ========================================================================
  populateAiMatchDropdown() {
    const select = document.getElementById('ai-match-select');
    if (!select) return;

    select.innerHTML = this.allMatches.map(m => `
      <option value="${m.id}" ${this.selectedAiMatchId === m.id ? 'selected' : ''}>${m.match_title} (${m.status})</option>
    `).join('');

    if (!this.selectedAiMatchId && this.allMatches.length) {
      this.selectedAiMatchId = this.allMatches[0].id;
    }
  }

  openAiOracleModal() {
    document.getElementById('cric-ai-modal').classList.add('open');
    this.populateAiMatchDropdown();
  }

  closeAiOracleModal() {
    document.getElementById('cric-ai-modal').classList.remove('open');
  }

  openAiOracleForMatch(matchId) {
    this.selectedAiMatchId = matchId;
    this.openAiOracleModal();
    const select = document.getElementById('ai-match-select');
    if (select) select.value = matchId;
    this.sendPredefinedQuestion('Kaun jitega ye match aur kyu?');
  }

  askAiForCurrentModalMatch() {
    if (this.currentModalMatch) {
      this.closeMatchModal();
      this.openAiOracleForMatch(this.currentModalMatch.id);
    }
  }

  changeAiMatchContext(matchId) {
    this.selectedAiMatchId = matchId;
    this.appendBotMessage(`Switched context to match. Ask me predictions for this match!`);
  }

  async sendPredefinedQuestion(q) {
    await this.processAiQuery(q);
  }

  async handleUserChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('ai-chat-input');
    const q = input.value.trim();
    if (!q) return;
    input.value = '';
    await this.processAiQuery(q);
  }

  async processAiQuery(question) {
    this.appendUserMessage(question);
    
    // Add typing loader
    const typingId = this.appendTypingIndicator();

    const payload = {
      question: question,
      match_id: this.selectedAiMatchId
    };

    const res = await this.fetchApi('/api/cricket/ai-predict', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });

    this.removeTypingIndicator(typingId);

    if (res && res.response) {
      this.appendBotMessage(res.response);
    } else {
      this.appendBotMessage("Apologies, CricAI could not generate prediction right now. Please try again!");
    }
  }

  appendUserMessage(text) {
    const container = document.getElementById('ai-chat-messages');
    const div = document.createElement('div');
    div.className = 'ai-msg user';
    div.innerHTML = `<div class="ai-bubble">${text}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  appendBotMessage(text) {
    const container = document.getElementById('ai-chat-messages');
    const div = document.createElement('div');
    div.className = 'ai-msg bot';
    
    // Format bold and line breaks
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\n/g, '<br>');

    div.innerHTML = `<div class="ai-bubble">${formatted}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  appendTypingIndicator() {
    const container = document.getElementById('ai-chat-messages');
    const id = 'typing_' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'ai-msg bot';
    div.innerHTML = `<div class="ai-bubble"><i class="fa-solid fa-circle-notch fa-spin"></i> CricAI is analyzing live match data & odds...</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
  }

  removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  // ========================================================================
  // 5. MATCH DETAIL MODAL CONTROLLER
  // ========================================================================
  async openMatchModal(matchId) {
    const data = await this.fetchApi(`/api/cricket/match/${matchId}`);
    if (!data) return;

    this.currentModalMatch = data;
    const t1 = data.team1 || {};
    const t2 = data.team2 || {};
    const odds = data.odds || {};

    document.getElementById('modal-series-txt').textContent = data.series || 'Cricket Match';
    document.getElementById('modal-match-title').textContent = data.match_title || 'Match Center';

    document.getElementById('modal-scores-container').innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;background:#0d121c;padding:16px;border-radius:10px;border:1px solid var(--cric-border)">
        <div>
          <h3 style="font-size:16px;color:#fff">${t1.name}</h3>
          <div style="font-size:22px;font-weight:900;color:var(--cric-emerald)">${t1.score}</div>
        </div>
        <div style="font-size:16px;font-weight:900;color:var(--cric-text-muted)">VS</div>
        <div style="text-align:right">
          <h3 style="font-size:16px;color:#fff">${t2.name}</h3>
          <div style="font-size:22px;font-weight:900;color:var(--cric-emerald)">${t2.score}</div>
        </div>
      </div>
      <div style="margin-top:10px;font-size:13px;color:#ffd600;font-weight:700">📢 ${data.status_note}</div>
    `;

    document.getElementById('modal-odds-container').innerHTML = `
      <div class="odds-box-grid" style="margin-top:14px">
        <div class="odds-card">
          <span class="odds-team-lbl">${t1.name} Winner Odds:</span>
          <span class="odds-rate-val">${odds.team1_rate || '1.80'}</span>
          <span style="font-size:12px;color:var(--cric-cyan)">Win Probability: ${odds.team1_win_pct || 50}%</span>
        </div>
        <div class="odds-card">
          <span class="odds-team-lbl">${t2.name} Winner Odds:</span>
          <span class="odds-rate-val">${odds.team2_rate || '2.00'}</span>
          <span style="font-size:12px;color:var(--cric-emerald)">Win Probability: ${odds.team2_win_pct || 50}%</span>
        </div>
      </div>
    `;

    document.getElementById('cric-match-modal').classList.add('open');
  }

  closeMatchModal() {
    document.getElementById('cric-match-modal').classList.remove('open');
  }

  // ========================================================================
  // 6. VIP MODAL & HELPERS
  // ========================================================================
  openVipModal() {
    document.getElementById('cric-vip-modal').classList.add('open');
  }

  closeVipModal() {
    document.getElementById('cric-vip-modal').classList.remove('open');
  }

  openGlobalOdds() {
    if (this.featuredMatch) {
      this.openMatchModal(this.featuredMatch.id);
    }
  }

  switchTab(tabKey, btnEl = null) {
    if (btnEl) {
      document.querySelectorAll('.cric-nav-tab').forEach(t => t.classList.remove('active'));
      btnEl.classList.add('active');
    }
    this.filterMatches(tabKey);
  }

  copyUpiId(upi) {
    navigator.clipboard.writeText(upi);
    this.showToast(`✅ UPI ID "${upi}" Copied! Open GPay / PhonePe to Pay ₹199.`);
  }

  showToast(msg) {
    const t = document.getElementById('cric-toast');
    const txt = document.getElementById('cric-toast-msg');
    if (!t || !txt) return;
    txt.textContent = msg;
    t.style.display = 'flex';
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      t.style.display = 'none';
    }, 3500);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.cric = new CricProApp();
});
