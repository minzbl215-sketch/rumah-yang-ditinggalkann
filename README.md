# Rumah yang Ditinggalkan

Game horror 2D berbasis web (HTML/CSS/JS murni, tanpa install apa-apa) yang bisa dimainkan langsung di browser HP. Bab 1 sudah lengkap: eksplorasi + dialog + 1 jumpscare scripted.

## Cara main lokal
Buka `index.html` langsung di browser HP/laptop. Karena ini murni file statis, gak butuh server — double click aja atau buka lewat file manager.

## Cara upload ke GitHub Pages (gratis, online)

1. Buat repository baru di GitHub (bisa lewat app GitHub di HP atau github.com), misal namanya `rumah-yang-ditinggalkan`.
2. Upload 4 file ini ke root repo: `index.html`, `style.css`, `story.js`, `game.js`.
   - Lewat browser/app: buka repo → "Add file" → "Upload files" → pilih ke-4 file → Commit.
3. Masuk ke **Settings** repo → **Pages** (di sidebar kiri) → bagian "Build and deployment" → Source pilih **Deploy from a branch** → Branch pilih `main` / folder `/ (root)` → Save.
4. Tunggu 1-2 menit, GitHub kasih link kayak:
   `https://username-lu.github.io/rumah-yang-ditinggalkan/`
5. Buka link itu di HP — bisa langsung dimainkan, dan bisa lu share ke orang lain juga.

## Cara nambah cerita / bab baru

Semua isi cerita ada di **`story.js`** — file `game.js` (mesin game-nya) gak perlu diutak-atik kecuali mau nambah fitur baru.

Untuk nambah scene baru:
```js
{
  id: "nama_scene_baru",
  label: "Nama yang muncul di HUD",
  playerStart: { x: 0.5, y: 0.6 },   // posisi awal, 0..1 relatif layar
  bg(ctx, w, h) { /* gambar background pakai canvas API */ },
  hotspots: [ /* titik interaksi, lihat contoh di scene lain */ ]
}
```

Setiap **hotspot** bisa:
- Munculin dialog (`lines`)
- Ngunci diri sampai flag tertentu ke-set (`requiresFlag` + `lockedLines`)
- Nge-set flag cerita setelah selesai (`setFlag`)
- Pindah ke scene lain (`goto: "id_scene"`) atau tamat (`goto: "END"`)
- Trigger jumpscare (`jumpscare: "id_jumpscare"`, definisinya di `STORY.jumpscares`)

Struktur ini sengaja dibikin modular biar lu bisa nambah bab 2, 3, dst tanpa nulis ulang mesin game-nya.

## Kontrol
- **Tap di layar** → karakter jalan ke titik itu.
- **Tap di dekat objek/NPC bercahaya** → muncul teks "ketuk untuk berinteraksi", tap lagi buat interaksi.
- **Tap saat dialog** → percepat teks / lanjut ke baris berikutnya.

## Catatan teknis
- Semua visual digambar pakai Canvas API (bentuk geometris + gradient), jadi gak butuh file gambar sama sekali — ringan dan gampang di-tweak warnanya.
- Efek jumpscare pakai flash warna + screen shake (CSS) + suara sintetis (Web Audio API, jadi gak butuh file audio) + getar HP (Vibration API, kalau didukung browser).
- Font pakai Google Fonts (`Special Elite` buat judul/nama, `Crimson Text` buat body) — butuh koneksi internet pas load pertama kali.
