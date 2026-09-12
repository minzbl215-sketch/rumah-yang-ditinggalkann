/* ============================================================
   STORY.JS
   Semua isi cerita ada di sini. Kalau mau nambah bab / scene baru,
   cukup tambah objek baru ke STORY.scenes — gak perlu sentuh game.js.

   Struktur satu scene:
   {
     id: "nama_unik",
     label: "Nama yang muncul di HUD",
     bg(ctx, w, h): fungsi gambar background (dinding, lantai, furnitur)
     playerStart: {x, y}            // posisi awal pemain (0..1 relatif layar)
     hotspots: [ ... ]              // titik yang bisa diinteraksi
   }

   Struktur satu hotspot:
   {
     id: "nama_unik",
     x, y, r,                       // posisi (0..1 relatif layar) & radius interaksi
     draw(ctx, x, y, t): opsional, gambar ikon hotspot
     requiresFlag: "nama_flag"      // null kalau selalu bisa diakses
     lockedLines: [...]             // dialog kalau requiresFlag belum terpenuhi
     lines: [{ name, text }]        // dialog saat berhasil interaksi
     setFlag: "nama_flag"           // flag yang diset setelah dialog selesai
     jumpscare: "nama_jumpscare"    // trigger jumpscare setelah dialog (opsional)
     goto: "id_scene_lain"          // pindah scene setelah dialog (opsional)
     oneTime: true/false            // hotspot hilang/nonaktif setelah dipakai
   }
============================================================ */

const STORY = {

  startScene: "ruang_tamu",

  scenes: [

    // ---------------------------------------------------------
    {
      id: "ruang_tamu",
      label: "Ruang Tamu",
      playerStart: { x: 0.5, y: 0.62 },
      bg(ctx, w, h) {
        ctx.fillStyle = "#14100c";
        ctx.fillRect(0, 0, w, h);
        // lantai
        ctx.fillStyle = "#1c1712";
        ctx.fillRect(0, h * 0.55, w, h * 0.45);
        // karpet usang
        ctx.fillStyle = "#2a1414";
        ctx.fillRect(w * 0.25, h * 0.6, w * 0.5, h * 0.28);
        // sofa tua (kiri)
        ctx.fillStyle = "#20191b";
        ctx.fillRect(w * 0.06, h * 0.5, w * 0.22, h * 0.14);
        // pintu depan (atas tengah)
        ctx.fillStyle = "#3a2a1c";
        ctx.fillRect(w * 0.42, h * 0.12, w * 0.16, h * 0.32);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(w * 0.42, h * 0.12, w * 0.16, h * 0.32);
        // jam dinding berhenti di 00:00 (kanan atas)
        ctx.beginPath();
        ctx.arc(w * 0.82, h * 0.22, w * 0.045, 0, Math.PI * 2);
        ctx.strokeStyle = "#5a4a30";
        ctx.lineWidth = 2;
        ctx.stroke();
      },
      hotspots: [
        {
          id: "surat",
          x: 0.5, y: 0.68, r: 0.07,
          requiresFlag: null,
          lines: [
            { name: "", text: "Ada secarik kertas tergeletak di atas karpet, tulisannya sudah pudar." },
            { name: "kertas", text: "\"...jangan nyalakan lampu di lorong. dia suka cahaya.\"" },
            { name: "", text: "Tanganku dingin. Tapi aku tetap menyimpannya." },
          ],
          setFlag: "baca_surat",
          oneTime: true,
        },
        {
          id: "pintu_depan",
          x: 0.5, y: 0.28, r: 0.09,
          requiresFlag: null,
          lockedLines: [
            { name: "", text: "Kunci diputar, tapi pintu tidak bergerak sedikit pun." },
            { name: "", text: "Seperti ada yang menahannya dari luar." },
          ],
          lines: [
            { name: "", text: "Aku sudah tahu ini akan sia-sia. Tapi tetap kucoba." },
          ],
        },
        {
          id: "lorong_masuk",
          x: 0.86, y: 0.6, r: 0.09,
          requiresFlag: "baca_surat",
          lockedLines: [
            { name: "", text: "Lorong itu gelap sekali. Aku belum berani ke sana." },
          ],
          lines: [
            { name: "", text: "Dengan surat itu di tangan, aku melangkah ke lorong." },
          ],
          goto: "lorong",
        },
      ],
    },

    // ---------------------------------------------------------
    {
      id: "lorong",
      label: "Lorong",
      playerStart: { x: 0.12, y: 0.6 },
      bg(ctx, w, h) {
        ctx.fillStyle = "#0c0a09";
        ctx.fillRect(0, 0, w, h);
        // dinding lorong panjang
        ctx.fillStyle = "#161210";
        ctx.fillRect(0, h * 0.35, w, h * 0.3);
        // bingkai foto retak di dinding
        ctx.strokeStyle = "#3a3028";
        ctx.lineWidth = 3;
        ctx.strokeRect(w * 0.6, h * 0.4, w * 0.12, h * 0.16);
        // sosok anak kecil (samar, hanya siluet)
        ctx.fillStyle = "rgba(159,180,176,0.5)";
        ctx.beginPath();
        ctx.arc(w * 0.7, h * 0.56, w * 0.02, 0, Math.PI * 2); // kepala
        ctx.fill();
        ctx.fillRect(w * 0.685, h * 0.58, w * 0.03, h * 0.09); // badan
      },
      hotspots: [
        {
          id: "sosok_anak",
          x: 0.7, y: 0.6, r: 0.09,
          requiresFlag: null,
          lines: [
            { name: "???", text: "...kamu bukan dia." },
            { name: "", text: "Sosok itu menoleh perlahan. Wajahnya tidak lengkap." },
            { name: "???", text: "dia janji akan kembali. tapi dia bohong. semua orang di sini bohong." },
            { name: "", text: "Sebelum aku sempat bicara, sosok itu menghilang ke dinding." },
          ],
          setFlag: "temu_anak",
          oneTime: true,
        },
        {
          id: "pintu_kamar",
          x: 0.88, y: 0.58, r: 0.09,
          requiresFlag: "temu_anak",
          lockedLines: [
            { name: "", text: "Aku belum siap membuka pintu itu." },
          ],
          lines: [
            { name: "", text: "Pintu kamar berderit saat kudorong perlahan." },
          ],
          goto: "kamar",
        },
      ],
    },

    // ---------------------------------------------------------
    {
      id: "kamar",
      label: "Kamar Belakang",
      playerStart: { x: 0.5, y: 0.68 },
      bg(ctx, w, h) {
        ctx.fillStyle = "#100c0a";
        ctx.fillRect(0, 0, w, h);
        // ranjang kecil
        ctx.fillStyle = "#241c18";
        ctx.fillRect(w * 0.08, h * 0.42, w * 0.28, h * 0.14);
        // cermin retak di dinding kanan
        ctx.fillStyle = "#1a2426";
        ctx.fillRect(w * 0.68, h * 0.3, w * 0.18, h * 0.24);
        ctx.strokeStyle = "#0a0a0a";
        ctx.beginPath();
        ctx.moveTo(w * 0.7, h * 0.32); ctx.lineTo(w * 0.82, h * 0.5);
        ctx.moveTo(w * 0.8, h * 0.31); ctx.lineTo(w * 0.7, h * 0.5);
        ctx.stroke();
        // meja kecil dengan buku harian
        ctx.fillStyle = "#2a2018";
        ctx.fillRect(w * 0.42, h * 0.58, w * 0.16, h * 0.1);
      },
      hotspots: [
        {
          id: "buku_harian",
          x: 0.5, y: 0.6, r: 0.08,
          requiresFlag: null,
          lines: [
            { name: "buku harian", text: "\"hari ke-14. dia berdiri di depan cermin lagi tadi malam.\"" },
            { name: "buku harian", text: "\"aku tidak berani menoleh. tapi aku dengar dia memanggil namaku.\"" },
            { name: "", text: "Halaman terakhir robek. Aku mendongak — cermin di depanku sedikit bergetar." },
          ],
          setFlag: "baca_diary",
          jumpscare: "cermin",
          oneTime: true,
        },
        {
          id: "cermin",
          x: 0.77, y: 0.42, r: 0.09,
          requiresFlag: "baca_diary",
          lockedLines: [
            { name: "", text: "Aku belum berani mendekati cermin itu." },
          ],
          lines: [
            { name: "", text: "Pantulanku di cermin terlambat satu detik untuk bergerak." },
            { name: "", text: "Di baliknya, sebuah pintu menuju bawah tanah kini terbuka." },
          ],
          goto: "END",
        },
      ],
    },

  ],

  // -----------------------------------------------------------
  // Definisi jumpscare. Ditrigger via hotspot.jumpscare = "id_ini"
  // -----------------------------------------------------------
  jumpscares: {
    cermin: {
      // digambar penuh layar selama durasi tertentu
      duration: 550, // ms
      draw(ctx, w, h, t) {
        // flash merah-putih + wajah kasar di cermin
        ctx.fillStyle = t < 0.5 ? "#ffffff" : "#3a0000";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#000";
        // mata
        ctx.beginPath();
        ctx.ellipse(w * 0.42, h * 0.42, w * 0.05, h * 0.03, 0, 0, Math.PI * 2);
        ctx.ellipse(w * 0.58, h * 0.42, w * 0.05, h * 0.03, 0, 0, Math.PI * 2);
        ctx.fill();
        // mulut
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.58, w * 0.09, h * 0.06, 0, 0, Math.PI * 2);
        ctx.fill();
      },
      vibrate: [40, 30, 120],
    },
  },
};
