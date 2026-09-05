// ==========================================================================
// CINEMA ULTRA - NETFLIX STREAMING ENGINE & MULTI-LANGUAGE CONTROLLER
// ==========================================================================

class CinemaUltraApp {
  constructor() {
    this.billboards = [];
    this.catalogs = {};
    this.currentHeroIndex = 0;
    this.currentHeroMovie = null;
    this.currentModalMovie = null;
    this.currentPlayingMovie = null;
    this.currentStreams = [];
    this.currentServerIdx = 0;
    this.currentSeason = 1;
    this.currentEpisode = 1;
    this.watchlist = JSON.parse(localStorage.getItem('cinema_watchlist') || '[]');
    
    this.init();
  }

  async init() {
    this.renderWatchlistCount();
    await this.loadCatalog();
    this.setupEventListeners();
    this.startBillboardRotation();
  }

  // ========================================================================
  // 1. API DATA LOADER
  // ========================================================================
  async fetchApi(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('Fetch error:', url, e);
      return null;
    }
  }

  async loadCatalog() {
    const data = await this.fetchApi('/api/movies/catalog');
    if (!data) return;

    this.billboards = data.billboards || [];
    this.catalogs = data.catalogs || {};

    if (this.billboards.length) {
      this.setHeroBillboard(this.billboards[0]);
    }

    this.renderAllShelves();
  }

  // ========================================================================
  // 2. HERO BILLBOARD
  // ========================================================================
  setHeroBillboard(movie) {
    if (!movie) return;
    this.currentHeroMovie = movie;

    const bgImg = document.getElementById('hero-backdrop-img');
    const title = document.getElementById('hero-title');
    const rating = document.getElementById('hero-rating');
    const year = document.getElementById('hero-year');
    const langBadge = document.getElementById('hero-lang-badge');
    const genres = document.getElementById('hero-genres');
    const overview = document.getElementById('hero-overview');
    const wBtn = document.getElementById('btn-hero-watchlist');

    if (bgImg) bgImg.src = movie.backdrop || movie.poster;
    if (title) title.textContent = movie.title;
    if (rating) rating.textContent = movie.rating || '7.8';
    if (year) year.textContent = movie.year || '2024';
    if (langBadge) langBadge.textContent = movie.languages ? movie.languages.split(',')[0] : 'Multi-Audio';
    if (genres) genres.textContent = movie.genre || 'Action &bull; Blockbuster';
    if (overview) overview.textContent = movie.overview || '';

    if (wBtn) {
      const isSaved = this.isMovieInWatchlist(movie.id);
      wBtn.innerHTML = isSaved ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-plus"></i>';
    }
  }

  startBillboardRotation() {
    setInterval(() => {
      if (this.billboards.length > 1) {
        this.currentHeroIndex = (this.currentHeroIndex + 1) % this.billboards.length;
        this.setHeroBillboard(this.billboards[this.currentHeroIndex]);
      }
    }, 14000);
  }

  playHeroMovie() {
    if (this.currentHeroMovie) {
      this.playMovie(this.currentHeroMovie.id, this.currentHeroMovie.title, this.currentHeroMovie.type === 'series');
    }
  }

  openHeroInfo() {
    if (this.currentHeroMovie) {
      this.openDetailModal(this.currentHeroMovie.id);
    }
  }

  toggleHeroWatchlist() {
    if (this.currentHeroMovie) {
      this.toggleWatchlist(this.currentHeroMovie);
      this.setHeroBillboard(this.currentHeroMovie);
    }
  }

  // ========================================================================
  // 3. SHELVES RENDERER
  // ========================================================================
  renderAllShelves() {
    for (const [shelfKey, movies] of Object.entries(this.catalogs)) {
      const row = document.getElementById(`row-${shelfKey}`);
      if (!row) continue;

      row.innerHTML = movies.map(m => this.createMovieCardHtml(m)).join('');
    }
  }

  createMovieCardHtml(movie) {
    const isSeries = movie.type === 'series';

    return `
      <div class="cinema-card" onclick="cinema.openDetailModal('${movie.id}')">
        <div class="cinema-card-poster-wrap">
          <img src="${movie.poster}" alt="${movie.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=300'">
          <div class="cinema-card-badge-rating">
            <i class="fa-solid fa-star"></i> ${movie.rating || '7.8'}
          </div>
          ${isSeries ? '<div class="cinema-card-badge-series">SERIES</div>' : ''}
          <div class="cinema-card-play-hover-btn">
            <i class="fa-solid fa-play"></i>
          </div>
        </div>
        <div class="cinema-card-info">
          <div class="cinema-card-title">${movie.title}</div>
          <div class="cinema-card-meta">
            <span>${movie.year || '2024'}</span>
            <span class="cinema-card-genre">${(movie.genre || 'Movie').split(',')[0]}</span>
          </div>
        </div>
      </div>
    `;
  }

  // ========================================================================
  // 4. CATEGORY FILTER
  // ========================================================================
  filterCategory(catKey, btnEl = null) {
    document.querySelectorAll('.cinema-nav-link, .cinema-pill-btn, .cinema-mob-tab').forEach(el => {
      if (el.getAttribute('data-cat') === catKey || el.getAttribute('data-view') === catKey) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    this.switchView('home');

    const shelves = document.querySelectorAll('.cinema-shelf-section');
    shelves.forEach(sec => {
      if (catKey === 'all') {
        sec.style.display = 'flex';
      } else {
        sec.style.display = (sec.id === `shelf-${catKey}`) ? 'flex' : 'none';
      }
    });

    if (catKey !== 'all') {
      const targetShelf = document.getElementById(`shelf-${catKey}`);
      if (targetShelf) {
        targetShelf.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // ========================================================================
  // 5. DETAIL MODAL
  // ========================================================================
  async openDetailModal(imdbId) {
    const modal = document.getElementById('movie-detail-modal');
    modal.classList.add('open');

    const movie = await this.fetchApi(`/api/movies/detail/${imdbId}`);
    if (!movie) return;

    this.currentModalMovie = movie;

    document.getElementById('modal-backdrop-img').src = movie.backdrop || movie.poster;
    document.getElementById('modal-movie-title').textContent = movie.title;
    document.getElementById('modal-rating').textContent = movie.rating || '7.8';
    document.getElementById('modal-year').textContent = movie.year || '2024';
    document.getElementById('modal-runtime').textContent = movie.runtime || '2h 10m';
    document.getElementById('modal-lang-tag').textContent = movie.languages ? movie.languages.split(',')[0] : 'Multi-Audio';
    document.getElementById('modal-overview').textContent = movie.overview || 'Enjoy high-speed 1080p full movie streaming.';
    document.getElementById('modal-cast').textContent = movie.cast || 'Star Cast';
    document.getElementById('modal-director').textContent = movie.director || 'Director';
    document.getElementById('modal-languages').textContent = movie.languages || 'Hindi, English, Punjabi, Multi-Subtitles';

    const wBtn = document.getElementById('btn-modal-watchlist');
    const isSaved = this.isMovieInWatchlist(movie.id);
    wBtn.innerHTML = isSaved ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-plus"></i>';
  }

  closeDetailModal() {
    document.getElementById('movie-detail-modal').classList.remove('open');
  }

  playCurrentModalMovie() {
    if (this.currentModalMovie) {
      const isSeries = this.currentModalMovie.type === 'series';
      this.closeDetailModal();
      this.playMovie(this.currentModalMovie.id, this.currentModalMovie.title, isSeries);
    }
  }

  toggleCurrentModalWatchlist() {
    if (this.currentModalMovie) {
      this.toggleWatchlist(this.currentModalMovie);
      const wBtn = document.getElementById('btn-modal-watchlist');
      const isSaved = this.isMovieInWatchlist(this.currentModalMovie.id);
      wBtn.innerHTML = isSaved ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-plus"></i>';
    }
  }

  // ========================================================================
  // 6. NETFLIX FULL STREAMING PLAYER ENGINE
  // ========================================================================
  async playMovie(imdbId, title = 'Movie', isSeries = false, season = 1, episode = 1) {
    const playerModal = document.getElementById('cinema-player-modal');
    const playerTitle = document.getElementById('player-movie-title');
    const iframe = document.getElementById('cinema-video-iframe');
    const select = document.getElementById('player-server-select');
    const seriesControls = document.getElementById('player-series-controls');

    this.currentPlayingMovie = { id: imdbId, title, isSeries };
    this.currentSeason = season;
    this.currentEpisode = episode;

    playerTitle.textContent = isSeries ? `${title} (S${season}:E${episode})` : title;
    playerModal.classList.add('open');
    this.showToast(`▶ Loading 1080p Ultra HD: "${title}"`);

    // Setup Series UI if TV Show
    if (isSeries) {
      seriesControls.style.display = 'flex';
      this.renderSeasonEpisodeSelectors(imdbId, season, episode);
    } else {
      seriesControls.style.display = 'none';
    }

    // Fetch live stream nodes
    const movieData = await this.fetchApi(`/api/movies/detail/${imdbId}?season=${season}&episode=${episode}`);
    if (movieData && movieData.streams && movieData.streams.length) {
      this.currentStreams = movieData.streams;
    } else {
      this.currentStreams = [
        {
          name: "⚡ Server 1: Netflix VIP HD (Multi-Language)",
          url: isSeries ? `https://vidsrc.net/embed/tv/${imdbId}/${season}/${episode}` : `https://vidsrc.net/embed/movie/${imdbId}`
        },
        {
          name: "🚀 Server 2: VidSrc Pro 1080p",
          url: isSeries ? `https://vidsrc.xyz/embed/tv?imdb=${imdbId}&season=${season}&episode=${episode}` : `https://vidsrc.xyz/embed/movie?imdb=${imdbId}`
        },
        {
          name: "💎 Server 3: AutoEmbed VIP",
          url: isSeries ? `https://player.autoembed.cc/embed/tv/${imdbId}/${season}/${episode}` : `https://player.autoembed.cc/embed/movie/${imdbId}`
        },
        {
          name: "🌐 Server 4: 2Embed Global Mirror",
          url: isSeries ? `https://www.2embed.cc/embedtv/${imdbId}&s=${season}&e=${episode}` : `https://www.2embed.cc/embed/${imdbId}`
        }
      ];
    }

    select.innerHTML = this.currentStreams.map((s, idx) => `
      <option value="${idx}">${s.name}</option>
    `).join('');

    this.currentServerIdx = 0;
    select.value = '0';

    iframe.src = this.currentStreams[0].url;
  }

  renderSeasonEpisodeSelectors(imdbId, activeSeason, activeEpisode) {
    const sSelect = document.getElementById('player-season-select');
    const eSelect = document.getElementById('player-episode-select');

    // Populate seasons (1 to 4)
    sSelect.innerHTML = [1, 2, 3, 4].map(s => `
      <option value="${s}" ${s === activeSeason ? 'selected' : ''}>Season ${s}</option>
    `).join('');

    // Populate episodes (1 to 10)
    eSelect.innerHTML = Array.from({length: 10}, (_, i) => i + 1).map(e => `
      <option value="${e}" ${e === activeEpisode ? 'selected' : ''}>Episode ${e}</option>
    `).join('');
  }

  changeSeason(val) {
    this.currentSeason = parseInt(val);
    if (this.currentPlayingMovie) {
      this.playMovie(this.currentPlayingMovie.id, this.currentPlayingMovie.title, true, this.currentSeason, 1);
    }
  }

  changeEpisode(val) {
    this.currentEpisode = parseInt(val);
    if (this.currentPlayingMovie) {
      this.playMovie(this.currentPlayingMovie.id, this.currentPlayingMovie.title, true, this.currentSeason, this.currentEpisode);
    }
  }

  changePlayerServer(serverIdx) {
    const idx = parseInt(serverIdx);
    if (!this.currentStreams || !this.currentStreams[idx]) return;

    this.currentServerIdx = idx;
    const iframe = document.getElementById('cinema-video-iframe');
    iframe.src = this.currentStreams[idx].url;
    this.showToast(`Switched to Server ${idx + 1}`);
  }

  cycleNextServer() {
    if (!this.currentStreams || !this.currentStreams.length) return;
    const nextIdx = (this.currentServerIdx + 1) % this.currentStreams.length;
    document.getElementById('player-server-select').value = nextIdx;
    this.changePlayerServer(nextIdx);
  }

  openInExternalTab() {
    if (this.currentStreams && this.currentStreams[this.currentServerIdx]) {
      const activeUrl = this.currentStreams[this.currentServerIdx].url;
      window.open(activeUrl, '_blank');
      this.showToast('🚀 Opened in Full Player Window!');
    }
  }

  closePlayerModal() {
    const playerModal = document.getElementById('cinema-player-modal');
    const iframe = document.getElementById('cinema-video-iframe');
    iframe.src = '';
    playerModal.classList.remove('open');
  }

  togglePlayerFullscreen() {
    const iframeFrame = document.querySelector('.cinema-iframe-frame');
    if (!document.fullscreenElement) {
      if (iframeFrame.requestFullscreen) {
        iframeFrame.requestFullscreen();
      } else if (iframeFrame.webkitRequestFullscreen) {
        iframeFrame.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // ========================================================================
  // 7. SEARCH CONTROLLER
  // ========================================================================
  async handleSearch(query) {
    const q = query.trim();
    if (!q) {
      this.closeSearch();
      return;
    }

    this.switchView('search');
    document.getElementById('search-query-display').textContent = q;
    document.getElementById('cinema-search-clear').style.display = 'block';

    const grid = document.getElementById('cinema-search-grid');
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-sub)">Searching movie & series database...</p>';

    const results = await this.fetchApi(`/api/movies/search?q=${encodeURIComponent(q)}`);
    if (!results || !results.length) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-sub)">No movies or series found.</p>';
      return;
    }

    grid.innerHTML = results.map(m => this.createMovieCardHtml(m)).join('');
  }

  clearSearch() {
    const input = document.getElementById('cinema-search-input');
    input.value = '';
    document.getElementById('cinema-search-clear').style.display = 'none';
    this.closeSearch();
  }

  closeSearch() {
    this.switchView('home');
  }

  focusSearchMobile() {
    this.switchView('search');
    const input = document.getElementById('cinema-search-input');
    input.focus();
  }

  // ========================================================================
  // 8. WATCHLIST / MY LIST
  // ========================================================================
  isMovieInWatchlist(id) {
    return this.watchlist.some(m => m.id === id);
  }

  toggleWatchlist(movie) {
    if (!movie) return;
    const idx = this.watchlist.findIndex(m => m.id === movie.id);
    if (idx > -1) {
      this.watchlist.splice(idx, 1);
      this.showToast(`Removed from My List`);
    } else {
      this.watchlist.unshift({
        id: movie.id,
        title: movie.title,
        year: movie.year,
        poster: movie.poster,
        rating: movie.rating,
        genre: movie.genre,
        type: movie.type
      });
      this.showToast(`Added to My List ❤️`);
    }

    localStorage.setItem('cinema_watchlist', JSON.stringify(this.watchlist));
    this.renderWatchlistCount();
    this.renderWatchlistView();
  }

  renderWatchlistCount() {
    const count = this.watchlist.length;
    const countTxt = document.getElementById('watchlist-count-txt');
    if (countTxt) countTxt.textContent = `${count}`;
  }

  renderWatchlistView() {
    const grid = document.getElementById('cinema-watchlist-grid');
    if (!grid) return;

    if (!this.watchlist.length) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-sub)">Your watchlist is empty. Add movies using the + button!</p>';
      return;
    }

    grid.innerHTML = this.watchlist.map(m => this.createMovieCardHtml(m)).join('');
  }

  // ========================================================================
  // 9. VIEW SWITCHER
  // ========================================================================
  switchView(viewName) {
    const mainShelves = document.getElementById('cinema-shelves-container');
    const heroBillboard = document.getElementById('cinema-hero-billboard');
    const searchView = document.getElementById('cinema-search-view');
    const watchlistView = document.getElementById('cinema-watchlist-view');

    document.querySelectorAll('.cinema-mob-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-view') === viewName);
    });

    if (viewName === 'home') {
      mainShelves.style.display = 'flex';
      heroBillboard.style.display = 'flex';
      searchView.style.display = 'none';
      watchlistView.style.display = 'none';
    } else if (viewName === 'search') {
      mainShelves.style.display = 'none';
      heroBillboard.style.display = 'none';
      searchView.style.display = 'block';
      watchlistView.style.display = 'none';
    } else if (viewName === 'watchlist') {
      mainShelves.style.display = 'none';
      heroBillboard.style.display = 'none';
      searchView.style.display = 'none';
      watchlistView.style.display = 'block';
      this.renderWatchlistView();
    }
  }

  showToast(msg) {
    const t = document.getElementById('cinema-toast');
    const txt = document.getElementById('cinema-toast-msg');
    if (!t || !txt) return;
    txt.textContent = msg;
    t.style.display = 'flex';
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      t.style.display = 'none';
    }, 3000);
  }

  // ========================================================================
  // 10. EVENT LISTENERS
  // ========================================================================
  setupEventListeners() {
    let searchDebounce;
    const searchInput = document.getElementById('cinema-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
          this.handleSearch(e.target.value);
        }, 350);
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDetailModal();
        this.closePlayerModal();
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.cinema = new CinemaUltraApp();
});
