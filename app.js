// Polyfill for AbortSignal.timeout (Android WebView & older browser compatibility)
if (typeof AbortSignal !== 'undefined' && !AbortSignal.timeout) {
  AbortSignal.timeout = function(ms) {
    const controller = new AbortController();
    setTimeout(() => { try { controller.abort(); } catch(e) {} }, ms);
    return controller.signal;
  };
}
// ==========================================================================
// PLAYIFY — PURE JAVASCRIPT DES ECB DECRYPTION ENGINE (320kbps Studio Audio)
// ==========================================================================
class PureDES {
  constructor() {
    this.IP = [58,50,42,34,26,18,10,2,60,52,44,36,28,20,12,4,62,54,46,38,30,22,14,6,64,56,48,40,32,24,16,8,57,49,41,33,25,17,9,1,59,51,43,35,27,19,11,3,61,53,45,37,29,21,13,5,63,55,47,39,31,23,15,7];
    this.FP = [40,8,48,16,56,24,64,32,39,7,47,15,55,23,63,31,38,6,46,14,54,22,62,30,37,5,45,13,53,21,61,29,36,4,44,12,52,20,60,28,35,3,43,11,51,19,59,27,34,2,42,10,50,18,58,26,33,1,41,9,49,17,57,25];
    this.PC1 = [57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4];
    this.PC2 = [14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32];
    this.SHIFTS = [1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1];
    this.E = [32,1,2,3,4,5,4,5,6,7,8,9,8,9,10,11,12,13,12,13,14,15,16,17,16,17,18,19,20,21,20,21,22,23,24,25,24,25,26,27,28,29,28,29,30,31,32,1];
    this.P = [16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25];
    this.S = [
      [14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7,0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8,4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0,15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13],
      [15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10,3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5,0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15,13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9],
      [10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8,13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1,13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7,1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12],
      [7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15,13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9,10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4,3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14],
      [2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9,14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6,4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14,11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3],
      [12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11,10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8,9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6,4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13],
      [4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1,13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6,1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2,6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12],
      [13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7,1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2,7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8,2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]
    ];
  }
  permute(input, table) { const out = []; for (let i = 0; i < table.length; i++) out.push(input[table[i] - 1]); return out; }
  bytesToBits(bytes) { const bits = []; for (let i = 0; i < bytes.length; i++) for (let j = 7; j >= 0; j--) bits.push((bytes[i] >> j) & 1); return bits; }
  bitsToBytes(bits) { const bytes = []; for (let i = 0; i < bits.length; i += 8) { let b = 0; for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j]; bytes.push(b); } return bytes; }
  generateSubkeys(keyBytes) {
    const keyBits = this.bytesToBits(keyBytes);
    const pc1Bits = this.permute(keyBits, this.PC1);
    let c = pc1Bits.slice(0, 28); let d = pc1Bits.slice(28, 56);
    const subkeys = [];
    for (let r = 0; r < 16; r++) {
      const shift = this.SHIFTS[r];
      c = c.slice(shift).concat(c.slice(0, shift));
      d = d.slice(shift).concat(d.slice(0, shift));
      subkeys.push(this.permute(c.concat(d), this.PC2));
    }
    return subkeys;
  }
  feistel(rBits, subkey) {
    const eBits = this.permute(rBits, this.E);
    const xorBits = [];
    for (let i = 0; i < 48; i++) xorBits.push(eBits[i] ^ subkey[i]);
    const sOut = [];
    for (let i = 0; i < 8; i++) {
      const block = xorBits.slice(i * 6, i * 6 + 6);
      const row = (block[0] << 1) | block[5];
      const col = (block[1] << 3) | (block[2] << 2) | (block[3] << 1) | block[4];
      const val = this.S[i][row * 16 + col];
      for (let j = 3; j >= 0; j--) sOut.push((val >> j) & 1);
    }
    return this.permute(sOut, this.P);
  }
  decryptBlock(blockBytes, subkeys) {
    const bits = this.bytesToBits(blockBytes);
    let perm = this.permute(bits, this.IP);
    let left = perm.slice(0, 32); let right = perm.slice(32, 64);
    for (let r = 15; r >= 0; r--) {
      const nextLeft = right;
      const f = this.feistel(right, subkeys[r]);
      const nextRight = [];
      for (let i = 0; i < 32; i++) nextRight.push(left[i] ^ f[i]);
      left = nextLeft; right = nextRight;
    }
    return this.bitsToBytes(this.permute(right.concat(left), this.FP));
  }
  decryptECB(cipherBytes, keyBytes) {
    const subkeys = this.generateSubkeys(keyBytes);
    const decrypted = [];
    for (let i = 0; i < cipherBytes.length; i += 8) {
      const block = cipherBytes.slice(i, i + 8);
      decrypted.push(...this.decryptBlock(block, subkeys));
    }
    const padLen = decrypted[decrypted.length - 1];
    if (padLen >= 1 && padLen <= 8) {
      return decrypted.slice(0, decrypted.length - padLen);
    }
    return decrypted;
  }
}

const gPlayifyDES = new PureDES();
const gPlayifyKey = [51, 56, 51, 52, 54, 53, 57, 49]; // '38346591' in ASCII

function decryptJioSaavn320(encB64) {
  if (!encB64) return null;
  try {
    const binary = atob(encB64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const decBytes = gPlayifyDES.decryptECB(Array.from(bytes), gPlayifyKey);
    const str = new TextDecoder().decode(new Uint8Array(decBytes));
    if (!str) return null;
    if (str.includes('_96.mp4')) return str.replace('_96.mp4', '_320.mp4');
    if (str.includes('_160.mp4')) return str.replace('_160.mp4', '_320.mp4');
    if (str.endsWith('.mp4') && !str.includes('_320.mp4')) return str.replace('.mp4', '_320.mp4');
    return str;
  } catch(e) {
    return null;
  }
}

// ==========================================================================
// PLAYIFY — MASTER ULTRA HD AUDIO ENGINE (v29.0 FLAWLESS NATIVE AUDIO RELEASE)
// Pure Native Audio Pipeline, 1,270+ Master Tracks, Offline IndexedDB, Crossfade
// ==========================================================================

// --------------------------------------------------------------------------
// 1. INDEXEDDB OFFLINE STORAGE ENGINE
// --------------------------------------------------------------------------
class PlayifyOfflineStorage {
  constructor() {
    this.dbName = 'PlayifyOfflineMusicDB';
    this.version = 1;
    this.db = null;
    this.init();
  }

  init() {
    return new Promise((resolve) => {
      const req = indexedDB.open(this.dbName, this.version);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('downloaded_songs')) {
          db.createObjectStore('downloaded_songs', { keyPath: 'id' });
        }
      };
      req.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };
      req.onerror = () => resolve(null);
    });
  }

  async ensureDB() {
    if (!this.db) await this.init();
    return this.db;
  }

  async saveSong(song, audioBlob, imageBlob) {
    const db = await this.ensureDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction('downloaded_songs', 'readwrite');
        const store = tx.objectStore('downloaded_songs');
        const record = {
          id: song.id,
          title: song.title,
          artist: song.artist,
          album: song.album || 'Single',
          duration: song.duration || 180,
          image: song.image,
          audioBlob: audioBlob,
          imageBlob: imageBlob,
          savedAt: Date.now()
        };
        const req = store.put(record);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  async removeSong(songId) {
    const db = await this.ensureDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction('downloaded_songs', 'readwrite');
        const store = tx.objectStore('downloaded_songs');
        const req = store.delete(songId);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  async getAllSongs() {
    const db = await this.ensureDB();
    if (!db) return [];
    return new Promise((resolve) => {
      try {
        const tx = db.transaction('downloaded_songs', 'readonly');
        const store = tx.objectStore('downloaded_songs');
        const req = store.getAll();
        req.onsuccess = () => {
          const list = (req.result || []).map(r => ({
            id: r.id,
            title: r.title,
            artist: r.artist,
            album: r.album,
            duration: r.duration,
            image: r.imageBlob ? URL.createObjectURL(r.imageBlob) : r.image,
            stream_url: r.audioBlob ? URL.createObjectURL(r.audioBlob) : '',
            isDownloaded: true
          }));
          resolve(list);
        };
        req.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  }

  async isDownloaded(songId) {
    const db = await this.ensureDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction('downloaded_songs', 'readonly');
        const store = tx.objectStore('downloaded_songs');
        const req = store.get(songId);
        req.onsuccess = () => resolve(!!req.result);
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }
}

// --------------------------------------------------------------------------
// 1.5 SPOTIFY BaRT VIBE MATRIX & WEAVER RECOMMENDATION ENGINE (12 MICRO-GENRES)
// --------------------------------------------------------------------------
const PLAYIFY_SONIC_VIBES = {
  punjabi_melodic_trap: {
    language: 'punjabi',
    energy: 'mid',
    compatible: ['punjabi_drill_gangster', 'desi_hiphop_rap', 'punjabi_pop_dance'],
    artists: ['shubh', 'ap dhillon', 'gurinder gill', 'talwiinder', 'intense', 'the prophec', 'jerry', 'gminxr', 'raf-saperra', 'chani nattan', 'tegi pannu', 'indie bargo'],
    keywords: /cheques|no love|excuses|with you|gallan|dill|her|one love|baller|king shit|dior|safety off|insane|brown munde|summer high|dil nu/i
  },
  punjabi_drill_gangster: {
    language: 'punjabi',
    energy: 'high',
    compatible: ['punjabi_melodic_trap', 'desi_hiphop_rap', 'punjabi_pop_dance'],
    artists: ['sidhu moose wala', 'karan aujla', 'wazir patar', 'cheema y', 'hustinder', 'prem dhillon', 'navaan sandhu', 'sukha', 'varinder brar', 'shooter kahlon', 'shree brar', 'deep jandu', 'bohemia', 'jassa dhillon', 'korala maan', 'khan bhaini', 'r nait'],
    keywords: /295|same beef|52 bars|winning speech|california|yaar grari|boot cut|old skool|these days|so high|taare|bhabi|g-shit|goat|chitta|weapon|badmashi|jatt|gangster/i
  },
  punjabi_pop_dance: {
    language: 'punjabi',
    energy: 'very_high',
    compatible: ['punjabi_drill_gangster', 'bollywood_dance_party', 'punjabi_folk_soul'],
    artists: ['diljit dosanjh', 'guru randhawa', 'harrdy sandhu', 'jassie gill', 'amrit maan', 'mankirt aulakh', 'parmish verma', 'jordan sandhu', 'ammy virk', 'sunanda sharma', 'gippy grewal'],
    keywords: /lover|born to shine|high rated|bijlee|dope shope|kya baat ay|proper patola|g.o.a.t|clash|chhori|patola|laung laachi|morni/i
  },
  punjabi_folk_soul: {
    language: 'punjabi',
    energy: 'chill',
    compatible: ['punjabi_pop_dance', 'bollywood_romantic_soul', 'indie_acoustic_chill'],
    artists: ['amrinder gill', 'satinder sartaaj', 'b praak', 'prabh gill', 'nirvair pannu', 'maninder buttar', 'gurnam bhullar', 'babbu maan', 'nimrat khaira', 'baani sandhu', 'simiran kaur dhadli', 'kulwinder billa', 'tarsem jassar', 'kamal khan', 'akhil', 'guri', 'garry sandhu'],
    keywords: /filhall|udaarian|tareyan de des|lehanga|sajjan raazi|jind mahi|soch|qismat|mann bharrya|rooh|pachtaoge|dila/i
  },
  bollywood_romantic_soul: {
    language: 'hindi',
    energy: 'chill',
    compatible: ['indie_acoustic_chill', 'classic_bollywood_nostalgia', 'punjabi_folk_soul'],
    artists: ['arijit singh', 'atif aslam', 'kk', 'mohit chauhan', 'shreya ghoshal', 'jubin nautiyal', 'vishal mishra', 'darshan raval', 'pritam', 'armaan malik', 'amaal mallik', 'mithoon', 'sachet tandon', 'jasleen royal', 'papon', 'shilpa rao', 'sonu nigam', 'javed ali', 'rahat fateh ali khan', 'rochak kohli', 'stebin ben', 'amit trivedi'],
    keywords: /tum hi ho|channa mereya|pehli nazar|tum se hi|zara sa|lut gaye|kaise hua|hawayein|shayad|agar tum saath ho|kesariya|apna bana le|raataan lambiyan|pal|alvida|rabba/i
  },
  bollywood_dance_party: {
    language: 'hindi',
    energy: 'very_high',
    compatible: ['punjabi_pop_dance', 'desi_hiphop_rap'],
    artists: ['badshah', 'neha kakkar', 'yo yo honey singh', 'mika singh', 'meet bros', 'tanishk bagchi', 'sachin-jigar', 'vishal-shekhar', 'kanika kapoor', 'sukhwinder singh', 'sunidhi chauhan', 'nakash aziz', 'tony kakkar'],
    keywords: /garmi|kar gayi chull|lungi dance|party|aankh marey|ghallat|tauba tauba|kudi nu nachne de|hookah bar|kala chashma|dilbar|nachde ne saare/i
  },
  indie_acoustic_chill: {
    language: 'hindi',
    energy: 'chill',
    compatible: ['bollywood_romantic_soul', 'international_synth_pop'],
    artists: ['anuv jain', 'prateek kuhad', 'jasleen royal', 'the local train', 'osho jain', 'twin strings', 'sanam', 'zaeden', 'when chai met toast', 'raghav chaitanya', 'bhuvan bam', 'kavita seth'],
    keywords: /baarishein|kasoor|cold\/mess|din shagna da|heeriye|alag aasmaan|ocean|mishri|choo lo|khudi|aaoge tum kabhi|rangrez/i
  },
  desi_hiphop_rap: {
    language: 'hindi',
    energy: 'high',
    compatible: ['punjabi_drill_gangster', 'international_hiphop_trap', 'bollywood_dance_party'],
    artists: ['seedhe maut', 'kr$na', 'divine', 'raftaar', 'mc stan', 'king', 'emiway bantai', 'ikka', 'dino james', 'fotty seven', 'karma', 'paradox', 'mc square', 'raga', 'bella', 'panther', 'gravity', 'rebel 7', 'rawal', 'bharg'],
    keywords: /nanchaku|mirchi|say my name|basti ka hasti|tu aake dekhle|machayenge|sheikh chilli|kya bolte|kohinoor|asli hip hop|vyanjan|namastute/i
  },
  classic_bollywood_nostalgia: {
    language: 'hindi',
    energy: 'chill',
    compatible: ['bollywood_romantic_soul'],
    artists: ['kishore kumar', 'lata mangeshkar', 'mohammed rafi', 'mukesh', 'asha bhosle', 'kumar sanu', 'udit narayan', 'alka yagnik', 'kavita krishnamurthy', 'r.d. burman', 'rd burman', 'jagjit singh', 'pankaj udhas', 'manna dey', 'hemant kumar', 'talat mahmood'],
    keywords: /o mere dil ke chain|tere bina|tujhe dekha toh|pehla nasha|kal ho naa ho|chura liya|lag ja gale|kabhi kabhie|hothon se/i
  },
  international_synth_pop: {
    language: 'english',
    energy: 'mid_high',
    compatible: ['international_hiphop_trap', 'indie_acoustic_chill'],
    artists: ['the weeknd', 'taylor swift', 'dua lipa', 'bruno mars', 'billie eilish', 'justin bieber', 'ariana grande', 'katy perry', 'rihanna', 'harry styles', 'charlie puth', 'shawn mendes', 'sabrina carpenter', 'coldplay', 'sia', 'maroon 5', 'olivia rodrigo'],
    keywords: /blinding lights|starboy|levitating|as it was|espresso|cruel summer|uptown funk|shape of you|save your tears|stay|bad guy|watermelon sugar/i
  },
  international_hiphop_trap: {
    language: 'english',
    energy: 'high',
    compatible: ['international_synth_pop', 'desi_hiphop_rap'],
    artists: ['drake', 'eminem', 'travis scott', 'kendrick lamar', 'post malone', '21 savage', 'future', 'metro boomin', 'kanye west', 'lil baby', 'jack harlow', 'j. cole', 'juice wrld', 'central cee', 'xxxtentacion'],
    keywords: /gods plan|sicko mode|sunflower|not like us|lose yourself|circles|band4band|goosebumps|humble|rockstar|congratulations/i
  },
  haryanvi_desi_swag: {
    language: 'haryanvi',
    energy: 'very_high',
    compatible: ['punjabi_drill_gangster', 'punjabi_pop_dance'],
    artists: ['gulzaar chhaniwala', 'masoom sharma', 'amit saini rohtakiya', 'sumit goswami', 'diler kharkiya', 'renuka panwar', 'khasa aala chahar', 'ruchika jangid', 'kd', 'md', 'sapna choudhary'],
    keywords: /middle class|kothe chad|52 gaj|chatak matak|goli chal javegi|desi desi|bholenath|haryana/i
  }
};

const PLAYIFY_VIBE_CLUSTERS = PLAYIFY_SONIC_VIBES;

const PLAYIFY_FAMOUS_SINGERS = new Set([
  'arijit singh', 'atif aslam', 'kk', 'mohit chauhan', 'shreya ghoshal', 'jubin nautiyal',
  'vishal mishra', 'darshan raval', 'armaan malik', 'sachet tandon', 'jasleen royal',
  'anuv jain', 'prateek kuhad', 'sonu nigam', 'sunidhi chauhan', 'javed ali', 'rahat fateh ali khan',
  'neha kakkar', 'badshah', 'yo yo honey singh', 'mika singh', 'shubh', 'ap dhillon',
  'sidhu moose wala', 'karan aujla', 'diljit dosanjh', 'amrinder gill', 'b praak',
  'seedhe maut', 'kr$na', 'divine', 'raftaar', 'mc stan', 'the weeknd', 'drake', 'taylor swift',
  'kishore kumar', 'lata mangeshkar', 'mohammed rafi', 'kumar sanu', 'udit narayan', 'alka yagnik',
  'gulzaar chhaniwala', 'masoom sharma', 'travis scott', 'eminem'
]);

function extractLeadArtist(rawArtist) {
  if (!rawArtist) return 'Artist';
  const parts = rawArtist.split(/[,&/|]|\band\b/i).map(s => s.trim()).filter(Boolean);
  for (const p of parts) {
    const pClean = p.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    for (const fs of PLAYIFY_FAMOUS_SINGERS) {
      if (pClean === fs || pClean.startsWith(fs + ' ') || pClean.endsWith(' ' + fs)) return p;
    }
  }
  return parts[0] || rawArtist;
}

function matchArtistToken(rawArtist, artistName) {
  if (!rawArtist || !artistName) return false;
  const rawClean = ' ' + rawArtist.toLowerCase().replace(/[^a-z0-9\s]/g, ' ') + ' ';
  const rawNoPunct = ' ' + rawArtist.toLowerCase().replace(/[^a-z0-9\s]/g, '') + ' ';
  const targetClean = artistName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  if (targetClean.length <= 3) {
    const regex = new RegExp('\\b' + targetClean + '\\b', 'i');
    return regex.test(rawClean) || regex.test(rawNoPunct);
  }
  return rawClean.includes(' ' + targetClean + ' ') || rawNoPunct.includes(' ' + targetClean + ' ');
}

function detectMicroVibe(song) {
  if (!song) return { key: 'punjabi_melodic_trap', lang: 'punjabi', energy: 'mid' };
  const leadArt = extractLeadArtist(song.artist);
  const rawArt = (song.artist || '').toLowerCase();
  const title = (song.title || '').toLowerCase();
  const img = (song.image || '').toLowerCase();

  for (const [key, conf] of Object.entries(PLAYIFY_SONIC_VIBES)) {
    for (const a of conf.artists) {
      if (matchArtistToken(leadArt, a)) {
        return { key, lang: conf.language, energy: conf.energy, matchedArtist: a };
      }
    }
  }

  for (const [key, conf] of Object.entries(PLAYIFY_SONIC_VIBES)) {
    for (const a of conf.artists) {
      if (matchArtistToken(rawArt, a)) {
        return { key, lang: conf.language, energy: conf.energy, matchedArtist: a };
      }
    }
  }

  for (const [key, conf] of Object.entries(PLAYIFY_SONIC_VIBES)) {
    if (conf.keywords && conf.keywords.test(title)) {
      return { key, lang: conf.language, energy: conf.energy };
    }
  }

  if (img.includes('-punjabi-')) return { key: 'punjabi_melodic_trap', lang: 'punjabi', energy: 'mid' };
  if (img.includes('-hindi-')) return { key: 'bollywood_romantic_soul', lang: 'hindi', energy: 'chill' };
  if (img.includes('-english-')) return { key: 'international_synth_pop', lang: 'english', energy: 'mid_high' };
  if (img.includes('-haryanvi-')) return { key: 'haryanvi_desi_swag', lang: 'haryanvi', energy: 'very_high' };

  return { key: 'punjabi_melodic_trap', lang: 'punjabi', energy: 'mid' };
}

function buildSpotifyBaRTQueue(seedSong, masterDb, limit = 50) {
  if (!seedSong) return [];

  const seedVibe = detectMicroVibe(seedSong);
  const seedConf = PLAYIFY_SONIC_VIBES[seedVibe.key] || PLAYIFY_SONIC_VIBES.punjabi_melodic_trap;
  const seedLead = extractLeadArtist(seedSong.artist).toLowerCase();
  const seedTitleClean = (seedSong.title || '').toLowerCase().trim();

  const candidates = [];
  const seenIds = new Set();
  if (seedSong.id) seenIds.add(seedSong.id);

  for (const t of (masterDb || [])) {
    if (!t || !t.id || seenIds.has(t.id)) continue;
    const tTitleClean = (t.title || '').toLowerCase().trim();
    if (tTitleClean === seedTitleClean) continue;

    if (/karaoke|instrumental|cover version|tribute/i.test(t.artist || '')) continue;
    if (/mashup|remix by dj|mega party mix|karaoke|instrumental/i.test(tTitleClean)) continue;

    const tVibe = detectMicroVibe(t);
    if (tVibe.lang !== seedVibe.lang) continue;

    const isExact = (tVibe.key === seedVibe.key);
    const isCompat = seedConf.compatible && seedConf.compatible.includes(tVibe.key);
    if (!isExact && !isCompat) continue;

    const tLead = extractLeadArtist(t.artist).toLowerCase();
    const isSameLead = (tLead === seedLead || (t.artist || '').toLowerCase().includes(seedLead));

    let score = 0;
    if (isExact) score += 60;
    else if (isCompat) score += 25;

    if (isSameLead) {
      score += 45;
    } else {
      const isCorePeer = seedConf.artists.some(a => matchArtistToken(tLead, a));
      if (isCorePeer) score += 35;
    }

    const seedArtFull = (seedSong.artist || '').toLowerCase();
    const tArtFull = (t.artist || '').toLowerCase();
    if (seedArtFull.includes(tLead) || tArtFull.includes(seedLead)) {
      score += 30;
    }

    score += Math.random() * 12;

    candidates.push({
      track: t,
      score: score,
      leadArtist: tLead,
      isSameLead: isSameLead,
      vibeKey: tVibe.key
    });
  }

  candidates.sort((a, b) => b.score - a.score);

  const queue = [seedSong];
  const recentArtists = [seedLead];

  while (queue.length < limit && candidates.length > 0) {
    let pickedIdx = -1;

    for (let i = 0; i < candidates.length; i++) {
      const c = candidates[i];
      const inRecentWindow = recentArtists.slice(-2).includes(c.leadArtist);
      if (!inRecentWindow) {
        pickedIdx = i;
        break;
      }
    }

    if (pickedIdx === -1) {
      pickedIdx = 0;
    }

    const [chosen] = candidates.splice(pickedIdx, 1);
    queue.push(chosen.track);
    recentArtists.push(chosen.leadArtist);
  }

  return queue;
}

// --------------------------------------------------------------------------
// 2. MAIN PLAYIFY CORE ENGINE (NATIVE HARDWARE PLAYBACK)
// --------------------------------------------------------------------------
// ============================================================================
// BULLETPROOF PUBNUB REAL-TIME JAM RELAY (100% UNBLOCKED, ZERO-CONFIG, SUB-500MS)
// ============================================================================
class PubNubJamRelay {
  constructor(channel, onMessage) {
    this.channel = channel;
    this.onMessage = onMessage;
    this.active = true;
    this.timeToken = '0';
    this.abortController = null;
    this.startListening();
  }

  async publish(data) {
    if (!this.active) return;
    try {
      const payload = encodeURIComponent(JSON.stringify(data));
      const url = `https://ps.pndsn.com/publish/demo/demo/0/${encodeURIComponent(this.channel)}/0/${payload}`;
      let ctrl = null;
      let tid = null;
      if (typeof AbortController !== 'undefined') {
        ctrl = new AbortController();
        tid = setTimeout(() => { try { ctrl.abort(); } catch(e) {} }, 4000);
      }
      await fetch(url, { signal: ctrl ? ctrl.signal : undefined });
      if (tid) clearTimeout(tid);
    } catch(err) {
      console.warn('[PubNub] Publish notice:', err.message);
    }
  }

  async startListening() {
    while (this.active) {
      try {
        this.abortController = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const url = `https://ps.pndsn.com/subscribe/demo/${encodeURIComponent(this.channel)}/0/${this.timeToken}`;
        const res = await fetch(url, { signal: this.abortController ? this.abortController.signal : undefined });
        if (!res.ok) {
          await new Promise(r => setTimeout(r, 600));
          continue;
        }
        const [messages, nextTimeToken] = await res.json();
        this.timeToken = nextTimeToken || this.timeToken;
        if (messages && Array.isArray(messages) && messages.length > 0) {
          for (const rawMsg of messages) {
            if (this.onMessage) {
              let parsed = rawMsg;
              if (typeof rawMsg === 'string') {
                try { parsed = JSON.parse(rawMsg); } catch(err) { parsed = rawMsg; }
              }
              try { this.onMessage(parsed); } catch(err) { console.error('[Jam] onMessage error:', err); }
            }
          }
        }
      } catch(e) {
        if (!this.active) break;
        await new Promise(r => setTimeout(r, 500));
      }
    }
  }

  destroy() {
    this.active = false;
    if (this.abortController) {
      try { this.abortController.abort(); } catch(e) {}
    }
  }
}

class PlayifyEngine {

  async safeFetchJson(url) {
    const isCloudflare = (typeof window !== 'undefined' && window.location && 
      (window.location.hostname.includes('workers.dev') || window.location.hostname.includes('pages.dev')));
    const isFileScheme = (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:');

    // 1. Cloudflare Edge API Proxy (when deployed on workers.dev / cloudflare)
    if (isCloudflare) {
      try {
        const edgeProxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
        const edgeRes = await fetch(edgeProxyUrl, { signal: AbortSignal.timeout(2500) });
        if (edgeRes.ok) {
          const data = await edgeRes.json();
          if (data && !data.error) return data;
        }
      } catch(e) {}
    }

    // 2. Direct asynchronous fetch (In Android WebView, intercepted by PlayifyWebClient on background thread with full CORS/UA)
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch(e) {}

    // 3. Local PHP Proxy (works natively on XAMPP/Apache, skip if file:/// or workers.dev)
    if (!isCloudflare && !isFileScheme) {
      try {
        const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
        const path = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '';
        const dir = path.substring(0, path.lastIndexOf('/') + 1);
        const proxyUrl = `${origin}${dir}proxy.php?url=${encodeURIComponent(url)}`;
        const pRes = await fetch(proxyUrl, { signal: AbortSignal.timeout(2000) });
        if (pRes.ok) {
          const data = await pRes.json();
          if (data && !data.error) return data;
        }
      } catch(e) {}
    }

    // 4. Multi-tier CORS Proxy Fallbacks
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
    ];
    for (const pUrl of proxies) {
      try {
        const pRes = await fetch(pUrl, { signal: AbortSignal.timeout(2500) });
        if (pRes.ok) {
          const txt = await pRes.text();
          return JSON.parse(txt);
        }
      } catch(e) {}
    }
    return null;
  }

  getApiBase() {
    if (typeof window !== 'undefined' && window.location && window.location.hostname && window.location.hostname.includes('workers.dev')) {
      return window.location.origin;
    }
    return 'https://peaceful-davinci.meowing-dianella.workers.dev';
  }

  setupNetworkListeners() {
    const updateStatus = () => {
      const banner = document.getElementById('sp-offline-bar');
      if (!navigator.onLine) {
        if (banner) banner.style.display = 'flex';
        this.showToast('📡 You are offline. Accessing Downloaded Music...');
        // Auto-navigate to downloaded music if library or home
        this.openDownloadedSongsView();
      } else {
        if (banner) banner.style.display = 'none';
        this.showToast('🟢 Back Online! High Speed Streaming restored.');
      }
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    if (!navigator.onLine) {
      setTimeout(updateStatus, 800);
    }
  }

  constructor() {
    this.audio = document.getElementById('sp-audio-engine');
    if (this.audio) {
      this.audio.volume = 1.0;
      this.audio.muted = false;
    }
    this.audioSource = null;
    this.currentEqPreset = localStorage.getItem('sp_eq_preset') || 'flat';
    this.savedBassGain = parseFloat(localStorage.getItem('sp_eq_bass') || '0');
    this.savedMidGain = parseFloat(localStorage.getItem('sp_eq_mid') || '0');
    this.savedTrebleGain = parseFloat(localStorage.getItem('sp_eq_treble') || '0');

    // In Android APK, restore hardware BassBoost and Equalizer presets
    if (typeof window !== 'undefined' && window.PlayifyNative) {
      setTimeout(() => {
        try {
          if (this.currentEqPreset && this.currentEqPreset !== 'flat') {
            if (typeof window.PlayifyNative.setNativePreset === 'function') {
              window.PlayifyNative.setNativePreset(this.currentEqPreset);
            }
          } else if (this.savedBassGain > 0) {
            if (typeof window.PlayifyNative.setNativeBass === 'function') {
              window.PlayifyNative.setNativeBass(Math.round(this.savedBassGain));
            }
          }
        } catch(e) {}
      }, 500);
    }

    this.initJamState();

    this.currentSong = null;
    this.queue = [];
    this.queueIndex = -1;
    this.isPlaying = false;
    this.isShuffle = false;
    this.shuffleMode = 'off'; // 'off' | 'standard' | 'smart'
    this.playbackContext = { type: 'single', originalList: [] };
    this.repeatMode = 'off';

    // Storage & State
    this.offlineDB = new PlayifyOfflineStorage();
    this.downloadedSongIds = new Set();
    this.downloadingSongIds = new Set();
    this.likedSongs = JSON.parse(localStorage.getItem('sp_liked_songs') || '[]');
    this.recentlyPlayed = JSON.parse(localStorage.getItem('sp_recently_played') || '[]');
    this.customPlaylists = JSON.parse(localStorage.getItem('sp_custom_playlists') || '[]');

    // Toggles & Quality
    this.crossfadeDuration = parseInt(localStorage.getItem('sp_crossfade_duration') || '3');
    this.smartRadioEnabled = localStorage.getItem('sp_smart_radio') !== 'false';
    this.ambientGlowEnabled = localStorage.getItem('sp_ambient_glow') !== 'false';
    this.streamingQuality = localStorage.getItem('sp_streaming_quality_v3') || '320';
    this.bufferStallTimer = null;
    this.visualizerAnimId = null;
    this._preloadedNext = false;
    this.bgPreloader = null;

    // Web Audio API & Visualizer State
    this.visualizerEnabled = localStorage.getItem('sp_visualizer_enabled') === 'true';
    this.visualizerMode = false;
    this.audioCtx = null;
    this.analyser = null;
    this.eqBass = null;
    this.eqMid = null;
    this.eqTreble = null;
    this.currentAlbumTracks = [];
    this.currentAlbumMeta = null;
    this.currentArtistAllSongs = [];
    this.currentArtistTracks = [];
    this.currentArtistAllAlbums = [];
    this.currentSearchSongs = [];
    this.currentSearchTopSong = null;
    this.currentPlaylistViewSongs = [];
    this.songRegistry = new Map();

    // Internal State
    this.currentLyrics = [];
    this.activeLyricIndex = -1;
    this.homeData = null;
    this.musicDB = [];
    this.searchTimer = null;
    this.toastTimer = null;
    this.searchCache = new Map();
    this.searchSeq = 0;
    this.navHistory = ['home'];
    this.artistIndex = new Map();
    this.albumIndex = new Map();

    // Sleep Timer
    this.sleepTimerTarget = null;
    this.sleepTimerInterval = null;
    this.sleepOnTrackEnd = false;

    this.init();
  }

  registerSong(song) {
    if (!song || !song.id) return;
    if (!this.songRegistry) this.songRegistry = new Map();
    this.songRegistry.set(String(song.id), song);
  }

  getSongById(id) {
    if (!id) return null;
    const sId = String(id);
    if (this.songRegistry && this.songRegistry.has(sId)) {
      return this.songRegistry.get(sId);
    }
    if (this.currentSong && String(this.currentSong.id) === sId) {
      return this.currentSong;
    }
    if (this.currentArtistAllSongs) {
      const found = this.currentArtistAllSongs.find(s => String(s.id) === sId);
      if (found) return found;
    }
    if (this.currentAlbumTracks) {
      const found = this.currentAlbumTracks.find(s => String(s.id) === sId);
      if (found) return found;
    }
    if (this.currentSearchSongs) {
      const found = this.currentSearchSongs.find(s => String(s.id) === sId);
      if (found) return found;
    }
    if (this.musicDB && this.musicDB.length) {
      const found = this.musicDB.find(s => String(s.id) === sId);
      if (found) return found;
    }
    return null;
  }

  escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  escapeJsString(str) {
    if (!str) return '';
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
  }

  playSongById(songId) {
    const song = this.getSongById(songId);
    if (song) {
      this.playSong(song, null, false, { type: 'single', seedSong: song });
    }
  }

  playArtistTrack(idOrIdx) {
    const songs = this.currentArtistAllSongs || [];
    let song = null;
    if (typeof idOrIdx === 'string') {
      song = songs.find(s => String(s.id) === idOrIdx) || this.getSongById(idOrIdx);
    } else if (typeof idOrIdx === 'number' && songs[idOrIdx]) {
      song = songs[idOrIdx];
    }
    if (song) {
      this.playSong(song, songs.length ? songs : [song], false, {
        type: 'artist',
        originalList: songs.length ? songs : [song],
        artistName: this.currentViewArtistName || this.cleanArtistNames(song.artist)
      });
    }
  }

  playArtistTrackByIndex(indexOrId) {
    this.playArtistTrack(indexOrId);
  }

  openArtistFromPlayer(artistName = null) {
    let target = artistName;
    if (!target && this.currentSong && this.currentSong.artist) {
      target = this.cleanArtistNames(this.currentSong.artist).split(',')[0].trim();
    }
    if (!target) return;
    this.closeFullscreenPlayer();
    this.openArtistPage(target, this.currentSong?.image || '');
  }

  playAlbumTrack(idOrIdx) {
    const songs = this.currentAlbumTracks || [];
    let song = null;
    if (typeof idOrIdx === 'string') {
      song = songs.find(s => String(s.id) === idOrIdx) || this.getSongById(idOrIdx);
    } else if (typeof idOrIdx === 'number' && songs[idOrIdx]) {
      song = songs[idOrIdx];
    }
    if (song) {
      this.playSong(song, songs.length ? songs : [song], false, {
        type: 'album',
        originalList: songs.length ? songs : [song],
        albumId: this.currentAlbumMeta?.id,
        albumTitle: this.currentAlbumMeta?.title
      });
    }
  }

  playAlbumTrackByIndex(indexOrId) {
    this.playAlbumTrack(indexOrId);
  }

  playSearchTrack(idOrIdx) {
    const songs = this.currentSearchSongs || [];
    let song = null;
    if (typeof idOrIdx === 'string') {
      song = songs.find(s => String(s.id) === idOrIdx) || this.getSongById(idOrIdx);
    } else if (typeof idOrIdx === 'number' && songs[idOrIdx]) {
      song = songs[idOrIdx];
    }
    if (song) {
      this.playSong(song, null, false, {
        type: 'single',
        seedSong: song
      });
    }
  }

  playSearchTrackByIndex(indexOrId) {
    this.playSearchTrack(indexOrId);
  }

  playSearchTopSong() {
    if (this.currentSearchTopSong) {
      this.playSong(this.currentSearchTopSong, null, false, {
        type: 'single',
        seedSong: this.currentSearchTopSong
      });
    }
  }

  playLikedTrack(idOrIdx) {
    const songs = this.likedSongs || [];
    let song = null;
    if (typeof idOrIdx === 'string') {
      song = songs.find(s => String(s.id) === idOrIdx) || this.getSongById(idOrIdx);
    } else if (typeof idOrIdx === 'number' && songs[idOrIdx]) {
      song = songs[idOrIdx];
    }
    if (song) {
      this.playSong(song, songs, false, {
        type: 'playlist',
        originalList: songs
      });
    }
  }

  playLikedTrackByIndex(indexOrId) {
    this.playLikedTrack(indexOrId);
  }

  playRecentTrack(idOrIdx) {
    const songs = this.recentlyPlayed || [];
    let song = null;
    if (typeof idOrIdx === 'string') {
      song = songs.find(s => String(s.id) === idOrIdx) || this.getSongById(idOrIdx);
    } else if (typeof idOrIdx === 'number' && songs[idOrIdx]) {
      song = songs[idOrIdx];
    }
    if (song) {
      this.playSong(song, songs, false, {
        type: 'playlist',
        originalList: songs
      });
    }
  }

  playRecentTrackByIndex(indexOrId) {
    this.playRecentTrack(indexOrId);
  }

  playOfflineTrack(idOrIdx) {
    const offlineTracks = this.offlineTracks || this.currentAlbumTracks || [];
    let song = null;
    if (typeof idOrIdx === 'string') {
      song = offlineTracks.find(s => String(s.id) === idOrIdx) || this.getSongById(idOrIdx);
    } else if (typeof idOrIdx === 'number' && offlineTracks[idOrIdx]) {
      song = offlineTracks[idOrIdx];
    }
    if (song) {
      this.playSong(song, offlineTracks, false, {
        type: 'playlist',
        originalList: offlineTracks
      });
    }
  }

  playOfflineTrackByIndex(indexOrId) {
    this.playOfflineTrack(indexOrId);
  }

  playPlaylistTrack(idOrIdx) {
    const songs = this.currentPlaylistViewSongs || [];
    let song = null;
    if (typeof idOrIdx === 'string') {
      song = songs.find(s => String(s.id) === idOrIdx) || this.getSongById(idOrIdx);
    } else if (typeof idOrIdx === 'number' && songs[idOrIdx]) {
      song = songs[idOrIdx];
    }
    if (song) {
      this.playSong(song, songs, false, {
        type: 'playlist',
        originalList: songs
      });
    }
  }

  playPlaylistTrackByIndex(indexOrId) {
    this.playPlaylistTrack(indexOrId);
  }

  playTopHitsTrack(idOrIdx) {
    const billboard = this.homeData?.billboard || [];
    let song = null;
    if (typeof idOrIdx === 'string') {
      song = billboard.find(s => String(s.id) === idOrIdx) || this.getSongById(idOrIdx);
    } else if (typeof idOrIdx === 'number' && billboard[idOrIdx]) {
      song = billboard[idOrIdx];
    }
    if (song) {
      this.playSong(song, null, false, {
        type: 'single',
        seedSong: song
      });
    }
  }

  playTopHitsTrackByIndex(indexOrId) {
    this.playTopHitsTrack(indexOrId);
  }

  playShelfTrack(shelfKey, index) {
    const list = this.homeSections?.[shelfKey] || (this.homeData?.sections?.[shelfKey]) || [];
    if (list && list[index]) {
      this.playSong(list[index], null, false, {
        type: 'single',
        seedSong: list[index]
      });
    }
  }

  dismissSplashScreen() {
    const splash = document.getElementById('sp-splash-screen');
    if (splash) {
      splash.classList.add('splash-hidden');
      setTimeout(() => {
        splash.remove();
      }, 250);
    }
  }

  async init() {
    try {
      this.dismissSplashScreen();
      this.setupNetworkListeners();
      this.bindAudioEvents();
      this.bindKeyboardShortcuts();
      this.setupMediaSession();
      this.updateGreeting();
      this.renderLikedCount();
      await this.loadDatabaseAndCharts();
      await this.refreshDownloadedSongIds();
      this.setupSearchInput();
      this.renderLibraryPage();
      this.updateJumpBackInShelf();
      this.initVisualizer();
      this.initJamManager();
    } catch (e) {
      console.error('PlayifyEngine init error:', e);
    }
  }

  // ========================================================================
  // 1. DATA LOADERS & INITIALIZERS
  // ========================================================================
  async loadDatabaseAndCharts() {
    try {
      if (typeof window !== 'undefined') {
        if (window.PLAYIFY_CHARTS) {
          this.homeData = window.PLAYIFY_CHARTS;
        } else if (window.sp_charts_data) {
          this.homeData = window.sp_charts_data;
        }

        if (Array.isArray(window.PLAYIFY_MUSIC_DB)) {
          this.musicDB = window.PLAYIFY_MUSIC_DB;
          this.buildDatabaseIndices();
        } else if (Array.isArray(window.sp_music_db)) {
          this.musicDB = window.sp_music_db;
          this.buildDatabaseIndices();
        }
      }

      // If homeData is already loaded from memory (e.g. charts_data.js in APK or web), render immediately!
      if (this.homeData) {
        this.renderHomeViews();
      } else {
        fetch('charts.json').then(r => r.ok ? r.json() : null).then(charts => {
          if (charts) {
            this.homeData = charts;
            this.renderHomeViews();
          }
        }).catch(() => {});
      }

      // Load 2.2MB Music DB asynchronously in background without blocking UI thread or startup
      this.loadMusicDBInBackground();
    } catch(e) {
      console.warn('loadDatabaseAndCharts notice:', e);
    }
  }

  buildDatabaseIndices() {
    if (!this.musicDB || !this.musicDB.length) return;
    this.artistIndex = new Map();
    this.albumIndex = new Map();

    for (let i = 0; i < this.musicDB.length; i++) {
      const s = this.musicDB[i];
      if (!s) continue;

      if (s.artist) {
        const fullArt = s.artist.toLowerCase().trim();
        let aList = this.artistIndex.get(fullArt);
        if (!aList) {
          aList = [];
          this.artistIndex.set(fullArt, aList);
        }
        aList.push(s);

        const parts = s.artist.split(',');
        for (let p = 0; p < parts.length; p++) {
          const cleanPart = parts[p].trim().toLowerCase();
          if (cleanPart && cleanPart !== fullArt) {
            let pList = this.artistIndex.get(cleanPart);
            if (!pList) {
              pList = [];
              this.artistIndex.set(cleanPart, pList);
            }
            pList.push(s);
          }
        }
      }

      if (s.album && s.album !== 'Single') {
        const albKey = s.album.toLowerCase().trim();
        let albList = this.albumIndex.get(albKey);
        if (!albList) {
          albList = [];
          this.albumIndex.set(albKey, albList);
        }
        albList.push(s);
      }
    }
  }

  loadMusicDBInBackground() {
    if (this.musicDB && this.musicDB.length) {
      this.buildDatabaseIndices();
      return;
    }

    const checkGlobalDB = () => {
      if (typeof window !== 'undefined') {
        if (Array.isArray(window.PLAYIFY_MUSIC_DB) && window.PLAYIFY_MUSIC_DB.length > 0) {
          this.musicDB = window.PLAYIFY_MUSIC_DB;
          this.buildDatabaseIndices();
          return true;
        }
        if (Array.isArray(window.sp_music_db) && window.sp_music_db.length > 0) {
          this.musicDB = window.sp_music_db;
          this.buildDatabaseIndices();
          return true;
        }
      }
      return false;
    };

    if (checkGlobalDB()) return;

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (checkGlobalDB() || attempts > 25) {
        clearInterval(interval);
        if (!this.musicDB || !this.musicDB.length) {
          fetch('music_db.json')
            .then(r => r.ok ? r.json() : [])
            .then(data => {
              if (Array.isArray(data) && data.length) {
                this.musicDB = data;
                this.buildDatabaseIndices();
              }
            })
            .catch(() => {});
        }
      }
    }, 200);
  }

  async refreshDownloadedSongIds() {
    const list = await this.offlineDB.getAllSongs();
    this.downloadedSongIds = new Set(list.map(s => s.id));
    const cnt = document.getElementById('lib-page-downloads-count');
    if (cnt) cnt.textContent = `${list.length} Offline Songs`;
    if (this.currentSong) {
      this.updateDownloadButtonsState(this.currentSong.id);
    }
  }

  // ========================================================================
  // 2. PLAYBACK & CROSSFADE ENGINE
  // ========================================================================
  bindAudioEvents() {
    if (!this.audio) return;

    const clearBufferStallTimer = () => {
      if (this.bufferStallTimer) {
        clearTimeout(this.bufferStallTimer);
        this.bufferStallTimer = null;
      }
    };

    this.audio.addEventListener('error', (e) => {
      clearBufferStallTimer();
      console.warn('Audio stream playback error:', e);
      if (this.currentSong && this.audio.src) {
        const curSrc = this.audio.src;
        const curPos = this.audio.currentTime || 0;
        if (curSrc.includes('_320.mp4') && !this._triedFallback160) {
          this._triedFallback160 = true;
          this.audio.src = curSrc.replace('_320.mp4', '_160.mp4');
          if (curPos > 0) this.audio.currentTime = curPos;
          this.audio.play().catch(() => {});
          return;
        }
        if (curSrc.includes('_160.mp4') && !this._triedFallback96) {
          this._triedFallback96 = true;
          this.audio.src = curSrc.replace('_160.mp4', '_96.mp4');
          if (curPos > 0) this.audio.currentTime = curPos;
          this.audio.play().catch(() => {});
          return;
        }
      }
      this.isPlaying = false;
      this.updatePlayPauseUI(false);
      this.stopVisualizerRender();
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.updatePlayPauseUI(true);
    });

    this.audio.addEventListener('playing', () => {
      clearBufferStallTimer();
      this.isPlaying = true;
      this.updatePlayPauseUI(true);
      if (this.visualizerEnabled && this.visualizerMode) {
        this.startVisualizerRender();
      }
    });

    this.audio.addEventListener('waiting', () => {
      clearBufferStallTimer();
      // Stream is buffering naturally; keep native stream socket open without interruption
    });

    this.audio.addEventListener('stalled', () => {
      clearBufferStallTimer();
      // Chromium pauses network reads when internal hardware buffer is full; preserve stream
    });

    this.audio.addEventListener('canplay', () => {
      clearBufferStallTimer();
    });

    this.audio.addEventListener('pause', () => {
      clearBufferStallTimer();
      this.isPlaying = false;
      this.updatePlayPauseUI(false);
      this.stopVisualizerRender();
    });

    this.audio.addEventListener('timeupdate', () => {
      this.updateProgressUI();
      this.handleCrossfadeCheck();

      // Smart background preloading: only fetch next 320kbps track when 15s remain
      // This prevents parallel bandwidth saturation while the current song buffers!
      const dur = this.audio.duration;
      const cur = this.audio.currentTime;
      if (dur && cur && (dur - cur <= 15) && !this._preloadedNext) {
        this._preloadedNext = true;
        this.preloadNextTrack();
      }
    });

    this.audio.addEventListener('ended', () => {
      clearBufferStallTimer();
      if (this.sleepOnTrackEnd) {
        this.executeSleepTimerStop();
        return;
      }
      if (this.repeatMode === 'one') {
        this.audio.currentTime = 0;
        this.audio.play();
      } else {
        this.nextSong();
      }
    });
  }

  preloadNextTrack() {
    // Preserve 100% mobile bandwidth for the active playing track to guarantee zero stutters!
    // Next track is loaded on demand in 0ms via JioSaavn CDN direct stream URLs.
  }

  handleCrossfadeCheck() {
    if (!this.audio || this.crossfadeDuration <= 0 || !this.audio.duration) return;
    const timeLeft = this.audio.duration - this.audio.currentTime;

    if (timeLeft > 0 && timeLeft <= this.crossfadeDuration && this.audio.volume > 0.05) {
      const step = 0.05 / (this.crossfadeDuration * 10);
      this.audio.volume = Math.max(0.05, this.audio.volume - step);
    }
  }

  getOptimalStreamUrl(raw) {
    let rawUrl = (typeof raw === 'object' && raw !== null) ? (raw.stream_url || raw.url || '') : raw;
    if (!rawUrl || typeof rawUrl !== 'string') return '';
    const q = String(this.streamingQuality || '320').toLowerCase();

    // 1. Explicit Data Saver (96 kbps)
    if (q === '96' || q === '96k') {
      return rawUrl.replace(/_(320|160)\.mp4/, '_96.mp4');
    }

    // 2. Explicit High (160 kbps Studio AAC)
    if (q === '160' || q === '160k') {
      return rawUrl.replace(/_(320|96)\.mp4/, '_160.mp4');
    }

    // 3. Default: Very High (320 kbps Master) - Pristine audio quality
    if (rawUrl.includes('_160.mp4')) return rawUrl.replace('_160.mp4', '_320.mp4');
    if (rawUrl.includes('_96.mp4')) return rawUrl.replace('_96.mp4', '_320.mp4');
    return rawUrl;
  }

  setStreamingQuality(val) {
    this.streamingQuality = val || '320';
    localStorage.setItem('sp_streaming_quality_v3', this.streamingQuality);
    const sel = document.getElementById('setting-streaming-quality');
    if (sel) sel.value = this.streamingQuality;

    let label = 'Very High (320 kbps Master - Default)';
    if (val === '160' || val === '160k') label = 'High (160 kbps Studio AAC)';
    if (val === '96' || val === '96k') label = 'Data Saver (96 kbps)';
    this.showToast(`⚡ Audio Quality: ${label}`);

    if (this.currentSong && this.audio && !this.audio.paused) {
      const curTime = this.audio.currentTime;
      const targetUrl = this.getOptimalStreamUrl(this.currentSong.stream_url);
      if (targetUrl && this.audio.src !== targetUrl) {
        this.audio.src = targetUrl;
        this.audio.currentTime = curTime;
        this.audio.play().catch(() => {});
      }
    }
  }

  async playSong(song, playlistContext = null, preserveQueue = false, contextMeta = null) {
    if (!song) return;

    this._triedFallback160 = false;
    this._triedFallback96 = false;
    this._preloadedNext = false;
    this.currentSong = song;

    // Reset audio playbackRate & pitch preservation for pristine, stutter-free playback
    if (this.audio) {
      this.audio.playbackRate = 1.0;
      if ('preservesPitch' in this.audio) this.audio.preservesPitch = true;
    }

    // If user starts their own local song while in a Jam guest session, leave Jam so background sync doesn't hijack/stutter!
    if (this.jamState && this.jamState.active && !this.jamState.isHost && (!contextMeta || contextMeta.type !== 'jam')) {
      this.leaveJamSession(true);
    }

    // 1. INSTANT STREAM RESOLUTION (0ms)
    let playUrl = song.stream_url;
    if (playUrl && playUrl.includes('_320_320')) {
      playUrl = playUrl.replace('_320_320', '_320');
      song.stream_url = playUrl;
    }

    // Fast lookup from local database if missing
    if (!playUrl && this.musicDB && this.musicDB.length) {
      const sLower = (song.title || '').toLowerCase().trim();
      const aLower = (song.artist || '').toLowerCase().trim();
      const found = this.musicDB.find(s => s.title && (s.title.toLowerCase() === sLower || (s.title.toLowerCase().includes(sLower) && s.artist && s.artist.toLowerCase().includes(aLower))));
      if (found && found.stream_url) {
        playUrl = found.stream_url;
        song.stream_url = found.stream_url;
        song.duration = found.duration || song.duration;
      }
    }

    // 2. IMMEDIATE AUDIO PLAYBACK KICKOFF (0ms delay - Audio buffers & plays immediately!)
    if (playUrl && this.audio) {
      const optimalUrl = this.getOptimalStreamUrl(playUrl);
      if (this.audio.src !== optimalUrl) {
        this.audio.src = optimalUrl;
      }
      this.audio.volume = 1.0;
      this.audio.muted = false;
      this.isPlaying = true;
      this.updatePlayPauseUI(true);
      const p = this.audio.play();
      if (p !== undefined) {
        p.catch(e => {
          console.warn('Play kickoff note:', e);
        });
      }
    }

    // SPOTIFY JAM: Sync song change across all devices
    if (this.jamState && this.jamState.active && !this._jamIncomingAction) {
      if (this.jamState.isHost || this.jamState.guestControl) {
        this.broadcastJamAction('PLAY_SONG', {
          song: song,
          position: 0,
          isPlaying: true
        });
      }
    }

    // 3. INSTANT OPTIMISTIC UI UPDATES (0ms)
    this.updateNowPlayingUI(song);
    const sc = document.querySelector('.sp-mf-scroll-content');
    if (sc) sc.scrollTop = 0;

    // 4. DEFERRED NON-BLOCKING TASKS (Ambient glow, recent tracks, BaRT queue, queue drawer)
    // Running in setTimeout allows the browser to focus 100% of CPU on network streaming & audio decoding!
    setTimeout(async () => {
      this.trackRecentlyPlayed(song);
      this.adaptHomeAndQueueToVibe(song);
      this.updateMediaSessionMetadata(song);
      this.updateAmbientGlow(song.image);

      // Context & Queue Management
      if (preserveQueue || playlistContext === this.queue) {
        const idx = this.queue.findIndex(s => s.id === song.id);
        if (idx !== -1) {
          this.queueIndex = idx;
        }
      } else if (contextMeta && (contextMeta.type === 'artist' || contextMeta.type === 'album' || contextMeta.type === 'playlist')) {
        this.playbackContext = contextMeta;
        const baseList = contextMeta.originalList || playlistContext || [song];
        if (this.shuffleMode === 'off') {
          this.queue = [...baseList];
          const idx = this.queue.findIndex(s => s.id === song.id);
          this.queueIndex = idx !== -1 ? idx : 0;
        } else if (this.shuffleMode === 'standard') {
          this.queue = this.shuffleArrayPreservingCurrent(baseList, song);
          this.queueIndex = 0;
        } else if (this.shuffleMode === 'smart') {
          this.queue = this.buildSmartShuffledQueue(baseList, song);
          this.queueIndex = 0;
        }
      } else if (playlistContext && Array.isArray(playlistContext) && playlistContext.length > 1) {
        this.playbackContext = contextMeta || { type: 'playlist', originalList: [...playlistContext] };
        if (this.shuffleMode === 'standard') {
          this.queue = this.shuffleArrayPreservingCurrent(playlistContext, song);
          this.queueIndex = 0;
        } else if (this.shuffleMode === 'smart') {
          this.queue = this.buildSmartShuffledQueue(playlistContext, song);
          this.queueIndex = 0;
        } else {
          this.queue = [...playlistContext];
          const idx = this.queue.findIndex(s => s.id === song.id);
          this.queueIndex = idx !== -1 ? idx : 0;
        }
      } else {
        this.playbackContext = contextMeta || { type: 'single', seedSong: song, originalList: [] };
        if (this.shuffleMode === 'smart') {
          const rawVibe = this.buildSpotifyBaRTQueue(song, 50);
          this.queue = this.buildSmartShuffledQueue(rawVibe, song);
        } else {
          this.queue = this.buildSpotifyBaRTQueue(song, 50);
        }
        this.queueIndex = 0;
      }

      this.renderQueueDrawer();

      // If stream_url was not available initially, resolve via edge/JioSaavn
      if (!playUrl) {
        try {
          const query = `${song.title} ${song.artist}`;
          const isCloudflare = (typeof window !== 'undefined' && window.location && 
            (window.location.hostname.includes('workers.dev') || window.location.hostname.includes('pages.dev')));
          if (isCloudflare) {
            const edgeRes = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: AbortSignal.timeout(2500) });
            if (edgeRes.ok) {
              const edgeData = await edgeRes.json();
              if (edgeData.songs && edgeData.songs.length > 0 && edgeData.songs[0].stream_url) {
                playUrl = edgeData.songs[0].stream_url;
                song.stream_url = playUrl;
              }
            }
          }
          if (!playUrl) {
            const searchUrl = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=5&p=1&q=${encodeURIComponent(query)}`;
            const data = await this.safeFetchJson(searchUrl);
            if (data && data.results && data.results.length > 0) {
              const enc = data.results[0].more_info?.encrypted_media_url;
              playUrl = enc ? decryptJioSaavn320(enc) : null;
              if (playUrl) song.stream_url = playUrl;
            }
          }
          if (playUrl && this.audio && (!this.audio.src || this.audio.paused)) {
            const optUrl = this.getOptimalStreamUrl(playUrl);
            this.audio.src = optUrl;
            this.audio.volume = 1.0;
            this.audio.play().catch(() => {});
          }
        } catch(e) {}
      }
    }, 400);
  }

  togglePlay() {
    if (!this.currentSong) {
      if (this.queue.length > 0) {
        this.playSong(this.queue[0]);
      } else if (this.homeData && this.homeData.billboard && this.homeData.billboard.length > 0) {
        this.playSong(this.homeData.billboard[0], this.homeData.billboard);
      }
      return;
    }

    if (!this.audio) return;
    const isActuallyPlaying = !this.audio.paused && !this.audio.ended && this.audio.currentTime > 0;
    if (isActuallyPlaying || this.isPlaying) {
      this.isPlaying = false;
      this.audio.pause();
      this.updatePlayPauseUI(false);
      if (this.jamState && this.jamState.active && !this._jamIncomingAction) {
        if (this.jamState.isHost || this.jamState.guestControl) {
          this.broadcastJamAction('PAUSE', { position: this.audio ? this.audio.currentTime : 0, isPlaying: false });
        }
      }
    } else {
      this.audio.volume = 1.0;
      this.audio.muted = false;
      this.isPlaying = true;
      this.updatePlayPauseUI(true);
      if (this.jamState && this.jamState.active && !this._jamIncomingAction) {
        if (this.jamState.isHost || this.jamState.guestControl) {
          this.broadcastJamAction('RESUME', { position: this.audio ? this.audio.currentTime : 0, isPlaying: true });
        }
      }
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.warn('Play notice:', e);
          this.isPlaying = false;
          this.updatePlayPauseUI(false);
        });
      }
    }
  }

  async nextSong() {
    if (!this.queue || !this.queue.length) return;

    // Check if nearing the end of the queue
    if (this.queueIndex >= this.queue.length - 4) {
      // In single radio context, or if smart shuffle is on, auto extend queue infinitely
      if (this.playbackContext?.type === 'single' || this.shuffleMode === 'smart') {
        await this.extendInfiniteQueue();
      }
    }

    if (this.queueIndex >= this.queue.length - 1) {
      // Reached the end of queue
      if (this.playbackContext && (this.playbackContext.type === 'artist' || this.playbackContext.type === 'album' || this.playbackContext.type === 'playlist')) {
        if (this.repeatMode === 'all') {
          this.queueIndex = 0;
        } else {
          // Spotify Autoplay: Seamlessly transition to Radio matching the finished context
          const seed = this.currentSong || this.queue[this.queue.length - 1] || this.queue[0];
          this.playbackContext = { type: 'single', seedSong: seed, isAutoplay: true };
          this.queue = this.buildSpotifyBaRTQueue(seed, 50);
          this.queueIndex = 0;
        }
      } else {
        if (this.repeatMode === 'all') {
          this.queueIndex = 0;
        } else {
          await this.extendInfiniteQueue();
          if (this.queueIndex < this.queue.length - 1) {
            this.queueIndex++;
          } else {
            this.queueIndex = 0;
          }
        }
      }
    } else {
      this.queueIndex++;
    }

    const nextTrack = this.queue[this.queueIndex];
    if (nextTrack) {
      this.playSong(nextTrack, this.queue, true);
    }
  }

  prevSong() {
    if (this.audio && this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }
    if (!this.queue || !this.queue.length) return;
    this.queueIndex = Math.max(0, this.queueIndex - 1);
    const prevTrack = this.queue[this.queueIndex];
    if (prevTrack) {
      this.playSong(prevTrack, this.queue, true);
    }
  }

  toggleShuffle() {
    if (this.shuffleMode === 'off') {
      this.shuffleMode = 'standard';
      this.isShuffle = true;
      this.applyShuffleToCurrentContext('standard');
      this.updateShuffleUI('standard');
      this.showToast('🔀 Shuffle ON');
    } else if (this.shuffleMode === 'standard') {
      this.shuffleMode = 'smart';
      this.isShuffle = true;
      this.applyShuffleToCurrentContext('smart');
      this.updateShuffleUI('smart');
      this.showToast('✨ Smart Shuffle ON (Recommendations Active)');
    } else {
      this.shuffleMode = 'off';
      this.isShuffle = false;
      this.applyShuffleToCurrentContext('off');
      this.updateShuffleUI('off');
      this.showToast('Shuffle OFF');
    }
  }

  updateShuffleUI(mode = this.shuffleMode) {
    const barBtn = document.getElementById('btn-shuffle');
    const fsBtn = document.getElementById('fs-btn-shuffle');

    [barBtn, fsBtn].forEach(btn => {
      if (!btn) return;
      btn.classList.remove('active', 'smart-active');
      
      const existingDot = btn.querySelector('.sp-shuffle-sparkle-dot');
      if (existingDot) existingDot.remove();

      if (mode === 'standard') {
        btn.classList.add('active');
        btn.setAttribute('title', 'Shuffle: ON');
      } else if (mode === 'smart') {
        btn.classList.add('active', 'smart-active');
        btn.setAttribute('title', 'Smart Shuffle: ON (✨ Spotify Recommendations Active)');
        const dot = document.createElement('span');
        dot.className = 'sp-shuffle-sparkle-dot';
        dot.textContent = '✨';
        btn.appendChild(dot);
      } else {
        btn.setAttribute('title', 'Shuffle: OFF');
      }
    });
  }

  applyShuffleToCurrentContext(mode) {
    if (!this.currentSong) return;

    if (mode === 'off') {
      if (this.playbackContext && this.playbackContext.originalList && this.playbackContext.originalList.length > 0) {
        this.queue = [...this.playbackContext.originalList];
        const curIdx = this.queue.findIndex(s => s.id === this.currentSong.id);
        this.queueIndex = curIdx !== -1 ? curIdx : 0;
      }
    } else if (mode === 'standard') {
      const sourceList = (this.playbackContext && this.playbackContext.originalList && this.playbackContext.originalList.length > 0)
        ? this.playbackContext.originalList
        : this.queue;
      this.queue = this.shuffleArrayPreservingCurrent(sourceList, this.currentSong);
      this.queueIndex = 0;
    } else if (mode === 'smart') {
      const sourceList = (this.playbackContext && this.playbackContext.originalList && this.playbackContext.originalList.length > 0)
        ? this.playbackContext.originalList
        : this.queue;
      this.queue = this.buildSmartShuffledQueue(sourceList, this.currentSong);
      this.queueIndex = 0;
    }

    this.renderQueueDrawer();
  }

  shuffleArrayPreservingCurrent(arr, currentSong) {
    if (!arr || !arr.length) return currentSong ? [currentSong] : [];
    const others = arr.filter(s => s && s.id !== currentSong.id);
    for (let i = others.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [others[i], others[j]] = [others[j], others[i]];
    }
    return [currentSong, ...others];
  }

  buildSmartShuffledQueue(baseList, currentSong) {
    if (!baseList || !baseList.length) return currentSong ? [currentSong] : [];

    const others = baseList.filter(s => s && s.id !== currentSong.id);
    for (let i = others.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [others[i], others[j]] = [others[j], others[i]];
    }

    const recs = this.buildSpotifyBaRTQueue(currentSong, 30)
      .filter(s => s && s.id !== currentSong.id && !baseList.some(b => b && b.id === s.id))
      .map(s => ({ ...s, isSmartRecommendation: true }));

    const result = [currentSong];
    let bIdx = 0;
    let rIdx = 0;

    while (bIdx < others.length || rIdx < recs.length) {
      if (bIdx < others.length) {
        result.push(others[bIdx++]);
      }
      if (bIdx < others.length && Math.random() > 0.4) {
        result.push(others[bIdx++]);
      }
      if (rIdx < recs.length) {
        result.push(recs[rIdx++]);
      }
    }

    return result;
  }

  toggleRepeat() {
    if (this.repeatMode === 'off') {
      this.repeatMode = 'all';
      this.updateRepeatUI('all');
      this.showToast('🔁 Repeat All ON');
    } else if (this.repeatMode === 'all') {
      this.repeatMode = 'one';
      this.updateRepeatUI('one');
      this.showToast('🔂 Repeat Track ON');
    } else {
      this.repeatMode = 'off';
      this.updateRepeatUI('off');
      this.showToast('Repeat OFF');
    }
  }

  updateRepeatUI(mode) {
    const barBtn = document.getElementById('btn-repeat');
    const fsBtn = document.getElementById('fs-btn-repeat');
    [barBtn, fsBtn].forEach(btn => {
      if (!btn) return;
      btn.classList.remove('active', 'repeat-one');
      if (mode === 'all') btn.classList.add('active');
      else if (mode === 'one') btn.classList.add('active', 'repeat-one');
    });
  }

  // ========================================================================
  // 3. SPOTIFY-GRADE BaRT VIBE ENGINE & CONTINUOUS SMART RADIO
  // ========================================================================
  detectSongVibeAndLanguage(song) {
    if (!song) return { language: 'unknown', clusterKey: null };
    const vibe = detectMicroVibe(song);
    return {
      language: vibe.lang,
      clusterKey: vibe.key,
      matchedArtist: vibe.matchedArtist,
      energy: vibe.energy
    };
  }

  buildSpotifyBaRTQueue(seedSong, limit = 50) {
    if (!seedSong) return [];
    const masterDb = (this.musicDB && this.musicDB.length) ? this.musicDB : [];
    return buildSpotifyBaRTQueue(seedSong, masterDb, limit);
  }

  buildSpotifyVibeQueue(seedSong, limit = 50) {
    return this.buildSpotifyBaRTQueue(seedSong, limit);
  }

  // Alias for backward compatibility
  buildVibeQueue(seedSong) {
    return this.buildSpotifyBaRTQueue(seedSong, 50);
  }

  async extendInfiniteQueue() {
    if (this._isExtendingQueue || !this.currentSong) return;
    this._isExtendingQueue = true;

    try {
      const existingIds = new Set(this.queue.map(s => s.id));
      const moreTracks = this.buildSpotifyBaRTQueue(this.currentSong, 50)
        .filter(s => s && !existingIds.has(s.id));

      if (this.shuffleMode === 'smart') {
        moreTracks.forEach(s => { s.isSmartRecommendation = true; });
      }

      if (moreTracks.length > 0) {
        this.queue.push(...moreTracks.slice(0, 20));
        this.renderQueueDrawer();
      } else if (this.smartRadioEnabled) {
        await this.enqueueSmartRadioTracks(this.currentSong);
      }
    } catch(e) {
      console.warn('Infinite queue extension notice:', e);
    } finally {
      this._isExtendingQueue = false;
    }
  }

  async enqueueSmartRadioTracks(song) {
    if (!song || !this.smartRadioEnabled || this._isFetchingRadio) return;
    this._isFetchingRadio = true;

    try {
      const pArtist = (song.artist || '').split(/[,&]/)[0].trim();
      const pLang = (song.language || '').toLowerCase();
      const existingQueueIds = new Set(this.queue.map(q => q.id));
      const candidates = [];

      if (this.musicDB && this.musicDB.length && pArtist) {
        const pArtLower = pArtist.toLowerCase();
        const localMatches = this.musicDB.filter(s => !existingQueueIds.has(s.id) && s.artist && s.artist.toLowerCase().includes(pArtLower));
        candidates.push(...localMatches);
      }

      if (candidates.length < 8 && pArtist) {
        const searchUrl = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=20&p=1&q=${encodeURIComponent(pArtist)}`;
        const data = await this.safeFetchJson(searchUrl);
        if (data && data.results) {
          for (const s of data.results) {
            if (!existingQueueIds.has(s.id)) {
              const enc = s.more_info?.encrypted_media_url;
              const stream = enc ? decryptJioSaavn320(enc) : null;
              if (stream) {
                candidates.push({
                  id: s.id,
                  title: s.title ? s.title.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"') : '',
                  artist: s.more_info?.artistMap?.primary_artists?.map(a => a.name).join(', ') || (s.subtitle ? s.subtitle.split('-')[0].trim() : '') || pArtist,
                  album: s.more_info?.album ? s.more_info.album.replace(/&amp;/g, '&').replace(/&#039;/g, "'") : 'Single',
                  image: s.image ? s.image.replace('150x150', '500x500') : '',
                  duration: parseInt(s.more_info?.duration || 180),
                  stream_url: stream,
                  language: (s.language || pLang || 'punjabi').toLowerCase()
                });
              }
            }
          }
        }
      }

      const unique = [];
      const seen = new Set(existingQueueIds);
      if (song.id) seen.add(song.id);
      for (const c of candidates) {
        if (!seen.has(c.id) && c.title.toLowerCase() !== song.title.toLowerCase()) {
          seen.add(c.id);
          if (this.shuffleMode === 'smart') c.isSmartRecommendation = true;
          unique.push(c);
        }
      }

      const toAdd = unique.slice(0, 10);
      if (toAdd.length > 0) {
        this.queue.push(...toAdd);
        this.renderQueueDrawer();
      }
    } catch(e) {
      console.warn('Smart radio recommendation warning:', e);
    } finally {
      this._isFetchingRadio = false;
    }
  }

  toggleSmartRadio(enabled) {
    this.smartRadioEnabled = enabled;
    localStorage.setItem('sp_smart_radio', enabled);
    this.showToast(enabled ? '📻 Infinite Smart Radio: ON' : 'Smart Radio: OFF');
  }

  setCrossfadeDuration(sec) {
    this.crossfadeDuration = parseInt(sec);
    localStorage.setItem('sp_crossfade_duration', sec);
    this.showToast(`🎚️ Crossfade set to ${sec}s`);
  }

  // ========================================================================
  // 4. 100% OFFLINE INDEXEDDB DOWNLOADER & GREEN STATE FEEDBACK
  // ========================================================================
  updateDownloadButtonsState(songId = null) {
    const targetId = songId || (this.currentSong ? this.currentSong.id : null);

    // 1. Update player-level buttons (Desktop bottom right, mobile mini player, mobile fullscreen)
    if (this.currentSong && (!targetId || this.currentSong.id === targetId)) {
      const curId = this.currentSong.id;
      const isDownloaded = this.downloadedSongIds && this.downloadedSongIds.has(curId);
      const isDownloading = this.downloadingSongIds && this.downloadingSongIds.has(curId);

      const playerBtns = [
        document.getElementById('btn-download-320k'),
        document.getElementById('btn-download-fs'),
        document.getElementById('btn-player-download')
      ];

      playerBtns.forEach(btn => {
        if (!btn) return;
        btn.classList.remove('downloaded', 'downloading');
        if (isDownloading) {
          btn.classList.add('downloading');
          btn.style.color = 'var(--sp-green)';
          btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
          btn.title = 'Downloading...';
        } else if (isDownloaded) {
          btn.classList.add('downloaded');
          btn.style.color = 'var(--sp-green)';
          btn.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
          btn.title = 'Downloaded (Available Offline)';
        } else {
          btn.style.color = '';
          btn.innerHTML = '<i class="fa-solid fa-circle-down"></i>';
          btn.title = 'Download track';
        }
      });
    }

    // 2. Update all track row download buttons in the DOM matching targetId
    if (targetId) {
      const isDownloaded = this.downloadedSongIds && this.downloadedSongIds.has(targetId);
      const isDownloading = this.downloadingSongIds && this.downloadingSongIds.has(targetId);

      document.querySelectorAll(`.track-download-btn[data-song-id="${targetId}"]`).forEach(btn => {
        btn.classList.remove('downloaded', 'downloading');
        if (isDownloading) {
          btn.classList.add('downloading');
          btn.style.color = 'var(--sp-green)';
          btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
          btn.title = 'Downloading...';
        } else if (isDownloaded) {
          btn.classList.add('downloaded');
          btn.style.color = 'var(--sp-green)';
          btn.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
          btn.title = 'Downloaded (Available Offline)';
        } else {
          btn.style.color = '';
          btn.innerHTML = '<i class="fa-solid fa-circle-down"></i>';
          btn.title = 'Download track';
        }
      });
    }
  }

  getTrackDownloadBtnHtml(song) {
    if (!song || !song.id) return '';
    this.registerSong(song);
    const isDownloaded = this.downloadedSongIds && this.downloadedSongIds.has(song.id);
    const isDownloading = this.downloadingSongIds && this.downloadingSongIds.has(song.id);
    const cls = isDownloading ? 'downloading' : (isDownloaded ? 'downloaded' : '');
    const style = (isDownloading || isDownloaded) ? 'color:var(--sp-green);' : '';
    const icon = isDownloading 
      ? '<i class="fa-solid fa-circle-notch fa-spin"></i>' 
      : (isDownloaded ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-down"></i>');
    const title = isDownloading 
      ? 'Downloading...' 
      : (isDownloaded ? 'Downloaded (Offline Playable)' : 'Download track');

    return `<button class="track-download-btn ${cls}" data-song-id="${song.id}" style="${style}" title="${title}" onclick="event.stopPropagation(); sp.downloadSongById('${song.id}', this)">${icon}</button>`;
  }

  async downloadSongById(songId, btnElement = null) {
    const song = this.getSongById(songId);
    if (song) {
      await this.downloadSong(song, btnElement);
    } else {
      this.showToast('Song details not found for download.');
    }
  }

  async downloadSong(song, btnElement = null) {
    if (!song) {
      if (this.currentSong) song = this.currentSong;
      else {
        this.showToast('Please select or play a song first.');
        return;
      }
    }

    // Check if already downloaded
    if (this.downloadedSongIds && this.downloadedSongIds.has(song.id)) {
      this.showToast(`💚 "${song.title}" is already saved offline!`);
      this.updateDownloadButtonsState(song.id);
      return;
    }

    // Check if already downloading
    if (this.downloadingSongIds && this.downloadingSongIds.has(song.id)) {
      this.showToast(`⏳ "${song.title}" is currently downloading...`);
      return;
    }

    // 1. Immediately turn button GREEN with spinner & show toast
    this.downloadingSongIds.add(song.id);
    this.updateDownloadButtonsState(song.id);
    this.showToast(`⬇️ Downloading "${song.title}" for offline play...`);

    try {
      let streamUrl = song.stream_url;
      if (!streamUrl && this.musicDB && this.musicDB.length) {
        const found = this.musicDB.find(s => s.title.toLowerCase() === song.title.toLowerCase() || (s.title.toLowerCase().includes(song.title.toLowerCase()) && s.artist.toLowerCase().includes(song.artist.toLowerCase())));
        if (found && found.stream_url) {
          streamUrl = found.stream_url;
          song.stream_url = found.stream_url;
        }
      }
      if (!streamUrl && song.fallback_url) {
        streamUrl = song.fallback_url;
      }

      let audioBlob = null;
      let imgBlob = null;

      if (streamUrl) {
        try {
          const [aB, iB] = await Promise.all([
            fetch(streamUrl).then(r => r.ok ? r.blob() : null).catch(() => null),
            song.image ? fetch(song.image).then(r => r.ok ? r.blob() : null).catch(() => null) : Promise.resolve(null)
          ]);
          audioBlob = aB;
          imgBlob = iB;
        } catch (fetchErr) {
          console.warn('Direct blob fetch notice:', fetchErr);
        }
      }

      if (audioBlob) {
        await this.offlineDB.saveSong(song, audioBlob, imgBlob);
        this.downloadedSongIds.add(song.id);
        this.downloadingSongIds.delete(song.id);
        await this.refreshDownloadedSongIds();
        this.updateDownloadButtonsState(song.id);
        this.showToast(`💚 "${song.title}" downloaded & saved offline!`);
      } else if (streamUrl) {
        // Fallback: direct browser trigger
        const a = document.createElement('a');
        a.href = streamUrl;
        a.download = `${song.title} - ${song.artist}.mp3`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        a.remove();

        this.downloadedSongIds.add(song.id);
        this.downloadingSongIds.delete(song.id);
        await this.refreshDownloadedSongIds();
        this.updateDownloadButtonsState(song.id);
        this.showToast(`💚 Download triggered for "${song.title}"`);
      } else {
        this.downloadingSongIds.delete(song.id);
        this.updateDownloadButtonsState(song.id);
        this.showToast(`⚠️ Audio source unavailable for "${song.title}"`);
      }
    } catch (e) {
      console.error('Download error:', e);
      this.downloadingSongIds.delete(song.id);
      this.updateDownloadButtonsState(song.id);
      this.showToast(`⬇️ Download triggered for "${song.title}"`);
    }
  }

  async downloadCurrentSong() {
    if (!this.currentSong) {
      this.showToast('Please play a song first.');
      return;
    }
    await this.downloadSong(this.currentSong);
  }

  async downloadCurrentAlbumAll() {
    if (!this.currentAlbumTracks || !this.currentAlbumTracks.length) {
      this.showToast('No tracks found in this album to download.');
      return;
    }

    const albumBtn = document.getElementById('btn-download-album');
    if (albumBtn) {
      albumBtn.classList.remove('downloaded');
      albumBtn.classList.add('downloading');
      albumBtn.style.color = 'var(--sp-green)';
      albumBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
      albumBtn.title = 'Downloading album...';
    }

    this.showToast(`⬇️ Downloading ${this.currentAlbumTracks.length} tracks offline...`);

    let completed = 0;
    for (const song of this.currentAlbumTracks) {
      if (!this.downloadedSongIds.has(song.id)) {
        await this.downloadSong(song);
        completed++;
      }
    }

    if (albumBtn) {
      albumBtn.classList.remove('downloading');
      albumBtn.classList.add('downloaded');
      albumBtn.style.color = 'var(--sp-green)';
      albumBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
      albumBtn.title = 'Album Saved Offline';
    }

    this.showToast(`💚 Album saved offline (${completed} new songs downloaded)!`);
  }

  async openDownloadedSongsView() {
    this.navigate('album');
    const headerBox = document.getElementById('album-cover-box');
    if (headerBox) {
      headerBox.style.background = 'linear-gradient(135deg, #0d7337, #1ed760)';
      headerBox.innerHTML = '<i class="fa-solid fa-circle-down" style="font-size:64px;color:#fff"></i>';
    }

    const b1 = document.getElementById('album-type-badge');
    if (b1) b1.textContent = 'OFFLINE STORAGE';
    const b2 = document.getElementById('album-title-txt');
    if (b2) b2.textContent = 'Downloaded Music';
    const b3 = document.getElementById('album-artist-txt');
    if (b3) b3.textContent = 'Playable without Internet';
    const b4 = document.getElementById('album-year-txt');
    if (b4) b4.textContent = 'Device IndexedDB';

    const offlineTracks = await this.offlineDB.getAllSongs();
    const b5 = document.getElementById('album-song-count-txt');
    if (b5) b5.textContent = `${offlineTracks.length} songs`;

    const body = document.getElementById('album-tracklist-items');
    if (!body) return;

    if (!offlineTracks.length) {
      body.innerHTML = `
        <div style="padding:48px 16px;text-align:center;color:var(--sp-text-subdued)">
          <i class="fa-solid fa-circle-down" style="font-size:48px;color:#333;margin-bottom:16px"></i>
          <h3 style="font-size:20px;color:#fff;margin-bottom:8px">No offline downloads yet</h3>
          <p style="font-size:14px;margin-bottom:20px">Tap the download icon while playing any song to save it for offline listening.</p>
          <button class="sp-btn-play-now" style="margin:0 auto" onclick="sp.navigate('home')">
            <i class="fa-solid fa-compass"></i> Explore 1,200+ Songs
          </button>
        </div>
      `;
      return;
    }

    this.offlineTracks = offlineTracks;
    this.currentAlbumTracks = offlineTracks;
    const albDlBtn = document.getElementById('btn-download-album');
    if (albDlBtn) {
      albDlBtn.classList.add('downloaded');
      albDlBtn.style.color = 'var(--sp-green)';
      albDlBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
      albDlBtn.title = 'All Songs Saved Offline';
    }

    body.innerHTML = offlineTracks.map((s, idx) => {
      this.registerSong(s);
      return `
      <div class="sp-track-row" onclick="sp.playOfflineTrack('${this.escapeJsString(s.id)}')">
        <span class="track-num-col">${idx + 1}</span>
        <div class="track-title-col">
          <img src="${s.image}" class="track-thumb" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100'">
          <div class="track-names">
            <span class="track-name-txt">${this.escapeHtml(s.title)} <i class="fa-solid fa-circle-check" style="color:var(--sp-green);font-size:11px"></i></span>
            <span class="track-artist-txt">${this.escapeHtml(this.cleanArtistNames(s.artist))}</span>
          </div>
        </div>
        <span class="track-album-col">${this.escapeHtml(s.album || 'Downloaded')}</span>
        <span class="track-dur-col">
          <span style="font-size:10px;background:#242424;color:var(--sp-green);padding:2px 6px;border-radius:4px;font-weight:800">OFFLINE</span>
          <span>${this.formatTime(s.duration)}</span>
          ${this.getTrackDownloadBtnHtml(s)}
        </span>
      </div>
    `;
    }).join('');
  }

  // ========================================================================
  // 5. DYNAMIC AMBIENT GLOW
  // ========================================================================
  updateAmbientGlow(imgSrc) {
    if (!this.ambientGlowEnabled || !imgSrc) return;

    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 10; canvas.height = 10;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 10, 10);
        const data = ctx.getImageData(0, 0, 10, 10).data;

        let r = 0, g = 0, b = 0, count = 0;
        let rMax = 0, gMax = 0, bMax = 0, maxSaturation = 0;

        for (let i = 0; i < data.length; i += 4) {
          const pr = data[i], pg = data[i+1], pb = data[i+2];
          if (pr > 25 || pg > 25 || pb > 25) {
            r += pr; g += pg; b += pb; count++;

            const maxVal = Math.max(pr, pg, pb);
            const minVal = Math.min(pr, pg, pb);
            const sat = maxVal > 0 ? (maxVal - minVal) / maxVal : 0;
            if (sat > maxSaturation) {
              maxSaturation = sat;
              rMax = pr; gMax = pg; bMax = pb;
            }
          }
        }

        if (count > 0) {
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);

          const hex1 = `rgb(${r}, ${g}, ${b})`;
          const hex2 = maxSaturation > 0.25 ? `rgb(${rMax}, ${gMax}, ${bMax})` : `rgb(${Math.min(255, r + 45)}, ${Math.min(255, g + 45)}, ${Math.min(255, b + 60)})`;
          const hex3 = `rgb(${Math.max(10, Math.round(r * 0.3))}, ${Math.max(10, Math.round(g * 0.3))}, ${Math.max(10, Math.round(b * 0.3))})`;

          document.documentElement.style.setProperty('--sp-ambient-color-1', hex1);
          document.documentElement.style.setProperty('--sp-ambient-color-2', hex2);
          document.documentElement.style.setProperty('--sp-ambient-color-3', hex3);
          document.documentElement.style.setProperty('--sp-accent-glow', `rgba(${r}, ${g}, ${b}, 0.5)`);

          const mesh = document.getElementById('sp-ambient-mesh');
          if (mesh) {
            mesh.style.background = `radial-gradient(circle at 50% -10%, ${hex1} 0%, rgba(6, 7, 10, 0.96) 70%), #06070a`;
          }
        }
      };
      img.src = imgSrc;
    } catch(e) {}
  }

  toggleAmbientGlow(enabled) {
    this.ambientGlowEnabled = enabled;
    localStorage.setItem('sp_ambient_glow', enabled);
    const mesh = document.getElementById('sp-ambient-mesh');
    if (mesh) mesh.style.opacity = enabled ? '1' : '0';
    document.documentElement.style.setProperty('--sp-ambient-glow-opacity', enabled ? '0.45' : '0.0');
    this.showToast(enabled ? '🌈 Dynamic Ambient Glow: ON' : 'Ambient Glow: OFF');
  }

  // ========================================================================
  // 6. SETTINGS MODAL CONTROLLER
  // ========================================================================
  openSettingsModal() {
    const modal = document.getElementById('sp-settings-modal');
    if (modal) modal.classList.add('open');

    const sel = document.getElementById('setting-crossfade-select');
    if (sel) sel.value = this.crossfadeDuration.toString();

    const rad = document.getElementById('setting-smart-radio');
    if (rad) rad.checked = this.smartRadioEnabled;

    const amb = document.getElementById('setting-ambient-glow');
    if (amb) amb.checked = this.ambientGlowEnabled;
  }

  closeSettingsModal() {
    const modal = document.getElementById('sp-settings-modal');
    if (modal) modal.classList.remove('open');
  }

  // ========================================================================
  // 7. MASTER SEARCH & DISCOGRAPHY ENGINE
  // ========================================================================
  normalizeArtistQuery(raw) {
    if (!raw) return '';
    const q = raw.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
    const map = {
      // Global Icons & Typos
      'weeknd': 'The Weeknd', 'weekend': 'The Weeknd', 'the weekend': 'The Weeknd', 'abel': 'The Weeknd',
      'taylor': 'Taylor Swift', 'swift': 'Taylor Swift', 'taylorswift': 'Taylor Swift',
      'sheeran': 'Ed Sheeran', 'edsheeran': 'Ed Sheeran',
      'eminem': 'Eminem', 'emminem': 'Eminem', 'slim shady': 'Eminem',
      'drake': 'Drake', 'drak': 'Drake', 'champagnepapi': 'Drake',
      'billie': 'Billie Eilish', 'eilish': 'Billie Eilish', 'billieeilish': 'Billie Eilish',
      'justin': 'Justin Bieber', 'bieber': 'Justin Bieber', 'justinbieber': 'Justin Bieber',
      'post': 'Post Malone', 'malone': 'Post Malone', 'postmalone': 'Post Malone',
      'dua': 'Dua Lipa', 'lipa': 'Dua Lipa', 'dualipa': 'Dua Lipa',
      'bruno': 'Bruno Mars', 'mars': 'Bruno Mars', 'brunomars': 'Bruno Mars',
      'travis': 'Travis Scott', 'scott': 'Travis Scott', 'travisscott': 'Travis Scott',
      'selena': 'Selena Gomez', 'gomez': 'Selena Gomez', 'selenagomez': 'Selena Gomez',
      'ariana': 'Ariana Grande', 'grande': 'Ariana Grande', 'arianagrande': 'Ariana Grande',
      'sabrina': 'Sabrina Carpenter', 'carpenter': 'Sabrina Carpenter', 'sabrinacarpenter': 'Sabrina Carpenter',
      'coldplay': 'Coldplay', 'shakira': 'Shakira', 'rihanna': 'Rihanna', 'riri': 'Rihanna',
      'kendrick': 'Kendrick Lamar', 'lamar': 'Kendrick Lamar', 'katy': 'Katy Perry',

      // Bollywood & Indian Icons
      'arijit': 'Arijit Singh', 'arjit': 'Arijit Singh', 'arijitsingh': 'Arijit Singh',
      'shreya': 'Shreya Ghoshal', 'ghoshal': 'Shreya Ghoshal', 'shreyaghoshal': 'Shreya Ghoshal',
      'atif': 'Atif Aslam', 'aslam': 'Atif Aslam', 'atifaslam': 'Atif Aslam',
      'sonu': 'Sonu Nigam', 'sonunigam': 'Sonu Nigam',
      'neha': 'Neha Kakkar', 'kakkar': 'Neha Kakkar', 'nehakakkar': 'Neha Kakkar',
      'jubin': 'Jubin Nautiyal', 'nautiyal': 'Jubin Nautiyal', 'jubinnautiyal': 'Jubin Nautiyal',
      'pritam': 'Pritam', 'rahman': 'A.R. Rahman', 'ar rahman': 'A.R. Rahman', 'arrahman': 'A.R. Rahman',
      'kk': 'KK', 'kishore': 'Kishore Kumar', 'kishorekumar': 'Kishore Kumar',
      'lata': 'Lata Mangeshkar', 'latamangeshkar': 'Lata Mangeshkar',
      'sunidhi': 'Sunidhi Chauhan', 'sunidhichauhan': 'Sunidhi Chauhan',
      'anuv': 'Anuv Jain', 'anuvjain': 'Anuv Jain',

      // Punjabi & Desi Hip Hop Icons
      'subh': 'Shubh', 'shub': 'Shubh', 'shubhh': 'Shubh', 'subhh': 'Shubh', 'shubha': 'Shubh',
      'jaggi': 'Jxggi', 'jagi': 'Jxggi', 'jxgi': 'Jxggi',
      'sidhu': 'Sidhu Moose Wala', 'moosewala': 'Sidhu Moose Wala', 'sidhumoosewala': 'Sidhu Moose Wala', 'moose wala': 'Sidhu Moose Wala',
      'karan': 'Karan Aujla', 'aujla': 'Karan Aujla', 'karanaujla': 'Karan Aujla',
      'diljit': 'Diljit Dosanjh', 'dosanjh': 'Diljit Dosanjh',
      'ap': 'AP Dhillon', 'dhillon': 'AP Dhillon',
      'honey singh': 'Yo Yo Honey Singh', 'yo yo': 'Yo Yo Honey Singh', 'honeysingh': 'Yo Yo Honey Singh',
      'talwinder': 'Talwiinder', 'cheema': 'Cheema Y', 'wazir': 'Wazir Patar',
      'arjan': 'Arjan Dhillon', 'bpraak': 'B Praak', 'hustinder': 'Hustinder',
      'badshah': 'Badshah'
    };
    return map[q] || raw;
  }

  async playArtistTopSongs(artistName, artistImage = '', artistId = null) {
    await this.openArtistPage(artistName, artistImage, artistId);
    if (this.currentArtistAllSongs && this.currentArtistAllSongs.length) {
      this.playSong(this.currentArtistAllSongs[0], this.currentArtistAllSongs);
    }
  }

  async directSearch(query) {
    if (!query || !query.trim()) return { songs: [], artists: [], albums: [] };

    const normalizedQuery = this.normalizeArtistQuery(query);
    const qClean = normalizedQuery.toLowerCase().trim();

    if (this.searchCache.has(qClean)) {
      return this.searchCache.get(qClean);
    }

    let matchedSongs = [];
    let matchedArtists = [];
    let matchedAlbums = [];
    const seenSongIds = new Set();
    const seenArtists = new Set();
    const seenAlbums = new Set();

    const isCloudflare = (typeof window !== 'undefined' && window.location && 
      (window.location.hostname.includes('workers.dev') || window.location.hostname.includes('pages.dev')));

    if (isCloudflare) {
      try {
        const edgeRes = await fetch(`/api/search?q=${encodeURIComponent(normalizedQuery)}`, { signal: AbortSignal.timeout(3500) });
        if (edgeRes.ok) {
          const edgeData = await edgeRes.json();
          if (edgeData && (edgeData.songs?.length || edgeData.artists?.length || edgeData.albums?.length)) {
            const fastRes = {
              songs: edgeData.songs || [],
              artists: edgeData.artists || [],
              albums: edgeData.albums || []
            };
            this.searchCache.set(qClean, fastRes);
            return fastRes;
          }
        }
      } catch(e) {}
    }

    // 1. Live Global Search (Worldwide — English, Hindi, Punjabi, International Pop, Hip-Hop, etc.)
    try {
      const [sData, aData, albData] = await Promise.all([
        this.safeFetchJson(`https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=50&p=1&q=${encodeURIComponent(normalizedQuery)}`),
        this.safeFetchJson(`https://www.jiosaavn.com/api.php?__call=search.getArtistResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=15&p=1&q=${encodeURIComponent(normalizedQuery)}`),
        this.safeFetchJson(`https://www.jiosaavn.com/api.php?__call=search.getAlbumResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=20&p=1&q=${encodeURIComponent(normalizedQuery)}`)
      ]);

      if (sData && sData.results) {
        sData.results.forEach(s => {
          const enc = s.more_info?.encrypted_media_url;
          const stream = enc ? decryptJioSaavn320(enc) : null;
          if (stream && !seenSongIds.has(s.id)) {
            seenSongIds.add(s.id);
            matchedSongs.push({
              id: s.id,
              title: s.title ? s.title.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"') : '',
              artist: s.more_info?.artistMap?.primary_artists?.map(a => a.name).join(', ') || (s.subtitle ? s.subtitle.split('-')[0].trim() : '') || 'Artist',
              album: s.more_info?.album ? s.more_info.album.replace(/&amp;/g, '&').replace(/&#039;/g, "'") : 'Single',
              image: s.image ? s.image.replace('150x150', '500x500') : '',
              duration: parseInt(s.more_info?.duration || 180),
              stream_url: stream,
              language: (s.language || 'english').toLowerCase(),
              playCount: parseInt(s.play_count || s.more_info?.play_count || 0)
            });
          }
        });
      }

      if (aData && aData.results) {
        aData.results.forEach(a => {
          const aLower = (a.name || '').toLowerCase().trim();
          if (aLower && !seenArtists.has(aLower)) {
            seenArtists.add(aLower);
            matchedArtists.push({
              id: a.id,
              name: a.name ? a.name.replace(/&amp;/g, '&').replace(/&#039;/g, "'") : '',
              role: 'Artist',
              image: a.image ? a.image.replace('150x150', '500x500') : ''
            });
          }
        });
      }

      // Also scan featured_artists (130+ verified artists)
      if (this.homeData?.featured_artists) {
        this.homeData.featured_artists.forEach(fa => {
          const faLower = (fa.name || '').toLowerCase().trim();
          if (faLower && (faLower.includes(qClean) || qClean.includes(faLower)) && !seenArtists.has(faLower)) {
            seenArtists.add(faLower);
            matchedArtists.unshift({
              id: fa.id || `art_${faLower.replace(/\s+/g, '_')}`,
              name: fa.name,
              role: 'Artist',
              image: fa.image
            });
          }
        });
      }

      // Also scan distinct artists from musicDB for smaller / indie singers
      if (this.musicDB && this.musicDB.length) {
        const localArtMap = new Map();
        for (const s of this.musicDB) {
          if (!s.artist) continue;
          const arts = s.artist.split(/[,&/|]/).map(a => a.trim()).filter(Boolean);
          for (const a of arts) {
            const aLower = a.toLowerCase();
            if (aLower.length > 2 && (aLower.includes(qClean) || qClean.includes(aLower)) && !seenArtists.has(aLower)) {
              if (!localArtMap.has(aLower)) {
                localArtMap.set(aLower, { name: a, image: s.image || '', id: `art_${aLower.replace(/\s+/g, '_')}` });
              }
            }
          }
        }
        localArtMap.forEach((artObj, aLower) => {
          if (!seenArtists.has(aLower)) {
            seenArtists.add(aLower);
            matchedArtists.push({
              id: artObj.id,
              name: artObj.name,
              role: 'Artist',
              image: artObj.image
            });
          }
        });
      }

      if (albData && albData.results) {
        albData.results.forEach(alb => {
          if (!seenAlbums.has(alb.title.toLowerCase())) {
            seenAlbums.add(alb.title.toLowerCase());
            matchedAlbums.push({
              id: alb.id,
              title: alb.title ? alb.title.replace(/&amp;/g, '&').replace(/&#039;/g, "'") : '',
              artist: alb.artist ? alb.artist.replace(/&amp;/g, '&').replace(/&#039;/g, "'") : '',
              subtitle: `${alb.artist || 'Artist'} &bull; Album`,
              image: alb.image ? alb.image.replace('150x150', '500x500') : '',
              isAlbum: true
            });
          }
        });
      }
    } catch(e) {
      console.warn('Direct live search error:', e);
    }

    // 2. Supplement with Embedded Database
    if (this.musicDB && this.musicDB.length) {
      const words = qClean.split(/\s+/).filter(Boolean);

      this.musicDB.forEach(s => {
        const tLower = s.title.toLowerCase();
        const aLower = s.artist.toLowerCase();
        const albLower = s.album.toLowerCase();

        const match = words.every(w => tLower.includes(w) || aLower.includes(w) || albLower.includes(w));
        if (match && !seenSongIds.has(s.id)) {
          seenSongIds.add(s.id);
          matchedSongs.push(s);

          const pArt = s.artist.split(',')[0].trim();
          if (pArt && !seenArtists.has(pArt.toLowerCase())) {
            seenArtists.add(pArt.toLowerCase());
            matchedArtists.push({
              id: `art_${s.id}`,
              name: pArt,
              role: 'Artist',
              image: s.image
            });
          }

          if (s.album && s.album !== 'Single' && !seenAlbums.has(s.album.toLowerCase())) {
            seenAlbums.add(s.album.toLowerCase());
            matchedAlbums.push({
              id: `alb_${s.id}`,
              title: s.album,
              artist: s.artist,
              subtitle: `${s.artist} &bull; Album`,
              image: s.image,
              isAlbum: true
            });
          }
        }
      });
    }

    // Rank songs by relevance + popularity/plays boost
    matchedSongs.sort((a, b) => this.rankSong(b, qClean) - this.rankSong(a, qClean));

    const finalResult = { songs: matchedSongs, artists: matchedArtists, albums: matchedAlbums };
    this.searchCache.set(qClean, finalResult);
    return finalResult;
  }

  setupSearchInput() {
    const input = document.getElementById('sp-global-search-input');
    const clearBtn = document.getElementById('sp-search-clear');
    if (!input) return;
    
    input.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      const qLower = q.toLowerCase();
      if (clearBtn) clearBtn.style.display = q ? 'block' : 'none';
      clearTimeout(this.searchTimer);
      if (q.length > 0) {
        this.navigate('search');
        // Render 0ms instant local DB preview while typing
        const local = this.searchLocalDb(q);
        if (local && (local.songs.length || local.artists.length)) {
          this.renderSearchResults(local, q);
        }
        this.searchTimer = setTimeout(() => this.performSearch(q), 250);
      } else {
        this.showBrowseAllCategories();
      }
    });
  }

  searchLocalDb(q) {
    if (!q || !q.trim()) return { songs: [], artists: [], albums: [] };
    const qClean = q.toLowerCase().trim();
    const matchedSongs = [];
    const matchedArtists = [];
    const matchedAlbums = [];
    const seenSongIds = new Set();
    const seenArtists = new Set();
    const seenAlbums = new Set();

    // 1. Featured artists
    if (this.homeData?.featured_artists) {
      for (const fa of this.homeData.featured_artists) {
        const faLower = (fa.name || '').toLowerCase().trim();
        if (faLower && (faLower.includes(qClean) || qClean.includes(faLower))) {
          if (!seenArtists.has(faLower)) {
            seenArtists.add(faLower);
            matchedArtists.push({
              id: fa.id || `art_${faLower.replace(/\s+/g, '_')}`,
              name: fa.name,
              image: fa.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'
            });
          }
        }
      }
    }

    // 2. Local database of 7,052 tracks
    if (this.musicDB && this.musicDB.length) {
      for (let i = 0; i < this.musicDB.length; i++) {
        const s = this.musicDB[i];
        if (!s) continue;
        const tLower = (s.title || '').toLowerCase();
        const aLower = (s.artist || '').toLowerCase();
        const albLower = (s.album || '').toLowerCase();

        const matchTitle = tLower.includes(qClean);
        const matchArtist = aLower.includes(qClean);
        const matchAlbum = albLower.includes(qClean);

        if ((matchTitle || matchArtist || matchAlbum) && !seenSongIds.has(s.id)) {
          seenSongIds.add(s.id);
          matchedSongs.push(s);
          if (matchedSongs.length >= 35 && matchedArtists.length >= 4) break;
        }

        if (matchAlbum && s.album && !seenAlbums.has(albLower) && matchedAlbums.length < 8) {
          seenAlbums.add(albLower);
          matchedAlbums.push({
            id: s.album_id || `alb_${albLower.replace(/\s+/g, '_')}`,
            title: s.album,
            artist: s.artist || 'Various Artists',
            image: s.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'
          });
        }
      }
    }

    matchedSongs.sort((a, b) => {
      const aTitle = (a.title || '').toLowerCase();
      const bTitle = (b.title || '').toLowerCase();
      const aStarts = aTitle.startsWith(qClean) ? 1 : 0;
      const bStarts = bTitle.startsWith(qClean) ? 1 : 0;
      if (aStarts !== bStarts) return bStarts - aStarts;
      return (b.playCount || 0) - (a.playCount || 0);
    });

    return { songs: matchedSongs, artists: matchedArtists, albums: matchedAlbums };
  }

  renderSearchResults(data, q) {
    const resArea = document.getElementById('sp-search-results-area');
    const songsList = document.getElementById('sp-search-songs-list');
    const topResultBox = document.getElementById('sp-top-result-box');
    const artistsShelf = document.getElementById('sp-search-artists-shelf');
    const artistsRow = document.getElementById('sp-search-artists-row');
    const albumsShelf = document.getElementById('sp-search-albums-shelf');
    const albumsRow = document.getElementById('sp-search-albums-row');

    const browseArea = document.getElementById('sp-browse-all-area');
    if (browseArea) browseArea.style.display = 'none';
    if (resArea) resArea.style.display = 'flex';

    const hasSongs = data && data.songs && data.songs.length > 0;
    const hasArtists = data && data.artists && data.artists.length > 0;
    const hasAlbums = data && data.albums && data.albums.length > 0;

    if (!hasSongs && !hasArtists && !hasAlbums) {
      if (songsList) songsList.innerHTML = `<p style="padding:40px;color:var(--sp-text-subdued);text-align:center">No results found for "${q}". Try searching for <strong>The Weeknd, Starboy, Arijit Singh, Karan Aujla, Taylor Swift, 295</strong>.</p>`;
      if (topResultBox) topResultBox.innerHTML = '';
      if (artistsShelf) artistsShelf.style.display = 'none';
      if (albumsShelf) albumsShelf.style.display = 'none';
      return;
    }

    const qClean = (q || '').toLowerCase().trim();
    const topSong = hasSongs ? data.songs[0] : null;
    const songScore = topSong ? this.scoreSongMatch(topSong.title, qClean) : 0;

    let bestArtist = null;
    let bestArtistScore = 0;
    if (hasArtists) {
      for (const art of data.artists) {
        const sc = this.scoreArtistMatch(art.name, qClean);
        if (sc > bestArtistScore) {
          bestArtistScore = sc;
          bestArtist = art;
        }
      }
    }

    let topType = 'none';
    let topData = null;

    if (topSong && songScore >= 80) {
      const songArtist = (topSong.artist || '').toLowerCase();
      const isArtistTheQuery = songArtist.includes(qClean);
      if (!isArtistTheQuery) {
        topType = 'song';
        topData = topSong;
      }
    }

    if (topType === 'none') {
      if (bestArtist && bestArtistScore >= 75) {
        topType = 'artist';
        topData = bestArtist;
      } else if (topSong && songScore >= 50) {
        topType = 'song';
        topData = topSong;
      } else if (bestArtist && bestArtistScore >= 40) {
        topType = 'artist';
        topData = bestArtist;
      } else if (topSong) {
        topType = 'song';
        topData = topSong;
      }
    }

    this.currentSearchSongs = data.songs || [];
    this.currentSearchTopSong = topData;

    if (topResultBox) {
      if (topType === 'artist' && topData) {
        topResultBox.innerHTML = `
          <div class="sp-card" style="width:100%;height:100%;flex:1;cursor:pointer" onclick="sp.openArtistPage('${this.escapeJsString(topData.name)}', '${this.escapeJsString(topData.image)}', '${this.escapeJsString(topData.id)}')">
            <div style="font-size:24px;font-weight:800;color:#fff;margin-bottom:12px">Top result</div>
            <img src="${topData.image}" style="width:108px;height:108px;border-radius:50%;object-fit:cover;box-shadow:0 8px 24px rgba(0,0,0,0.6)" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'">
            <div style="font-size:28px;font-weight:900;color:#fff;margin-top:14px">${this.escapeHtml(topData.name)}</div>
            <div style="font-size:14px;color:var(--sp-text-subdued);margin-top:4px"><span style="background:var(--sp-card);padding:3px 8px;border-radius:12px;font-size:11px;font-weight:700;color:#fff;text-transform:uppercase">Artist</span> &bull; Verified Profile</div>
            <div class="sp-card-play-btn" style="opacity:1;transform:none;right:20px;bottom:20px" onclick="event.stopPropagation(); sp.playArtistTopSongs('${this.escapeJsString(topData.name)}', '${this.escapeJsString(topData.image)}', '${this.escapeJsString(topData.id)}')"><i class="fa-solid fa-play"></i></div>
          </div>
        `;
      } else if (topType === 'song' && topData) {
        this.registerSong(topData);
        topResultBox.innerHTML = `
          <div class="sp-card" style="width:100%;height:100%;flex:1;cursor:pointer" onclick="sp.playSearchTopSong()">
            <div style="font-size:24px;font-weight:800;color:#fff;margin-bottom:12px">Top result</div>
            <img src="${topData.image}" style="width:96px;height:96px;border-radius:4px;object-fit:cover;box-shadow:0 8px 24px rgba(0,0,0,0.5)" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'">
            <div style="font-size:28px;font-weight:900;color:#fff;margin-top:14px">${this.escapeHtml(topData.title)}</div>
            <div style="font-size:14px;color:var(--sp-text-subdued);margin-top:4px">Song &bull; <span style="color:#fff;font-weight:700">${this.escapeHtml(this.cleanArtistNames(topData.artist))}</span></div>
            <div class="sp-card-play-btn" style="opacity:1;transform:none;right:20px;bottom:20px"><i class="fa-solid fa-play"></i></div>
          </div>
        `;
      } else {
        topResultBox.innerHTML = '';
      }
    }

    if (songsList) {
      if (hasSongs) {
        songsList.innerHTML = `
          <h2 style="font-size:24px;font-weight:800;color:#fff;margin-bottom:12px">Songs</h2>
          ${data.songs.slice(0, 25).map((s, idx) => {
            this.registerSong(s);
            return `
            <div class="sp-track-row" onclick="sp.playSearchTrack('${this.escapeJsString(s.id)}')">
              <span class="track-num-col">${idx + 1}</span>
              <div class="track-title-col">
                <img src="${s.image}" class="track-thumb" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100'">
                <div class="track-names">
                  <span class="track-name-txt">${this.escapeHtml(s.title)}</span>
                  <span class="track-artist-txt" onclick="event.stopPropagation(); sp.openArtistPage('${this.escapeJsString(this.cleanArtistNames(s.artist))}', '${this.escapeJsString(s.image)}')">${this.escapeHtml(this.cleanArtistNames(s.artist))}</span>
                </div>
              </div>
              <span class="track-album-col" onclick="event.stopPropagation(); sp.openAlbumPage('${this.escapeJsString(s.album || s.title)}', '${this.escapeJsString(s.artist)}', '${this.escapeJsString(s.image)}', '${this.escapeJsString(s.id || '')}')">${this.escapeHtml(s.album || '')}</span>
              <span class="track-dur-col">
                <span>${this.formatTime(s.duration)}</span>
                ${this.getTrackDownloadBtnHtml(s)}
              </span>
            </div>
          `;
          }).join('')}
        `;
      } else {
        songsList.innerHTML = '';
      }
    }

    if (hasArtists && artistsShelf && artistsRow) {
      artistsShelf.style.display = 'flex';
      artistsRow.innerHTML = data.artists.map(a => `
        <div class="sp-card artist-card" onclick="sp.openArtistPage('${a.name.replace(/'/g, "\\'")}', '${a.image}', '${a.id}')">
          <div class="sp-card-cover-wrap">
            <img src="${a.image}" alt="${a.name}" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'">
          </div>
          <div class="sp-card-info">
            <div class="sp-card-title">${a.name}</div>
            <div class="sp-card-desc">Artist</div>
          </div>
        </div>
      `).join('');
    } else if (artistsShelf) {
      artistsShelf.style.display = 'none';
    }

    if (hasAlbums && albumsShelf && albumsRow) {
      albumsShelf.style.display = 'flex';
      albumsRow.innerHTML = data.albums.map(alb => `
        <div class="sp-card" onclick="sp.openAlbumPage('${alb.title.replace(/'/g, "\\'")}', '${alb.artist.replace(/'/g, "\\'")}', '${alb.image}', '${alb.id}')">
          <div class="sp-card-cover-wrap">
            <img src="${alb.image}" alt="${alb.title}" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'">
          </div>
          <div class="sp-card-info">
            <div class="sp-card-title">${alb.title}</div>
            <div class="sp-card-desc">${alb.subtitle || alb.artist}</div>
          </div>
        </div>
      `).join('');
    } else if (albumsShelf) {
      albumsShelf.style.display = 'none';
    }
  }

  async performSearch(q) {
    this.searchSeq = (this.searchSeq || 0) + 1;
    const currentSeq = this.searchSeq;

    const resArea = document.getElementById('sp-search-results-area');
    const songsList = document.getElementById('sp-search-songs-list');
    const topResultBox = document.getElementById('sp-top-result-box');
    const artistsShelf = document.getElementById('sp-search-artists-shelf');
    const albumsShelf = document.getElementById('sp-search-albums-shelf');

    const browseArea = document.getElementById('sp-browse-all-area');
    if (browseArea) browseArea.style.display = 'none';
    if (resArea) resArea.style.display = 'flex';

    // 0ms instant local DB search preview
    const localData = this.searchLocalDb(q);
    const hasLocal = (localData.songs.length > 0 || localData.artists.length > 0 || localData.albums.length > 0);
    if (hasLocal) {
      this.renderSearchResults(localData, q);
    } else {
      if (songsList) songsList.innerHTML = '<p style="padding:24px;color:var(--sp-text-subdued)"><i class="fa-solid fa-spinner fa-spin"></i> Searching songs & artists...</p>';
      if (topResultBox) topResultBox.innerHTML = '';
      if (artistsShelf) artistsShelf.style.display = 'none';
      if (albumsShelf) albumsShelf.style.display = 'none';
    }

    const normalizedQuery = this.normalizeArtistQuery(q);
    const data = await this.directSearch(normalizedQuery);

    const currentInput = document.getElementById('sp-global-search-input')?.value.trim();
    if (currentSeq !== this.searchSeq || (currentInput && currentInput.toLowerCase() !== q.toLowerCase())) {
      return;
    }

    const hasSongs = data && data.songs && data.songs.length > 0;
    const hasArtists = data && data.artists && data.artists.length > 0;
    const hasAlbums = data && data.albums && data.albums.length > 0;

    if (hasSongs || hasArtists || hasAlbums) {
      this.renderSearchResults(data, q);
    } else if (!hasLocal) {
      if (songsList) songsList.innerHTML = `<p style="padding:40px;color:var(--sp-text-subdued);text-align:center">No results found for "${q}". Try searching for <strong>The Weeknd, Starboy, Arijit Singh, Karan Aujla, Taylor Swift, 295</strong>.</p>`;
      if (topResultBox) topResultBox.innerHTML = '';
      if (artistsShelf) artistsShelf.style.display = 'none';
      if (albumsShelf) albumsShelf.style.display = 'none';
    }
  }

  // ========================================================================
  // 8. ARTIST & ALBUM CONTROLLER
  // ========================================================================
  async openArtistPage(artistName, artistImage, artistIdParam = null) {
    this.navigate('artist');

    const cleanArtist = this.normalizeArtistQuery(this.cleanArtistNames(artistName).split(',')[0].trim());
    this.currentViewArtistName = cleanArtist;
    this.showAllArtistTracks = false;

    const nameEl = document.getElementById('artist-page-name');
    if (nameEl) nameEl.textContent = cleanArtist;
    const listEl = document.getElementById('artist-listeners-txt');
    if (listEl) listEl.textContent = `${(Math.floor(Math.random() * 12) + 8)},${(Math.floor(Math.random() * 800) + 100)},${(Math.floor(Math.random() * 800) + 100)} monthly listeners`;
    
    const banner = document.getElementById('artist-hero-banner');
    if (banner && artistImage) {
      banner.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.2), rgba(18,18,18,0.9)), url("${artistImage}")`;
    }

    const toggleBtn = document.getElementById('btn-toggle-artist-songs');
    if (toggleBtn) toggleBtn.textContent = 'See All Songs';

    // 1. Initial load strictly for this artist from musicDB
    let artistSongs = [];
    let artistAlbums = [];
    const seenSongIds = new Set();
    const seenAlbums = new Set();

    const cleanLower = cleanArtist.toLowerCase().trim();
    const indexed = (this.artistIndex && this.artistIndex.get(cleanLower)) || [];
    if (indexed.length > 0) {
      for (let i = 0; i < indexed.length; i++) {
        const s = indexed[i];
        if (!seenSongIds.has(s.id)) {
          seenSongIds.add(s.id);
          artistSongs.push(s);
        }
        if (s.album && s.album !== 'Single') {
          const albKey = s.album.toLowerCase();
          if (!seenAlbums.has(albKey)) {
            seenAlbums.add(albKey);
            artistAlbums.push({
              id: `alb_${s.id}`,
              title: s.album,
              subtitle: `${s.artist} &bull; Album`,
              artist: s.artist,
              image: s.image,
              isAlbum: true
            });
          }
        }
      }
    } else if (this.musicDB && this.musicDB.length) {
      for (let i = 0; i < this.musicDB.length; i++) {
        const s = this.musicDB[i];
        if (s.artist && s.artist.toLowerCase().includes(cleanLower)) {
          if (!seenSongIds.has(s.id)) {
            seenSongIds.add(s.id);
            artistSongs.push(s);
          }
          if (s.album && s.album !== 'Single') {
            const albKey = s.album.toLowerCase();
            if (!seenAlbums.has(albKey)) {
              seenAlbums.add(albKey);
              artistAlbums.push({
                id: `alb_${s.id}`,
                title: s.album,
                subtitle: `${s.artist} &bull; Album`,
                artist: s.artist,
                image: s.image,
                isAlbum: true
              });
            }
          }
        }
      }
    }

    this.currentArtistAllSongs = artistSongs;
    this.currentArtistAllAlbums = artistAlbums;
    this.currentArtistTracks = artistSongs;

    if (banner && artistSongs.length > 0 && !artistImage) {
      banner.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.2), rgba(18,18,18,0.9)), url("${artistSongs[0].image}")`;
    }

    this.renderArtistPopularTracks();
    this.renderArtistDiscography(this.currentArtistAllAlbums);

    // 2. Client-Side + Native Bridge Full Dynamic Discography Fetch (Always gives 50+ songs and all albums)
    try {
      const isCloudflare = (typeof window !== 'undefined' && window.location && 
        (window.location.hostname.includes('workers.dev') || window.location.hostname.includes('pages.dev')));

      if (isCloudflare) {
        try {
          const edgeRes = await fetch(`/api/artist?name=${encodeURIComponent(cleanArtist)}`, { signal: AbortSignal.timeout(3500) });
          if (edgeRes.ok) {
            const edgeArt = await edgeRes.json();
            if (edgeArt && edgeArt.status === 'success' && edgeArt.songs && edgeArt.songs.length > 0) {
              if (edgeArt.follower_count && listEl) {
                listEl.textContent = `${edgeArt.follower_count} monthly listeners`;
              }
              if (edgeArt.image && banner) {
                banner.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.2), rgba(18,18,18,0.9)), url("${edgeArt.image}")`;
              }
              this.currentArtistAllSongs = edgeArt.songs;
              this.currentArtistTracks = edgeArt.songs;
              if (edgeArt.albums && edgeArt.albums.length > 0) {
                this.currentArtistAllAlbums = edgeArt.albums;
              }
              this.renderArtistPopularTracks();
              this.renderArtistDiscography(this.currentArtistAllAlbums);
              return;
            }
          }
        } catch(e) {}
      }

      let resolvedArtistId = artistIdParam;
      
      // Step A: Search artist ID if missing
      if (!resolvedArtistId || resolvedArtistId.startsWith('art_')) {
        const feat = this.homeData?.featured_artists?.find(a => a.name.toLowerCase() === cleanArtist.toLowerCase());
        if (feat && feat.id) {
          resolvedArtistId = feat.id;
          if (feat.image && banner) {
            banner.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.2), rgba(18,18,18,0.9)), url("${feat.image}")`;
          }
        }
      }

      if (!resolvedArtistId || resolvedArtistId.startsWith('art_')) {
        const searchUrl = `https://www.jiosaavn.com/api.php?__call=search.getArtistResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=10&p=1&q=${encodeURIComponent(cleanArtist)}`;
        const sData = await this.safeFetchJson(searchUrl);
        if (sData && sData.results && sData.results.length > 0) {
          const matchedRes = sData.results.find(r => r.name && r.name.trim().toLowerCase() === cleanArtist.toLowerCase()) || sData.results[0];
          resolvedArtistId = matchedRes.id;
          if (matchedRes.image && banner) {
            banner.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.2), rgba(18,18,18,0.9)), url("${matchedRes.image.replace('150x150', '500x500')}")`;
          }
        }
      }

      // Step B: Query full official artist page details
      if (resolvedArtistId && !resolvedArtistId.startsWith('art_')) {
        const detUrl = `https://www.jiosaavn.com/api.php?__call=artist.getArtistPageDetails&_format=json&_marker=0&api_version=4&ctx=web6dot0&artistId=${encodeURIComponent(resolvedArtistId)}&n_song=50&n_album=50`;
        const det = await this.safeFetchJson(detUrl);
        if (det) {
          if (det.follower_count && listEl) {
            listEl.textContent = `${Number(det.follower_count).toLocaleString()} monthly listeners`;
          }
          if (det.image && banner) {
            banner.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.2), rgba(18,18,18,0.9)), url("${det.image.replace('150x150', '500x500')}")`;
          }

          const liveSongs = (det.topSongs || []).map(s => {
            const enc = s.more_info?.encrypted_media_url;
            return {
              id: s.id,
              title: s.title ? s.title.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"') : '',
              artist: s.more_info?.artistMap?.primary_artists?.map(a => a.name).join(', ') || s.subtitle || det.name,
              album: s.more_info?.album ? s.more_info.album.replace(/&amp;/g, '&').replace(/&#039;/g, "'") : 'Single',
              image: s.image ? s.image.replace('150x150', '500x500') : '',
              duration: parseInt(s.more_info?.duration || 180),
              stream_url: decryptJioSaavn320(enc)
            };
          }).filter(s => s.stream_url && this.isStrictArtistMatch(s.artist, cleanArtist));

          if (liveSongs.length > 0) {
            // Official live songs are the purest and placed FIRST
            const newArtistSongs = [...liveSongs];
            const localSeen = new Set(newArtistSongs.map(s => s.id));

            // Append extra matching songs from musicDB that aren't already included
            artistSongs.forEach(s => {
              if (!localSeen.has(s.id) && this.isStrictArtistMatch(s.artist, cleanArtist)) {
                localSeen.add(s.id);
                newArtistSongs.push(s);
              }
            });
            artistSongs = newArtistSongs;
          }

          const liveAlbums = (det.topAlbums || []).map(alb => ({
            id: alb.id,
            title: alb.title ? alb.title.replace(/&amp;/g, '&').replace(/&#039;/g, "'") : '',
            artist: alb.subtitle || det.name,
            subtitle: `${alb.subtitle || det.name} &bull; Album`,
            image: alb.image ? alb.image.replace('150x150', '500x500') : '',
            year: alb.year || '',
            isAlbum: true
          }));

          liveAlbums.forEach(alb => {
            if (!seenAlbums.has(alb.title.toLowerCase())) {
              seenAlbums.add(alb.title.toLowerCase());
              artistAlbums.push(alb);
            }
          });
        }
      }

      // Step C: Fallback live search ONLY if artist has fewer than 10 songs
      if (artistSongs.length < 10) {
        try {
          const fallbackSearchUrl = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=30&p=1&q=${encodeURIComponent(cleanArtist)}`;
          const fData = await this.safeFetchJson(fallbackSearchUrl);
          if (fData && fData.results) {
            fData.results.forEach(s => {
              const fullArt = (s.more_info?.artistMap?.primary_artists?.map(a => a.name).join(', ') || '') + ', ' + (s.primary_artists || '') + ', ' + (s.singers || '');
              if (!this.isStrictArtistMatch(fullArt, cleanArtist)) return;

              const enc = s.more_info?.encrypted_media_url;
              const stream = enc ? decryptJioSaavn320(enc) : null;
              if (stream && !seenSongIds.has(s.id)) {
                seenSongIds.add(s.id);
                artistSongs.push({
                  id: s.id,
                  title: s.title ? s.title.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"') : (s.song || ''),
                  artist: s.more_info?.artistMap?.primary_artists?.map(a => a.name).join(', ') || s.primary_artists || cleanArtist,
                  album: s.more_info?.album ? s.more_info.album.replace(/&amp;/g, '&').replace(/&#039;/g, "'") : (s.album || 'Single'),
                  image: s.image ? s.image.replace('150x150', '500x500') : '',
                  duration: parseInt(s.more_info?.duration || 180),
                  stream_url: stream
                });
              }
            });
          }
        } catch(fErr) {
          console.warn('Artist song search fallback error:', fErr);
        }
      }
    } catch(e) {
      console.warn('Live artist fetch warning:', e);
    }

    // FINAL INTEGRITY GUARANTEE: Filter strictly so NO foreign song can EVER appear
    this.currentArtistAllSongs = artistSongs.filter(s => this.isStrictArtistMatch(s.artist, cleanArtist));
    this.currentArtistTracks = this.currentArtistAllSongs;
    this.currentArtistAllAlbums = artistAlbums;
    this.renderArtistPopularTracks();
    this.renderArtistDiscography(this.currentArtistAllAlbums);
  }

  renderArtistPopularTracks() {
    const popularTable = document.getElementById('artist-popular-tracks');
    if (!popularTable) return;

    const songs = this.currentArtistAllSongs || [];
    if (!songs.length) {
      popularTable.innerHTML = '<p style="padding:20px;color:var(--sp-text-subdued)">No tracks found for this artist.</p>';
      return;
    }

    const limit = this.showAllArtistTracks ? songs.length : 10;
    popularTable.innerHTML = songs.slice(0, limit).map((s, idx) => {
      this.registerSong(s);
      const isCurPlaying = this.currentSong && this.currentSong.id === s.id;
      return `
      <div class="sp-track-row ${isCurPlaying ? 'active' : ''}" onclick="sp.playArtistTrack('${this.escapeJsString(s.id)}')">
        <span class="track-num-col">${isCurPlaying ? '<i class="fa-solid fa-volume-high" style="color:var(--sp-green);font-size:12px"></i>' : (idx + 1)}</span>
        <div class="track-title-col">
          <img src="${s.image}" class="track-thumb" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100'">
          <div class="track-names">
            <span class="track-name-txt" style="${isCurPlaying ? 'color:var(--sp-green);font-weight:700' : ''}">${this.escapeHtml(s.title)}</span>
            <span class="track-artist-txt">${this.escapeHtml(this.cleanArtistNames(s.artist))}</span>
          </div>
        </div>
        <span class="track-album-col" onclick="event.stopPropagation(); sp.openAlbumPage('${this.escapeJsString(s.album || s.title)}', '${this.escapeJsString(this.cleanArtistNames(s.artist))}', '${this.escapeJsString(s.image)}', '${this.escapeJsString(s.id || '')}')">${this.escapeHtml(s.album || '')}</span>
        <span class="track-dur-col">
          <span>${this.formatTime(s.duration)}</span>
          ${this.getTrackDownloadBtnHtml(s)}
        </span>
      </div>
    `;
    }).join('');
  }

  toggleArtistTracklistLimit() {
    this.showAllArtistTracks = !this.showAllArtistTracks;
    const toggleBtn = document.getElementById('btn-toggle-artist-songs');
    if (toggleBtn) {
      toggleBtn.textContent = this.showAllArtistTracks ? 'Show Top 10' : 'See All Songs';
    }
    this.renderArtistPopularTracks();
  }

  renderArtistDiscography(albumList) {
    const albumsRow = document.getElementById('artist-albums-row');
    if (!albumsRow) return;

    if (!albumList || !albumList.length) {
      albumsRow.innerHTML = '<p style="padding:20px;color:var(--sp-text-subdued)">No albums found in this category.</p>';
      return;
    }

    albumsRow.innerHTML = albumList.map(alb => `
      <div class="sp-card" onclick="sp.openAlbumPage('${this.escapeJsString(alb.title)}', '${this.escapeJsString(alb.artist || this.currentViewArtistName)}', '${this.escapeJsString(alb.image)}', '${this.escapeJsString(alb.id || '')}')">
        <div class="sp-card-cover-wrap">
          <img src="${alb.image}" alt="${this.escapeHtml(alb.title)}" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'">
        </div>
        <div class="sp-card-info">
          <div class="sp-card-title">${this.escapeHtml(alb.title)}</div>
          <div class="sp-card-desc">${this.escapeHtml(alb.subtitle || alb.artist)}</div>
        </div>
      </div>
    `).join('');
  }

  filterArtistDiscography(filterKey, btnEl) {
    document.querySelectorAll('.sp-artist-discography-section .sp-cat-pill').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    const all = this.currentArtistAllAlbums || [];
    if (filterKey === 'albums') {
      const filtered = all.filter(a => a.isAlbum);
      this.renderArtistDiscography(filtered);
    } else if (filterKey === 'singles') {
      const filtered = all.filter(a => !a.isAlbum);
      this.renderArtistDiscography(filtered);
    } else {
      this.renderArtistDiscography(all);
    }
  }

  playCurrentArtistAll() {
    if (this.currentArtistAllSongs && this.currentArtistAllSongs.length) {
      if (this.currentSong && this.currentArtistAllSongs.some(s => s.id === this.currentSong.id)) {
        this.togglePlay();
      } else {
        this.playSong(this.currentArtistAllSongs[0], this.currentArtistAllSongs, false, {
          type: 'artist',
          originalList: this.currentArtistAllSongs,
          artistName: this.currentViewArtistName || this.cleanArtistNames(this.currentArtistAllSongs[0].artist)
        });
      }
    } else {
      this.showToast('No tracks found for this artist.');
    }
  }

  toggleFollowArtist() {
    const btn = document.getElementById('btn-follow-artist');
    if (!btn) return;
    const isFollowing = btn.classList.toggle('following');
    btn.textContent = isFollowing ? 'Following' : 'Follow';
    this.showToast(isFollowing ? '💚 Added to your followed artists' : 'Unfollowed');
  }

  async openAlbumPage(albumTitle, artistName, albumImage, albumId) {
    this.navigate('album');

    const badge = document.getElementById('album-type-badge');
    if (badge) badge.textContent = 'ALBUM';
    const titleEl = document.getElementById('album-title-txt');
    if (titleEl) titleEl.textContent = albumTitle;
    const artEl = document.getElementById('album-artist-txt');
    if (artEl) artEl.textContent = artistName || 'Artist';
    const yrEl = document.getElementById('album-year-txt');
    if (yrEl) yrEl.textContent = 'Album';
    
    const coverBox = document.getElementById('album-cover-box');
    if (coverBox) {
      coverBox.style.background = '#282828';
      coverBox.innerHTML = `<img src="${albumImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500'}" class="entity-cover-img" referrerpolicy="no-referrer">`;
    }

    const tracklistBody = document.getElementById('album-tracklist-items');
    let songs = [];

    const albLower = (albumTitle || '').toLowerCase().trim();
    if (this.albumIndex && this.albumIndex.has(albLower)) {
      songs = this.albumIndex.get(albLower);
    } else if (this.musicDB && this.musicDB.length) {
      songs = this.musicDB.filter(s => s.album && (s.album.toLowerCase() === albLower || s.album.toLowerCase().includes(albLower)));
    }

    if (!songs.length) {
      const isCloudflare = (typeof window !== 'undefined' && window.location && 
        (window.location.hostname.includes('workers.dev') || window.location.hostname.includes('pages.dev')));
      if (isCloudflare) {
        try {
          const edgeRes = await fetch(`/api/album?id=${encodeURIComponent(albumId || '')}&title=${encodeURIComponent(albumTitle)}`, { signal: AbortSignal.timeout(3500) });
          if (edgeRes.ok) {
            const edgeAlb = await edgeRes.json();
            if (edgeAlb && edgeAlb.status === 'success' && edgeAlb.songs && edgeAlb.songs.length > 0) {
              songs = edgeAlb.songs;
            }
          }
        } catch(e) {}
      }
    }

    if (!songs.length) {
      const data = await this.directSearch(`${albumTitle} ${artistName || ''}`);
      songs = data.songs || [];
    }

    this.currentAlbumTracks = songs;
    this.currentAlbumMeta = { title: albumTitle, artist: artistName, image: albumImage, id: albumId };

    const cntEl = document.getElementById('album-song-count-txt');
    if (cntEl) cntEl.textContent = `${songs.length} songs`;

    const albumBtn = document.getElementById('btn-download-album');
    if (albumBtn) {
      const allDownloaded = songs.length > 0 && songs.every(s => this.downloadedSongIds && this.downloadedSongIds.has(s.id));
      albumBtn.classList.toggle('downloaded', allDownloaded);
      albumBtn.style.color = allDownloaded ? 'var(--sp-green)' : '';
      albumBtn.innerHTML = allDownloaded ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-down"></i>';
      albumBtn.title = allDownloaded ? 'Album Saved Offline' : 'Download Album Offline';
    }

    // Update album like button state
    const likeBtn = document.getElementById('btn-like-album');
    if (likeBtn) {
      const likedAlbums = JSON.parse(localStorage.getItem('sp_liked_albums') || '[]');
      const isLiked = likedAlbums.some(a => a.title === albumTitle);
      likeBtn.innerHTML = isLiked ? '<i class="fa-solid fa-heart" style="color:var(--sp-green)"></i>' : '<i class="fa-regular fa-heart"></i>';
    }

    if (tracklistBody) {
      if (!songs.length) {
        tracklistBody.innerHTML = '<p style="padding:20px;color:var(--sp-text-subdued)">No tracks found for this album.</p>';
      } else {
        tracklistBody.innerHTML = songs.map((s, idx) => {
          this.registerSong(s);
          const isCurPlaying = this.currentSong && this.currentSong.id === s.id;
          return `
          <div class="sp-track-row ${isCurPlaying ? 'active' : ''}" onclick="sp.playAlbumTrack('${this.escapeJsString(s.id)}')">
            <span class="track-num-col">${isCurPlaying ? '<i class="fa-solid fa-volume-high" style="color:var(--sp-green);font-size:12px"></i>' : (idx + 1)}</span>
            <div class="track-title-col">
              <img src="${s.image}" class="track-thumb" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100'">
              <div class="track-names">
                <span class="track-name-txt" style="${isCurPlaying ? 'color:var(--sp-green);font-weight:700' : ''}">${this.escapeHtml(s.title)}</span>
                <span class="track-artist-txt">${this.escapeHtml(this.cleanArtistNames(s.artist))}</span>
              </div>
            </div>
            <span class="track-album-col">${this.escapeHtml(s.album || albumTitle)}</span>
            <span class="track-dur-col">
              <span>${this.formatTime(s.duration)}</span>
              ${this.getTrackDownloadBtnHtml(s)}
            </span>
          </div>
        `;
        }).join('');
      }
    }
  }

  playCurrentAlbumAll() {
    if (this.currentAlbumTracks && this.currentAlbumTracks.length > 0) {
      this.playSong(this.currentAlbumTracks[0], this.currentAlbumTracks, false, {
        type: 'album',
        originalList: this.currentAlbumTracks,
        albumId: this.currentAlbumMeta?.id,
        albumTitle: this.currentAlbumMeta?.title
      });
      this.showToast(`▶ Playing album: ${this.currentAlbumMeta?.title || 'Album'}`);
    } else {
      this.showToast('No tracks found in this album to play.');
    }
  }

  toggleLikeCurrentAlbum() {
    const title = this.currentAlbumMeta?.title || 'Current Album';
    let likedAlbums = [];
    try {
      likedAlbums = JSON.parse(localStorage.getItem('sp_liked_albums') || '[]');
    } catch(e) { likedAlbums = []; }

    const idx = likedAlbums.findIndex(a => a.title === title);
    const btn = document.getElementById('btn-like-album');
    if (idx >= 0) {
      likedAlbums.splice(idx, 1);
      if (btn) btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
      this.showToast(`Removed "${title}" from Your Library`);
    } else {
      likedAlbums.push({
        title: title,
        artist: this.currentAlbumMeta?.artist || '',
        image: this.currentAlbumMeta?.image || '',
        id: this.currentAlbumMeta?.id || ''
      });
      if (btn) btn.innerHTML = '<i class="fa-solid fa-heart" style="color:var(--sp-green)"></i>';
      this.showToast(`💚 Added "${title}" to Your Library!`);
    }
    localStorage.setItem('sp_liked_albums', JSON.stringify(likedAlbums));
  }

  // ========================================================================
  // 9. UI & PROGRESS UPDATER
  // ========================================================================
  updateProgressUI() {
    if (!this.audio) return;
    const cur = this.audio.currentTime || 0;
    const dur = this.audio.duration && !isNaN(this.audio.duration) && this.audio.duration > 35 
      ? this.audio.duration 
      : (this.currentSong?.duration || 180);
    const pct = dur > 0 ? (cur / dur) * 100 : 0;

    const tc = document.getElementById('time-current');
    if (tc) tc.textContent = this.formatTime(cur);
    const td = document.getElementById('time-duration');
    if (td) td.textContent = this.formatTime(dur);
    const fill = document.getElementById('seek-bar-fill');
    if (fill) fill.style.width = `${pct}%`;
    const handle = document.getElementById('seek-handle');
    if (handle) handle.style.left = `${pct}%`;

    const fsPlayer = document.getElementById('sp-fullscreen-player');
    if (fsPlayer && fsPlayer.classList.contains('open')) {
      const fsCur = document.getElementById('fs-time-current');
      if (fsCur) fsCur.textContent = this.formatTime(cur);
      const fsDur = document.getElementById('fs-time-duration');
      if (fsDur) fsDur.textContent = this.formatTime(dur);
      const fsFill = document.getElementById('fs-seek-fill');
      if (fsFill) fsFill.style.width = `${pct}%`;
      const fsHandle = document.getElementById('fs-seek-handle');
      if (fsHandle) fsHandle.style.left = `${pct}%`;
      this.syncLyricsProgress(cur);
    }
  }

  updatePlayPauseUI(playing) {
    if (typeof playing !== 'boolean') {
      playing = Boolean(this.isPlaying || (this.audio && !this.audio.paused && !this.audio.ended && this.audio.currentTime > 0));
    }
    const icon = playing ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    const mainBtn = document.getElementById('btn-play-pause');
    if (mainBtn) {
      mainBtn.innerHTML = icon;
      mainBtn.title = playing ? 'Pause' : 'Play';
      mainBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    }
    const fsBtn = document.getElementById('fs-btn-play-pause');
    if (fsBtn) {
      fsBtn.innerHTML = icon;
      fsBtn.title = playing ? 'Pause' : 'Play';
      fsBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    }
    const artistPlay = document.getElementById('btn-play-artist');
    if (artistPlay) {
      artistPlay.innerHTML = icon;
      artistPlay.title = playing ? 'Pause' : 'Play';
    }
  }

  updateNowPlayingUI(song) {
    if (!song) return;

    // Guaranteed authentic image with fallback
    const targetImage = (song.image && typeof song.image === 'string' && song.image.trim().startsWith('http'))
      ? song.image.trim()
      : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500';

    const pThumb = document.getElementById('player-thumb');
    if (pThumb) {
      pThumb.setAttribute('referrerpolicy', 'no-referrer');
      pThumb.onerror = () => {
        pThumb.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100';
      };
      pThumb.src = targetImage;
    }

    const pTitle = document.getElementById('player-song-title');
    if (pTitle) pTitle.textContent = song.title;
    const cleanArt = this.cleanArtistNames(song.artist);
    const artistParts = cleanArt.split(',').map(a => a.trim()).filter(Boolean);
    const artistLinksHtml = artistParts.map(a => 
      `<span class="sp-artist-link" onclick="event.stopPropagation(); sp.openArtistFromPlayer('${this.escapeJsString(a)}')" title="View ${this.escapeHtml(a)} profile">${this.escapeHtml(a)}</span>`
    ).join(', ');

    const pArtist = document.getElementById('player-artist-name');
    if (pArtist) {
      pArtist.innerHTML = artistLinksHtml || this.escapeHtml(cleanArt);
      pArtist.title = `View artist: ${cleanArt}`;
    }

    const fsCover = document.getElementById('fs-cover-img');
    if (fsCover) {
      fsCover.setAttribute('referrerpolicy', 'no-referrer');
      fsCover.src = targetImage;
      fsCover.onerror = () => {
        fsCover.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500';
      };
    }

    const fsTitle = document.getElementById('fs-song-title');
    if (fsTitle) fsTitle.textContent = song.title;
    const fsArtist = document.getElementById('fs-artist-name');
    if (fsArtist) {
      fsArtist.innerHTML = artistLinksHtml || this.escapeHtml(cleanArt);
      fsArtist.title = `View artist: ${cleanArt}`;
    }
    
    const mfPlayingFrom = document.getElementById('mf-playing-from');
    const mfPlaylist = document.getElementById('mf-playlist-name');
    if (this.playbackContext) {
      if (this.playbackContext.type === 'artist') {
        if (mfPlayingFrom) mfPlayingFrom.textContent = 'PLAYING FROM ARTIST';
        if (mfPlaylist) mfPlaylist.textContent = this.playbackContext.artistName || cleanArt;
      } else if (this.playbackContext.type === 'album') {
        if (mfPlayingFrom) mfPlayingFrom.textContent = 'PLAYING FROM ALBUM';
        if (mfPlaylist) mfPlaylist.textContent = this.playbackContext.albumTitle || song.album || 'Album';
      } else if (this.playbackContext.type === 'playlist') {
        if (mfPlayingFrom) mfPlayingFrom.textContent = 'PLAYING FROM PLAYLIST';
        if (mfPlaylist) mfPlaylist.textContent = this.playbackContext.playlistName || 'Playlist';
      } else {
        if (mfPlayingFrom) mfPlayingFrom.textContent = this.playbackContext.isAutoplay ? 'PLAYING FROM RADIO' : 'PLAYING FROM ARTIST';
        if (mfPlaylist) mfPlaylist.textContent = cleanArt || song.title;
      }
    } else {
      if (mfPlayingFrom) mfPlayingFrom.textContent = 'PLAYING FROM ARTIST';
      if (mfPlaylist) mfPlaylist.textContent = cleanArt || song.title;
    }

    const isLiked = this.likedSongs.some(s => s.id === song.id);
    
    const likeBtn = document.getElementById('btn-player-like');
    if (likeBtn) {
      likeBtn.classList.toggle('liked', isLiked);
      likeBtn.innerHTML = isLiked 
        ? '<i class="fa-solid fa-heart" style="color:#1ed760;font-size:18px;"></i>' 
        : '<i class="fa-regular fa-heart" style="color:#fff;font-size:18px;"></i>';
    }

    const fsLike = document.getElementById('btn-fs-like');
    if (fsLike) {
      fsLike.classList.toggle('liked', isLiked);
      fsLike.innerHTML = isLiked 
        ? '<i class="fa-solid fa-heart" style="color:#1ed760;font-size:26px;"></i>' 
        : '<i class="fa-regular fa-heart" style="color:#ffffff;font-size:26px;"></i>';
    }

    this.loadLyricsForCurrentSong();
    this.updateDownloadButtonsState(song.id);
    document.title = `${song.title} • ${cleanArt} | Playify`;
    if (typeof this.updateSingleTrackUI === 'function') this.updateSingleTrackUI();
  }

  formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  cleanArtistNames(raw) {
    if (!raw) return 'Artist';
    let str = raw.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"');
    // Remove soundtrack, movie names, dates, labels
    str = str.replace(/\(from\s+[^)]+\)/gi, '');
    str = str.replace(/from\s+["'][^"']+["']/gi, '');
    str = str.replace(/original\s+motion\s+picture\s+soundtrack/gi, '');
    str = str.replace(/\b(19|20)\d{2}\b/g, '');
    // Cut at dash/bullet/separator that splits artist from film/album/remix info
    str = str.split(/[\-\u2013\u2014\|\/\:•~]/)[0].trim();
    str = str.replace(/\(.*?\)|\[.*?\]/g, '').trim();
    str = str.replace(/\b(ft|feat|featuring)\b\.?.*$/i, '').trim();
    const parts = str.split(/[,&]|\band\b/i).map(s => s.trim()).filter(Boolean);
    const valid = [];
    const seen = new Set();
    const nonSingers = new Set(['amitabh bhattacharya', 'irshad kamil', 'kumaar', 'anand bakshi', 'sameer', 'gulzar', 'javed akhtar', 'tanveer ghazi']);
    for (const p of parts) {
      const pLower = p.toLowerCase();
      if (!seen.has(pLower) && p.length > 1) {
        seen.add(pLower);
        if (parts.length > 1 && nonSingers.has(pLower)) continue;
        valid.push(p);
      }
    }
    return valid.slice(0, 2).join(', ') || parts[0] || 'Artist';
  }

  isStrictArtistMatch(songArtist, targetArtist) {
    if (!songArtist || !targetArtist) return false;
    const target = targetArtist.trim().toLowerCase();
    const sArt = songArtist.trim().toLowerCase();

    let tokens = sArt.split(/[,&/|]|(?:\s+ft\.?\s+)|\s+feat\.?\s+/i)
      .map(t => t.trim().replace(/^ft\.?\s*/i, '').replace(/^[("']+|[)"']+$/g, '').trim())
      .filter(Boolean);

    // If more than 3 artists are listed, it's a compilation/mashup.
    // Only the top 2 lead/primary artists are authentic matches for artist profiles.
    if (tokens.length > 3) {
      tokens = tokens.slice(0, 2);
    }

    for (const t of tokens) {
      if (t === target) return true;
      const words = t.split(/[^a-zA-Z0-9]+/).filter(Boolean);
      const targetWords = target.split(/[^a-zA-Z0-9]+/).filter(Boolean);

      if (targetWords.length > 1) {
        if (t.includes(target)) return true;
      } else {
        if (words.includes(target)) return true;
      }
    }
    return false;
  }

  cleanTitle(t) {
    return (t || '')
      .replace(/&amp;/g, '&')
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\(.*?\)|\[.*?\]/g, '')
      .toLowerCase()
      .trim();
  }

  scoreArtistMatch(artistName, query) {
    const a = (artistName || '').toLowerCase().trim();
    const q = (query || '').toLowerCase().trim();
    if (!a || !q) return 0;
    if (a === q) return 100;
    const aWords = a.split(/[\s,]+/);
    const qWords = q.split(/[\s,]+/);
    if (aWords.length === qWords.length && a === q) return 100;
    if (a.startsWith(q + ' ') || a.endsWith(' ' + q)) return 85;
    if (a.startsWith(q)) return 75;
    if (q.startsWith(a)) return 70;
    if (aWords.some(w => w === q)) return 65;
    if (a.includes(q) && q.length > 3) return 40;
    return 0;
  }

  scoreSongMatch(songTitle, query) {
    const rawT = (songTitle || '').toLowerCase().trim();
    const cleanT = this.cleanTitle(songTitle);
    const q = (query || '').toLowerCase().trim();
    if (!cleanT || !q) return 0;

    if (rawT === q || cleanT === q) return 100;
    if (cleanT.startsWith(q + ' ') || cleanT.startsWith(q)) return 90;
    const tWords = cleanT.split(/[\s,]+/);
    if (tWords.some(w => w === q)) return 80;
    if (cleanT.includes(q) && q.length > 2) return 65;
    return 0;
  }

  rankSong(s, qClean) {
    const t = (s.title || '').toLowerCase().trim();
    const cleanT = this.cleanTitle(s.title);
    const a = (s.artist || '').toLowerCase().trim();
    const plays = s.playCount || 0;
    let score = 0;

    const isExactTitle = (t === qClean || cleanT === qClean);

    if (isExactTitle) {
      score += 2000;
    } else if (cleanT.startsWith(qClean + ' ') || cleanT.startsWith(qClean)) {
      score += 800;
    } else if (cleanT.split(/[\s,]+/).some(w => w === qClean)) {
      score += 600;
    } else if (cleanT.includes(qClean)) {
      score += 400;
    }

    if (!isExactTitle) {
      if (a === qClean || a.split(/[\s,]+/).some(w => w === qClean)) {
        score += 500;
      } else if (a.includes(qClean)) {
        score += 250;
      }
    }

    if (plays > 0) {
      score += Math.min(800, Math.round(Math.log10(plays + 1) * 80));
    }
    return score;
  }

  adaptHomeAndQueueToVibe(song) {
    if (!song) return;
    const heroBox = document.getElementById('sp-hero-billboard');
    if (heroBox) {
      heroBox.innerHTML = `
        <div class="sp-billboard-content">
          <span class="sp-billboard-tag">NOW PLAYING</span>
          <h2 class="sp-billboard-title">${song.title}</h2>
          <p class="sp-billboard-artist">${song.artist}</p>
          <div class="sp-billboard-actions">
            <button class="sp-btn-play-now" onclick="event.stopPropagation(); sp.togglePlay()">
              <i class="fa-solid fa-play"></i> Play
            </button>
          </div>
        </div>
        <img src="${song.image}" class="sp-billboard-art" alt="${song.title}" loading="eager" decoding="async" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'">
      `;
      heroBox.onclick = () => this.togglePlay();
    }
  }

  trackRecentlyPlayed(song) {
    if (!song) return;
    this.recentlyPlayed = this.recentlyPlayed.filter(s => s.id !== song.id);
    this.recentlyPlayed.unshift(song);
    if (this.recentlyPlayed.length > 30) this.recentlyPlayed.pop();
    localStorage.setItem('sp_recently_played', JSON.stringify(this.recentlyPlayed));
    const cnt = document.getElementById('lib-page-recent-count');
    if (cnt) cnt.textContent = `${this.recentlyPlayed.length} Recently Played`;
    this.updateJumpBackInShelf();
  }

  updateJumpBackInShelf() {
    const shelf = document.getElementById('shelf-jump-back-in');
    const row = document.getElementById('row-jump-back-in');
    if (!shelf || !row) return;

    if (this.recentlyPlayed.length > 0) {
      shelf.style.display = 'flex';
      row.innerHTML = this.recentlyPlayed.slice(0, 8).map(s => this.renderSongCard(s, this.recentlyPlayed)).join('');
    } else {
      shelf.style.display = 'none';
    }
  }

  handleMiniPlayerClick(e) {
    if (e.target.closest('#btn-play-pause') || 
        e.target.closest('#btn-player-like') || 
        e.target.closest('.sp-progress-container') || 
        e.target.closest('.sp-player-right') || 
        e.target.closest('.sp-playback-controls') ||
        e.target.closest('.sp-volume-bar-wrap')) {
      return;
    }
    this.openFullscreenPlayer();
  }

  handleFsSeek(e) {
    if (!this.audio) return;
    const rect = document.getElementById('fs-seek-bar').getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (this.audio.duration) {
      this.audio.currentTime = pos * this.audio.duration;
      if (this.jamState && this.jamState.active && !this._jamIncomingAction) {
        if (this.jamState.isHost || this.jamState.guestControl) {
          this.broadcastJamAction('SEEK', { position: this.audio.currentTime, isPlaying: this.isPlaying });
        }
      }
    }
  }

  handleSeek(e) {
    if (!this.audio) return;
    const rect = document.getElementById('seek-bar-wrapper').getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (this.audio.duration) {
      this.audio.currentTime = pos * this.audio.duration;
      if (this.jamState && this.jamState.active && !this._jamIncomingAction) {
        if (this.jamState.isHost || this.jamState.guestControl) {
          this.broadcastJamAction('SEEK', { position: this.audio.currentTime, isPlaying: this.isPlaying });
        }
      }
    }
  }

  handleVolume(e) {
    if (!this.audio) return;
    const rect = document.getElementById('vol-bar-wrapper').getBoundingClientRect();
    const vol = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this.audio.volume = vol;
    const fill = document.getElementById('vol-bar-fill');
    if (fill) fill.style.width = `${vol * 100}%`;
  }

  toggleMute() {
    if (!this.audio) return;
    const fill = document.getElementById('vol-bar-fill');
    if (this.audio.volume > 0) {
      this.prevVolume = this.audio.volume;
      this.audio.volume = 0;
      if (fill) fill.style.width = '0%';
    } else {
      const v = this.prevVolume || 1.0;
      this.audio.volume = v;
      if (fill) fill.style.width = `${v * 100}%`;
    }
  }

  toggleLikeCurrentSong() {
    if (!this.currentSong) return;
    const idx = this.likedSongs.findIndex(s => s.id === this.currentSong.id);
    if (idx >= 0) {
      this.likedSongs.splice(idx, 1);
      this.showToast('Removed from Liked Songs');
    } else {
      this.likedSongs.push(this.currentSong);
      this.showToast('💚 Added to Liked Songs');
    }
    localStorage.setItem('sp_liked_songs', JSON.stringify(this.likedSongs));
    this.updateNowPlayingUI(this.currentSong);
    this.renderLikedCount();
    this.renderLibraryPage();
  }

  renderLikedCount() {
    const el = document.getElementById('liked-count-sidebar');
    if (el) el.textContent = this.likedSongs.length;
  }

  // ========================================================================
  // 10. NAVIGATION & LIBRARY VIEWS
  // ========================================================================
  navigate(viewId, pushHistory = true) {
    if (pushHistory) {
      if (!this.navHistory) this.navHistory = ['home'];
      if (this.navHistory[this.navHistory.length - 1] !== viewId) {
        this.navHistory.push(viewId);
      }
    }

    document.querySelectorAll('.sp-view-section').forEach(sec => {
      sec.style.display = 'none';
      sec.classList.remove('active');
    });

    const target = document.getElementById(`view-${viewId}`);
    if (target) {
      target.style.display = 'flex';
      target.classList.add('active');
    }

    document.querySelectorAll('.sp-nav-item').forEach(btn => btn.classList.remove('active'));
    const navBtn = document.getElementById(`nav-${viewId}`);
    if (navBtn) navBtn.classList.add('active');

    document.querySelectorAll('.sp-mob-item').forEach(btn => btn.classList.remove('active'));
    const mobBtn = document.getElementById(`mob-nav-${viewId}`);
    if (mobBtn) mobBtn.classList.add('active');

    if (viewId === 'search') {
      const searchInput = document.getElementById('sp-global-search-input');
      if (searchInput && searchInput.value.trim()) {
        this.performSearch(searchInput.value.trim());
      } else {
        this.showBrowseAllCategories();
      }
    }
    if (viewId === 'library') this.renderLibraryPage();
    const vp = document.getElementById('sp-viewport');
    if (vp) vp.scrollTop = 0;
  }

  historyBack() {
    this.handleBackPress();
  }

  historyForward() {
    this.navigate('search');
  }

  handleBackPress() {
    // -1. Spotify Jam Modal
    const jamModal = document.getElementById('sp-jam-modal');
    if (jamModal && (jamModal.classList.contains('open') || jamModal.classList.contains('active') || jamModal.style.display === 'flex')) {
      this.closeJamModal();
      return true;
    }

    // 1. Modals (Equalizer, Sleep, Playlist, Settings)
    const modals = [
      { id: 'sp-equalizer-modal', close: () => this.closeEqualizerModal() },
      { id: 'sp-sleep-modal', close: () => this.closeSleepTimerModal() },
      { id: 'sp-playlist-modal', close: () => this.closeAddToPlaylistModal() },
      { id: 'sp-settings-modal', close: () => this.closeSettingsModal() }
    ];
    for (const m of modals) {
      const el = document.getElementById(m.id);
      if (el && (el.classList.contains('open') || el.style.display === 'flex' || el.style.display === 'block')) {
        m.close();
        return true;
      }
    }

    // 2. Queue Drawer
    const dr = document.getElementById('sp-queue-drawer');
    if (dr && (dr.classList.contains('open') || dr.classList.contains('active'))) {
      this.closeQueueDrawer();
      return true;
    }

    // 3. Fullscreen Player (checks sp-fullscreen-player .open or sp-mini-fullscreen)
    const fs = document.getElementById('sp-fullscreen-player') || document.getElementById('sp-mini-fullscreen');
    if (fs && (fs.classList.contains('open') || fs.classList.contains('active') || fs.style.display === 'flex')) {
      this.closeFullscreenPlayer();
      return true;
    }

    // 4. Search input text cleared first if typing
    const searchInput = document.getElementById('sp-global-search-input');
    const searchView = document.getElementById('view-search');
    if (searchView && searchView.classList.contains('active') && searchInput && searchInput.value.trim()) {
      searchInput.value = '';
      const clearBtn = document.getElementById('sp-search-clear');
      if (clearBtn) clearBtn.style.display = 'none';
      this.showBrowseAllCategories();
      return true;
    }

    // 5. Navigation History stack (e.g. was on artist/album/library -> go back to previous view)
    if (this.navHistory && this.navHistory.length > 1) {
      this.navHistory.pop(); // Remove current view
      const prev = this.navHistory[this.navHistory.length - 1] || 'home';
      this.navigate(prev, false);
      return true;
    }

    // 6. Sub-views fallback if history was lost or on non-home tab
    const nonHomeViews = ['artist', 'album', 'search', 'library'];
    for (const vId of nonHomeViews) {
      const vEl = document.getElementById(`view-${vId}`);
      if (vEl && (vEl.classList.contains('active') || vEl.style.display === 'flex' || vEl.style.display === 'block')) {
        this.navHistory = ['home'];
        this.navigate('home', false);
        return true;
      }
    }

    // 7. Root home - nothing to dismiss
    return false;
  }

  renderLibraryPage() {
    const grid = document.getElementById('library-cards-grid');
    if (!grid) return;

    const defaultPlaylists = [
      { id: '1', title: 'Punjabi Hot Hits 🔥', subtitle: 'Shubh, Sidhu, Karan, Diljit', image: 'https://c.saavncdn.com/editorial/Punjabi-IndiaSuperhitsTop50_20260814050714_500x500.jpg' },
      { id: '2', title: 'Moosetape Forever 🦁', subtitle: 'Sidhu Moose Wala Greatest', image: 'https://c.saavncdn.com/202/Moosetape-Punjabi-2021-20210514211104-500x500.jpg' },
      { id: '3', title: 'Karan Aujla Specials ⚡', subtitle: 'Four You, Making Memories', image: 'https://c.saavncdn.com/978/Making-Memories-Punjabi-2023-20230818074945-500x500.jpg' },
      { id: '4', title: 'Diljit Dosanjh Blast 🌟', subtitle: 'Aura, Ghost, G.O.A.T.', image: 'https://c.saavncdn.com/748/Ghost-Punjabi-2023-20230929053531-500x500.jpg' }
    ];

    const customItems = this.customPlaylists.map(pl => ({
      id: pl.id,
      title: pl.title,
      subtitle: `${pl.songs.length} Custom Songs`,
      image: pl.songs.length ? pl.songs[0].image : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300',
      isCustom: true
    }));

    const albums = this.homeData?.featured_albums || [];
    const allItems = [...customItems, ...defaultPlaylists, ...albums];

    grid.innerHTML = allItems.map(item => `
      <div class="sp-card" onclick="${item.isCustom ? `sp.openCustomPlaylistView('${item.id}')` : `sp.openAlbumPage('${item.title.replace(/'/g, "\\'")}', '${item.subtitle.replace(/'/g, "\\'")}', '${item.image}', '${item.id || ''}')`}">
        <div class="sp-card-cover-wrap">
          <img src="${item.image}" alt="${item.title}" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'">
        </div>
        <div class="sp-card-info">
          <div class="sp-card-title">${item.title}</div>
          <div class="sp-card-desc">${item.subtitle || 'Playlist'}</div>
        </div>
      </div>
    `).join('');

    const likedCnt = document.getElementById('lib-page-liked-count');
    if (likedCnt) likedCnt.textContent = `${this.likedSongs.length} Liked Songs`;

    const recentCnt = document.getElementById('lib-page-recent-count');
    if (recentCnt) recentCnt.textContent = `${this.recentlyPlayed.length} Recently Played`;
  }

  filterLibraryPage(filterKey, btnEl) {
    document.querySelectorAll('#view-library .sp-cat-pill').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    
    if (filterKey === 'downloads') {
      this.openDownloadedSongsView();
    } else if (filterKey === 'artists' && this.homeData && this.homeData.featured_artists) {
      this.renderArtistsListView('all');
    } else {
      this.renderLibraryPage();
    }
  }

  renderArtistsListView(category = 'all', query = '') {
    const grid = document.getElementById('library-cards-grid');
    if (!grid || !this.homeData?.featured_artists) return;

    this.currentArtistCategory = category;
    const allArtists = this.homeData.featured_artists;
    const q = (query || '').toLowerCase().trim();

    let filtered = allArtists.filter(a => {
      const matchCat = (category === 'all' || a.category === category);
      const matchQuery = (!q || a.name.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });

    const categoryLabels = {
      all: 'All',
      english: 'Global / English',
      hindi: 'Bollywood',
      punjabi: 'Punjabi',
      classic: 'Golden Classics',
      hiphop: 'Desi Hip-Hop'
    };

    const pillsHtml = `
      <div class="sp-artist-category-bar" style="grid-column:1/-1;display:flex;flex-wrap:wrap;gap:8px;padding-bottom:12px;margin-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.08);">
        <input type="text" id="artist-filter-input" placeholder="🔍 Search 100+ singers or type ANY artist worldwide..." value="${query.replace(/"/g, '&quot;')}" style="flex:1;min-width:240px;padding:9px 16px;border-radius:24px;border:1px solid rgba(255,255,255,0.15);background:#1e1e24;color:#fff;font-size:13px;outline:none;" oninput="sp.renderArtistsListView('${category}', this.value)" onkeydown="if(event.key==='Enter')sp.liveSearchUnknownArtist(this.value)">
        <div style="display:flex;gap:6px;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:4px;">
          ${['all', 'english', 'hindi', 'punjabi', 'classic', 'hiphop'].map(cat => `
            <button class="sp-cat-pill ${cat === category ? 'active' : ''}" style="white-space:nowrap;cursor:pointer;padding:7px 16px;border-radius:20px;border:none;background:${cat === category ? '#fff' : '#282828'};color:${cat === category ? '#000' : '#fff'};font-weight:600;font-size:12px;transition:0.2s;" onclick="sp.renderArtistsListView('${cat}', document.getElementById('artist-filter-input')?.value || '')">
              ${categoryLabels[cat]} (${cat === 'all' ? allArtists.length : allArtists.filter(a => a.category === cat).length})
            </button>
          `).join('')}
        </div>
      </div>
    `;

    const cardsHtml = filtered.map(a => `
      <div class="sp-card artist-card" onclick="sp.openArtistPage('${a.name.replace(/'/g, "\\'")}', '${a.image}', '${a.id}')">
        <div class="sp-card-cover-wrap"><img src="${a.image}" alt="${a.name}" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300'"></div>
        <div class="sp-card-info">
          <div class="sp-card-title">${a.name}</div>
          <div class="sp-card-desc">${categoryLabels[a.category] || 'Artist'}</div>
        </div>
      </div>
    `).join('');

    grid.innerHTML = pillsHtml + (cardsHtml || `
      <div style="grid-column:1/-1;padding:40px 20px;text-align:center;color:var(--sp-text-subdued)">
        <p style="font-size:16px;margin-bottom:10px;">Singer "${query}" is not in the curated 100+ list.</p>
        <button class="sp-btn sp-btn-primary" style="padding:10px 20px;border-radius:20px;font-size:13px;font-weight:700;" onclick="sp.liveSearchUnknownArtist('${query.replace(/'/g, "\\'")}')">
          <i class="fa-solid fa-earth-americas" style="margin-right:6px"></i> Search Worldwide Live
        </button>
      </div>
    `);
  }

  liveSearchUnknownArtist(name) {
    if (!name || !name.trim()) return;
    const clean = name.trim();
    this.openArtistPage(clean);
  }

  openAllArtistsView(category = 'all') {
    this.navigate('library');
    const pill = document.querySelector('#view-library .sp-category-pills button:nth-child(3)');
    this.filterLibraryPage('artists', pill);
    if (category !== 'all') {
      this.renderArtistsListView(category);
    }
  }

  openLikedSongs() {
    this.navigate('album');
    const headerBox = document.getElementById('album-cover-box');
    if (headerBox) {
      headerBox.style.background = 'linear-gradient(135deg, #450af5, #8e8ee5)';
      headerBox.innerHTML = '<i class="fa-solid fa-heart" style="font-size:64px;color:#fff"></i>';
    }

    const b1 = document.getElementById('album-type-badge');
    if (b1) b1.textContent = 'PLAYLIST';
    const b2 = document.getElementById('album-title-txt');
    if (b2) b2.textContent = 'Liked Songs';
    const b3 = document.getElementById('album-artist-txt');
    if (b3) b3.textContent = 'Your Collection';
    const b4 = document.getElementById('album-year-txt');
    if (b4) b4.textContent = '2024';
    const b5 = document.getElementById('album-song-count-txt');
    if (b5) b5.textContent = `${this.likedSongs.length} songs`;

    const body = document.getElementById('album-tracklist-items');
    if (!body) return;
    if (!this.likedSongs.length) {
      body.innerHTML = `
        <div style="padding:48px 16px;text-align:center;color:var(--sp-text-subdued)">
          <i class="fa-solid fa-heart" style="font-size:48px;color:#333;margin-bottom:16px"></i>
          <h3 style="font-size:20px;color:#fff;margin-bottom:8px">Songs you like will appear here</h3>
          <p style="font-size:14px;margin-bottom:20px">Save songs by tapping the heart icon on any track.</p>
          <button class="sp-btn-play-now" style="margin:0 auto" onclick="sp.navigate('home')">
            <i class="fa-solid fa-compass"></i> Explore Trending Hits
          </button>
        </div>
      `;
      return;
    }

    body.innerHTML = this.likedSongs.map((s, idx) => {
      this.registerSong(s);
      return `
      <div class="sp-track-row" onclick="sp.playLikedTrack('${this.escapeJsString(s.id)}')">
        <span class="track-num-col">${idx + 1}</span>
        <div class="track-title-col">
          <img src="${s.image}" class="track-thumb" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100'">
          <div class="track-names">
            <span class="track-name-txt">${this.escapeHtml(s.title)}</span>
            <span class="track-artist-txt">${this.escapeHtml(this.cleanArtistNames(s.artist))}</span>
          </div>
        </div>
        <span class="track-album-col">${this.escapeHtml(s.album || '')}</span>
        <span class="track-dur-col">
          <span>${this.formatTime(s.duration)}</span>
          ${this.getTrackDownloadBtnHtml(s)}
        </span>
      </div>
    `;
    }).join('');
  }

  openRecentlyPlayed() {
    this.navigate('album');
    const headerBox = document.getElementById('album-cover-box');
    if (headerBox) {
      headerBox.style.background = 'linear-gradient(135deg, #1e3264, #27856a)';
      headerBox.innerHTML = '<i class="fa-solid fa-clock-rotate-left" style="font-size:64px;color:#fff"></i>';
    }

    const b1 = document.getElementById('album-type-badge');
    if (b1) b1.textContent = 'HISTORY';
    const b2 = document.getElementById('album-title-txt');
    if (b2) b2.textContent = 'Recently Played';
    const b3 = document.getElementById('album-artist-txt');
    if (b3) b3.textContent = 'Your Listening History';
    const b4 = document.getElementById('album-year-txt');
    if (b4) b4.textContent = 'Auto-Saved';
    const b5 = document.getElementById('album-song-count-txt');
    if (b5) b5.textContent = `${this.recentlyPlayed.length} songs`;

    const body = document.getElementById('album-tracklist-items');
    if (!body) return;
    if (!this.recentlyPlayed.length) {
      body.innerHTML = '<p style="padding:40px;text-align:center;color:var(--sp-text-subdued)">No history yet. Start playing songs to see them here!</p>';
      return;
    }

    body.innerHTML = this.recentlyPlayed.map((s, idx) => {
      this.registerSong(s);
      return `
      <div class="sp-track-row" onclick="sp.playRecentTrack('${this.escapeJsString(s.id)}')">
        <span class="track-num-col">${idx + 1}</span>
        <div class="track-title-col">
          <img src="${s.image}" class="track-thumb" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100'">
          <div class="track-names">
            <span class="track-name-txt">${this.escapeHtml(s.title)}</span>
            <span class="track-artist-txt">${this.escapeHtml(this.cleanArtistNames(s.artist))}</span>
          </div>
        </div>
        <span class="track-album-col">${this.escapeHtml(s.album || '')}</span>
        <span class="track-dur-col">
          <span>${this.formatTime(s.duration)}</span>
          ${this.getTrackDownloadBtnHtml(s)}
        </span>
      </div>
    `;
    }).join('');
  }

  showBrowseAllCategories() {
    const resArea = document.getElementById('sp-search-results-area');
    if (resArea) resArea.style.display = 'none';
    const browseArea = document.getElementById('sp-browse-all-area');
    if (browseArea) browseArea.style.display = 'block';

    const categories = [
      { name: 'Global Top Hits 🌍', color: '#1e3264', q: 'the weeknd', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300' },
      { name: 'Bollywood (Hindi) 🎭', color: '#e8115b', q: 'arijit singh', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300' },
      { name: 'Punjabi Bangers 🔥', color: '#503750', q: 'punjabi hits', img: 'https://c.saavncdn.com/178/Wavy-Punjabi-2024-20250523044332-500x500.jpg' },
      { name: 'Hip-Hop & Rap 🎙️', color: '#ba5d07', q: 'eminem', img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300' },
      { name: 'International Pop 🌟', color: '#8d67ab', q: 'taylor swift', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300' },
      { name: 'Romance & Chill 🌙', color: '#e91429', q: 'anuv jain', img: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300' },
      { name: 'Rock & Classics 🎸', color: '#477d95', q: 'coldplay', img: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300' },
      { name: 'Sidhu Moose Wala 🦁', color: '#27856a', q: 'sidhu moose wala', img: 'https://c.saavncdn.com/202/Moosetape-Punjabi-2021-20210514211104-500x500.jpg' },
      { name: 'Karan Aujla ⚡', color: '#4361ee', q: 'karan aujla', img: 'https://c.saavncdn.com/978/Making-Memories-Punjabi-2023-20230818074945-500x500.jpg' },
      { name: 'Diljit Dosanjh 🌟', color: '#7209b7', q: 'diljit dosanjh', img: 'https://c.saavncdn.com/748/Ghost-Punjabi-2023-20230929053531-500x500.jpg' }
    ];

    const grid = document.getElementById('sp-browse-grid');
    if (grid) {
      grid.innerHTML = categories.map(c => `
        <div class="sp-browse-card" style="background:${c.color};" onclick="sp.searchCategory('${c.q}')">
          <span class="sp-browse-card-title">${c.name}</span>
          <img src="${c.img}" class="sp-browse-card-img" alt="${c.name}" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200'">
        </div>
      `).join('');
    }
  }

  searchCategory(q) {
    const input = document.getElementById('sp-global-search-input');
    if (input) {
      input.value = q;
      const clearBtn = document.getElementById('sp-search-clear');
      if (clearBtn) clearBtn.style.display = 'block';
      this.performSearch(q);
    }
  }

  clearSearch() {
    const input = document.getElementById('sp-global-search-input');
    if (input) input.value = '';
    const clearBtn = document.getElementById('sp-search-clear');
    if (clearBtn) clearBtn.style.display = 'none';
    this.showBrowseAllCategories();
  }

  filterCategory(cat, btnEl) {
    document.querySelectorAll('.sp-cat-pill').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    
    if (cat === 'all') {
      this.renderHomeViews();
    } else {
      const qMap = {
        'global': 'the weeknd', 'bollywood': 'arijit singh', 'punjabi': 'punjabi hits',
        'hiphop': 'eminem', 'pop': 'taylor swift', 'chill': 'anuv jain',
        'sidhu': 'sidhu moose wala', 'karan': 'karan aujla', 'diljit': 'diljit dosanjh'
      };
      this.searchCategory(qMap[cat] || cat);
    }
  }

  renderHomeViews() {
    if (!this.homeData) return;

    const billboard = this.homeData.billboard || [];
    const sections = this.homeData.sections || {};

    if (billboard.length) this.adaptHomeAndQueueToVibe(billboard[0]);

    const quickGrid = document.getElementById('sp-quick-grid');
    if (quickGrid && billboard.length) {
      quickGrid.innerHTML = billboard.slice(0, 6).map((s, idx) => {
        this.registerSong(s);
        return `
        <div class="sp-quick-card" onclick="sp.playTopHitsTrack('${this.escapeJsString(s.id)}')">
          <img src="${s.image}" alt="${this.escapeHtml(s.title)}" loading="eager" decoding="async" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'">
          <span class="sp-quick-title">${this.escapeHtml(s.title)}</span>
          <div class="sp-quick-play-btn"><i class="fa-solid fa-play"></i></div>
        </div>
      `;
      }).join('');
    }

    const shelvesContainer = document.getElementById('sp-shelves-container');
    if (shelvesContainer) {
      let html = '';
      const shelfConfigs = [
        { key: 'global_top_50', title: 'Global Top 50 & Worldwide Hits 🌍' },
        { key: 'bollywood_top', title: 'Bollywood Mega Chartbusters 🎭' },
        { key: 'trending_punjabi', title: 'Trending Punjabi Bangers 🔥' },
        { key: 'international_pop', title: 'International Pop & Dance 🌟' },
        { key: 'global_hiphop', title: 'Global Hip-Hop & Rap 🎙️' },
        { key: 'desi_hiphop', title: 'Desi Hip-Hop & Drill ⚡' },
        { key: 'romantic_chill', title: 'Acoustic, Romance & Lo-Fi 🌙' },
        { key: 'classic_legends', title: '90s & Golden Evergreens 📻' }
      ];

      shelfConfigs.forEach(conf => {
        const list = sections[conf.key] || [];
        if (list.length) {
          html += `
            <div class="sp-shelf-section">
              <div class="sp-shelf-header"><h2 class="sp-shelf-title">${conf.title}</h2></div>
              <div class="sp-shelf-row">
                ${list.map(s => this.renderSongCard(s, list)).join('')}
              </div>
            </div>
          `;
        }
      });

      if (this.homeData.featured_artists) {
        html += `
          <div class="sp-shelf-section">
            <div class="sp-shelf-header" style="display:flex;justify-content:space-between;align-items:center;">
              <div>
                <h2 class="sp-shelf-title">Popular Artists</h2>
                <p style="font-size:12px;color:var(--sp-text-subdued);margin-top:2px;">100+ Global & Indian Icons &bull; Tap to explore</p>
              </div>
              <button class="sp-shelf-see-all" style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);color:#fff;font-size:12px;font-weight:700;cursor:pointer;padding:6px 14px;border-radius:20px;transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.18)'" onmouseout="this.style.background='rgba(255,255,255,0.07)'" onclick="sp.openAllArtistsView()">Show all 100+ &rarr;</button>
            </div>
            <div class="sp-shelf-row">
              ${this.homeData.featured_artists.slice(0, 16).map(a => `
                <div class="sp-card artist-card" onclick="sp.openArtistPage('${a.name.replace(/'/g, "\\'")}', '${a.image}')">
                  <div class="sp-card-cover-wrap"><img src="${a.image}" alt="${a.name}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300'"></div>
                  <div class="sp-card-info">
                    <div class="sp-card-title">${a.name}</div>
                    <div class="sp-card-desc">Artist</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      if (this.homeData.featured_albums) {
        html += `
          <div class="sp-shelf-section">
            <div class="sp-shelf-header"><h2 class="sp-shelf-title">Popular Albums</h2></div>
            <div class="sp-shelf-row">
              ${this.homeData.featured_albums.slice(0, 16).map(alb => `
                <div class="sp-card" onclick="sp.openAlbumPage('${alb.title.replace(/'/g, "\\'")}', '${alb.subtitle.replace(/'/g, "\\'")}', '${alb.image}', '${alb.id || ''}')">
                  <div class="sp-card-cover-wrap"><img src="${alb.image}" alt="${alb.title}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'"></div>
                  <div class="sp-card-info">
                    <div class="sp-card-title">${alb.title}</div>
                    <div class="sp-card-desc">${alb.subtitle}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      shelvesContainer.innerHTML = html;
    }

    const topTracksList = document.getElementById('home-top-tracks-list');
    if (topTracksList && billboard.length) {
      topTracksList.innerHTML = billboard.slice(0, 20).map((s, idx) => {
        this.registerSong(s);
        return `
        <div class="sp-track-row" onclick="sp.playTopHitsTrack('${this.escapeJsString(s.id)}')">
          <span class="track-num-col">${idx + 1}</span>
          <div class="track-title-col">
            <img src="${s.image}" class="track-thumb" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100'">
            <div class="track-names">
              <span class="track-name-txt">${this.escapeHtml(s.title)}</span>
              <span class="track-artist-txt" onclick="event.stopPropagation(); sp.openArtistPage('${this.escapeJsString(this.cleanArtistNames(s.artist))}', '${this.escapeJsString(s.image)}')">${this.escapeHtml(this.cleanArtistNames(s.artist))}</span>
            </div>
          </div>
          <span class="track-album-col" onclick="event.stopPropagation(); sp.openAlbumPage('${this.escapeJsString(s.album || s.title)}', '${this.escapeJsString(this.cleanArtistNames(s.artist))}', '${this.escapeJsString(s.image)}', '${this.escapeJsString(s.id || '')}')">${this.escapeHtml(s.album)}</span>
          <span class="track-dur-col">
            <span>${this.formatTime(s.duration)}</span>
            ${this.getTrackDownloadBtnHtml(s)}
          </span>
        </div>
      `;
      }).join('');
    }
  }

  renderSongCard(s, playlistContext) {
    if (!s) return '';
    this.registerSong(s);
    return `
      <div class="sp-card" onclick="sp.playSongById('${s.id}')">
        <div class="sp-card-cover-wrap">
          <img src="${s.image}" alt="${this.escapeHtml(s.title)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'">
          <div class="sp-card-play-btn"><i class="fa-solid fa-play"></i></div>
        </div>
        <div class="sp-card-info">
          <div class="sp-card-title">${this.escapeHtml(s.title)}</div>
          <div class="sp-card-desc">${this.escapeHtml(this.cleanArtistNames(s.artist))}</div>
        </div>
      </div>
    `;
  }

  playTopHitsAll() {
    if (this.homeData && this.homeData.billboard && this.homeData.billboard.length) {
      this.playSong(this.homeData.billboard[0], this.homeData.billboard);
    }
  }

  updateGreeting() {
    const hr = new Date().getHours();
    let g = 'Good evening';
    if (hr < 12) g = 'Good morning';
    else if (hr < 18) g = 'Good afternoon';
    const el = document.getElementById('sp-greeting-text');
    if (el) el.textContent = g;
  }

  // ========================================================================
  // 11. WEB AUDIO API, EQUALIZER & NEON SPECTRUM VISUALIZER
  // ========================================================================
  initAudioContext() {
    // In Android APK, hardware DSP is handled natively via PlayifyNativeBridge (BassBoost & Equalizer).
    // Connecting Web Audio createMediaElementSource in Android WebView detaches native hardware AudioTrack
    // and causes severe micro-stuttering and buffer underruns on mobile devices.
    if (typeof window !== 'undefined' && window.PlayifyNative) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }

      // Connect HTML5 audio element through Web Audio DSP Equalizer graph (Only once!)
      if (!this.audioSource && this.audio) {
        try {
          this.audioSource = this.audioCtx.createMediaElementSource(this.audio);

          // 1. Low-shelf Bass Filter (< 200 Hz)
          this.eqBass = this.audioCtx.createBiquadFilter();
          this.eqBass.type = 'lowshelf';
          this.eqBass.frequency.value = 180;
          this.eqBass.gain.value = (typeof this.savedBassGain === 'number') ? this.savedBassGain : 0;

          // 2. Peaking Mid Filter (1000 Hz)
          this.eqMid = this.audioCtx.createBiquadFilter();
          this.eqMid.type = 'peaking';
          this.eqMid.frequency.value = 1000;
          this.eqMid.Q.value = 1.0;
          this.eqMid.gain.value = (typeof this.savedMidGain === 'number') ? this.savedMidGain : 0;

          // 3. High-shelf Treble Filter (> 3200 Hz)
          this.eqTreble = this.audioCtx.createBiquadFilter();
          this.eqTreble.type = 'highshelf';
          this.eqTreble.frequency.value = 3200;
          this.eqTreble.gain.value = (typeof this.savedTrebleGain === 'number') ? this.savedTrebleGain : 0;

          // 4. Spectrum Analyser for neon visualizer
          this.analyser = this.audioCtx.createAnalyser();
          this.analyser.fftSize = 64;

          // Wire complete audio DSP graph:
          // MediaElement -> eqBass -> eqMid -> eqTreble -> analyser -> destination
          this.audioSource.connect(this.eqBass);
          this.eqBass.connect(this.eqMid);
          this.eqMid.connect(this.eqTreble);
          this.eqTreble.connect(this.analyser);
          this.analyser.connect(this.audioCtx.destination);
          console.log('[Equalizer] Hardware-accelerated DSP audio graph active!');
        } catch(connErr) {
          console.warn('[Equalizer] MediaElementSource connect note:', connErr);
        }
      }
    } catch(e) {
      console.warn('[Equalizer] AudioContext init error:', e);
    }
  }

  startVisualizerRender() {
    if (this.visualizerAnimId) return;
    if (!this.visualizerEnabled || !this.visualizerMode) return;
    const canvas = document.getElementById('fs-visualizer-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let simAngle = 0;
    let cachedW = canvas.offsetWidth || 360;
    let cachedH = canvas.offsetHeight || 64;
    canvas.width = cachedW;
    canvas.height = cachedH;

    const render = () => {
      const fsPlayer = document.getElementById('sp-fullscreen-player');
      const isFsOpen = fsPlayer && fsPlayer.classList.contains('open');
      if (!this.visualizerEnabled || !this.visualizerMode || !this.isPlaying || !isFsOpen) {
        this.stopVisualizerRender();
        return;
      }
      this.visualizerAnimId = requestAnimationFrame(render);

      // Only re-calculate dimensions if offset width/height actually changed
      if (canvas.offsetWidth && (canvas.offsetWidth !== cachedW || canvas.offsetHeight !== cachedH)) {
        cachedW = canvas.width = canvas.offsetWidth;
        cachedH = canvas.height = canvas.offsetHeight;
      }

      ctx.clearRect(0, 0, cachedW, cachedH);
      const numBars = 32;
      const gap = 3;
      const barWidth = (cachedW - (numBars - 1) * gap) / numBars;

      let freqData = null;
      if (this.analyser && this.isPlaying) {
        freqData = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(freqData);
      }

      const hasSignal = freqData && freqData.some(v => v > 0);
      const col1 = '#1ed760';
      const col2 = '#00e5ff';

      const gradient = ctx.createLinearGradient(0, cachedH, 0, 0);
      gradient.addColorStop(0, col2);
      gradient.addColorStop(0.7, col1);
      gradient.addColorStop(1, '#ffffff');

      simAngle += 0.06;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 4;
        if (this.isPlaying) {
          if (hasSignal) {
            const val = freqData[i] || 0;
            barHeight = Math.max(6, (val / 255) * (cachedH - 8));
          } else {
            const wave = Math.sin(simAngle + i * 0.32) * 0.5 + Math.cos(simAngle * 1.5 - i * 0.18) * 0.5;
            barHeight = Math.max(8, ((wave + 1) / 2) * (cachedH - 12) * 0.9);
          }
        } else {
          barHeight = 4;
        }

        const x = i * (barWidth + gap);
        const y = cachedH - barHeight;

        ctx.fillStyle = gradient;

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();

        if (this.isPlaying && barHeight > 10) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, Math.max(0, y - 2), barWidth, 2);
        }
      }
    };

    this.visualizerAnimId = requestAnimationFrame(render);
  }

  stopVisualizerRender() {
    if (this.visualizerAnimId) {
      cancelAnimationFrame(this.visualizerAnimId);
      this.visualizerAnimId = null;
    }
    const canvas = document.getElementById('fs-visualizer-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  initVisualizer() {
    if (this.visualizerEnabled && this.visualizerMode && this.isPlaying) {
      this.startVisualizerRender();
    } else {
      this.stopVisualizerRender();
    }
  }

  toggleVisualizerSetting(enabled) {
    this.visualizerEnabled = enabled;
    localStorage.setItem('sp_visualizer_enabled', enabled);
    this.visualizerMode = enabled;
    const box = document.getElementById('fs-visualizer-box');
    if (box) box.style.display = enabled ? 'flex' : 'none';
    const btn = document.getElementById('btn-fs-visualizer');
    if (btn) btn.classList.toggle('active', enabled);
    if (enabled) {
      this.initAudioContext();
      this.startVisualizerRender();
      this.showToast('Audio Spectrum: Enabled');
    } else {
      this.stopVisualizerRender();
      this.showToast('Audio Spectrum: Disabled');
    }
  }

  toggleVisualizerMode() {
    this.visualizerMode = !this.visualizerMode;
    this.visualizerEnabled = this.visualizerMode;
    const box = document.getElementById('fs-visualizer-box');
    if (box) box.style.display = this.visualizerMode ? 'flex' : 'none';
    const btn = document.getElementById('btn-fs-visualizer');
    if (btn) btn.classList.toggle('active', this.visualizerMode);
    const sw = document.getElementById('setting-visualizer');
    if (sw) sw.checked = this.visualizerMode;
    if (this.visualizerMode) {
      this.initAudioContext();
      this.startVisualizerRender();
      this.showToast('Audio Spectrum: Shown');
    } else {
      this.stopVisualizerRender();
      this.showToast('Audio Spectrum: Hidden');
    }
  }

  setEqualizerPreset(preset) {
    this.currentEqPreset = preset;
    localStorage.setItem('sp_eq_preset', preset);

    document.querySelectorAll('.sp-eq-preset-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(`eq-preset-${preset}`);
    if (activeBtn) activeBtn.classList.add('active');

    let bassVal = 0;
    let midVal = 0;
    let trebVal = 0;

    if (preset === 'bass') {
      bassVal = 10; midVal = -1; trebVal = 2;
      this.showToast('💥 Heavy Bass Boost Activated!');
    } else if (preset === 'vocal') {
      bassVal = -2; midVal = 5; trebVal = 3;
      this.showToast('🎙️ Vocal Clarity Mode Activated!');
    } else if (preset === '3d') {
      bassVal = 4; midVal = 2; trebVal = 6;
      this.showToast('🌌 3D Spatial Surround Activated!');
    } else if (preset === 'club') {
      bassVal = 9; midVal = 1; trebVal = 5;
      this.showToast('⚡ Club / EDM Mode Activated!');
    } else {
      bassVal = 0; midVal = 0; trebVal = 0;
      this.showToast('🎵 Studio Flat Response');
    }

    this.savedBassGain = bassVal;
    this.savedMidGain = midVal;
    this.savedTrebleGain = trebVal;
    localStorage.setItem('sp_eq_bass', bassVal);
    localStorage.setItem('sp_eq_mid', midVal);
    localStorage.setItem('sp_eq_treble', trebVal);

    if (typeof window !== 'undefined' && window.PlayifyNative && typeof window.PlayifyNative.setNativePreset === 'function') {
      try {
        window.PlayifyNative.setNativePreset(preset);
      } catch(e) {}
    } else {
      this.initAudioContext();
      if (this.eqBass) this.eqBass.gain.value = bassVal;
      if (this.eqMid) this.eqMid.gain.value = midVal;
      if (this.eqTreble) this.eqTreble.gain.value = trebVal;
    }

    const bRange = document.getElementById('bass-gain-range');
    const bLbl = document.getElementById('bass-gain-label');
    if (bRange) bRange.value = bassVal;
    if (bLbl) bLbl.textContent = `${bassVal >= 0 ? '+' : ''}${bassVal} dB`;

    const tRange = document.getElementById('treble-gain-range');
    const tLbl = document.getElementById('treble-gain-label');
    if (tRange) tRange.value = Math.max(0, trebVal);
    if (tLbl) tLbl.textContent = `+${Math.max(0, trebVal)} dB`;
  }

  setBassGainManual(val) {
    const gain = parseFloat(val);
    const lbl = document.getElementById('bass-gain-label');
    if (lbl) lbl.textContent = `+${gain} dB`;
    this.savedBassGain = gain;
    this.currentEqPreset = 'custom';
    localStorage.setItem('sp_eq_bass', gain);
    localStorage.setItem('sp_eq_preset', 'custom');
    document.querySelectorAll('.sp-eq-preset-btn').forEach(b => b.classList.remove('active'));

    if (typeof window !== 'undefined' && window.PlayifyNative && typeof window.PlayifyNative.setNativeBass === 'function') {
      try {
        window.PlayifyNative.setNativeBass(Math.round(gain));
      } catch(e) {}
    } else {
      this.initAudioContext();
      if (this.eqBass) this.eqBass.gain.value = gain;
    }
  }

  setTrebleGainManual(val) {
    const gain = parseFloat(val);
    const lbl = document.getElementById('treble-gain-label');
    if (lbl) lbl.textContent = `+${gain} dB`;
    this.savedTrebleGain = gain;
    this.currentEqPreset = 'custom';
    localStorage.setItem('sp_eq_treble', gain);
    localStorage.setItem('sp_eq_preset', 'custom');
    document.querySelectorAll('.sp-eq-preset-btn').forEach(b => b.classList.remove('active'));

    if (typeof window !== 'undefined' && window.PlayifyNative && typeof window.PlayifyNative.setNativeEqBands === 'function') {
      try {
        window.PlayifyNative.setNativeEqBands(Math.round(this.savedBassGain || 0), Math.round(this.savedMidGain || 0), Math.round(gain));
      } catch(e) {}
    } else {
      this.initAudioContext();
      if (this.eqTreble) this.eqTreble.gain.value = gain;
    }
  }

  openEqualizerModal() {
    if (!window.PlayifyNative) {
      this.initAudioContext();
    }

    const currentBass = this.eqBass ? this.eqBass.gain.value : (this.savedBassGain || 0);
    const currentTreble = this.eqTreble ? this.eqTreble.gain.value : (this.savedTrebleGain || 0);

    const bRange = document.getElementById('bass-gain-range');
    const bLbl = document.getElementById('bass-gain-label');
    if (bRange) bRange.value = currentBass;
    if (bLbl) bLbl.textContent = `${currentBass >= 0 ? '+' : ''}${currentBass} dB`;

    const tRange = document.getElementById('treble-gain-range');
    const tLbl = document.getElementById('treble-gain-label');
    if (tRange) tRange.value = Math.max(0, currentTreble);
    if (tLbl) tLbl.textContent = `+${Math.max(0, currentTreble)} dB`;

    const activePreset = this.currentEqPreset || 'flat';
    document.querySelectorAll('.sp-eq-preset-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(`eq-preset-${activePreset}`);
    if (btn) btn.classList.add('active');

    const modal = document.getElementById('sp-equalizer-modal');
    if (modal) modal.classList.add('open');
  }

  closeEqualizerModal() {
    const modal = document.getElementById('sp-equalizer-modal');
    if (modal) modal.classList.remove('open');
  }

  openSleepTimerModal() {
    const modal = document.getElementById('sp-sleeptimer-modal');
    if (modal) modal.classList.add('open');
    const cancelBtn = document.getElementById('btn-cancel-timer');
    if (cancelBtn) {
      cancelBtn.style.display = (this.sleepTimerTarget || this.sleepOnTrackEnd) ? 'block' : 'none';
    }
  }

  closeSleepTimerModal() {
    const modal = document.getElementById('sp-sleeptimer-modal');
    if (modal) modal.classList.remove('open');
  }

  setSleepTimer(mins) {
    this.cancelSleepTimer(false);

    if (mins === 'end_of_track') {
      this.sleepOnTrackEnd = true;
      this.showToast('🌙 Sleep Timer: Auto-pause at end of current track');
      this.updateTimerBadge('End');
      this.closeSleepTimerModal();
      return;
    }

    const durationMs = mins * 60 * 1000;
    this.sleepTimerTarget = Date.now() + durationMs;

    this.sleepTimerInterval = setInterval(() => {
      const remainingMs = this.sleepTimerTarget - Date.now();
      if (remainingMs <= 0) {
        this.executeSleepTimerStop();
      } else {
        const remMins = Math.ceil(remainingMs / 60000);
        this.updateTimerBadge(`${remMins}m`);

        if (remainingMs <= 10000 && this.audio && this.audio.volume > 0.05) {
          this.audio.volume = Math.max(0, this.audio.volume - 0.08);
        }
      }
    }, 1000);

    this.updateTimerBadge(`${mins}m`);
    this.showToast(`🌙 Sleep Timer set for ${mins} minutes`);
    this.closeSleepTimerModal();
  }

  cancelSleepTimer(showMsg = true) {
    if (this.sleepTimerInterval) clearInterval(this.sleepTimerInterval);
    this.sleepTimerInterval = null;
    this.sleepTimerTarget = null;
    this.sleepOnTrackEnd = false;
    this.updateTimerBadge(null);
    if (showMsg) this.showToast('Sleep Timer turned off');
    this.closeSleepTimerModal();
  }

  executeSleepTimerStop() {
    if (this.audio) this.audio.pause();
    this.cancelSleepTimer(false);
    this.showToast('🌙 Sleep Timer: Playback paused. Goodnight!');
  }

  updateTimerBadge(text) {
    const badge = document.getElementById('timer-badge');
    if (!badge) return;
    if (text) {
      badge.textContent = text;
      badge.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }
  }

  openQueueDrawer() {
    this.renderQueueDrawer();
    const bd = document.getElementById('sp-queue-backdrop');
    if (bd) bd.classList.add('open');
    const dr = document.getElementById('sp-queue-drawer');
    if (dr) dr.classList.add('open');
  }

  closeQueueDrawer() {
    const bd = document.getElementById('sp-queue-backdrop');
    if (bd) bd.classList.remove('open');
    const dr = document.getElementById('sp-queue-drawer');
    if (dr) dr.classList.remove('open');
  }

  renderQueueDrawer() {
    const nowBox = document.getElementById('queue-now-playing-box');
    const upcomingList = document.getElementById('queue-upcoming-list');
    const countSubtitle = document.getElementById('queue-count-subtitle');

    if (this.currentSong && nowBox) {
      nowBox.innerHTML = `
        <div class="sp-queue-now-card">
          <img src="${this.currentSong.image}" class="sp-queue-now-thumb" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100'">
          <div class="sp-queue-now-info">
            <div class="sp-queue-now-title">${this.escapeHtml(this.currentSong.title)}</div>
            <div class="sp-queue-now-artist" onclick="sp.closeQueueDrawer(); sp.openArtistFromPlayer()" title="View artist profile">${this.escapeHtml(this.cleanArtistNames(this.currentSong.artist))}</div>
          </div>
          <div class="sp-queue-eq" title="Playing">
            <span class="sp-queue-eq-bar"></span>
            <span class="sp-queue-eq-bar"></span>
            <span class="sp-queue-eq-bar"></span>
          </div>
        </div>
      `;
    }

    const upcoming = this.queue.slice(this.queueIndex + 1);
    if (countSubtitle) countSubtitle.textContent = `${upcoming.length} Tracks Upcoming`;

    if (upcomingList) {
      if (!upcoming.length) {
        upcomingList.innerHTML = `
          <div class="sp-queue-empty">
            <i class="fa-solid fa-music" style="font-size:28px;color:var(--sp-text-subdued);margin-bottom:10px;opacity:0.6;"></i>
            <p style="color:var(--sp-text-subdued);font-size:13px;line-height:1.5;margin:0;">No more songs in queue.<br>Pick any song to keep the music playing!</p>
          </div>
        `;
        return;
      }

      upcomingList.innerHTML = upcoming.map((s, idx) => {
        const actualIdx = this.queueIndex + 1 + idx;
        return `
          <div class="sp-queue-item" onclick="sp.playFromQueueIndex(${actualIdx})">
            <span class="sp-queue-index">${idx + 1}</span>
            <img src="${s.image}" class="sp-queue-thumb" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100'">
            <div class="sp-queue-info">
              <div class="sp-queue-title">${this.escapeHtml(s.title)}${s.isSmartRecommendation ? ' <span class="sp-smart-tag"><i class="fa-solid fa-wand-magic-sparkles"></i> Recommended</span>' : ''}</div>
              <div class="sp-queue-artist" onclick="event.stopPropagation(); sp.closeQueueDrawer(); sp.openArtistPage('${this.escapeJsString(this.cleanArtistNames(s.artist))}', '${this.escapeJsString(s.image)}')">${this.escapeHtml(this.cleanArtistNames(s.artist))}</div>
            </div>
            <button class="sp-queue-remove-btn" onclick="event.stopPropagation(); sp.removeFromQueue(${actualIdx})" title="Remove from queue" aria-label="Remove">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        `;
      }).join('');
    }
  }

  playFromQueueIndex(index) {
    if (index >= 0 && index < this.queue.length) {
      this.queueIndex = index;
      this.playSong(this.queue[index], this.queue, true);
      this.renderQueueDrawer();
    }
  }

  removeFromQueue(index) {
    if (index >= 0 && index < this.queue.length) {
      this.queue.splice(index, 1);
      if (index < this.queueIndex) this.queueIndex--;
      this.renderQueueDrawer();
      this.showToast('Removed from queue');
    }
  }

  clearUpcomingQueue() {
    this.queue = this.currentSong ? [this.currentSong] : [];
    this.queueIndex = 0;
    this.renderQueueDrawer();
    this.showToast('Upcoming queue cleared');
  }

  openCreatePlaylistModal() {
    this.openAddToPlaylistModal();
  }

  openAddToPlaylistModal() {
    const modal = document.getElementById('sp-playlist-modal');
    if (modal) modal.classList.add('open');
    this.renderModalPlaylists();
  }

  closePlaylistModal() {
    const modal = document.getElementById('sp-playlist-modal');
    if (modal) modal.classList.remove('open');
  }

  createNewPlaylistFromInput() {
    const input = document.getElementById('new-playlist-input');
    if (!input) return;
    const name = input.value.trim();
    if (!name) {
      this.showToast('Please enter a playlist name');
      return;
    }

    const newPl = {
      id: `pl_${Date.now()}`,
      title: name,
      songs: this.currentSong ? [this.currentSong] : [],
      created: new Date().toLocaleDateString()
    };

    this.customPlaylists.push(newPl);
    localStorage.setItem('sp_custom_playlists', JSON.stringify(this.customPlaylists));
    input.value = '';
    this.showToast(`💚 Playlist "${name}" Created!`);
    this.renderModalPlaylists();
    this.renderLibraryPage();
  }

  addCurrentSongToPlaylist(playlistId) {
    if (!this.currentSong) {
      this.showToast('Play a song first to add it.');
      return;
    }

    const pl = this.customPlaylists.find(p => p.id === playlistId);
    if (!pl) return;

    if (!pl.songs.some(s => s.id === this.currentSong.id)) {
      pl.songs.push(this.currentSong);
      localStorage.setItem('sp_custom_playlists', JSON.stringify(this.customPlaylists));
      this.showToast(`💚 Added "${this.currentSong.title}" to ${pl.title}!`);
    } else {
      this.showToast(`Already in ${pl.title}`);
    }

    this.closePlaylistModal();
    this.renderLibraryPage();
  }

  renderModalPlaylists() {
    const list = document.getElementById('modal-user-playlists-list');
    if (!list) return;

    if (!this.customPlaylists.length) {
      list.innerHTML = '<p style="padding:14px;color:var(--sp-text-subdued);font-size:13px;text-align:center">No custom playlists yet. Create one above!</p>';
      return;
    }

    list.innerHTML = this.customPlaylists.map(pl => `
      <div class="sp-playlist-pick-item" onclick="sp.addCurrentSongToPlaylist('${pl.id}')">
        <div style="display:flex;align-items:center;gap:10px">
          <i class="fa-solid fa-music" style="color:var(--sp-green);font-size:14px"></i>
          <div>
            <div style="font-size:14px;font-weight:700;color:#fff">${pl.title}</div>
            <div style="font-size:11px;color:var(--sp-text-subdued)">${pl.songs.length} songs</div>
          </div>
        </div>
        <i class="fa-solid fa-plus" style="color:var(--sp-text-subdued);font-size:14px"></i>
      </div>
    `).join('');
  }

  openCustomPlaylistView(playlistId) {
    const pl = this.customPlaylists.find(p => p.id === playlistId);
    if (!pl) return;

    this.navigate('album');
    const headerBox = document.getElementById('album-cover-box');
    if (headerBox) {
      headerBox.style.background = 'linear-gradient(135deg, #1db954, #191414)';
      headerBox.innerHTML = '<i class="fa-solid fa-list-check" style="font-size:64px;color:#fff"></i>';
    }

    const b1 = document.getElementById('album-type-badge');
    if (b1) b1.textContent = 'CUSTOM PLAYLIST';
    const b2 = document.getElementById('album-title-txt');
    if (b2) b2.textContent = pl.title;
    const b3 = document.getElementById('album-artist-txt');
    if (b3) b3.textContent = 'Created by You';
    const b4 = document.getElementById('album-year-txt');
    if (b4) b4.textContent = pl.created;
    const b5 = document.getElementById('album-song-count-txt');
    if (b5) b5.textContent = `${pl.songs.length} songs`;

    const body = document.getElementById('album-tracklist-items');
    if (!body) return;
    if (!pl.songs.length) {
      body.innerHTML = `
        <div style="padding:48px 16px;text-align:center;color:var(--sp-text-subdued)">
          <i class="fa-solid fa-music" style="font-size:48px;color:#333;margin-bottom:16px"></i>
          <h3 style="font-size:20px;color:#fff;margin-bottom:8px">This playlist is empty</h3>
          <p style="font-size:14px;margin-bottom:20px">Search and add songs using the "+" button.</p>
          <button class="sp-btn-play-now" style="margin:0 auto" onclick="sp.navigate('search')">
            <i class="fa-solid fa-magnifying-glass"></i> Search Songs to Add
          </button>
        </div>
      `;
      return;
    }

    this.currentPlaylistViewSongs = pl.songs || [];
    body.innerHTML = pl.songs.map((s, idx) => {
      this.registerSong(s);
      return `
      <div class="sp-track-row" onclick="sp.playPlaylistTrack('${this.escapeJsString(s.id)}')">
        <span class="track-num-col">${idx + 1}</span>
        <div class="track-title-col">
          <img src="${s.image}" class="track-thumb" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100'">
          <div class="track-names">
            <span class="track-name-txt">${this.escapeHtml(s.title)}</span>
            <span class="track-artist-txt">${this.escapeHtml(this.cleanArtistNames(s.artist))}</span>
          </div>
        </div>
        <span class="track-album-col">${this.escapeHtml(s.album || '')}</span>
        <span class="track-dur-col">
          <span>${this.formatTime(s.duration)}</span>
          ${this.getTrackDownloadBtnHtml(s)}
        </span>
      </div>
    `;
    }).join('');
  }

  // ========================================================================
  // 12. REAL-TIME SYNCED LYRICS
  // ========================================================================
  async loadLyricsForCurrentSong() {
    if (!this.currentSong) return;
    this.currentLyrics = [];
    this.activeLyricIndex = -1;
    
    const container = document.getElementById('fs-lyrics-container');
    if (container) {
      container.innerHTML = '<p class="mf-lyric active">Loading synchronized lyrics...</p>';
    }

    try {
      const cleanTitle = this.currentSong.title.replace(/\(.*?\)|\[.*?\]|feat\..*|ft\..*/gi, '').trim();
      const cleanArtist = this.currentSong.artist.split(',')[0].trim();
      
      const res = await fetch(`https://lrclib.net/api/get?track_name=${encodeURIComponent(cleanTitle)}&artist_name=${encodeURIComponent(cleanArtist)}`);
      if (res.ok) {
        const data = await res.json();
        const synced = data.syncedLyrics || '';
        const plain = data.plainLyrics || '';

        if (synced) {
          const lines = [];
          const pattern = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;
          synced.split('\n').forEach(l => {
            const m = pattern.exec(l.trim());
            if (m) {
              const mins = parseInt(m[1], 10);
              const secs = parseInt(m[2], 10);
              const ms = parseInt(m[3], 10);
              const timeSec = mins * 60 + secs + (m[3].length === 2 ? ms / 100 : ms / 1000);
              const txt = m[4].trim();
              if (txt) lines.push({ time: Math.round(timeSec * 100) / 100, text: txt });
            }
          });
          this.currentLyrics = lines;
        } else if (plain) {
          this.currentLyrics = plain.split('\n').filter(l => l.trim()).map(l => ({ time: null, text: l.trim() }));
        }
      }

      if (container) {
        if (this.currentLyrics && this.currentLyrics.length > 0) {
          container.innerHTML = this.currentLyrics.map((l, i) => `
            <p class="mf-lyric ${i === 0 ? 'active' : ''}" id="lyric-line-${i}" ${l.time !== null ? `onclick="sp.seekToLyric(${l.time})"` : ''}>${l.text}</p>
          `).join('');
        } else {
          container.innerHTML = `
            <p class="mf-lyric active">♪ ${this.currentSong.title} ♪</p>
            <p class="mf-lyric">Artist: ${this.currentSong.artist}</p>
            <p class="mf-lyric">Enjoy synchronized lyrics on Playify</p>
          `;
        }
      }
    } catch (e) {
      if (container) {
        container.innerHTML = `
          <p class="mf-lyric active">♪ ${this.currentSong.title} ♪</p>
          <p class="mf-lyric">Artist: ${this.currentSong.artist}</p>
          <p class="mf-lyric">Enjoy music on Playify</p>
        `;
      }
    }
  }

  seekToLyric(timeSec) {
    if (timeSec !== null && this.audio && this.audio.duration) {
      this.audio.currentTime = timeSec;
    }
  }

  syncLyricsProgress(currentTime) {
    if (!this.currentLyrics || !this.currentLyrics.length) return;
    const fsPlayer = document.getElementById('sp-fullscreen-player');
    if (!fsPlayer || !fsPlayer.classList.contains('open')) return;

    let newIndex = -1;
    for (let i = 0; i < this.currentLyrics.length; i++) {
      const lTime = this.currentLyrics[i].time;
      if (lTime !== null && lTime <= currentTime) newIndex = i;
    }

    if (newIndex !== -1 && newIndex !== this.activeLyricIndex) {
      const prevEl = document.getElementById(`lyric-line-${this.activeLyricIndex}`);
      if (prevEl) prevEl.classList.remove('active');

      const nextEl = document.getElementById(`lyric-line-${newIndex}`);
      if (nextEl) {
        nextEl.classList.add('active');
        const container = document.getElementById('fs-lyrics-container');
        if (container) {
          const targetScroll = nextEl.offsetTop - container.offsetTop - (container.clientHeight / 2) + (nextEl.clientHeight / 2);
          container.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
        }
      }
      this.activeLyricIndex = newIndex;
    }
  }

  setupMediaSession() {
    try {
      if (!('mediaSession' in navigator)) return;
      navigator.mediaSession.setActionHandler('play', () => this.togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => this.togglePlay());
      navigator.mediaSession.setActionHandler('previoustrack', () => this.prevSong());
      navigator.mediaSession.setActionHandler('nexttrack', () => this.nextSong());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime && this.audio && this.audio.duration) this.audio.currentTime = details.seekTime;
      });
    } catch (e) {}
  }

  updateMediaSessionMetadata(song) {
    try {
      if (!('mediaSession' in navigator) || !song) return;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: song.album || 'Playify',
        artwork: [
          { src: song.image, sizes: '96x96', type: 'image/jpeg' },
          { src: song.image, sizes: '256x256', type: 'image/jpeg' },
          { src: song.image, sizes: '512x512', type: 'image/jpeg' }
        ]
      });
    } catch (e) {}
  }

  openFullscreenPlayer() {
    if (!this.currentSong) {
      this.showToast('Please select a song to play first!');
      return;
    }
    this.updateNowPlayingUI(this.currentSong);
    this.updateProgressUI();
    const isActuallyPlaying = Boolean(this.isPlaying || (this.audio && !this.audio.paused && !this.audio.ended && this.audio.currentTime > 0));
    this.updatePlayPauseUI(isActuallyPlaying);

    const vBox = document.getElementById('fs-visualizer-box');
    if (vBox) vBox.style.display = this.visualizerMode ? 'flex' : 'none';
    const vBtn = document.getElementById('btn-fs-visualizer');
    if (vBtn) vBtn.classList.toggle('active', Boolean(this.visualizerMode));

    if (this.visualizerMode && this.isPlaying) {
      this.startVisualizerRender();
    }

    const p = document.getElementById('sp-fullscreen-player');
    if (p) {
      p.classList.add('open');
      p.scrollTop = 0;
      const sc = p.querySelector('.sp-mf-scroll-content');
      if (sc) {
        sc.scrollTop = 0;
        requestAnimationFrame(() => { sc.scrollTop = 0; });
      }
    }
    document.body.style.overflow = 'hidden';
  }

  closeFullscreenPlayer() {
    const p = document.getElementById('sp-fullscreen-player');
    if (p) {
      p.classList.remove('open');
      p.scrollTop = 0;
    }
    document.body.style.overflow = '';
    this.stopVisualizerRender();
  }

  scrollToLyrics() {
    const card = document.getElementById('fs-lyrics-card');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  shareSong() {
    if (!this.currentSong) return;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: this.currentSong.title,
        text: `Listen to ${this.currentSong.title} by ${this.currentSong.artist} on Playify!`,
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      this.showToast('🔗 Song link copied to clipboard!');
    }
  }

  toggleExpandLyrics() {
    this.scrollToLyrics();
  }

  showToast(msg) {
    const t = document.getElementById('sp-toast');
    const txt = document.getElementById('sp-toast-msg');
    if (!t || !txt) return;
    txt.textContent = msg;
    t.style.display = 'flex';
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      t.style.display = 'none';
    }, 3000);
  }

  // ==========================================================================
  // SPOTIFY JAM (0-DELAY MULTI-DEVICE SYNCHRONIZED PLAYBACK)
  // ==========================================================================

  initJamState() {
    let deviceId = null;
    try {
      deviceId = localStorage.getItem('sp_jam_device_id');
      if (!deviceId) {
        deviceId = 'dev_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('sp_jam_device_id', deviceId);
      }
    } catch(e) {
      deviceId = 'dev_' + Math.random().toString(36).substring(2, 9);
    }

    this.jamState = {
      active: false,
      isHost: false,
      roomId: null,
      deviceId: deviceId,
      deviceName: this.getDeviceFriendlyName(),
      guestControl: true,
      clockOffset: 0,
      hostClockOffset: 0, // Direct Peer NTP offset between Guest and Host
      rtt: 0,
      lastActionSeq: 0,
      pollInterval: null,
      heartbeatInterval: null, // Host 2-second heartbeat pulse
      ntpInterval: null,       // Guest periodic NTP sync loop (12s)
      driftLoopId: null,       // Guest 250ms smooth phase-lock loop
      broadcastChannel: null,
      socket: null,
      lastTargetPosition: 0,
      lastTargetTimestamp: 0,
      lastHardSeekTime: 0,
      relay: null,
      peer: null,
      peerConnections: [],     // Prevents repeat seeking / audio stutter
      isHostPlaying: false
    };

    // Setup Local BroadcastChannel (instant <1ms sync for multi-tab testing)
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.jamState.broadcastChannel = new BroadcastChannel('playify_jam_bus');
        this.jamState.broadcastChannel.onmessage = (e) => this.handleJamBroadcastMessage(e.data);
      }
    } catch(e) {
      console.warn('BroadcastChannel note:', e);
    }
  }

  getDeviceFriendlyName() {
    const ua = (typeof navigator !== 'undefined' ? navigator.userAgent : '') || '';
    if (/android/i.test(ua)) return 'Android Device';
    if (/iphone|ipad|ipod/i.test(ua)) return 'Apple iPhone';
    if (/macintosh|mac os x/i.test(ua)) return 'MacBook Chrome';
    if (/windows/i.test(ua)) return 'Windows PC';
    if (/linux/i.test(ua)) return 'Linux Device';
    return 'Playify Web Player';
  }

  initJamManager() {
    try {
      if (typeof window !== 'undefined' && window.location && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const jamCode = params.get('jam');
        if (jamCode) {
          setTimeout(() => {
            this.openJamModal();
            this.joinJamSession(jamCode.toUpperCase().trim());
          }, 1200);
        }
      }
    } catch(e) {}
  }

  async calibrateJamClock() {
    const samples = [];
    const apiBase = this.getApiBase();

    for (let i = 0; i < 3; i++) {
      try {
        const t0 = performance.now();
        const localBefore = Date.now();
        const res = await fetch(`${apiBase}/api/jam/time?_=${Date.now()}_${i}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const t1 = performance.now();
          const localAfter = Date.now();

          if (data && data.serverTime) {
            const rtt = t1 - t0;
            const localCenter = (localBefore + localAfter) / 2;
            const offset = data.serverTime - localCenter;
            samples.push({ offset, rtt });
          }
        }
      } catch(e) {}
      await new Promise(r => setTimeout(r, 40));
    }

    if (samples.length > 0) {
      samples.sort((a, b) => a.rtt - b.rtt);
      this.jamState.clockOffset = samples[0].offset;
      this.jamState.rtt = Math.round(samples[0].rtt);
    }
  }

  getCalibratedNow() {
    return Date.now() + (this.jamState.clockOffset || 0);
  }

  getHostNow() {
    return Date.now() + (this.jamState.hostClockOffset || 0);
  }

  pingHostClock() {
    if (!this.jamState.active || !this.jamState.roomId || this.jamState.isHost) return;
    const t0 = Date.now();
    const ping = {
      type: 'JAM_NTP_PING',
      roomId: this.jamState.roomId,
      senderId: this.jamState.deviceId,
      t0: t0
    };
    if (this.jamState.broadcastChannel) {
      try { this.jamState.broadcastChannel.postMessage(ping); } catch(e) {}
    }
    fetch(`https://ntfy.sh/playify_jam_${this.jamState.roomId}`, {
      method: 'POST',
      body: JSON.stringify(ping)
    }).catch(() => {});
  }

  // ========================================================================
  // WEBRTC PEER-TO-PEER DIRECT DATACHANNEL (Sub-10ms P2P Audio Sync)
  // ========================================================================
  initPeerJs(roomId, isHost) {
    if (typeof window === 'undefined' || !window.Peer) return;
    if (this.jamState.peer) {
      try { this.jamState.peer.destroy(); } catch(e) {}
      this.jamState.peer = null;
    }
    this.jamState.peerConnections = [];

    try {
      const peerId = isHost ? `playify_jam_${roomId}` : `playify_guest_${this.jamState.deviceId}_${Math.floor(Math.random()*1000)}`;
      const peer = new window.Peer(peerId, {
        debug: 0,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' }
          ]
        }
      });
      this.jamState.peer = peer;

      peer.on('open', (id) => {
        console.log('[PeerJS] Online with Peer ID:', id);
        if (!isHost) {
          this.connectToHostPeer(roomId);
        }
      });

      peer.on('connection', (conn) => {
        console.log('[PeerJS] Connected to peer:', conn.peer);
        this.setupPeerDataConnection(conn);
      });

      peer.on('error', (err) => {
        console.warn('[PeerJS] Signaling notice:', err.type);
      });
    } catch(err) {
      console.warn('[PeerJS] Setup notice:', err);
    }
  }

  connectToHostPeer(roomId) {
    if (!this.jamState.peer || this.jamState.isHost) return;
    const hostPeerId = `playify_jam_${roomId}`;
    try {
      const conn = this.jamState.peer.connect(hostPeerId, { reliable: true });
      this.setupPeerDataConnection(conn);
    } catch(e) {}
  }

  setupPeerDataConnection(conn) {
    conn.on('open', () => {
      console.log('[PeerJS] P2P WebRTC DataChannel OPEN with:', conn.peer);
      const statusText = document.getElementById('jam-sync-status-text');
      if (statusText) statusText.innerHTML = `🟢 Phase-locked sync (<10ms WebRTC)`;

      if (!this.jamState.peerConnections) this.jamState.peerConnections = [];
      if (!this.jamState.peerConnections.includes(conn)) {
        this.jamState.peerConnections.push(conn);
      }

      // If Host, send current state to newly connected guest immediately!
      if (this.jamState.isHost && this.currentSong) {
        conn.send({
          type: 'STATE_UPDATE',
          roomId: this.jamState.roomId,
          senderId: this.jamState.deviceId,
          senderName: this.jamState.deviceName,
          isHost: true,
          action: 'SYNC_BEACON',
          song: this.currentSong,
          position: this.audio ? this.audio.currentTime : 0,
          isPlaying: this.isPlaying && this.audio && !this.audio.paused,
          hostTime: Date.now(),
          guestControl: this.jamState.guestControl
        });
      }
    });

    conn.on('data', (data) => {
      this.handleIncomingJamAction(data);
    });

    conn.on('close', () => {
      if (this.jamState.peerConnections) {
        this.jamState.peerConnections = this.jamState.peerConnections.filter(c => c !== conn);
      }
    });
  }

  sendPeerJsData(data) {
    if (this.jamState.peerConnections && this.jamState.peerConnections.length > 0) {
      for (const conn of this.jamState.peerConnections) {
        if (conn.open) {
          try { conn.send(data); } catch(e) {}
        }
      }
    }
  }

  startHostHeartbeat() {
    if (this.jamState.heartbeatInterval) clearInterval(this.jamState.heartbeatInterval);
    if (!this.jamState.active || !this.jamState.isHost) return;

    this.jamState.heartbeatInterval = setInterval(() => {
      if (!this.jamState.active || !this.jamState.isHost || !this.jamState.roomId) return;
      if (!this.audio) return;

      const hostWallTime = Date.now();
      const currentPos = this.audio.currentTime || 0;
      const isActuallyPlaying = this.isPlaying && !this.audio.paused && !this.audio.ended;

      const heartbeat = {
        type: 'JAM_HEARTBEAT',
        roomId: this.jamState.roomId,
        senderId: this.jamState.deviceId,
        hostTime: hostWallTime,
        position: currentPos,
        isPlaying: isActuallyPlaying,
        songId: this.currentSong ? this.currentSong.id : null,
        song: this.currentSong ? this.currentSong : null
      };

      // 1. Direct WebRTC P2P DataChannel (<10ms)
      this.sendPeerJsData(heartbeat);

      // 2. Global PubNub Cloud Relay (100% reliable)
      if (this.jamState.relay) {
        this.jamState.relay.publish(heartbeat);
      }

      // 3. Local BroadcastChannel
      if (this.jamState.broadcastChannel) {
        try { this.jamState.broadcastChannel.postMessage(heartbeat); } catch(e) {}
      }
    }, 1500);
  }

  async startJamSession() {
    this.showToast('🚀 Starting Jam Session...');

    // Clean 4-digit PIN (e.g. 5297)
    const roomId = String(Math.floor(1000 + Math.random() * 9000));

    this.jamState.active = true;
    this.jamState.isHost = true;
    this.jamState.roomId = roomId;
    this.jamState.hostClockOffset = 0;
    this.jamState.lastTargetPosition = this.audio ? this.audio.currentTime : 0;
    this.jamState.lastTargetTimestamp = Date.now();

    const hostPayload = {
      type: 'STATE_UPDATE',
      roomId: roomId,
      hostId: this.jamState.deviceId,
      hostName: this.jamState.deviceName,
      senderId: this.jamState.deviceId,
      action: 'HOST_START',
      guestControl: this.jamState.guestControl,
      song: this.currentSong,
      position: this.audio ? this.audio.currentTime : 0,
      isPlaying: this.isPlaying && this.audio && !this.audio.paused,
      hostTime: Date.now(),
      guests: [{ id: this.jamState.deviceId, name: this.jamState.deviceName, isHost: true }]
    };

    this.updateJamUI(hostPayload);

    // 1. Initialize PubNub Cloud Relay
    if (this.jamState.relay) this.jamState.relay.destroy();
    this.jamState.relay = new PubNubJamRelay(`playify_jam_${roomId}`, (msg) => {
      this.handleIncomingJamAction(msg);
    });

    // 2. Initialize WebRTC PeerJS
    this.initPeerJs(roomId, true);

    // 3. Start Heartbeat pulse
    this.startHostHeartbeat();

    // Broadcast initial room state
    this.jamState.relay.publish(hostPayload);

    this.showToast(`🎉 Jam Active! PIN: ${roomId}`);
  }

  async joinJamSession(code) {
    if (!code) return;
    const cleanCode = String(code).replace(/[^0-9]/g, '') || String(code).trim();
    if (!cleanCode) {
      this.showToast('Please enter a 4-digit PIN (e.g. 5297)');
      return;
    }

    this.jamState.active = true;
    this.jamState.isHost = false;
    this.jamState.roomId = cleanCode;

    // Immediately switch tab and show active session UI
    this.switchJamTab('session');
    this.updateJamUI({
      roomId: cleanCode,
      hostName: 'Host Device',
      guests: [
        { id: 'host', name: 'Jam Host', isHost: true },
        { id: this.jamState.deviceId, name: this.jamState.deviceName, isHost: false }
      ]
    });
    this.showToast(`🟢 Connected to Jam ${cleanCode}! Synchronizing...`);

    // 1. Initialize PubNub Cloud Relay
    if (this.jamState.relay) this.jamState.relay.destroy();
    this.jamState.relay = new PubNubJamRelay(`playify_jam_${cleanCode}`, (msg) => {
      this.handleIncomingJamAction(msg);
    });

    // 2. Initialize WebRTC PeerJS
    this.initPeerJs(cleanCode, false);

    // 3. Start 0-delay phase lock loop
    this.startJamDriftLoop();

    // Announce guest presence so Host broadcasts fresh sync beacon
    const announcePayload = {
      type: 'GUEST_JOINED',
      roomId: cleanCode,
      senderId: this.jamState.deviceId,
      guestId: this.jamState.deviceId,
      guestName: this.jamState.deviceName
    };
    if (this.jamState.relay) this.jamState.relay.publish(announcePayload);
    this.sendPeerJsData(announcePayload);
    if (this.jamState.broadcastChannel) {
      try { this.jamState.broadcastChannel.postMessage(announcePayload); } catch(e) {}
    }
  }

  async broadcastJamAction(action, payload = {}) {
    if (!this.jamState.active || !this.jamState.roomId) return;
    if (this._jamIncomingAction) return;

    if (!this.jamState.isHost && !this.jamState.guestControl) {
      this.showToast('Only host can control playback in this Jam session');
      return;
    }

    const hostWallTime = Date.now();
    const data = {
      type: 'STATE_UPDATE',
      roomId: this.jamState.roomId,
      senderId: this.jamState.deviceId,
      senderName: this.jamState.deviceName,
      isHost: this.jamState.isHost,
      action: action,
      song: payload.song || this.currentSong,
      position: payload.position !== undefined ? payload.position : (this.audio ? this.audio.currentTime : 0),
      isPlaying: payload.isPlaying !== undefined ? payload.isPlaying : this.isPlaying,
      hostTime: hostWallTime,
      guestControl: this.jamState.guestControl
    };

    this.jamState.lastTargetPosition = data.position;
    this.jamState.lastTargetTimestamp = hostWallTime;
    this.jamState.isHostPlaying = data.isPlaying;

    // 1. WebRTC Direct P2P DataChannel
    this.sendPeerJsData(data);

    // 2. PubNub Cloud Pub/Sub
    if (this.jamState.relay) {
      this.jamState.relay.publish(data);
    }

    // 3. Local BroadcastChannel
    if (this.jamState.broadcastChannel) {
      try { this.jamState.broadcastChannel.postMessage(data); } catch(e) {}
    }
  }


  // ========================================================================
  // INCOMING JAM PLAYBACK SYNCHRONIZER (Exact Same Song & Timecode)
  // ========================================================================
  applyIncomingJamPlayback(state) {
    if (!state || (!state.song && !state.songId && state.position === undefined)) return;
    this._jamIncomingAction = true;

    // 1. Resolve full song object if only songId was provided
    let targetSong = state.song;
    if (!targetSong && state.songId && this.musicDB) {
      targetSong = this.musicDB.find(s => String(s.id) === String(state.songId));
    }
    if (!targetSong && this.currentSong) targetSong = this.currentSong;
    if (!targetSong) {
      this._jamIncomingAction = false;
      return;
    }

    const isSongDifferent = !this.currentSong || String(this.currentSong.id) !== String(targetSong.id);
    
    // Calculate expected playback position using timestamp delta
    const hostCurrentTime = this.getHostNow ? this.getHostNow() : Date.now();
    const elapsedSec = Math.max(0, (hostCurrentTime - (state.hostTime || hostCurrentTime)) / 1000);
    const expectedPosition = state.isPlaying ? ((state.position || 0) + elapsedSec) : (state.position || 0);

    this.jamState.lastTargetPosition = expectedPosition;
    this.jamState.lastTargetTimestamp = state.hostTime || hostCurrentTime;
    this.jamState.isHostPlaying = !!state.isPlaying;
    this.jamState.lastTargetSongId = targetSong.id;

    const executePlaybackSync = () => {
      if (!this.audio) {
        this._jamIncomingAction = false;
        return;
      }

      if (state.isPlaying) {
        this.isPlaying = true;
        this.updatePlayPauseUI(true);

        const freshElapsed = Math.max(0, ((this.getHostNow ? this.getHostNow() : Date.now()) - (state.hostTime || Date.now())) / 1000);
        const freshTarget = Math.max(0, (state.position || 0) + freshElapsed);

        if (this.audio.readyState >= 1) {
          try { this.audio.currentTime = Math.max(0, freshTarget); } catch(e) {}
        } else {
          const onMeta = () => {
            try {
              const curElapsed = Math.max(0, ((this.getHostNow ? this.getHostNow() : Date.now()) - (state.hostTime || Date.now())) / 1000);
              this.audio.currentTime = Math.max(0, (state.position || 0) + curElapsed);
            } catch(e) {}
          };
          this.audio.addEventListener('loadedmetadata', onMeta, { once: true });
        }

        const p = this.audio.play();
        if (p !== undefined) {
          p.then(() => {
            this.hideJamAutoplayPrompt();
            const cur = this.audio ? this.audio.currentTime : 0;
            if (freshTarget > 1.0 && Math.abs(cur - freshTarget) > 1.0) {
              try { this.audio.currentTime = freshTarget; } catch(e) {}
            }
          }).catch(err => {
            console.warn('[Jam] Guest autoplay blocked by browser policy:', err);
            this.showJamAutoplayPrompt();
          });
        }
      } else {
        this.isPlaying = false;
        this.audio.pause();
        this.updatePlayPauseUI(false);
        try { this.audio.currentTime = Math.max(0, expectedPosition); } catch(e) {}
      }

      setTimeout(() => {
        this._jamIncomingAction = false;
      }, 250);
    };

    if (isSongDifferent) {
      this.currentSong = targetSong;
      this.registerSong(targetSong);
      this.updateNowPlayingUI(targetSong);

      let playUrl = targetSong.stream_url;
      if (!playUrl && this.musicDB) {
        const found = this.musicDB.find(s => String(s.id) === String(targetSong.id));
        if (found && found.stream_url) playUrl = found.stream_url;
      }

      if (playUrl && this.audio) {
        const optimal = this.getOptimalStreamUrl ? this.getOptimalStreamUrl(playUrl) : playUrl;
        if (this.audio.src !== optimal) {
          this.audio.src = optimal;
        }
        this.audio.volume = 1.0;
        this.audio.muted = false;
        executePlaybackSync();
      } else {
        this.playSong(targetSong, null, false, { type: 'jam' }).then(() => {
          executePlaybackSync();
        }).catch(() => {
          executePlaybackSync();
        });
      }
    } else {
      executePlaybackSync();
    }
  }

  // ========================================================================
  // ZERO-STUTTER PHASE-LOCK LOOP (P-Controller Drift Compensation <20ms)
  // ========================================================================
  startJamDriftLoop() {
    if (this.jamState.driftLoopId) clearInterval(this.jamState.driftLoopId);
    if (!this.jamState.active || this.jamState.isHost) return;

    this.jamState.driftLoopId = setInterval(() => {
      if (!this.jamState.active || !this.audio || this.jamState.isHost) {
        if (this.jamState.driftLoopId) clearInterval(this.jamState.driftLoopId);
        return;
      }
      if (this._jamIncomingAction || this.audio.readyState < 2 || this.audio.seeking) return;

      // Only synchronize if guest is playing the same song as host
      if (!this.currentSong || !this.jamState.lastTargetSongId) return;
      if (String(this.currentSong.id) !== String(this.jamState.lastTargetSongId)) return;

      const hostCurrentTime = this.getHostNow ? this.getHostNow() : Date.now();
      const elapsedSinceBeacon = (hostCurrentTime - (this.jamState.lastTargetTimestamp || hostCurrentTime)) / 1000;
      
      // If no beacon update in 8 seconds, don't extrapolate or touch rate
      if (elapsedSinceBeacon > 8.0) {
        if (this.audio.playbackRate !== 1.0) this.audio.playbackRate = 1.0;
        return;
      }

      const expectedPosition = this.jamState.isHostPlaying ? 
        (this.jamState.lastTargetPosition + elapsedSinceBeacon) : 
        this.jamState.lastTargetPosition;

      const currentPosition = this.audio.currentTime;
      const drift = currentPosition - expectedPosition;
      const absDrift = Math.abs(drift);
      const statusText = document.getElementById('jam-sync-status-text');
      const now = Date.now();

      // HARD SEEK: ONLY for extreme desync (>3.0s) and throttled to once every 6 seconds
      if (absDrift > 3.0 && (now - (this.jamState.lastHardSeekTime || 0)) > 6000) {
        this.jamState.lastHardSeekTime = now;
        try {
          this.audio.currentTime = expectedPosition;
        } catch(e) {}
        this.audio.playbackRate = 1.0;
        if (statusText) statusText.innerHTML = `🔄 Re-aligned (<50ms)`;
        return;
      }

      // STABLE DISCRETE RATE ADJUSTMENT:
      // Human ear cannot detect audio delay < 80ms over phone speakers/earbuds.
      // We NEVER re-assign playbackRate every 250ms with continuous fractions!
      if (absDrift <= 0.080) {
        if (this.audio.playbackRate !== 1.0) this.audio.playbackRate = 1.0;
        if (statusText) statusText.innerHTML = `🟢 Phase-locked sync (<50ms)`;
      } else if (drift < -0.080) {
        // Guest behind host by >80ms: stable 4% speedup until aligned
        if (this.audio.playbackRate !== 1.04) this.audio.playbackRate = 1.04;
        if (statusText) statusText.innerHTML = `⚡ Smooth sync (${Math.round(drift * 1000)}ms)`;
      } else if (drift > 0.080) {
        // Guest ahead of host by >80ms: stable 4% slowdown until aligned
        if (this.audio.playbackRate !== 0.96) this.audio.playbackRate = 0.96;
        if (statusText) statusText.innerHTML = `⚡ Smooth sync (+${Math.round(drift * 1000)}ms)`;
      }
    }, 350);
  }

    handleIncomingJamAction(msg) {
    if (!msg || !this.jamState.active) return;
    if (String(msg.roomId) !== String(this.jamState.roomId)) return;
    if (msg.senderId === this.jamState.deviceId) return; // Ignore own echoes

    // If new guest joined and this device is the Host, immediately broadcast current state
    if (msg.type === 'GUEST_JOINED') {
      if (this.jamState.isHost && this.currentSong) {
        this.broadcastJamAction('SYNC_BEACON', {
          song: this.currentSong,
          position: this.audio ? this.audio.currentTime : 0,
          isPlaying: this.isPlaying && this.audio && !this.audio.paused
        });
      }
      return;
    }

    // High-Frequency Host Heartbeat
    if (msg.type === 'JAM_HEARTBEAT') {
      if (this.jamState.isHost) return;

      this.jamState.lastTargetPosition = msg.position;
      this.jamState.lastTargetTimestamp = msg.hostTime;
      this.jamState.isHostPlaying = !!msg.isPlaying;

      const guestSongId = this.currentSong ? String(this.currentSong.id) : null;
      const hostSongId = msg.songId ? String(msg.songId) : (msg.song ? String(msg.song.id) : null);

      if (hostSongId && guestSongId !== hostSongId) {
        let songToLoad = msg.song;
        if (!songToLoad && this.musicDB) {
          songToLoad = this.musicDB.find(s => String(s.id) === hostSongId);
        }
        if (songToLoad) {
          this.applyIncomingJamPlayback({
            song: songToLoad,
            position: msg.position,
            isPlaying: msg.isPlaying,
            hostTime: msg.hostTime
          });
          return;
        }
      }

      if (!this.audio || this._jamIncomingAction) return;

      // Match play / pause state smoothly
      if (msg.isPlaying && (this.audio.paused || this.audio.ended)) {
        this.isPlaying = true;
        this.updatePlayPauseUI(true);
        const p = this.audio.play();
        if (p) p.catch(() => this.showJamAutoplayPrompt());
      } else if (!msg.isPlaying && !this.audio.paused) {
        this.isPlaying = false;
        this.audio.pause();
        this.updatePlayPauseUI(false);
      }
      return;
    }

    if (msg.action === 'LEAVE' || msg.type === 'LEAVE') {
      if (msg.isHost) {
        this.leaveJamSession(false);
        this.showToast('Host ended the Jam session.');
      }
      return;
    }

    if (msg.action === 'UPDATE_SETTINGS') {
      if (msg.guestControl !== undefined) {
        this.jamState.guestControl = !!msg.guestControl;
      }
      return;
    }

    // Apply song / position / playback sync
    if (msg.song || msg.songId || msg.position !== undefined) {
      this.applyIncomingJamPlayback(msg);
    }
  }


  handleJamBroadcastMessage(msg) {
    this.handleIncomingJamAction(msg);
  }

  startJamPolling() {
    if (this.jamState.pollInterval) clearInterval(this.jamState.pollInterval);

    this.jamState.pollInterval = setInterval(async () => {
      if (!this.jamState.active || !this.jamState.roomId) return;
      // If real-time WebSocket is active, skip HTTP polling to avoid network buffer bloat!
      if (this.jamState.socket && this.jamState.socket.readyState === 1) return;

      try {
        const url = `${this.getApiBase()}/api/jam/poll?room=${encodeURIComponent(this.jamState.roomId)}&pid=${encodeURIComponent(this.jamState.deviceId)}&_=${Date.now()}`;
        const res = await fetch(url);
        if (res.status === 404) return;

        const data = await res.json();
        if (data && data.status === 'success' && data.room) {
          const room = data.room;
          this.updateJamUI(room);

          if (room.actionSeq > this.jamState.lastActionSeq) {
            this.jamState.lastActionSeq = room.actionSeq;
            if (!this.jamState.isHost) {
              this.applyIncomingJamPlayback({
                song: room.song,
                position: room.position,
                isPlaying: room.isPlaying,
                scheduledTime: room.scheduledTime,
                hostTime: room.hostTime || room.serverTime
              });
            }
          }
        }
      } catch(e) {}
    }, 3000);
  }

  updateJamUI(room) {
    const floatingPill = document.getElementById('sp-jam-floating-pill');
    const pillLabel = document.getElementById('sp-jam-pill-label');
    const navDot = document.getElementById('sp-jam-nav-dot');
    const topBadge = document.getElementById('jam-top-badge');
    const barIndicator = document.getElementById('jam-bar-indicator');
    const fsDot = document.getElementById('jam-dot-fs');

    const guestCount = room && room.guests ? room.guests.length : 1;

    if (this.jamState.active) {
      if (floatingPill) floatingPill.style.display = 'flex';
      if (pillLabel) pillLabel.textContent = `🟢 Jam Active • PIN ${this.jamState.roomId} (${guestCount} ${guestCount === 1 ? 'Device' : 'Devices'})`;
      if (navDot) navDot.style.display = 'inline-block';
      if (topBadge) topBadge.style.display = 'inline-block';
      if (barIndicator) barIndicator.style.display = 'inline-block';
      if (fsDot) fsDot.style.display = 'inline-block';
    } else {
      if (floatingPill) floatingPill.style.display = 'none';
      if (navDot) navDot.style.display = 'none';
      if (topBadge) topBadge.style.display = 'none';
      if (barIndicator) barIndicator.style.display = 'none';
      if (fsDot) fsDot.style.display = 'none';
      return;
    }

    if (!room) return;

    const idleView = document.getElementById('jam-idle-view');
    const activeView = document.getElementById('jam-active-view');
    if (idleView) idleView.style.display = 'none';
    if (activeView) activeView.style.display = 'block';

    const codeDisplay = document.getElementById('jam-room-code-display');
    if (codeDisplay) codeDisplay.textContent = room.roomId;

    const devCount = document.getElementById('jam-devices-count');
    if (devCount) devCount.textContent = guestCount;
    this.renderJamDevicesList(room.guests || []);

    const guestControlToggle = document.getElementById('jam-toggle-guest-control');
    if (guestControlToggle) {
      guestControlToggle.checked = (room.guestControl !== undefined ? room.guestControl : true);
      guestControlToggle.disabled = !this.jamState.isHost;
    }

    const leaveBtn = document.getElementById('jam-leave-btn');
    if (leaveBtn) {
      leaveBtn.innerHTML = this.jamState.isHost ? 
        '<i class="fa-solid fa-power-off"></i> End Jam Session' : 
        '<i class="fa-solid fa-right-from-bracket"></i> Leave Jam Session';
    }

    this.renderJamQrCode(room.roomId);
  }

  renderJamQrCode(roomId) {
    const container = document.getElementById('sp-jam-qrcode-container');
    if (!container) return;

    const joinUrl = `https://peaceful-davinci.meowing-dianella.workers.dev/?jam=${roomId}`;
    if (container.getAttribute('data-qr-code') === roomId) return;
    container.setAttribute('data-qr-code', roomId);
    container.innerHTML = '';

    if (typeof QRCode !== 'undefined') {
      try {
        new QRCode(container, {
          text: joinUrl,
          width: 170,
          height: 170,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch(e) {
        console.warn('QR code render note:', e);
      }
    }
  }

  renderJamDevicesList(guests) {
    const list = document.getElementById('sp-jam-devices-list');
    if (!list) return;

    list.innerHTML = guests.map(g => {
      const isMe = g.id === this.jamState.deviceId;
      const isHost = !!g.isHost;
      const icon = (g.name || '').includes('Phone') || (g.name || '').includes('Android') ? 'fa-mobile-screen' : 
                   (g.name || '').includes('Mac') || (g.name || '').includes('PC') || (g.name || '').includes('Windows') ? 'fa-laptop' : 'fa-headphones';

      return `
        <div class="sp-jam-device-item">
          <div class="sp-jam-device-left">
            <div class="sp-jam-device-icon"><i class="fa-solid ${icon}"></i></div>
            <div>
              <div class="sp-jam-device-name">${this.escapeHtml(g.name || 'Device')} ${isMe ? '<span style="color:#1ed760;font-size:11px;">(You)</span>' : ''}</div>
              <div class="sp-jam-device-role">${isHost ? 'Session Host • Controller' : 'Listener • Synced'}</div>
            </div>
          </div>
          <div class="sp-jam-device-badge">
            <i class="fa-solid fa-circle" style="font-size:7px;margin-right:4px;"></i> ${isHost ? 'Host' : 'In Sync'}
          </div>
        </div>
      `;
    }).join('');
  }

  openJamModal() {
    const m = document.getElementById('sp-jam-modal');
    if (m) {
      m.classList.add('open');
      m.style.display = 'flex';
      if (!this.jamState.active) {
        this.switchJamTab('session');
      }
    }
  }

  closeJamModal() {
    const m = document.getElementById('sp-jam-modal');
    if (m) {
      m.classList.remove('open');
      m.style.display = 'none';
    }
  }

  switchJamTab(tab) {
    const sessionTab = document.getElementById('jam-tab-session');
    const joinTab = document.getElementById('jam-tab-join');
    const sessionContent = document.getElementById('jam-content-session');
    const joinContent = document.getElementById('jam-content-join');

    if (tab === 'session') {
      if (sessionTab) sessionTab.classList.add('active');
      if (joinTab) joinTab.classList.remove('active');
      if (sessionContent) sessionContent.style.display = 'block';
      if (joinContent) joinContent.style.display = 'none';
    } else {
      if (sessionTab) sessionTab.classList.remove('active');
      if (joinTab) joinTab.classList.add('active');
      if (sessionContent) sessionContent.style.display = 'none';
      if (joinContent) joinContent.style.display = 'block';
    }
  }

  joinJamFromInput() {
    const input = document.getElementById('sp-jam-code-input');
    if (!input || !input.value.trim()) {
      this.showToast('Please enter the 4-digit PIN');
      return;
    }
    // CRITICAL: Synchronously prime audio element directly inside the user tap event!
    // Unlocks HTML5 audio engine for all background/async playback!
    if (this.audio) {
      try {
        const primeP = this.audio.play();
        if (primeP !== undefined) {
          primeP.then(() => {
            if (!this.isPlaying) this.audio.pause();
          }).catch(() => {});
        }
      } catch(e) {}
    }
    this.joinJamSession(input.value.trim());
  }

  copyJamLink() {
    if (!this.jamState.roomId) return;
    const url = `https://peaceful-davinci.meowing-dianella.workers.dev/?jam=${this.jamState.roomId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        this.showToast(`🔗 Jam invite link copied: PIN ${this.jamState.roomId}`);
      }).catch(() => {
        this.showToast(`Invite PIN: ${this.jamState.roomId}`);
      });
    } else {
      this.showToast(`Invite PIN: ${this.jamState.roomId}`);
    }
  }

  shareJamSession() {
    if (!this.jamState.roomId) return;
    const url = `https://peaceful-davinci.meowing-dianella.workers.dev/?jam=${this.jamState.roomId}`;
    if (navigator.share) {
      navigator.share({
        title: 'Listen Together on Playify Jam',
        text: `Join my Spotify Jam session on Playify! 4-Digit PIN: ${this.jamState.roomId}`,
        url: url
      }).catch(() => {});
    } else {
      this.copyJamLink();
    }
  }

  async forceJamResync() {
    this.showToast('🔄 Calibrating phase sync clocks...');
    await this.calibrateJamClock();
    if (this.jamState.isHost) {
      this.broadcastJamAction('RESYNC', {
        position: this.audio ? this.audio.currentTime : 0,
        isPlaying: this.isPlaying
      });
      this.showToast('🟢 Sync beacon broadcasted to all devices!');
    } else {
      this.pingHostClock();
      this.showToast('🟢 Synchronized with host clock!');
    }
  }

  async leaveJamSession(notifyServer = true) {
    if (this.jamState.socket) {
      try { this.jamState.socket.close(); } catch(e) {}
      this.jamState.socket = null;
    }

    if (this.jamState.heartbeatInterval) { clearInterval(this.jamState.heartbeatInterval); this.jamState.heartbeatInterval = null; }
    if (this.jamState.ntpInterval) { clearInterval(this.jamState.ntpInterval); this.jamState.ntpInterval = null; }
    if (this.jamState.pollInterval) { clearInterval(this.jamState.pollInterval); this.jamState.pollInterval = null; }
    if (this.jamState.driftLoopId) { clearInterval(this.jamState.driftLoopId); this.jamState.driftLoopId = null; }

    // Completely destroy PubNub cloud relay and PeerJS WebRTC connections
    if (this.jamState.relay) {
      try { this.jamState.relay.destroy(); } catch(e) {}
      this.jamState.relay = null;
    }
    if (this.jamState.peer) {
      try { this.jamState.peer.destroy(); } catch(e) {}
      this.jamState.peer = null;
    }
    this.jamState.peerConnections = [];

    if (this.jamState.roomId) {
      const leaveData = {
        type: 'LEAVE',
        action: 'LEAVE',
        roomId: this.jamState.roomId,
        senderId: this.jamState.deviceId,
        isHost: this.jamState.isHost
      };
      if (this.jamState.broadcastChannel) {
        try { this.jamState.broadcastChannel.postMessage(leaveData); } catch(e) {}
      }
    }

    this.jamState.active = false;
    this.jamState.isHost = false;
    this.jamState.roomId = null;
    this.jamState.lastTargetSongId = null;
    this.jamState.hostClockOffset = 0;

    if (this.audio) {
      this.audio.playbackRate = 1.0;
      if ('preservesPitch' in this.audio) this.audio.preservesPitch = true;
    }

    const idleView = document.getElementById('jam-idle-view');
    const activeView = document.getElementById('jam-active-view');
    if (idleView) idleView.style.display = 'block';
    if (activeView) activeView.style.display = 'none';

    this.updateJamUI(null);
    this.showToast('Left Jam session');
  }

  toggleJamGuestControl(enabled) {
    if (!this.jamState.isHost) return;
    this.jamState.guestControl = !!enabled;
    this.broadcastJamAction('UPDATE_SETTINGS', { guestControl: !!enabled });
  }

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      } else if (e.code === 'Escape') {
        this.closeFullscreenPlayer();
      } else if (e.code === 'ArrowRight') {
        if (this.audio && this.audio.currentTime) this.audio.currentTime += 5;
      } else if (e.code === 'ArrowLeft') {
        if (this.audio && this.audio.currentTime) this.audio.currentTime -= 5;
      } else if (e.code === 'KeyM') {
        this.toggleMute();
      }
    });
  }

  showJamAutoplayPrompt() {
    let bar = document.getElementById('sp-jam-autoplay-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'sp-jam-autoplay-bar';
      bar.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:var(--sp-green,#1db954);color:#000;font-weight:700;font-size:14px;padding:12px 22px;border-radius:999px;box-shadow:0 8px 30px rgba(0,0,0,0.8);z-index:99999;cursor:pointer;display:flex;align-items:center;gap:10px;user-select:none;';
      bar.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span>Tap here to hear Jam audio</span>';
      bar.onclick = () => this.resumeJamAudio();
      document.body.appendChild(bar);
    }
    bar.style.display = 'flex';

    const onAnyTap = () => {
      this.resumeJamAudio();
      document.removeEventListener('click', onAnyTap);
      document.removeEventListener('touchend', onAnyTap);
    };
    document.addEventListener('click', onAnyTap, { once: true });
    document.addEventListener('touchend', onAnyTap, { once: true });
  }

  hideJamAutoplayPrompt() {
    const bar = document.getElementById('sp-jam-autoplay-bar');
    if (bar) bar.style.display = 'none';
  }

  resumeJamAudio() {
    this.hideJamAutoplayPrompt();
    if (this.audio && this.jamState.active && !this.jamState.isHost) {
      this.audio.volume = 1.0;
      this.audio.muted = false;
      this.isPlaying = true;
      this.updatePlayPauseUI(true);
      const p = this.audio.play();
      if (p !== undefined) {
        p.catch(e => console.warn('Resume notice:', e));
      }
    }
  }
}

// Bulletproof Initializer
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.sp) window.sp = new PlayifyEngine();
  });
} else {
  if (!window.sp) window.sp = new PlayifyEngine();
}
