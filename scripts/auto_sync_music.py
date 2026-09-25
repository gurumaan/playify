#!/usr/bin/env python3
"""
Playify Automated Punjabi & Trending Music Sync Engine
Runs on a scheduled GitHub Actions Cron or manually to pull brand new Punjabi releases,
decrypt high-bitrate 320kbps streams, fetch lyrics, and update charts.json & charts_data.js.
"""

import json
import os
import re
import urllib.request
import urllib.parse
from datetime import datetime

class PureDES:
    def __init__(self):
        self.IP = [58,50,42,34,26,18,10,2,60,52,44,36,28,20,12,4,62,54,46,38,30,22,14,6,64,56,48,40,32,24,16,8,57,49,41,33,25,17,9,1,59,51,43,35,27,19,11,3,61,53,45,37,29,21,13,5,63,55,47,39,31,23,15,7]
        self.FP = [40,8,48,16,56,24,64,32,39,7,47,15,55,23,63,31,38,6,46,14,54,22,62,30,37,5,45,13,53,21,61,29,36,4,44,12,52,20,60,28,35,3,43,11,51,19,59,27,34,2,42,10,50,18,58,26,33,1,41,9,49,17,57,25]
        self.PC1 = [57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4]
        self.PC2 = [14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32]
        self.SHIFTS = [1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1]
        self.E = [32,1,2,3,4,5,4,5,6,7,8,9,8,9,10,11,12,13,12,13,14,15,16,17,16,17,18,19,20,21,20,21,22,23,24,25,24,25,26,27,28,29,28,29,30,31,32,1]
        self.P = [16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25]
        self.S = [
            [14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7,0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8,4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0,15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13],
            [15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10,3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5,0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15,13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9],
            [10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8,13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1,13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7,1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12],
            [7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15,13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9,10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4,3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14],
            [2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9,14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6,4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14,11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3],
            [12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11,10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8,9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6,4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13],
            [4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1,13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6,1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2,6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12],
            [13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7,1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2,7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8,2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]
        ]

    def _permute(self, inp, table):
        return [inp[table[i] - 1] for i in range(len(table))]

    def _bytes_to_bits(self, b):
        bits = []
        for byte in b:
            for j in range(7, -1, -1):
                bits.append((byte >> j) & 1)
        return bits

    def _bits_to_bytes(self, bits):
        b = bytearray()
        for i in range(0, len(bits), 8):
            val = 0
            for j in range(8):
                val = (val << 1) | bits[i + j]
            b.append(val)
        return bytes(b)

    def _generate_subkeys(self, key_bytes):
        key_bits = self._bytes_to_bits(key_bytes)
        pc1_bits = self._permute(key_bits, self.PC1)
        c = pc1_bits[:28]
        d = pc1_bits[28:56]
        subkeys = []
        for r in range(16):
            shift = self.SHIFTS[r]
            c = c[shift:] + c[:shift]
            d = d[shift:] + d[:shift]
            subkeys.append(self._permute(c + d, self.PC2))
        return subkeys

    def _feistel(self, r_bits, subkey):
        e_bits = self._permute(r_bits, self.E)
        xor_bits = [e_bits[i] ^ subkey[i] for i in range(48)]
        s_out = []
        for i in range(8):
            block = xor_bits[i * 6:(i + 1) * 6]
            row = (block[0] << 1) | block[5]
            col = (block[1] << 3) | (block[2] << 2) | (block[3] << 1) | block[4]
            val = self.S[i][row * 16 + col]
            for j in range(3, -1, -1):
                s_out.append((val >> j) & 1)
        return self._permute(s_out, self.P)

    def _decrypt_block(self, block_bytes, subkeys):
        bits = self._bytes_to_bits(block_bytes)
        perm = self._permute(bits, self.IP)
        left = perm[:32]
        right = perm[32:64]
        for r in range(15, -1, -1):
            next_left = right
            f = self._feistel(right, subkeys[r])
            next_right = [left[i] ^ f[i] for i in range(32)]
            left = next_left
            right = next_right
        return self._bits_to_bytes(self._permute(right + left, self.FP))

    def decrypt_ecb(self, cipher_bytes, key_bytes):
        subkeys = self._generate_subkeys(key_bytes)
        decrypted = bytearray()
        for i in range(0, len(cipher_bytes), 8):
            block = cipher_bytes[i:i + 8]
            decrypted.extend(self._decrypt_block(block, subkeys))
        if decrypted:
            pad_len = decrypted[-1]
            if 1 <= pad_len <= 8:
                decrypted = decrypted[:-pad_len]
        return bytes(decrypted)

des = PureDES()
DES_KEY = b"38346591"

def decrypt_stream_url(enc_str):
    if not enc_str:
        return None
    try:
        import base64
        raw = base64.b64decode(enc_str)
        dec = des.decrypt_ecb(raw, DES_KEY)
        url = dec.decode('utf-8', errors='ignore')
        return url.replace('_96.mp4', '_320.mp4').replace('_160.mp4', '_320.mp4')
    except Exception:
        return None

def fetch_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def main():
    print(f"[{datetime.now().isoformat()}] Starting Playify Punjabi & Trending Auto-Sync...")
    
    # 1. Fetch JioSaavn 'Trending Punjabi' Playlist (ID: 1265052337)
    playlist_url = "https://www.jiosaavn.com/api.php?__call=playlist.getDetails&_format=json&_marker=0&api_version=4&ctx=web6dot0&cc=in&listid=1265052337"
    pdata = fetch_json(playlist_url)
    
    new_punjabi_songs = []
    if pdata and 'list' in pdata:
        for s in pdata['list']:
            enc = s.get('more_info', {}).get('encrypted_media_url')
            stream = decrypt_stream_url(enc)
            if not stream:
                continue
            
            title = s.get('title', '').replace('&amp;', '&').replace('&#039;', "'").replace('&quot;', '"')
            artist = s.get('more_info', {}).get('artistMap', {}).get('primary_artists', [{}])[0].get('name') or s.get('subtitle', 'Punjabi Artist')
            album = s.get('more_info', {}).get('album', 'Single').replace('&amp;', '&').replace('&#039;', "'")
            
            song_obj = {
                "id": s.get('id'),
                "title": title,
                "artist": artist,
                "album": album,
                "image": s.get('image', '').replace('150x150', '500x500'),
                "duration": int(s.get('more_info', {}).get('duration') or 180),
                "stream_url": stream,
                "language": "punjabi",
                "year": s.get('year', '2026')
            }
            new_punjabi_songs.append(song_obj)
            
    print(f"Fetched {len(new_punjabi_songs)} live Punjabi tracks from JioSaavn.")
    
    # 2. Update static/charts.json and static/charts_data.js
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    charts_path = os.path.join(base_dir, 'static', 'charts.json')
    if not os.path.exists(charts_path):
        charts_path = 'static/charts.json'
        
    with open(charts_path, 'r', encoding='utf-8') as f:
        charts = json.load(f)
        
    if 'sections' not in charts:
        charts['sections'] = {}
        
    current_punjabi = charts['sections'].get('trending_punjabi', [])
    seen_ids = set()
    
    # Keep pinned AUJLA SZN 1 and top manual tracks first
    merged_punjabi = []
    for s in current_punjabi:
        if s.get('id', '').startswith('as1_') or 'aujla' in s.get('album', '').lower():
            merged_punjabi.append(s)
            seen_ids.add(s.get('id'))
            
    # Add newly fetched live Punjabi tracks
    for s in new_punjabi_songs:
        if s['id'] not in seen_ids:
            merged_punjabi.append(s)
            seen_ids.add(s['id'])
            
    # Append the rest of existing
    for s in current_punjabi:
        if s.get('id') not in seen_ids:
            merged_punjabi.append(s)
            seen_ids.add(s.get('id'))
            
    charts['sections']['trending_punjabi'] = merged_punjabi
    charts['trending_punjabi'] = merged_punjabi
    
    with open(charts_path, 'w', encoding='utf-8') as f:
        json.dump(charts, f, indent=2, ensure_ascii=False)
        
    charts_js_path = charts_path.replace('charts.json', 'charts_data.js')
    with open(charts_js_path, 'w', encoding='utf-8') as f:
        f.write('window.PLAYIFY_CHARTS = ' + json.dumps(charts, ensure_ascii=False) + ';\nwindow.sp_charts_data = window.PLAYIFY_CHARTS;\n')
        
    print(f"Successfully updated {charts_path} and {charts_js_path} with {len(merged_punjabi)} total Punjabi tracks.")

if __name__ == '__main__':
    main()
