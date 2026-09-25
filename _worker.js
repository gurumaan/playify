// Cloudflare Worker API for Playify
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

const desEngine = new PureDES();
const desKey = [51, 56, 51, 52, 54, 53, 57, 49];

const AUJLA_LYRICS = {
  "as1_ashke": {
    "plain": "Welcome home, Mr. Aujla. England's been rather dull without you, sir.\nWell, let's change that, shall we?\nSplendid idea, sir.\n\nJittan di shaunki sohniye, haravan vairi hass ke.\nGidda landuan da yaar aap pavaaunda main keha dass ke.\nBaabe di saanu bakhshish, karaan na akhiyan gani lashke.\nNi modhe paundi jhummar donaali keh ke ashke!\n\nMere zor bada ae phatt je, dooja tu saala hath 'ch.\nTu jigra dekhi jatt je, khad jaanda kalla gatth 'ch.\nMain sidha chalda pothiyan na, wing-val ni saala matth 'ch.\nLattan koyi kise da khich le, mainu trust ae neeli chhat 'ch.\n\nSaade kamm kaale, teriyan gallan de utte laaliyan.\nNi suttian si sohniye kismatan main thaaliyan.\nPindan aaliyan saanu taan dhi aundiyan pindan aaliyan.\nAsla karda shaan saanu ya motaran utte taaliyan.\n\nYour family have arrived, sir.\nHow are they?\nThree generations, 12 cars, 22 gentlemen, and 23 guns.\n22 gentlemen and 23 guns... Who brought two?\nYour grandfather, sir. It seems that Purdey only sells them in pairs.\n\nJittan di shaunki sohniye, haravan vairi hass ke.\nGidda landuan da yaar aap pavaaunda main keha dass ke.\nBaabe di saanu bakhshish, karaan na akhiyan gani lashke.\nNi modhe paundi jhummar donaali keh ke ashke!",
    "synced": "[00:15.90] Welcome home, Mr. Aujla. England's been rather dull without you, sir.\n[00:22.50] Well, let's change that, shall we?\n[00:25.80] Splendid idea, sir.\n[00:28.60] Jittan di shaunki sohniye, haravan vairi hass ke\n[00:32.20] Gidda landuan da yaar aap pavaaunda main keha dass ke\n[00:35.40] Baabe di saanu bakhshish, karaan na akhiyan gani lashke\n[00:39.10] Ni modhe paundi jhummar donaali keh ke ashke!\n[00:42.50] Mere zor bada ae phatt je, dooja tu saala hath 'ch\n[00:45.40] Tu jigra dekhi jatt je, khad jaanda kalla gatth 'ch\n[00:48.50] Main sidha chalda pothiyan na, wing-val ni saala matth 'ch\n[00:52.00] Lattan koyi kise da khich le, mainu trust ae neeli chhat 'ch\n[00:56.00] Saade kamm kaale, teriyan gallan de utte laaliyan\n[01:00.00] Ni suttian si sohniye kismatan main thaaliyan\n[01:04.00] Pindan aaliyan saanu taan dhi aundiyan pindan aaliyan\n[01:08.00] Asla karda shaan saanu ya motaran utte taaliyan\n[01:14.00] Your family have arrived, sir. How are they?\n[01:18.00] Three generations, 12 cars, 22 gentlemen, and 23 guns.\n[01:23.00] 22 gentlemen and 23 guns... Who brought two?\n[01:27.00] Your grandfather, sir. It seems Purdey only sells in pairs.\n[01:31.00] Jittan di shaunki sohniye, haravan vairi hass ke\n[01:35.00] Gidda landuan da yaar aap pavaaunda main keha dass ke\n[01:38.80] Baabe di saanu bakhshish, karaan na akhiyan gani lashke\n[01:42.50] Ni modhe paundi jhummar donaali keh ke ashke!\n[01:50.00] Asla karda shaan saanu ya motaran utte taaliyan\n[02:00.00] Ni modhe paundi jhummar donaali keh ke ashke!\n[02:15.00] Aujla SZN 1 - Ashke"
  },
  "as1_realbadman": {
    "plain": "MXRCI on the beat!\nYeah, Karan Aujla!\nAujla Szn!\n\nReal bad man, gallan kude kharriyan\nJithe vi khalo gaye othe daangaan kude charriyan\nAkhaan 'ch barood, hikkan 'ch ae zor ni\nJatt de mukaable 'ch aunda koyi hor ni\n\nGaddi kaali, kaale kaale kaare sohniye\nVairi saare kadd te kinare sohniye\nReal bad man, naam chalda ae top te\nPair dharida ni kade gairan de scope te\n\nKarde record break geet jadon aunde ne\nPind to Toronto takk saare jatt gaunde ne\nMaut naal yaari, saadi zindgi azaad ni\nJatt naal vair pauna aape barbaad ni\n\nHathan vich asla te dilan vich robh ni\nKise de vi moore kade kiti nahio sobh ni\nReal bad man, kalla hi bathera main\nKise di na parwaah, darr kihda jehra main!",
    "synced": "[00:05.00] MXRCI on the beat!\n[00:10.00] Yeah, Karan Aujla!\n[00:15.00] Aujla Szn 1!\n[00:20.00] Real bad man, gallan kude kharriyan\n[00:24.00] Jithe vi khalo gaye othe daangaan kude charriyan\n[00:28.00] Akhaan 'ch barood, hikkan 'ch ae zor ni\n[00:32.00] Jatt de mukaable 'ch aunda koyi hor ni\n[00:36.00] Gaddi kaali, kaale kaale kaare sohniye\n[00:40.00] Vairi saare kadd te kinare sohniye\n[00:44.00] Real bad man, naam chalda ae top te\n[00:48.00] Pair dharida ni kade gairan de scope te\n[00:54.00] Karde record break geet jadon aunde ne\n[00:58.00] Pind to Toronto takk saare jatt gaunde ne\n[01:03.00] Maut naal yaari, saadi zindgi azaad ni\n[01:07.00] Jatt naal vair pauna aape barbaad ni\n[01:12.00] Hathan vich asla te dilan vich robh ni\n[01:17.00] Kise de vi moore kade kiti nahio sobh ni\n[01:22.00] Real bad man, kalla hi bathera main\n[01:26.00] Kise di na parwaah, darr kihda jehra main!\n[01:35.00] Real bad man, gallan kude kharriyan\n[01:42.00] Aujla SZN 1 - Real Bad Man"
  },
  "as1_straightup": {
    "plain": "Straight Up!\nAzaad 4L, Karan Aujla, MXRCI\n\nSidhe sidhe bol, sidha jatt da style ni\nKudiyan te vairiyan di lami ae profile ni\nGallan vich weight, saade lafzan 'ch aag ni\nMehntan di khatti, kade mangeya na bhaag ni\n\nStraight up, no games, ainvaye darrde ni kude\nHikkan taan khad de aan, pichhe mudd de ni kude\nChadh di jawani vich kitte karobaar ne\nYaaran de siraan te kude ghumdi car ne\n\nShehar tere vich jadon aundi saadi toli ni\nAsla hi bolda te band hundi goli ni\nSidha chalde aan, sidha karde hisaab ni\nJatt da swag kude wakhra Punjab ni\n\nStraight up, sidha bol!\nKaran Aujla, Azaad 4L\nAujla SZN!",
    "synced": "[00:08.00] Straight Up!\n[00:13.00] Azaad 4L, Karan Aujla, MXRCI\n[00:19.00] Sidhe sidhe bol, sidha jatt da style ni\n[00:23.00] Kudiyan te vairiyan di lami ae profile ni\n[00:27.00] Gallan vich weight, saade lafzan 'ch aag ni\n[00:31.00] Mehntan di khatti, kade mangeya na bhaag ni\n[00:36.00] Straight up, no games, ainvaye darrde ni kude\n[00:40.00] Hikkan taan khad de aan, pichhe mudd de ni kude\n[00:44.00] Chadh di jawani vich kitte karobaar ne\n[00:48.00] Yaaran de siraan te kude ghumdi car ne\n[00:53.00] Shehar tere vich jadon aundi saadi toli ni\n[00:57.00] Asla hi bolda te band hundi goli ni\n[01:02.00] Sidha chalde aan, sidha karde hisaab ni\n[01:06.00] Jatt da swag kude wakhra Punjab ni\n[01:14.00] Straight up, no games!\n[01:25.00] Sidhe sidhe bol, sidha jatt da style ni\n[01:40.00] Aujla SZN 1 - Straight Up"
  },
  "as1_rapkilla": {
    "plain": "Changeyan naa changey, paapiyan naa paapi aan\nJigre ni jaande jaani hikkna naapi aan\nTu taan paavein goondiyan ni chhaatiyan\nLanghaan je paseete taahiyon maare chaatiyan\nAttactive baahle nakhro, yaar hathiyar jaane naale nakhro\nBaapu seega ghatt aale nakhro, bebe jigre aali si jihne paale nakhro\n\nRutbe uchhe ne tu jinna nu naapdi\nDuniya karugi gallan chhaddi chhaap di\nNi mere utte laati jihne jaan aap di\nPith nahi laggann deni os baap di\nLaunde nachde ne hor jo machaunde\nAujle de gaane rehnde gaunde\nChoti de husn pichhe aunde, agg launde\n\nGaddi kandi te ohdiye ni chhak ke\nChaar kolne paine lagge agge ni\nAinvaye kihda langhu saala tainu takk ke\nBhukh 'ch rakhaan parne na takk ke\nAap payi aa dekh keeli jatt ne\nSoch vi nahi sakdi jo jeeli jatt ne\nDekhne halaat maadi reeli jatt ne\nSaadi tutti chhatt paa ke diti neeli chhatt ne\n\nYaariyan pugaayian gayian bhukh sun ke\nVairi bhajj jande dugg dugg sun ke!",
    "synced": "[00:08.00] Changeyan naa changey, paapiyan naa paapi aan\n[00:12.50] Jigre ni jaande jaani hikkna naapi aan\n[00:16.50] Tu taan paavein goondiyan ni chhaatiyan\n[00:20.00] Langhaan je paseete taahiyon maare chaatiyan\n[00:24.00] Attactive baahle nakhro, yaar hathiyar jaane naale nakhro\n[00:29.00] Baapu seega ghatt aale nakhro, bebe jigre aali si jihne paale nakhro\n[00:34.00] Rutbe uchhe ne tu jinna nu naapdi\n[00:38.00] Duniya karugi gallan chhaddi chhaap di\n[00:42.00] Ni mere utte laati jihne jaan aap di\n[00:46.00] Pith nahi laggann deni os baap di\n[00:50.00] Launde nachde ne hor jo machaunde\n[00:53.50] Aujle de gaane rehnde gaunde\n[00:57.00] Choti de husn pichhe aunde, agg launde\n[01:01.00] Gaddi kandi te ohdiye ni chhak ke\n[01:05.00] Chaar kolne paine lagge agge ni\n[01:08.50] Ainvaye kihda langhu saala tainu takk ke\n[01:12.00] Bhukh 'ch rakhaan parne na takk ke\n[01:15.50] Aap payi aa dekh keeli jatt ne\n[01:18.50] Soch vi nahi sakdi jo jeeli jatt ne\n[01:21.50] Dekhne halaat maadi reeli jatt ne\n[01:25.00] Saadi tutti chhatt paa ke diti neeli chhatt ne\n[01:30.00] Yaariyan pugaayian gayian bhukh sun ke\n[01:36.00] Vairi bhajj jande dugg dugg sun ke!\n[01:50.00] Aujla SZN 1 - Rap Killa"
  },
  "as1_aujlaszn": {
    "plain": "Eh duniya ae satrangi peeng wargi\nTaahi add chalaan, mainu ni eh theek lagdi\nDindi duniya ni hallasheri kade mehnatan nu\nBhare nu commentan vich weak kardi\n\nHo aithe oh wala pyaar kitthe\nNaujawan saare bani baithe theke\nJe koi hatti dikhave ohnu dassde hankaar\nPehlan maar ditta Sidhu, hun Aujle de pichhe\nMaarde Punjabi hi Punjabiyan de naal\n\nSingeraan da haar, paunda reejh sangeet nu banayi deewar\nSher likhde, ni sher bade kalmaan de naal\nKi ae Majha ki Doaba, ji maarde chak\nSaare apne ne bhai, kaaton dassi jaande wakh\n\nPehlan thodeya na hor, laa laa ke zor\nHun bache hoye Punjab nu na kar dio waapar\nAkl nu maaro, bande apni na chaaro\nJinni lage chhabeela, ohna rukh vi lagaalo\n\nSaadi kaum ne nachaye itihas 'ch vairi\nAjj di nu basari reelaan de nachaalo\nMain mohataan di siyaana, ainvaye deyi jaavaan mattan\nMain mooh-phat banda, saaf dil jihda rakhda\nMeri reel naale khole, khush ho jaave feel\nMera motive aa ikko, sohneya nu hassaun da!",
    "synced": "[00:08.00] Eh duniya ae satrangi peeng wargi\n[00:13.00] Taahi add chalaan, mainu ni eh theek lagdi\n[00:18.00] Dindi duniya ni hallasheri kade mehnatan nu\n[00:23.00] Bhare nu commentan vich weak kardi\n[00:28.00] Ho aithe oh wala pyaar kitthe\n[00:33.00] Naujawan saare bani baithe theke\n[00:38.00] Je koi hatti dikhave ohnu dassde hankaar\n[00:43.00] Pehlan maar ditta Sidhu, hun Aujle de pichhe\n[00:48.00] Maarde Punjabi hi Punjabiyan de naal\n[00:53.00] Singeraan da haar, paunda reejh sangeet nu banayi deewar\n[00:59.00] Sher likhde, ni sher bade kalmaan de naal\n[01:04.00] Ki ae Majha ki Doaba, ji maarde chak\n[01:09.00] Saare apne ne bhai, kaaton dassi jaande wakh\n[01:14.00] Pehlan thodeya na hor, laa laa ke zor\n[01:18.00] Hun bache hoye Punjab nu na kar dio waapar\n[01:23.00] Akl nu maaro, bande apni na chaaro\n[01:28.00] Jinni lage chhabeela, ohna rukh vi lagaalo\n[01:33.00] Saadi kaum ne nachaye itihas 'ch vairi\n[01:38.00] Ajj di nu basari reelaan de nachaalo\n[01:43.00] Main mohataan di siyaana, ainvaye deyi jaavaan mattan\n[01:48.00] Main mooh-phat banda, saaf dil jihda rakhda\n[01:53.00] Meri reel naale khole, khush ho jaave feel\n[01:58.00] Mera motive aa ikko, sohneya nu hassaun da!\n[02:08.00] Aujla SZN 1 - Aujla Szn"
  }
};


function decryptSaavnUrl(enc) {
  if (!enc) return null;
  try {
    const bin = atob(enc);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const dec = desEngine.decryptECB(Array.from(bytes), desKey);
    const str = new TextDecoder().decode(new Uint8Array(dec));
    return str ? str.replace('_96.mp4', '_320.mp4').replace('_160.mp4', '_320.mp4') : null;
  } catch(e) { return null; }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Content-Type': 'application/json; charset=utf-8'
};

// In-memory Jam Session Store for real-time 0-delay multi-device synchronization
const jamRooms = new Map();

// Helper to clean up old rooms
function cleanupJamRooms() {
  const now = Date.now();
  for (const [id, room] of jamRooms.entries()) {
    if (now - room.updatedAt > 2 * 60 * 60 * 1000) {
      jamRooms.delete(id);
    }
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ==========================================
    // SPOTIFY JAM REAL-TIME RELAY ENDPOINTS
    // ==========================================

    // High-Precision NTP Clock Sync
    if (url.pathname === '/api/jam/time') {
      return new Response(JSON.stringify({
        status: 'success',
        serverTime: Date.now()
      }), { headers: corsHeaders });
    }

    // Create / Host Jam Room
    if (url.pathname === '/api/jam/create' && request.method === 'POST') {
      try {
        cleanupJamRooms();
        const data = await request.json();
        const roomId = (data.roomId || '').toUpperCase().trim();
        if (!roomId) return new Response(JSON.stringify({ error: 'Missing roomId' }), { status: 400, headers: corsHeaders });

        const room = {
          roomId,
          hostId: data.hostId || 'host_' + Math.random().toString(36).substring(2, 8),
          hostName: data.hostName || 'Host Device',
          guestControl: data.guestControl !== undefined ? data.guestControl : true,
          song: data.song || null,
          position: data.position || 0,
          isPlaying: !!data.isPlaying,
          hostTime: data.hostTime || Date.now(),
          serverTime: Date.now(),
          scheduledTime: data.scheduledTime || 0,
          action: data.action || 'INIT',
          actionSeq: 1,
          updatedAt: Date.now(),
          guests: [{
            id: data.hostId || 'host',
            name: data.hostName || 'Host Device',
            isHost: true,
            lastSeen: Date.now()
          }]
        };
        jamRooms.set(roomId, room);

        return new Response(JSON.stringify({ status: 'success', room }), { headers: corsHeaders });
      } catch(e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    // Join Jam Room
    if (url.pathname === '/api/jam/join' && request.method === 'POST') {
      try {
        cleanupJamRooms();
        const data = await request.json();
        const roomId = (data.roomId || '').toUpperCase().trim();
        const room = jamRooms.get(roomId);

        if (!room) {
          return new Response(JSON.stringify({ status: 'error', message: 'Jam session not found. Please check room code.' }), { status: 404, headers: corsHeaders });
        }

        const guestId = data.guestId || 'guest_' + Math.random().toString(36).substring(2, 8);
        const guestName = data.guestName || 'Guest Device';

        // Add or update guest
        const existingIdx = room.guests.findIndex(g => g.id === guestId);
        const guestObj = {
          id: guestId,
          name: guestName,
          isHost: guestId === room.hostId,
          lastSeen: Date.now()
        };

        if (existingIdx >= 0) {
          room.guests[existingIdx] = guestObj;
        } else {
          room.guests.push(guestObj);
        }
        room.updatedAt = Date.now();

        return new Response(JSON.stringify({
          status: 'success',
          room: {
            ...room,
            serverTime: Date.now()
          }
        }), { headers: corsHeaders });
      } catch(e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    // Broadcast Jam State Update (Play, Pause, Seek, Next Track)
    if (url.pathname === '/api/jam/state' && request.method === 'POST') {
      try {
        const data = await request.json();
        const roomId = (data.roomId || '').toUpperCase().trim();
        const room = jamRooms.get(roomId);

        if (!room) {
          return new Response(JSON.stringify({ status: 'error', message: 'Jam session expired or not found.' }), { status: 404, headers: corsHeaders });
        }

        // Check if sender is allowed (host or guest if guestControl is on)
        const isHost = data.senderId === room.hostId;
        if (!isHost && !room.guestControl) {
          return new Response(JSON.stringify({ status: 'error', message: 'Host has disabled guest playback controls.' }), { status: 403, headers: corsHeaders });
        }

        if (data.song !== undefined) room.song = data.song;
        if (data.position !== undefined) room.position = data.position;
        if (data.isPlaying !== undefined) room.isPlaying = !!data.isPlaying;
        if (data.guestControl !== undefined && isHost) room.guestControl = !!data.guestControl;
        if (data.scheduledTime !== undefined) room.scheduledTime = data.scheduledTime;

        room.action = data.action || 'UPDATE';
        room.actionSeq = (room.actionSeq || 0) + 1;
        room.hostTime = data.hostTime || Date.now();
        room.serverTime = Date.now();
        room.updatedAt = Date.now();

        // Update sender last seen
        const sender = room.guests.find(g => g.id === data.senderId);
        if (sender) sender.lastSeen = Date.now();

        return new Response(JSON.stringify({
          status: 'success',
          actionSeq: room.actionSeq,
          serverTime: Date.now()
        }), { headers: corsHeaders });
      } catch(e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    // Poll Jam Room State & Participants
    if (url.pathname === '/api/jam/poll') {
      const roomId = (url.searchParams.get('room') || '').toUpperCase().trim();
      const participantId = url.searchParams.get('pid') || '';
      const room = jamRooms.get(roomId);

      if (!room) {
        return new Response(JSON.stringify({ status: 'not_found' }), { status: 404, headers: corsHeaders });
      }

      // Update participant heartbeat
      if (participantId) {
        const participant = room.guests.find(g => g.id === participantId);
        if (participant) {
          participant.lastSeen = Date.now();
        }
      }

      // Prune inactive guests (> 45s no heartbeat)
      const now = Date.now();
      room.guests = room.guests.filter(g => g.isHost || (now - g.lastSeen < 45000));

      return new Response(JSON.stringify({
        status: 'success',
        room: {
          ...room,
          serverTime: Date.now()
        }
      }), { headers: corsHeaders });
    }

    // Leave Jam Room
    if (url.pathname === '/api/jam/leave' && request.method === 'POST') {
      try {
        const data = await request.json();
        const roomId = (data.roomId || '').toUpperCase().trim();
        const room = jamRooms.get(roomId);

        if (room) {
          if (data.participantId === room.hostId) {
            jamRooms.delete(roomId);
          } else {
            room.guests = room.guests.filter(g => g.id !== data.participantId);
          }
        }
        return new Response(JSON.stringify({ status: 'success' }), { headers: corsHeaders });
      } catch(e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    // 0. UNIVERSAL FAST PROXY (Bypasses browser CORS with Cloudflare Edge)
    if (url.pathname === '/api/proxy') {
      const targetUrl = url.searchParams.get('url');
      if (!targetUrl) return new Response(JSON.stringify({ error: 'Missing url param' }), { status: 400, headers: corsHeaders });
      try {
        const proxyRes = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        const contentType = proxyRes.headers.get('content-type') || 'application/json';
        const body = await proxyRes.arrayBuffer();
        return new Response(body, {
          status: proxyRes.status,
          headers: {
            ...corsHeaders,
            'Content-Type': contentType
          }
        });
      } catch(e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    // 1. LIVE SEARCH (Millions of songs)
    if (url.pathname === '/api/search') {
      const q = url.searchParams.get('q') || '';
      try {
        const [sRes, aRes, albRes] = await Promise.all([
          fetch(`https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&cc=in&n=40&p=1&q=${encodeURIComponent(q)}`),
          fetch(`https://www.jiosaavn.com/api.php?__call=search.getArtistResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&cc=in&n=10&p=1&q=${encodeURIComponent(q)}`),
          fetch(`https://www.jiosaavn.com/api.php?__call=search.getAlbumResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&cc=in&n=20&p=1&q=${encodeURIComponent(q)}`)
        ]);

        const sData = sRes.ok ? await sRes.json() : null;
        const aData = aRes.ok ? await aRes.json() : null;
        const albData = albRes.ok ? await albRes.json() : null;

        const songs = (sData?.results || []).map(s => {
          const enc = s.more_info?.encrypted_media_url;
          const stream = enc ? decryptSaavnUrl(enc) : null;
          return {
            id: s.id,
            title: s.title ? s.title.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"') : '',
            artist: s.more_info?.artistMap?.primary_artists?.map(a => a.name).join(', ') || s.subtitle || 'Artist',
            album: s.more_info?.album ? s.more_info.album.replace(/&amp;/g, '&').replace(/&#039;/g, "'") : 'Single',
            image: s.image ? s.image.replace('150x150', '500x500') : '',
            duration: parseInt(s.more_info?.duration || 180),
            stream_url: stream
          };
        }).filter(s => s.stream_url);

        const artists = (aData?.results || []).map(a => ({
          id: a.id,
          name: a.name ? a.name.replace(/&amp;/g, '&').replace(/&#039;/g, "'") : '',
          role: 'Artist',
          image: a.image ? a.image.replace('150x150', '500x500') : ''
        }));

        const albums = (albData?.results || []).map(alb => ({
          id: alb.id,
          title: alb.title ? alb.title.replace(/&amp;/g, '&').replace(/&#039;/g, "'") : '',
          artist: alb.artist ? alb.artist.replace(/&amp;/g, '&').replace(/&#039;/g, "'") : '',
          subtitle: `${alb.artist || 'Artist'} &bull; Album`,
          image: alb.image ? alb.image.replace('150x150', '500x500') : '',
          isAlbum: true
        }));

        return new Response(JSON.stringify({ status: 'success', songs, artists, albums }), { headers: corsHeaders });
      } catch(e) {
        return new Response(JSON.stringify({ status: 'error', message: e.message }), { headers: corsHeaders });
      }
    }

    // 2. ARTIST FULL DISCOGRAPHY & TOP SONGS & ALBUMS
    if (url.pathname === '/api/artist') {
      const artistId = url.searchParams.get('id') || '';
      const artistName = url.searchParams.get('name') || '';

      try {
        let finalArtistId = artistId;
        let artistHeroImage = '';
        let artistBio = '';
        let artistFollowers = '';
        let resolvedName = artistName;

        if (artistName) {
          const searchRes = await fetch(`https://www.jiosaavn.com/api.php?__call=search.getArtistResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&cc=in&n=5&p=1&q=${encodeURIComponent(artistName)}`);
          if (searchRes.ok) {
            const data = await searchRes.json();
            if (data?.results?.length) {
              const exact = data.results.find(a => a.name.toLowerCase() === artistName.toLowerCase()) || data.results[0];
              if (exact) {
                finalArtistId = exact.id;
                resolvedName = exact.name.replace(/&amp;/g, '&').replace(/&#039;/g, "'");
                artistHeroImage = exact.image ? exact.image.replace('50x50', '500x500').replace('150x150', '500x500') : '';
              }
            }
          }
        }

        let songs = [];
        let albums = [];

        // Try getting full artist page details
        if (finalArtistId) {
          const detRes = await fetch(`https://www.jiosaavn.com/api.php?__call=artist.getArtistPageDetails&_format=json&_marker=0&api_version=4&ctx=web6dot0&cc=in&artistId=${encodeURIComponent(finalArtistId)}&n_song=50&n_album=50`);
          if (detRes.ok) {
            const det = await detRes.json();
            if (det.name) resolvedName = det.name;
            if (det.image) artistHeroImage = det.image.replace('150x150', '500x500');
            artistFollowers = det.follower_count || '';
            artistBio = det.bio || '';

            songs = (det.topSongs || []).map(s => {
              const enc = s.more_info?.encrypted_media_url;
              const stream = enc ? decryptSaavnUrl(enc) : null;
              return {
                id: s.id,
                title: s.title ? s.title.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"') : '',
                artist: s.more_info?.artistMap?.primary_artists?.map(a => a.name).join(', ') || s.subtitle || det.name,
                album: s.more_info?.album ? s.more_info.album.replace(/&amp;/g, '&').replace(/&#039;/g, "'") : 'Single',
                image: s.image ? s.image.replace('150x150', '500x500') : (artistHeroImage || ''),
                duration: parseInt(s.more_info?.duration || 180),
                stream_url: stream
              };
            }).filter(s => s.stream_url);

            albums = (det.topAlbums || []).map(alb => ({
              id: alb.id,
              title: alb.title ? alb.title.replace(/&amp;/g, '&').replace(/&#039;/g, "'") : '',
              artist: alb.subtitle || det.name,
              subtitle: `${alb.subtitle || det.name} &bull; Album`,
              image: alb.image ? alb.image.replace('150x150', '500x500') : '',
              year: alb.year || '',
              isAlbum: true
            }));
          }
        }

        // Universal Fallback for Western or uncatalogued artists: Search directly
        if (songs.length < 5 && resolvedName) {
          const [sRes, aRes] = await Promise.all([
            fetch(`https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&cc=in&n=45&p=1&q=${encodeURIComponent(resolvedName)}`),
            fetch(`https://www.jiosaavn.com/api.php?__call=search.getAlbumResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&cc=in&n=25&p=1&q=${encodeURIComponent(resolvedName)}`)
          ]);

          if (sRes.ok) {
            const sData = await sRes.json();
            const fallbackSongs = (sData.results || []).map(s => {
              const enc = s.more_info?.encrypted_media_url;
              const stream = enc ? decryptSaavnUrl(enc) : null;
              return {
                id: s.id,
                title: s.title ? s.title.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"') : '',
                artist: s.more_info?.artistMap?.primary_artists?.map(a => a.name).join(', ') || s.subtitle || resolvedName,
                album: s.more_info?.album ? s.more_info.album.replace(/&amp;/g, '&').replace(/&#039;/g, "'") : 'Single',
                image: s.image ? s.image.replace('150x150', '500x500') : '',
                duration: parseInt(s.more_info?.duration || 180),
                stream_url: stream
              };
            }).filter(s => s.stream_url);

            if (fallbackSongs.length > songs.length) {
              songs = fallbackSongs;
            }
          }

          if (aRes.ok) {
            const aData = await aRes.json();
            const fallbackAlbums = (aData.results || []).map(alb => ({
              id: alb.id,
              title: alb.title ? alb.title.replace(/&amp;/g, '&').replace(/&#039;/g, "'") : '',
              artist: alb.artist ? alb.artist.replace(/&amp;/g, '&').replace(/&#039;/g, "'") : resolvedName,
              subtitle: `${alb.artist || resolvedName} &bull; Album`,
              image: alb.image ? alb.image.replace('150x150', '500x500') : '',
              isAlbum: true
            }));

            if (fallbackAlbums.length > albums.length) {
              albums = fallbackAlbums;
            }
          }
        }

        if (songs.length > 0 && !artistHeroImage) {
          artistHeroImage = songs[0].image;
        }

        // Prioritize Karan Aujla latest EPs & brand-new releases
        if (resolvedName.toLowerCase().includes('karan aujla') || finalArtistId === '697691') {
          const aujlaAlbums = [
            {
              id: 'alb_aujla_szn_1',
              title: 'AUJLA SZN 1',
              artist: 'Karan Aujla',
              subtitle: 'Karan Aujla &bull; 2026 EP',
              image: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/74/b9/74/74b974cc-a8e3-ab69-1675-65b29e5324d1/5064089826918_cover.jpg/500x500bb.jpg',
              year: '2026',
              isAlbum: true
            },
            {
              id: '55544222',
              title: 'Four Me',
              artist: 'Karan Aujla',
              subtitle: 'Karan Aujla &bull; EP',
              image: 'https://c.saavncdn.com/374/Four-Me-Punjabi-2024-20240626022802-500x500.jpg',
              year: '2024',
              isAlbum: true
            },
            {
              id: '62781248',
              title: 'Four You',
              artist: 'Karan Aujla, IKKY',
              subtitle: 'Karan Aujla &bull; EP',
              image: 'https://c.saavncdn.com/552/Four-You-Punjabi-2023-20230204151745-500x500.jpg',
              year: '2023',
              isAlbum: true
            },
            {
              id: '51761804',
              title: 'Street Dreams',
              artist: 'Karan Aujla, DIVINE',
              subtitle: 'Karan Aujla &bull; Album',
              image: 'https://c.saavncdn.com/505/Street-Dreams-Punjabi-2024-20240216134015-500x500.jpg',
              year: '2024',
              isAlbum: true
            }
          ];
          const seenAlbTitles = new Set(albums.map(a => a.title.toLowerCase()));
          for (let i = aujlaAlbums.length - 1; i >= 0; i--) {
            if (!seenAlbTitles.has(aujlaAlbums[i].title.toLowerCase())) {
              albums.unshift(aujlaAlbums[i]);
            }
          }

          const topAujlaSongs = [
            { id: "as1_ashke", title: "Ashke", artist: "Karan Aujla, MXRCI", album: "AUJLA SZN 1", duration: 218, image: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/74/b9/74/74b974cc-a8e3-ab69-1675-65b29e5324d1/5064089826918_cover.jpg/500x500bb.jpg", stream_url: "audio/ashke.m4a", lyrics: AUJLA_LYRICS["as1_ashke"].plain, synced_lyrics: AUJLA_LYRICS["as1_ashke"].synced },
            { id: "as1_realbadman", title: "Real Bad Man", artist: "Karan Aujla, MXRCI", album: "AUJLA SZN 1", duration: 170, image: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/74/b9/74/74b974cc-a8e3-ab69-1675-65b29e5324d1/5064089826918_cover.jpg/500x500bb.jpg", stream_url: "audio/realbadman.m4a", lyrics: AUJLA_LYRICS["as1_realbadman"].plain, synced_lyrics: AUJLA_LYRICS["as1_realbadman"].synced },
            { id: "as1_straightup", title: "Straight Up (feat. Azaad 4L)", artist: "Karan Aujla, Azaad 4L, MXRCI", album: "AUJLA SZN 1", duration: 215, image: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/74/b9/74/74b974cc-a8e3-ab69-1675-65b29e5324d1/5064089826918_cover.jpg/500x500bb.jpg", stream_url: "audio/straightup.m4a", lyrics: AUJLA_LYRICS["as1_straightup"].plain, synced_lyrics: AUJLA_LYRICS["as1_straightup"].synced },
            { id: "as1_rapkilla", title: "Rap Killa", artist: "Karan Aujla, MXRCI", album: "AUJLA SZN 1", duration: 246, image: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/74/b9/74/74b974cc-a8e3-ab69-1675-65b29e5324d1/5064089826918_cover.jpg/500x500bb.jpg", stream_url: "audio/rapkilla.m4a", lyrics: AUJLA_LYRICS["as1_rapkilla"].plain, synced_lyrics: AUJLA_LYRICS["as1_rapkilla"].synced },
            { id: "as1_aujlaszn", title: "Aujla Szn", artist: "Karan Aujla, MXRCI", album: "AUJLA SZN 1", duration: 218, image: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/74/b9/74/74b974cc-a8e3-ab69-1675-65b29e5324d1/5064089826918_cover.jpg/500x500bb.jpg", stream_url: "audio/aujlaszn.m4a", lyrics: AUJLA_LYRICS["as1_aujlaszn"].plain, synced_lyrics: AUJLA_LYRICS["as1_aujlaszn"].synced },
            { id: "1azNm1cN", title: "IDK HOW", artist: "Karan Aujla", album: "Four Me", duration: 152, image: "https://c.saavncdn.com/374/Four-Me-Punjabi-2024-20240626022802-500x500.jpg", stream_url: "https://aac.saavncdn.com/374/9656916646d0217382a081b1bfac7526_320.mp4" },
            { id: "bYkVrmlH", title: "WHO THEY?", artist: "Karan Aujla, Yeah Proof", album: "Four Me", duration: 170, image: "https://c.saavncdn.com/374/Four-Me-Punjabi-2024-20240626022802-500x500.jpg", stream_url: "https://aac.saavncdn.com/374/89ece46d37b9dffd524a37e8f736544d_320.mp4" },
            { id: "OTmiAydz", title: "ANTIDOTE", artist: "Karan Aujla", album: "Four Me", duration: 187, image: "https://c.saavncdn.com/374/Four-Me-Punjabi-2024-20240626022802-500x500.jpg", stream_url: "https://aac.saavncdn.com/374/0fb1a52161fbcab7c5703ab6db64a937_320.mp4" },
            { id: "kOL57-FR", title: "Y.D.G", artist: "Karan Aujla", album: "Four Me", duration: 164, image: "https://c.saavncdn.com/374/Four-Me-Punjabi-2024-20240626022802-500x500.jpg", stream_url: "https://aac.saavncdn.com/374/0a1d1cdc56a13e155fb6acdf387310a1_320.mp4" },
            { id: "4nvYwtL_", title: "52 Bars", artist: "Karan Aujla, IKKY", album: "Four You", duration: 204, image: "https://c.saavncdn.com/552/Four-You-Punjabi-2023-20230204151745-500x500.jpg", stream_url: "https://aac.saavncdn.com/552/44035100d2aab3af5226718086f29523_320.mp4" }
          ];
          const seenSongIds = new Set(songs.map(s => s.id));
          for (let i = topAujlaSongs.length - 1; i >= 0; i--) {
            if (!seenSongIds.has(topAujlaSongs[i].id)) {
              songs.unshift(topAujlaSongs[i]);
            }
          }
        }

        return new Response(JSON.stringify({
          status: 'success',
          id: finalArtistId || 'art_' + Date.now(),
          name: resolvedName,
          image: artistHeroImage,
          follower_count: artistFollowers || `${Math.floor(Math.random() * 15) + 5},${Math.floor(Math.random() * 800) + 100},${Math.floor(Math.random() * 800) + 100}`,
          bio: artistBio,
          songs,
          albums
        }), { headers: corsHeaders });
      } catch(e) {
        return new Response(JSON.stringify({ status: 'error', message: e.message }), { headers: corsHeaders });
      }
    }

    // 3. ALBUM FULL TRACKLIST
    if (url.pathname === '/api/album') {
      const albumId = url.searchParams.get('id') || '';
      const albumTitle = url.searchParams.get('title') || '';
      const aLower = albumTitle.toLowerCase().trim();

      if (albumId === 'alb_aujla_szn_1' || aLower.includes('aujla szn')) {
        return new Response(JSON.stringify({
          status: 'success',
          id: 'alb_aujla_szn_1',
          title: 'AUJLA SZN 1',
          artist: 'Karan Aujla',
          image: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/74/b9/74/74b974cc-a8e3-ab69-1675-65b29e5324d1/5064089826918_cover.jpg/500x500bb.jpg',
          year: '2026',
          songs: [
            { id: "as1_ashke", title: "Ashke", artist: "Karan Aujla, MXRCI", album: "AUJLA SZN 1", duration: 218, image: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/74/b9/74/74b974cc-a8e3-ab69-1675-65b29e5324d1/5064089826918_cover.jpg/500x500bb.jpg", stream_url: "audio/ashke.m4a", lyrics: AUJLA_LYRICS["as1_ashke"].plain, synced_lyrics: AUJLA_LYRICS["as1_ashke"].synced },
            { id: "as1_realbadman", title: "Real Bad Man", artist: "Karan Aujla, MXRCI", album: "AUJLA SZN 1", duration: 170, image: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/74/b9/74/74b974cc-a8e3-ab69-1675-65b29e5324d1/5064089826918_cover.jpg/500x500bb.jpg", stream_url: "audio/realbadman.m4a", lyrics: AUJLA_LYRICS["as1_realbadman"].plain, synced_lyrics: AUJLA_LYRICS["as1_realbadman"].synced },
            { id: "as1_straightup", title: "Straight Up (feat. Azaad 4L)", artist: "Karan Aujla, Azaad 4L, MXRCI", album: "AUJLA SZN 1", duration: 215, image: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/74/b9/74/74b974cc-a8e3-ab69-1675-65b29e5324d1/5064089826918_cover.jpg/500x500bb.jpg", stream_url: "audio/straightup.m4a", lyrics: AUJLA_LYRICS["as1_straightup"].plain, synced_lyrics: AUJLA_LYRICS["as1_straightup"].synced },
            { id: "as1_rapkilla", title: "Rap Killa", artist: "Karan Aujla, MXRCI", album: "AUJLA SZN 1", duration: 246, image: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/74/b9/74/74b974cc-a8e3-ab69-1675-65b29e5324d1/5064089826918_cover.jpg/500x500bb.jpg", stream_url: "audio/rapkilla.m4a", lyrics: AUJLA_LYRICS["as1_rapkilla"].plain, synced_lyrics: AUJLA_LYRICS["as1_rapkilla"].synced },
            { id: "as1_aujlaszn", title: "Aujla Szn", artist: "Karan Aujla, MXRCI", album: "AUJLA SZN 1", duration: 218, image: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/74/b9/74/74b974cc-a8e3-ab69-1675-65b29e5324d1/5064089826918_cover.jpg/500x500bb.jpg", stream_url: "audio/aujlaszn.m4a", lyrics: AUJLA_LYRICS["as1_aujlaszn"].plain, synced_lyrics: AUJLA_LYRICS["as1_aujlaszn"].synced }
          ]
        }), { headers: corsHeaders });
      }

      if (albumId === '55544222' || (aLower.includes('four me') && !aLower.includes('four you'))) {
        return new Response(JSON.stringify({
          status: 'success',
          id: '55544222',
          title: 'Four Me',
          artist: 'Karan Aujla',
          image: 'https://c.saavncdn.com/374/Four-Me-Punjabi-2024-20240626022802-500x500.jpg',
          year: '2024',
          songs: [
            { id: "1azNm1cN", title: "IDK HOW", artist: "Karan Aujla", album: "Four Me", duration: 152, image: "https://c.saavncdn.com/374/Four-Me-Punjabi-2024-20240626022802-500x500.jpg", stream_url: "https://aac.saavncdn.com/374/9656916646d0217382a081b1bfac7526_320.mp4" },
            { id: "bYkVrmlH", title: "WHO THEY?", artist: "Karan Aujla, Yeah Proof", album: "Four Me", duration: 170, image: "https://c.saavncdn.com/374/Four-Me-Punjabi-2024-20240626022802-500x500.jpg", stream_url: "https://aac.saavncdn.com/374/89ece46d37b9dffd524a37e8f736544d_320.mp4" },
            { id: "OTmiAydz", title: "ANTIDOTE", artist: "Karan Aujla", album: "Four Me", duration: 187, image: "https://c.saavncdn.com/374/Four-Me-Punjabi-2024-20240626022802-500x500.jpg", stream_url: "https://aac.saavncdn.com/374/0fb1a52161fbcab7c5703ab6db64a937_320.mp4" },
            { id: "kOL57-FR", title: "Y.D.G", artist: "Karan Aujla", album: "Four Me", duration: 164, image: "https://c.saavncdn.com/374/Four-Me-Punjabi-2024-20240626022802-500x500.jpg", stream_url: "https://aac.saavncdn.com/374/0a1d1cdc56a13e155fb6acdf387310a1_320.mp4" }
          ]
        }), { headers: corsHeaders });
      }

      if (albumId === '62781248' || aLower.includes('four you')) {
        return new Response(JSON.stringify({
          status: 'success',
          id: '62781248',
          title: 'Four You',
          artist: 'Karan Aujla, IKKY',
          image: 'https://c.saavncdn.com/552/Four-You-Punjabi-2023-20230204151745-500x500.jpg',
          year: '2023',
          songs: [
            { id: "4nvYwtL_", title: "52 Bars", artist: "Karan Aujla, IKKY", album: "Four You", duration: 204, image: "https://c.saavncdn.com/552/Four-You-Punjabi-2023-20230204151745-500x500.jpg", stream_url: "https://aac.saavncdn.com/552/44035100d2aab3af5226718086f29523_320.mp4" },
            { id: "4sVA2Cga", title: "Take It Easy", artist: "Karan Aujla, IKKY", album: "Four You", duration: 177, image: "https://c.saavncdn.com/552/Four-You-Punjabi-2023-20230204151745-500x500.jpg", stream_url: "https://aac.saavncdn.com/552/d682e2423780267d3d1a796d792de4cf_320.mp4" },
            { id: "3SSUn4uf", title: "Fallin Apart", artist: "Karan Aujla, IKKY", album: "Four You", duration: 175, image: "https://c.saavncdn.com/552/Four-You-Punjabi-2023-20230204151745-500x500.jpg", stream_url: "https://aac.saavncdn.com/552/552a1830779ab0bb77f87185bc8fa9e0_320.mp4" },
            { id: "2C0FpAOJ", title: "YEAH NAAH", artist: "Karan Aujla, IKKY", album: "Four You", duration: 184, image: "https://c.saavncdn.com/552/Four-You-Punjabi-2023-20230204151745-500x500.jpg", stream_url: "https://aac.saavncdn.com/552/b23c3b7375eb8510d537aed93af7e707_320.mp4" }
          ]
        }), { headers: corsHeaders });
      }

      try {
        let songs = [];
        let albMeta = null;

        if (albumId && !albumId.startsWith('alb_')) {
          const res = await fetch(`https://www.jiosaavn.com/api.php?__call=content.getAlbumDetails&_format=json&_marker=0&api_version=4&ctx=web6dot0&cc=in&albumid=${encodeURIComponent(albumId)}`);
          if (res.ok) {
            const alb = await res.json();
            albMeta = alb;
            songs = (alb.list || []).map((s, idx) => {
              const enc = s.more_info?.encrypted_media_url;
              const stream = enc ? decryptSaavnUrl(enc) : null;
              return {
                id: s.id,
                trackNumber: idx + 1,
                title: s.title ? s.title.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"') : '',
                artist: s.more_info?.artistMap?.primary_artists?.map(a => a.name).join(', ') || s.subtitle || alb.title,
                album: alb.title || 'Single',
                image: alb.image ? alb.image.replace('150x150', '500x500') : '',
                duration: parseInt(s.more_info?.duration || 180),
                stream_url: stream
              };
            }).filter(s => s.stream_url);
          }
        }

        // Fallback: search by album title if no tracks from ID
        if (!songs.length && albumTitle) {
          const sRes = await fetch(`https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&cc=in&n=30&p=1&q=${encodeURIComponent(albumTitle)}`);
          if (sRes.ok) {
            const sData = await sRes.json();
            songs = (sData.results || []).map((s, idx) => {
              const enc = s.more_info?.encrypted_media_url;
              const stream = enc ? decryptSaavnUrl(enc) : null;
              return {
                id: s.id,
                trackNumber: idx + 1,
                title: s.title ? s.title.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"') : '',
                artist: s.more_info?.artistMap?.primary_artists?.map(a => a.name).join(', ') || s.subtitle || albumTitle,
                album: s.more_info?.album || albumTitle,
                image: s.image ? s.image.replace('150x150', '500x500') : '',
                duration: parseInt(s.more_info?.duration || 180),
                stream_url: stream
              };
            }).filter(s => s.stream_url);
          }
        }

        return new Response(JSON.stringify({
          status: 'success',
          id: albumId,
          title: albMeta?.title || albumTitle,
          artist: albMeta?.subtitle || '',
          image: albMeta?.image ? albMeta.image.replace('150x150', '500x500') : (songs[0]?.image || ''),
          year: albMeta?.year || '',
          songs
        }), { headers: corsHeaders });
      } catch(e) {
        return new Response(JSON.stringify({ status: 'error', message: e.message }), { headers: corsHeaders });
      }
    }


    // 4. MULTI-SOURCE SYNCED & PLAIN LYRICS
    if (url.pathname === '/api/lyrics') {
      const id = url.searchParams.get('id') || '';
      const title = (url.searchParams.get('title') || '').trim();
      const artist = (url.searchParams.get('artist') || '').trim();

      // Check embedded lyrics
      if (id && AUJLA_LYRICS[id]) {
        return new Response(JSON.stringify({
          status: 'success',
          syncedLyrics: AUJLA_LYRICS[id].synced,
          plainLyrics: AUJLA_LYRICS[id].plain
        }), { headers: corsHeaders });
      }

      const tClean = title.toLowerCase().replace(/\(.*?\)|\[.*?\]|feat\..*|ft\..*/gi, '').trim();
      for (const [k, v] of Object.entries(AUJLA_LYRICS)) {
        if (k.toLowerCase().includes(tClean) || tClean.includes(k.replace('as1_', ''))) {
          return new Response(JSON.stringify({
            status: 'success',
            syncedLyrics: v.synced,
            plainLyrics: v.plain
          }), { headers: corsHeaders });
        }
      }

      // Multi-tier external search: LRCLIB
      try {
        const cleanT = title.replace(/\(.*?\)|\[.*?\]|feat\..*|ft\..*/gi, '').trim();
        const cleanA = artist.split(',')[0].replace(/&/g, '').trim();
        
        // Exact get
        const lrcRes = await fetch(`https://lrclib.net/api/get?track_name=${encodeURIComponent(cleanT)}&artist_name=${encodeURIComponent(cleanA)}`);
        if (lrcRes.ok) {
          const lrcData = await lrcRes.json();
          if (lrcData.syncedLyrics || lrcData.plainLyrics) {
            return new Response(JSON.stringify({
              status: 'success',
              syncedLyrics: lrcData.syncedLyrics || '',
              plainLyrics: lrcData.plainLyrics || ''
            }), { headers: corsHeaders });
          }
        }

        // LRCLIB search fallback
        const searchRes = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(cleanT + ' ' + cleanA)}`);
        if (searchRes.ok) {
          const sList = await searchRes.json();
          if (Array.isArray(sList) && sList.length > 0) {
            const first = sList[0];
            return new Response(JSON.stringify({
              status: 'success',
              syncedLyrics: first.syncedLyrics || '',
              plainLyrics: first.plainLyrics || ''
            }), { headers: corsHeaders });
          }
        }
      } catch(e) {}

      return new Response(JSON.stringify({ status: 'not_found' }), { status: 404, headers: corsHeaders });
    }

    // 5. LIVE TRENDING PUNJABI SONGS (Auto-updated straight from JioSaavn Live Charts)
    if (url.pathname === '/api/punjabi/trending') {
      try {
        const res = await fetch('https://www.jiosaavn.com/api.php?__call=playlist.getDetails&_format=json&_marker=0&api_version=4&ctx=web6dot0&cc=in&listid=1265052337');
        if (!res.ok) {
          return new Response(JSON.stringify({ status: 'error', songs: [] }), { headers: corsHeaders });
        }
        const data = await res.json();
        const songs = (data.list || []).map(s => {
          const enc = s.more_info?.encrypted_media_url;
          const stream = enc ? decryptSaavnUrl(enc) : null;
          return {
            id: s.id,
            title: s.title ? s.title.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"') : '',
            artist: s.more_info?.artistMap?.primary_artists?.map(a => a.name).join(', ') || s.subtitle || 'Punjabi Artist',
            album: s.more_info?.album ? s.more_info.album.replace(/&amp;/g, '&').replace(/&#039;/g, "'") : 'Single',
            image: s.image ? s.image.replace('150x150', '500x500') : '',
            duration: parseInt(s.more_info?.duration || 180),
            stream_url: stream,
            language: 'punjabi',
            year: s.year || '2026'
          };
        }).filter(s => s.stream_url);

        return new Response(JSON.stringify({
          status: 'success',
          title: data.title || 'Trending Punjabi 2026',
          count: songs.length,
          songs
        }), { headers: corsHeaders });
      } catch(e) {
        return new Response(JSON.stringify({ status: 'error', message: e.message, songs: [] }), { headers: corsHeaders });
      }
    }

    // Serve static assets for all other routes
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return new Response('Playify Core API Active', { status: 200 });
  }
};
