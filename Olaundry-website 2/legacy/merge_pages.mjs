// LEGACY — script untuk menggabungkan file parcial lama. Edit index.html langsung untuk produksi.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function read(name) {
  return fs.readFileSync(path.join(__dirname, name), 'utf8');
}

function extractStyle(html) {
  const m = html.match(/<style>([\s\S]*?)<\/style>/);
  return m ? m[1].trim() : '';
}

function extractBody(html) {
  const m = html.match(/<body>([\s\S]*)<\/body>/);
  return m ? m[1].trim() : '';
}

const hero = read('1.olaundy-hero.html');
const proses = read('2.olaundry-prosesproduksi.html');
const harga = read('3.section-harga.html');

let heroBody = extractBody(hero);
heroBody = heroBody.replace(/<!-- More sections[\s\S]*?-->/, '');
heroBody = heroBody.replace(/<script src="https:\/\/unpkg.com\/aos@[^"]*"><\/script>\s*/g, '');
heroBody = heroBody.replace(/<script>\s*AOS\.init[\s\S]*?<\/script>\s*/g, '');

const prosesBody = extractBody(proses);
const hargaBody = extractBody(harga);

const prosesSection = prosesBody.match(/<!-- ══ SECTION: PROSES[\s\S]*?<\/section>/)[0]
  .replace('<section class="proses">', '<section class="proses" id="proses">');

const hargaSection = hargaBody.match(/<!-- ══ SECTION: HARGA[\s\S]*?<\/section>/)[0]
  .replace('<section class="harga">', '<section class="harga" id="harga">');

const checkout = hargaBody.match(/<!-- ══ CHECKOUT STICKY BAR[\s\S]*?(?=<script>)/)[0].trim();

const hargaScripts = [...hargaBody.matchAll(/<script>\s*\(function[\s\S]*?<\/script>/g)].map(m => m[0]).join('\n');

const pulseCss = `
    /* Pulse — tombol WhatsApp */
    @keyframes pulse-wa {
      0%, 100% { box-shadow: 0 4px 14px rgba(37,211,102,0.35); }
      50%       { box-shadow: 0 4px 24px rgba(37,211,102,0.6); }
    }
    .navbar-cta { animation: pulse-wa 2.5s ease-in-out infinite; }
    .checkout-btn:not(:disabled) { animation: pulse-wa 2.5s ease-in-out infinite; }
`;

const extraCss = `
    /* Gabungan: padding bawah untuk sticky checkout */
    body { padding-bottom: 76px; }
    @media (max-width: 600px) { body { padding-bottom: 84px; } }
`;

const fontsUrl = 'https://fonts.googleapis.com/css2?family=Kaushan+Script&family=Ms+Madi&family=Poppins:wght@300;400;500;600;700;800&display=swap';

const merged = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>O'Laundry — Serve Wholeheartedly</title>
  <meta name="description" content="Laundry profesional di Pontianak. Cuci kiloan, setrika, bedcover. Garansi cuci ulang gratis. Jl. Purnama 2 No. 78.">
  <meta name="keywords" content="Laundry Pontianak, Laundry Kiloan, Laundry Satuan, Cuci kering setrika, binatu">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontsUrl}" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
  <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css">
  <style>
${extractStyle(hero)}

${extractStyle(proses)}

${extractStyle(harga)}

${pulseCss}

${extraCss}
  </style>
</head>
<body>

${heroBody}

${prosesSection}

${hargaSection}

${checkout}

<script src="https://unpkg.com/aos@next/dist/aos.js"></script>
<script>
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: false,
    offset: 80
  });
</script>
${hargaScripts}

</body>
</html>
`;

const outPath = path.join(__dirname, '..', 'index.html'); // legacy: regenerates main site
fs.writeFileSync(outPath, merged, 'utf8');
console.log('Written:', outPath);
console.log('Lines:', merged.split('\n').length);
console.log('Size:', merged.length);
