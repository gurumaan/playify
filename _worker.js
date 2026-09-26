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

const AUJLA_LYRICS = {"as1_ashke": {"plain": "Welcome home, Mr. Aujla. England's been rather dull without you, sir.\nWell, let's change that, shall we?\nSplendid idea, sir.\nGidda landua da, Baabe ji saanu bakshe\nKann nathiya gaani lashke, Ni modde paundi\nJhummar dunali keh ke ashke\nNi modde paundi, Jhummar dunali keh ke ashke\nSaade kam kaale, Mainu ditte maa ne jigre ni\nKalla chauda ni seena, Haan baby you so fire\nKahe jehdi mile haseena\nKe main miss kardi aa tainu, Tu kade milja yaar shakeena\nJattan de shonki, Yaaran eh pwaunda main kahan dass ke\nSaade kam kaale, Teriyan gallan de utte laaliyan\nNi suttiyan si sohniye, Pindan aale aa\nSaanu taan thiyon pindan aaliyan\nAah asla karda chhaan saanu, Yaa motran utte taaliyan\nMain yaar yaaran da jogi, Mere dabb te asle beenan\nMainu ditte maa ne jigre ni, Kalla chauda ni seena\nHaan baby you so fire, Kahe jehdi mile haseena\nKe main miss kardi aa tainu, Tu kade milja yaar shakeena\nMannda guruan nu, Nature aa rakane mera saadh te\nIk oh rabb chete, Ohde to bina ni aundi yaad te\nAjj saukhi langdi, Baad di dekhange jaane baad te\nThode simple mere nanke, Par OG mere dadke\nJithe pairi rakha, Beeba othe thaalda tabahi\nPind lai li 25 kile, Kal hi de ke aaya sihayi\nShow off de ni aadi aa, Bas hind aa puggai\nChakki Milli di aa Lambo, Halle photo vi ni payi\nMain sidha turiya jaavan, Tu takkdi tedhi tedhi\nTu body karli sa-peri, Te main karda kamm shady\nSaada ta pura phera ae, Na main ni launda gedhi\nKaaran jutti te asla ni, Eh tinne Italy made hi\nNi leeda latta top da rakha, Main jaane chaadh ke\nKachi oh chabb ja, Peene aan chaahan nu ohda kadd ke\nJatt khulla ghumda, Vairi nu rakha main ohda taadh ke\nNi tu phull vargi, Pathran nu aaya munda paadh ke\nKardi meriyan deedan, Ni saada khul gaya chaaka\nTu dil kardi ae chori ni, Te main maarida daaka\nBebe kehndi tainu vihauna, Te mera shashtar de naal thaaka\nDass ki kar laina kaavan, Ni mera baaja aala rakha\nRaahan vich rodhe, Behna je yaara na paina kasske\nJatt mudh to zehri, Naag ni reha koi saanu dass ke\nBaabe ji saanu bakshe, Kann nathiya gaani lashke\nNi modde paundi, Jhummar dunali keh ke ashke\nNi modde paundi, Jhummar dunali keh ke ashke\nNi modde paundi, Jhummar dunali keh ke ashke", "synced": "[00:15.90] Welcome home, Mr. Aujla. England's been rather dull without you, sir.\n[00:22.50] Well, let's change that, shall we?\n[00:25.80] Splendid idea, sir.\n[00:28.60] Gidda landua da, Baabe ji saanu bakshe\n[00:32.20] Kann nathiya gaani lashke, Ni modde paundi\n[00:35.30] Jhummar dunali keh ke ashke\n[00:39.10] Ni modde paundi, Jhummar dunali keh ke ashke\n[00:42.40] Saade kam kaale, Mainu ditte maa ne jigre ni\n[00:46.00] Kalla chauda ni seena, Haan baby you so fire\n[00:49.00] Kahe jehdi mile haseena\n[00:51.40] Ke main miss kardi aa tainu, Tu kade milja yaar shakeena\n[00:54.30] Jattan de shonki, Yaaran eh pwaunda main kahan dass ke\n[00:58.20] Saade kam kaale, Teriyan gallan de utte laaliyan\n[01:01.30] Ni suttiyan si sohniye, Pindan aale aa\n[01:04.50] Saanu taan thiyon pindan aaliyan\n[01:08.30] Aah asla karda chhaan saanu, Yaa motran utte taaliyan\n[01:11.50] Main yaar yaaran da jogi, Mere dabb te asle beenan\n[01:15.50] Mainu ditte maa ne jigre ni, Kalla chauda ni seena\n[01:19.10] Haan baby you so fire, Kahe jehdi mile haseena\n[01:22.40] Ke main miss kardi aa tainu, Tu kade milja yaar shakeena\n[01:46.70] Mannda guruan nu, Nature aa rakane mera saadh te\n[01:50.70] Ik oh rabb chete, Ohde to bina ni aundi yaad te\n[01:53.20] Ajj saukhi langdi, Baad di dekhange jaane baad te\n[01:56.80] Thode simple mere nanke, Par OG mere dadke\n[02:01.50] Jithe pairi rakha, Beeba othe thaalda tabahi\n[02:05.60] Pind lai li 25 kile, Kal hi de ke aaya sihayi\n[02:10.00] Show off de ni aadi aa, Bas hind aa puggai\n[02:13.50] Chakki Milli di aa Lambo, Halle photo vi ni payi\n[02:17.40] Main sidha turiya jaavan, Tu takkdi tedhi tedhi\n[02:20.60] Tu body karli sa-peri, Te main karda kamm shady\n[02:24.00] Saada ta pura phera ae, Na main ni launda gedhi\n[02:27.10] Kaaran jutti te asla ni, Eh tinne Italy made hi\n[02:31.20] Ni leeda latta top da rakha, Main jaane chaadh ke\n[02:35.50] Kachi oh chabb ja, Peene aan chaahan nu ohda kadd ke\n[02:39.20] Jatt khulla ghumda, Vairi nu rakha main ohda taadh ke\n[02:42.70] Ni tu phull vargi, Pathran nu aaya munda paadh ke\n[02:46.10] Kardi meriyan deedan, Ni saada khul gaya chaaka\n[02:49.10] Tu dil kardi ae chori ni, Te main maarida daaka\n[02:52.50] Bebe kehndi tainu vihauna, Te mera shashtar de naal thaaka\n[02:55.10] Dass ki kar laina kaavan, Ni mera baaja aala rakha\n[02:58.30] Raahan vich rodhe, Behna je yaara na paina kasske\n[03:01.70] Jatt mudh to zehri, Naag ni reha koi saanu dass ke\n[03:05.20] Baabe ji saanu bakshe, Kann nathiya gaani lashke\n[03:08.90] Ni modde paundi, Jhummar dunali keh ke ashke\n[03:13.00] Ni modde paundi, Jhummar dunali keh ke ashke\n[03:17.40] Ni modde paundi, Jhummar dunali keh ke ashke"}, "as1_realbadman": {"plain": "Waddup Toronto, waddup Van city, waddup Mohali...\nMan like Ikky! You know I got the buzz around me...\nAjj saale khain parso si fan\nKal de chhalaru pange mere naal lain\nJutti kare shine akh khadhi ain\nDabb lagga sandh imma real bad man\nRakha halki daadhi\nHalka na lende sirra Jatt de aadi saare Jatt jugadhi\nPayi aa duniya saadhi\nImma gangster shawty\nZor full marda ni aive kithe haar da\nJinne-k dikhaundi rehndi onne-k ta vaarda\nBaba taare bediyan te Jatt maare gediyan\nNi aape chhid jaandiyan ne assi ta ni chhediyan\nMere pichhe jehriyan tu note kar kehriyan\nPichhe, pichhe, pichhe\nPichhe aundi line luttan naddiyan da chain\nMaar la try tu vi get me if you can\nBillo agg tere nain rang tera tan\nBach ke reh maitho imma real bad man\nAnkh te Cartier, dekho hoje na maadhi\nImma gangster shawty\nKehnda asla hold me\nKhade paer chakkla ge baby they know me\nBade lokki they owe me\nSaare vairi below me\nKedha takru show me\nUdh di aa gaddi meri road te khaasi\nPaya rim glossy, meri look classy\nKurta pajama pake lagda saucy\nBaali bann na bossy\nShaolin sikha phirra ghumda Japan\nMehnge mere sign, nasha Afghan\nBach ke reh maitho imma real bad man\nAnkh te Cartier, dekho hoje na maadhi\nImma gangster shawty\nJado kaali khurdi te ohdo gaddi turdi\nNigha ni phir tutdi rakane taar judh di\nChhaal maar beh java ni ghodi jave udh di\nTe rabb da shukar kade maya naiyo thudh di\nTinn deal-an ho gayi ni phone aunde kal de\nBeeba thode putthe aa rivaj pindan wal de\n12 12 12 12 bore dan\nVichhe-i 8 pain, Aujla shikari ae lok saare kehn\nJithe tera rehn biba othe Jatt ban\nMain keha bach ke reh maitho\nImma real bad man\nAnkh te Cartier, dekho hoje na maadhi\nImma gangster shawty\nImma gangster shawty\nImma gangster shawty\nImma gangster shawty\nImma gangster shawty", "synced": "[00:03.00] Waddup Toronto, waddup Van city, waddup Mohali...\n[00:07.50] Man like Ikky! You know I got the buzz around me...\n[00:11.20] Ajj saale khain parso si fan\n[00:14.00] Kal de chhalaru pange mere naal lain\n[00:16.80] Jutti kare shine akh khadhi ain\n[00:19.50] Dabb lagga sandh imma real bad man\n[00:22.50] Rakha halki daadhi\n[00:24.50] Halka na lende sirra Jatt de aadi saare Jatt jugadhi\n[00:28.00] Payi aa duniya saadhi\n[00:30.00] Imma gangster shawty\n[00:32.00] Zor full marda ni aive kithe haar da\n[00:35.00] Jinne-k dikhaundi rehndi onne-k ta vaarda\n[00:37.50] Baba taare bediyan te Jatt maare gediyan\n[00:40.50] Ni aape chhid jaandiyan ne assi ta ni chhediyan\n[00:43.50] Mere pichhe jehriyan tu note kar kehriyan\n[00:46.50] Pichhe, pichhe, pichhe\n[00:48.50] Pichhe aundi line luttan naddiyan da chain\n[00:51.50] Maar la try tu vi get me if you can\n[00:54.00] Billo agg tere nain rang tera tan\n[00:57.00] Bach ke reh maitho imma real bad man\n[01:00.00] Ankh te Cartier, dekho hoje na maadhi\n[01:03.00] Imma gangster shawty\n[01:05.50] Kehnda asla hold me\n[01:08.50] Khade paer chakkla ge baby they know me\n[01:11.50] Bade lokki they owe me\n[01:14.00] Saare vairi below me\n[01:16.50] Kedha takru show me\n[01:19.50] Udh di aa gaddi meri road te khaasi\n[01:22.50] Paya rim glossy, meri look classy\n[01:25.50] Kurta pajama pake lagda saucy\n[01:28.00] Baali bann na bossy\n[01:30.50] Shaolin sikha phirra ghumda Japan\n[01:33.50] Mehnge mere sign, nasha Afghan\n[01:36.50] Bach ke reh maitho imma real bad man\n[01:40.00] Ankh te Cartier, dekho hoje na maadhi\n[01:43.00] Imma gangster shawty\n[01:46.00] Jado kaali khurdi te ohdo gaddi turdi\n[01:49.00] Nigha ni phir tutdi rakane taar judh di\n[01:52.00] Chhaal maar beh java ni ghodi jave udh di\n[01:55.00] Te rabb da shukar kade maya naiyo thudh di\n[01:58.00] Tinn deal-an ho gayi ni phone aunde kal de\n[02:01.00] Beeba thode putthe aa rivaj pindan wal de\n[02:04.00] 12 12 12 12 bore dan\n[02:07.00] Vichhe-i 8 pain, Aujla shikari ae lok saare kehn\n[02:11.00] Jithe tera rehn biba othe Jatt ban\n[02:14.00] Main keha bach ke reh maitho\n[02:17.00] Imma real bad man\n[02:20.00] Ankh te Cartier, dekho hoje na maadhi\n[02:24.00] Imma gangster shawty\n[02:27.00] Imma gangster shawty\n[02:31.00] Imma gangster shawty\n[02:36.00] Imma gangster shawty\n[02:41.00] Imma gangster shawty"}, "as1_straightup": {"plain": "MXRCI on the beat!\nMunde att de shikari, Chaun di khumari\nRakhi thalle gaddi low low, lavish aa Ferrari\nNi main vehli bann da straight up, Na la mittra naal yaari\nEtho udh ja maar uddari, Ni dabb asla ghodh sawari\nAadat maadhi, Oh god!\nPaundi haul, Kehndi main jach jaandi tangg kurti paundi\nGhare asla yaar ni saunda, Naa dhaun ni jhukk di\nMukk di mukk je jind, pith ni dhaundi\nPind bulle lutt di phirr di, Phirre jawani kaliya gaundi\nNi rakhi dabbi vich kaali, Bann da bahuti chhak da thodhi\nBhajj di dikhdi kaali ghodi, Ankhan zyada maaya thodhi\nBukkde di aakad todhi, Munde diya chardhta balliye\nKadh ta phirda radka balliye, Kayi caaran lift karayian\nTe kayi chummdi sadka balliye, Chhati vich jor meri\nTe tor meri vich madka balliye\nJadd main maara lalkare, Engine mare badka\nImpala vich maare chhaala, Ni gaddi de shishe kaale\nChalle sheraan wargi chaalan, De de mainu vi gedha\nIkk naddi kardi caalan, Ve tu dekh mera kade haalan nu\nTere pichhe phirdi saalan ton, Main taalaan ohnu taalaan\nKhanne to set karayi aa, Tahion muchhan khadiyan yaar diyan\nCali to yaar aye si, Tahion ankhan chadiyan yaar diyan\nLokki saale gallan karde, Gallan karde badiyan yaar diyan\nChaal Jatt di desi aa, Par Swiss made ne ghadiyan\nThodha easy gaddi vich sundi Drizzy\nMain hath tere na aava ni, Jatt ber jive aa tisi\nJatt LA jaake loco, Jadd pind jaave jive DC\nKoka jarta jarna hi si, Eh saale karde reh gye rees hi, Honi ki si\nIkk naddi kare phone te phone, Main kehndi home alone\nTu aaja on your own, Oh kehndi\nMunda paise kutte on and on\nMainu dasi ta kaun jo matha tere naal laun, Oh kehndi\nJehda ni kamm risky da, Bonnet te rakhde chobbar\nPeg bana ke whiskey da, Manak da phela gaana\nOhi aa number jatt da, Kaale te main shishe lishkale\nNi chale aa kal rally te, Ta kurte sivale\nEh shaunki pattu baale, Bas girne aale daale ni\nVairi de muh te taale, Main keha jor jihde vich laa le\nMunde att de shikari, chaun di khumari\nRakhi thalle gaddi low low, lavish aa Ferrari\nNi main vehli bann da straight up, Na la mittra naal yaari\nEtho udh ja maar uddari, Ni dabb asla ghodh sawari\nAadat maadhi, Oh god!\nPaundi haul, Kehndi main jach jaandi tangg kurti paundi\nMukk di mukk je jind, pith ni dhaundi\nStraight up! Karan Aujla, Mxrci", "synced": "[00:10.00] MXRCI on the beat!\n[00:13.50] Munde att de shikari, Chaun di khumari\n[00:17.00] Rakhi thalle gaddi low low, lavish aa Ferrari\n[00:21.00] Ni main vehli bann da straight up, Na la mittra naal yaari\n[00:25.50] Etho udh ja maar uddari, Ni dabb asla ghodh sawari\n[00:29.50] Aadat maadhi, Oh god!\n[00:32.00] Paundi haul, Kehndi main jach jaandi tangg kurti paundi\n[00:36.00] Ghare asla yaar ni saunda, Naa dhaun ni jhukk di\n[00:40.00] Mukk di mukk je jind, pith ni dhaundi\n[00:43.50] Pind bulle lutt di phirr di, Phirre jawani kaliya gaundi\n[00:48.00] Ni rakhi dabbi vich kaali, Bann da bahuti chhak da thodhi\n[00:52.50] Bhajj di dikhdi kaali ghodi, Ankhan zyada maaya thodhi\n[00:57.00] Bukkde di aakad todhi, Munde diya chardhta balliye\n[01:01.00] Kadh ta phirda radka balliye, Kayi caaran lift karayian\n[01:05.50] Te kayi chummdi sadka balliye, Chhati vich jor meri\n[01:10.00] Te tor meri vich madka balliye\n[01:13.00] Jadd main maara lalkare, Engine mare badka\n[01:17.00] Impala vich maare chhaala, Ni gaddi de shishe kaale\n[01:21.50] Challe sheraan wargi chaalan, De de mainu vi gedha\n[01:26.00] Ikk naddi kardi caalan, Ve tu dekh mera kade haalan nu\n[01:30.50] Tere pichhe phirdi saalan ton, Main taalaan ohnu taalaan\n[01:35.00] Khanne to set karayi aa, Tahion muchhan khadiyan yaar diyan\n[01:39.50] Cali to yaar aye si, Tahion ankhan chadiyan yaar diyan\n[01:44.00] Lokki saale gallan karde, Gallan karde badiyan yaar diyan\n[01:48.50] Chaal Jatt di desi aa, Par Swiss made ne ghadiyan\n[01:53.00] Thodha easy gaddi vich sundi Drizzy\n[01:56.50] Main hath tere na aava ni, Jatt ber jive aa tisi\n[02:00.50] Jatt LA jaake loco, Jadd pind jaave jive DC\n[02:05.00] Koka jarta jarna hi si, Eh saale karde reh gye rees hi, Honi ki si\n[02:11.00] Ikk naddi kare phone te phone, Main kehndi home alone\n[02:15.50] Tu aaja on your own, Oh kehndi\n[02:19.00] Munda paise kutte on and on\n[02:22.50] Mainu dasi ta kaun jo matha tere naal laun, Oh kehndi\n[02:27.50] Jehda ni kamm risky da, Bonnet te rakhde chobbar\n[02:32.00] Peg bana ke whiskey da, Manak da phela gaana\n[02:36.50] Ohi aa number jatt da, Kaale te main shishe lishkale\n[02:41.00] Ni chale aa kal rally te, Ta kurte sivale\n[02:45.50] Eh shaunki pattu baale, Bas girne aale daale ni\n[02:50.00] Vairi de muh te taale, Main keha jor jihde vich laa le\n[02:54.50] Munde att de shikari, chaun di khumari\n[02:58.50] Rakhi thalle gaddi low low, lavish aa Ferrari\n[03:02.50] Ni main vehli bann da straight up, Na la mittra naal yaari\n[03:07.00] Etho udh ja maar uddari, Ni dabb asla ghodh sawari\n[03:11.50] Aadat maadhi, Oh god!\n[03:15.00] Paundi haul, Kehndi main jach jaandi tangg kurti paundi\n[03:20.00] Mukk di mukk je jind, pith ni dhaundi\n[03:25.00] Straight up! Karan Aujla, Mxrci"}, "as1_rapkilla": {"plain": "25 kille pindd ikk dhon wich killa\nMunda look toh drippy, Jatt desi rap killa\nChakkna stash kado? Phone kare dealer!\nAnkhan javaan laal utton aasmaan neela\n25 kille pindd ikk dhon wich killa\nLook toh drippy, Jatt desi rap killa\nRa-Ra-Rap Killa, Jatt Godzilla\nSohniye skin tone laggdi vanilla\nKadd de aan kande jaane chakkde ni feel-an\nCharche Mohali mera Ludhiana jilaa\nDe-De-De dil aa, Lakk nu naa hilaa\nMittran naal pyaar hoju akh nu na milaa\nJaddh te koke mai pech chadd de ni dhila\nBeeba yaaran di life jive movie aa thriller\n25 kille pindd ikk dhon wich killa\nKhet vaunda 60 te vajje Chamkila\nChakkna stash kado? Phone kare dealer!\n25 kille pindd ikk dhon wich killa\nAzaad for life! Yeah, yeah, yeah!\nWho the fuck? You wanna see Azaad, imma face em all\nLeher laggi payi aa puri wavy ae mahaul\nDasa tainu kal ikk chakk ta si call\nDass ki chahida main puggaun da phiraan bol\nGun smoke naal bane hotbox\nAnkha vich agg utte rahe locks\nSunne Aujle naal, tainu lagge new shit\nKamm saade roj de aa, saanu pind baitheyan nu Bombay aale khojde aa\nKholte aa khajane khole sim-sim-sim\nBaale saau aa bande saale to kehnde sinner\nFake rapper ohnu daso imma rap killa\nHar tha mera le, jithe kamm fasse othe naun mera le\nCheck joz kar jaane tera sohn mera le\nMaitho door khadhi reh, Jatt bahut badi sheh\nVade saale bailiya di todhi addhi le\nMuchh modhi khadhi le, das kith nu jaana tu, gaddi modhi khadhi le\nPata karna ki saade baare aap hi das dinne aa\nKade asla kade ghoor kade hass hi hass dinne aa\nEhna naale mar jaande vair hi\nHor ki khara maal naal chah kaidhi\nHor ki thalle kar bhaidi rang zehri\nHor ki, chahida ni hor kujj duniya machaun leyi\nDuniya hilaun leyi dhun hi bathere aa\nSaade to tagde das saanu kehde aa\nNumber-an de naal saadi age na nu naapi\nAsle da honsla te rabb dinda thaapi\nPadhna Azaad ja scheme na lage\nLikh ke vi de da ta vi honi nayio copy\nMittran da swag mittra da, jilla lainde lainde ikko pind mittra da\nJo kama leya oh khaa leya, jo dekhya oh paa leya\nMittra ne duniya to puch ke ni saah leya\nBheed muhre dil saade chaddar dikhde aa\nPairan thalle mittran de baddal dikhde aa\nPuthe hath naal likha jo sense ban jaave\nJithe paer paava situation tense ban jaave\nBig killa, no filla, tera yaar aa gorilla\nDollar aa udaati laili navi Rich Miller\nJihne OG naal saare vaili ne stiller\nRap scene mittra de modde banne pillar\n25 kille pindd ikk dhon wich killa\nMunda look toh drippy, Jatt desi rap killa\nChakkna stash kado? Phone kare dealer!\nAnkhan javaan laal utton aasmaan neela\n25 kille pindd ikk dhon wich killa\nRa-Ra-Rap Killa, Jatt Godzilla\nAzaad 4L, Karan Aujla, Mxrci", "synced": "[00:13.50] 25 kille pindd ikk dhon wich killa\n[00:16.80] Munda look toh drippy, Jatt desi rap killa\n[00:20.20] Chakkna stash kado? Phone kare dealer!\n[00:23.50] Ankhan javaan laal utton aasmaan neela\n[00:27.00] 25 kille pindd ikk dhon wich killa\n[00:30.20] Look toh drippy, Jatt desi rap killa\n[00:33.80] Ra-Ra-Rap Killa, Jatt Godzilla\n[00:37.20] Sohniye skin tone laggdi vanilla\n[00:40.50] Kadd de aan kande jaane chakkde ni feel-an\n[00:44.00] Charche Mohali mera Ludhiana jilaa\n[00:47.50] De-De-De dil aa, Lakk nu naa hilaa\n[00:51.00] Mittran naal pyaar hoju akh nu na milaa\n[00:54.20] Jaddh te koke mai pech chadd de ni dhila\n[00:57.80] Beeba yaaran di life jive movie aa thriller\n[01:01.00] 25 kille pindd ikk dhon wich killa\n[01:04.50] Khet vaunda 60 te vajje Chamkila\n[01:08.00] Chakkna stash kado? Phone kare dealer!\n[01:11.50] 25 kille pindd ikk dhon wich killa\n[01:14.80] Azaad for life! Yeah, yeah, yeah!\n[01:17.50] Who the fuck? You wanna see Azaad, imma face em all\n[01:21.50] Leher laggi payi aa puri wavy ae mahaul\n[01:24.50] Dasa tainu kal ikk chakk ta si call\n[01:28.00] Dass ki chahida main puggaun da phiraan bol\n[01:31.50] Gun smoke naal bane hotbox\n[01:34.50] Ankha vich agg utte rahe locks\n[01:38.00] Sunne Aujle naal, tainu lagge new shit\n[01:41.50] Kamm saade roj de aa, saanu pind baitheyan nu Bombay aale khojde aa\n[01:46.00] Kholte aa khajane khole sim-sim-sim\n[01:49.50] Baale saau aa bande saale to kehnde sinner\n[01:53.00] Fake rapper ohnu daso imma rap killa\n[01:56.50] Har tha mera le, jithe kamm fasse othe naun mera le\n[02:00.00] Check joz kar jaane tera sohn mera le\n[02:03.50] Maitho door khadhi reh, Jatt bahut badi sheh\n[02:07.00] Vade saale bailiya di todhi addhi le\n[02:10.50] Muchh modhi khadhi le, das kith nu jaana tu, gaddi modhi khadhi le\n[02:15.00] Pata karna ki saade baare aap hi das dinne aa\n[02:18.50] Kade asla kade ghoor kade hass hi hass dinne aa\n[02:22.00] Ehna naale mar jaande vair hi\n[02:25.50] Hor ki khara maal naal chah kaidhi\n[02:29.00] Hor ki thalle kar bhaidi rang zehri\n[02:32.50] Hor ki, chahida ni hor kujj duniya machaun leyi\n[02:36.00] Duniya hilaun leyi dhun hi bathere aa\n[02:39.50] Saade to tagde das saanu kehde aa\n[02:43.00] Number-an de naal saadi age na nu naapi\n[02:46.50] Asle da honsla te rabb dinda thaapi\n[02:50.00] Padhna Azaad ja scheme na lage\n[02:53.50] Likh ke vi de da ta vi honi nayio copy\n[02:57.00] Mittran da swag mittra da, jilla lainde lainde ikko pind mittra da\n[03:02.00] Jo kama leya oh khaa leya, jo dekhya oh paa leya\n[03:06.00] Mittra ne duniya to puch ke ni saah leya\n[03:09.50] Bheed muhre dil saade chaddar dikhde aa\n[03:13.00] Pairan thalle mittran de baddal dikhde aa\n[03:16.50] Puthe hath naal likha jo sense ban jaave\n[03:20.00] Jithe paer paava situation tense ban jaave\n[03:23.50] Big killa, no filla, tera yaar aa gorilla\n[03:27.00] Dollar aa udaati laili navi Rich Miller\n[03:30.50] Jihne OG naal saare vaili ne stiller\n[03:34.00] Rap scene mittra de modde banne pillar\n[03:37.50] 25 kille pindd ikk dhon wich killa\n[03:41.00] Munda look toh drippy, Jatt desi rap killa\n[03:44.50] Chakkna stash kado? Phone kare dealer!\n[03:48.00] Ankhan javaan laal utton aasmaan neela\n[03:51.50] 25 kille pindd ikk dhon wich killa\n[03:55.00] Ra-Ra-Rap Killa, Jatt Godzilla\n[04:00.00] Azaad 4L, Karan Aujla, Mxrci"}, "as1_aujlaszn": {"plain": "Changeyan na change, paapiyan na paapi aa\nJigre ni jaande, jaan hikkan naapiyan\nTu taan paavein goondiyan ni chhaatiyan\nLanghaan je paseete taahiyon maare chaatiyan\nMunde attractive baale nakhro\nYaar hathiyaar jaane naale nakhro\nBaapu si ga ghatt aale daale nakhro\nBebe jigre aali si jihne paale nakhro\nRutbe ucche ne tu jihna nu naap di\nDuniya karu gi gallan chhaddi chhaap di\nNi mere utte laati jihne jaan aapdi\nPith ni laggan deni us baap di\nGede launde machde ne hor jo machaunde\nAujle de gaane rehnde gaunde\nChoti de husn pichhe aunde, agg launde aa\nKaddiye gadde te ho jiye ni shakk ke\nChark langhaune paine langh ke akk ke\nNi aivei kedha langu saala tainu takk ke\nDuniya payi aa dekh keeli Jatt ne\nSoch vi ni sakdi jo jee li Jatt ne\nDekhe ne halaat maadhe really Jatt ne\nNi saadi tutti chhatt paa ke deti neeli chhatt ne\nYaariyan pugaiyan gaiyan pugg sunke\nChaunde lok saanu jug jug sunke\nChache da bullet kade ruk sunke\nBhajj jande vairi dugg-dugg sunke\nAayi Afghano main keha ajj hi tukkri\nHakk da hi khaa ke neet rajji shukri\nDamm na hove ta kiven vajje fukri\nHawa naal gallan jado bhajj nucckri\nNi rehn jionde yaar mere baawa naiyo launde\nIkk phone laawa bhajje aunde, khadhkaunde aa\nJogi aa rakane sapp siro napp la\nLeek khiche vairi dass kado tapp la\nNi bhul ja zamana ohda naam japp la\nJitho langa khaali hon raha nakhro\nKhariyan kara de kera baaha nakhro\nNi mainu modhe tangi dindi aa salaaha nakhro\nPooriya karange jo vi manga honiya aa\nAssi ta ready aa ehna ta sanga honiya aa\nAaye ni mere na jitt janga honiya aa\nDass ke ni aunde ikk peyo de ni hunde\nJihde naal rehnde eh saale ohde ni hunde\nMaaya de hunde na assi moh de ni hunde\nSabar shukar bina ohde ni hunde, naiyo saunde\nMehnta de aadi dand launde\nKarke ni kisse da jataunde\nNaam chato pehr baabe dheonde, ohnu chaunde aa\nBhar ge aa desi yakke aa de jhuuta te\nEhna to chadhayi biba kalle ni hundi\nGaira de sirra toh balle balle ni hundii\nDabban dubban di ta gall hi ni hundi\nLaindi dhaun latt je ni thalle ni hundi\nAujla!\nChangeyan na change, paapiyan na paapi aa\nJigre ni jaande, jaan hikkan naapiyan\nJigre ni jaande, jaan hikkan naapiyan", "synced": "[00:10.00] Changeyan na change, paapiyan na paapi aa\n[00:14.00] Jigre ni jaande, jaan hikkan naapiyan\n[00:17.30] Tu taan paavein goondiyan ni chhaatiyan\n[00:20.10] Langhaan je paseete taahiyon maare chaatiyan\n[00:24.00] Munde attractive baale nakhro\n[00:25.70] Yaar hathiyaar jaane naale nakhro\n[00:28.00] Baapu si ga ghatt aale daale nakhro\n[00:31.00] Bebe jigre aali si jihne paale nakhro\n[00:34.70] Rutbe ucche ne tu jihna nu naap di\n[00:37.20] Duniya karu gi gallan chhaddi chhaap di\n[00:40.20] Ni mere utte laati jihne jaan aapdi\n[00:42.90] Pith ni laggan deni us baap di\n[00:47.30] Gede launde machde ne hor jo machaunde\n[00:50.00] Aujle de gaane rehnde gaunde\n[00:52.80] Choti de husn pichhe aunde, agg launde aa\n[00:56.90] Kaddiye gadde te ho jiye ni shakk ke\n[01:00.70] Chark langhaune paine langh ke akk ke\n[01:02.40] Ni aivei kedha langu saala tainu takk ke\n[01:08.80] Duniya payi aa dekh keeli Jatt ne\n[01:11.00] Soch vi ni sakdi jo jee li Jatt ne\n[01:13.50] Dekhe ne halaat maadhe really Jatt ne\n[01:15.90] Ni saadi tutti chhatt paa ke deti neeli chhatt ne\n[01:19.50] Yaariyan pugaiyan gaiyan pugg sunke\n[01:22.40] Chaunde lok saanu jug jug sunke\n[01:25.20] Chache da bullet kade ruk sunke\n[01:28.20] Bhajj jande vairi dugg-dugg sunke\n[01:31.60] Aayi Afghano main keha ajj hi tukkri\n[01:33.60] Hakk da hi khaa ke neet rajji shukri\n[01:37.10] Damm na hove ta kiven vajje fukri\n[01:39.90] Hawa naal gallan jado bhajj nucckri\n[01:43.40] Ni rehn jionde yaar mere baawa naiyo launde\n[01:46.20] Ikk phone laawa bhajje aunde, khadhkaunde aa\n[01:54.00] Jogi aa rakane sapp siro napp la\n[01:56.10] Leek khiche vairi dass kado tapp la\n[01:58.80] Ni bhul ja zamana ohda naam japp la\n[02:04.80] Jitho langa khaali hon raha nakhro\n[02:11.30] Khariyan kara de kera baaha nakhro\n[02:13.80] Ni mainu modhe tangi dindi aa salaaha nakhro\n[02:16.00] Pooriya karange jo vi manga honiya aa\n[02:18.80] Assi ta ready aa ehna ta sanga honiya aa\n[02:21.50] Aaye ni mere na jitt janga honiya aa\n[02:27.60] Dass ke ni aunde ikk peyo de ni hunde\n[02:30.70] Jihde naal rehnde eh saale ohde ni hunde\n[02:33.20] Maaya de hunde na assi moh de ni hunde\n[02:35.80] Sabar shukar bina ohde ni hunde, naiyo saunde\n[02:40.00] Mehnta de aadi dand launde\n[02:43.10] Karke ni kisse da jataunde\n[02:45.80] Naam chato pehr baabe dheonde, ohnu chaunde aa\n[02:52.90] Bhar ge aa desi yakke aa de jhuuta te\n[03:01.20] Ehna to chadhayi biba kalle ni hundi\n[03:04.00] Gaira de sirra toh balle balle ni hundii\n[03:06.80] Dabban dubban di ta gall hi ni hundi\n[03:09.70] Laindi dhaun latt je ni thalle ni hundi\n[03:14.00] Aujla!\n[03:19.00] Changeyan na change, paapiyan na paapi aa\n[03:23.00] Jigre ni jaande, jaan hikkan naapiyan\n[03:28.00] Jigre ni jaande, jaan hikkan naapiyan"}};

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

    // App Version & Update Check Endpoint
    if (url.pathname === '/api/version') {
      return new Response(JSON.stringify({
        status: 'success',
        version: 90.0,
        version_name: 'v90.0',
        apk_url: 'https://guru4code.online/playify/Playify.apk',
        title: 'Playify v90.0 Update 🔥',
        message: 'Karan Aujla AUJLA SZN 1 (Full Tracks + 100% Synced Studio Lyrics) & latest Punjabi songs are now live!',
        release_date: '2026-09-26'
      }), { headers: corsHeaders });
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
