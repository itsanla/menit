/**
 * Menit News Bot — Auto-generate berita dari RSS feed Indonesia
 *
 * Alur:
 * 1. Crawl RSS feed dari portal berita Indonesia
 * 2. Filter berita trending/hot dalam window 4 jam terakhir
 * 3. Ambil full content via Jina Reader (clean markdown)
 * 4. Rewrite artikel via Groq AI (llama-3.3-70b-versatile)
 * 5. Simpan sebagai file MDX di folder blog/
 *
 * Environment variables:
 *   GROQ_API_KEY — API key untuk Groq (wajib)
 *
 * Test lokal:
 *   cd scripts && npm install rss-parser axios groq-sdk
 *   GROQ_API_KEY="gsk_xxx" node generate-news.js
 */

const RSSParser = require('rss-parser');
const axios = require('axios');
const { Groq } = require('groq-sdk');
const fs = require('fs');
const path = require('path');

// ============================================================
// Konfigurasi
// ============================================================

const BLOG_DIR = path.join(__dirname, '..', 'blog');
const HISTORY_FILE = path.join(__dirname, 'history.json');
const MIN_ARTICLES = 4;
const MAX_ARTICLES = 6;
const HOURS_WINDOW = 4; // Sedikit lebih lebar dari cron 3 jam untuk overlap
const JINA_PREFIX = 'https://r.jina.ai/';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const MAX_TOKENS = 1024;
const TEMPERATURE = 0.7;
const MAX_HISTORY = 500; // Batasi jumlah entry di history agar file tidak terlalu besar

// Portal RSS feeds — sumber berita
const PORTALS = [
  {
    name: 'Detik',
    feeds: [
      'https://news.detik.com/berita/rss',          // Detik News (nasional/berita utama)
      'https://inet.detik.com/rss',                 // Detik Inet (teknologi, gadget, internet)
      'https://finance.detik.com/rss',              // Detik Finance (ekonomi)
      'https://hot.detik.com/rss',                  // Detik Hot (entertainment)
      'https://sport.detik.com/rss'                 // Detik Sport (olahraga)
    ],
  },
  {
    name: 'Tribunnews',
    feeds: [
      'https://www.tribunnews.com/rss',             // Tribunnews utama (semua)
    ],
  },
  {
    name: 'Liputan6',
    feeds: [
      'https://feed.liputan6.com/rss/news',         // Liputan6 News utama
      'https://feed.liputan6.com/rss/tekno'         // Teknologi
    ],
  },
  {
    name: 'CNN Indonesia',
    feeds: [
      'https://www.cnnindonesia.com/nasional/rss',  // Nasional
      'https://www.cnnindonesia.com/ekonomi/rss',   // Ekonomi
      'https://www.cnnindonesia.com/teknologi/rss'  // Teknologi
    ],
  },
  {
    name: 'Tempo',
    feeds: [
      'https://rss.tempo.co/nasional',              // Nasional
    ],
  }
];

// Kata kunci prioritas — skor lebih tinggi = lebih "hot"
const HOT_KEYWORDS = [
  'viral',
  'breaking',
  'hot',
  'terkini',
  'gempar',
  'heboh',
  'darurat',
  'resmi',
  'pertama',
  'terbesar',
  'terbaru',
  'kontrovers',
  'skandal',
  'ditangkap',
  'meninggal',
  'bencana',
  'ai',
  'teknologi',
  'samsung',
  'apple',
  'google',
  'microsoft',
  'presiden',
  'menteri',
  'dpr',
  'korupsi',
  'ekonomi',
  'rupiah',
];

// Mapping kategori berdasarkan kata kunci di konten
const CATEGORY_MAP = [
  {
    tags: ['teknologi', 'digital'],
    keywords: [
      'teknologi', 'ai', 'robot', 'samsung', 'apple', 'google',
      'microsoft', 'startup', 'gadget', 'smartphone', 'software',
      'hardware', 'internet', 'cyber', 'digital', 'coding',
    ],
  },
  {
    tags: ['ekonomi', 'bisnis'],
    keywords: [
      'ekonomi', 'rupiah', 'saham', 'investasi', 'bisnis', 'bank',
      'inflasi', 'pajak', 'ekspor', 'impor', 'tarif', 'keuangan',
      'kripto', 'emas',
    ],
  },
  {
    tags: ['politik', 'pemerintahan'],
    keywords: [
      'politik', 'presiden', 'menteri', 'dpr', 'partai', 'pemilu',
      'koalisi', 'oposisi', 'kabinet', 'pemerintah', 'undang-undang',
    ],
  },
  {
    tags: ['hukum', 'kriminal'],
    keywords: [
      'hukum', 'polisi', 'ditangkap', 'korupsi', 'pengadilan',
      'jaksa', 'tersangka', 'terdakwa', 'pidana', 'kriminal', 'narkoba',
    ],
  },
  {
    tags: ['internasional', 'dunia'],
    keywords: [
      'internasional', 'dunia', 'global', 'amerika', 'china', 'rusia',
      'eropa', 'jepang', 'perang', 'pbb', 'nato', 'trump', 'putin',
    ],
  },
  {
    tags: ['pendidikan', 'sosial'],
    keywords: [
      'pendidikan', 'sekolah', 'universitas', 'kampus', 'guru',
      'siswa', 'mahasiswa', 'kurikulum', 'beasiswa',
    ],
  },
  {
    tags: ['olahraga', 'sport'],
    keywords: [
      'sepak', 'bola', 'liga', 'timnas', 'olimpiade', 'atlet',
      'badminton', 'basket', 'motogp', 'f1',
    ],
  },
];

// ============================================================
// Helper Functions
// ============================================================

/** Normalisasi teks untuk perbandingan similarity */
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Hitung similarity antara 2 string (Jaccard similarity) */
function textSimilarity(text1, text2) {
  const words1 = new Set(normalizeText(text1).split(' '));
  const words2 = new Set(normalizeText(text2).split(' '));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/** Cek apakah judul terlalu mirip dengan judul yang sudah ada */
function isSimilarToExisting(title, existingTitles, threshold = 0.6) {
  const normalized = normalizeText(title);
  
  for (const existing of existingTitles) {
    const similarity = textSimilarity(title, existing);
    if (similarity >= threshold) {
      return true;
    }
  }
  
  return false;
}

/** Buat slug URL-friendly dari teks */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

/** Cek apakah file artikel sudah ada di blog/ */
function articleExists(slug) {
  return fs.existsSync(path.join(BLOG_DIR, `${slug}.mdx`));
}

/** Hitung skor "hotness" berdasarkan kata kunci di judul */
function calcHotScore(title) {
  const lower = title.toLowerCase();
  let score = 0;
  for (const kw of HOT_KEYWORDS) {
    if (lower.includes(kw)) score += 2;
  }
  return score;
}

/** Deteksi tags otomatis dari judul + konten */
function detectTags(title, content = '') {
  const text = `${title} ${content}`.toLowerCase();
  const matched = [];

  for (const cat of CATEGORY_MAP) {
    const hits = cat.keywords.filter((kw) => text.includes(kw)).length;
    if (hits >= 1) {
      matched.push({ tags: cat.tags, hits });
    }
  }

  // Sort berdasarkan relevansi, ambil top 2 kategori
  matched.sort((a, b) => b.hits - a.hits);
  const tags = matched.slice(0, 2).flatMap((m) => m.tags);

  // Fallback jika tidak cocok kategori manapun
  if (tags.length === 0) return ['berita', 'terkini'];

  return [...new Set(tags)].slice(0, 4);
}

/** Tanggal hari ini dalam format YYYY-MM-DD (WIB) */
function todayDate() {
  const now = new Date(Date.now() + 7 * 60 * 60 * 1000); // UTC+7
  return now.toISOString().split('T')[0];
}

/** Waktu sekarang dalam format HH:MM (WIB) */
function currentTime() {
  const now = new Date(Date.now() + 7 * 60 * 60 * 1000); // UTC+7
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/** Delay helper untuk rate limiting */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// History — Dedup cross-session
// ============================================================

/** Load history dari file JSON */
function loadHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
      if (Array.isArray(data)) {
        console.log(`📚 History loaded: ${data.length} entries`);
        return data;
      }
    }
  } catch (err) {
    console.warn(`⚠️  Gagal load history: ${err.message}`);
  }
  return [];
}

/** Rebuild history dari file MDX yang sudah ada (untuk backward compatibility) */
function rebuildHistoryFromExistingFiles() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));
  const history = [];
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
      const titleMatch = content.match(/^title: "(.+)"$/m);
      const dateMatch = content.match(/^date: "(.+)"$/m);
      const sourceMatch = content.match(/\*Sumber referensi: \[.+\]\((.+)\)\*/m);
      
      if (titleMatch && dateMatch) {
        history.push({
          slug: file.replace('.mdx', ''),
          title: titleMatch[1].replace(/\\"/g, '"'),
          sourceTitle: titleMatch[1].replace(/\\"/g, '"'), // Fallback
          sourceUrl: sourceMatch ? sourceMatch[1] : '',
          date: dateMatch[1],
        });
      }
    } catch (err) {
      // Skip file yang error
    }
  }
  
  return history;
}

/** Cek apakah URL sudah pernah diproses dalam N hari terakhir */
function isUrlInRecentHistory(url, daysBack = 2) {
  const history = loadHistory();
  const cutoff = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
  
  return history.some(entry => {
    if (entry.sourceUrl === url) {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoff;
    }
    return false;
  });
}

/** Simpan history ke file JSON */
function saveHistory(history) {
  try {
    // Batasi jumlah entry agar file tidak terlalu besar
    const trimmed = history.slice(-MAX_HISTORY);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
    console.log(`💾 History saved: ${trimmed.length} entries`);
  } catch (err) {
    console.warn(`⚠️  Gagal save history: ${err.message}`);
  }
}

/** Tambah entry baru ke history dan langsung simpan */
function appendHistory(entry) {
  const history = loadHistory();
  history.push(entry);
  saveHistory(history);
}

// ============================================================
// Image Extraction
// ============================================================

/** Ekstrak gambar dari RSS item (enclosure, media:content, media:thumbnail) */
function extractRSSImage(item) {
  // 1. Cek enclosure (format umum RSS untuk gambar)
  if (item.enclosure && item.enclosure.url && isImageUrl(item.enclosure.url)) {
    return item.enclosure.url;
  }

  // 2. Cek media:content
  if (item.mediaContent) {
    const url = item.mediaContent.$ && item.mediaContent.$.url;
    if (url && isImageUrl(url)) return url;
  }

  // 3. Cek media:thumbnail
  if (item.mediaThumbnail) {
    const url = item.mediaThumbnail.$ && item.mediaThumbnail.$.url;
    if (url && isImageUrl(url)) return url;
  }

  // 4. Cek <img> tag di content/description HTML
  const htmlContent = item.content || item['content:encoded'] || item.description || '';
  const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1] && isImageUrl(imgMatch[1])) {
    return imgMatch[1];
  }

  return null;
}

/** Ekstrak gambar dari Jina Reader markdown content */
function extractImageFromContent(text) {
  if (!text) return null;

  // 1. Cari markdown image: ![alt](url)
  const mdImageMatch = text.match(/!\[([^\]]*)\]\(([^)]+)\)/);
  if (mdImageMatch && mdImageMatch[2] && isImageUrl(mdImageMatch[2])) {
    return mdImageMatch[2];
  }

  // 2. Cari bare image URL di teks
  const urlMatch = text.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|gif)(?:\?[^\s"'<>]*)?/i);
  if (urlMatch && urlMatch[0]) {
    return urlMatch[0];
  }

  return null;
}

/** Cek apakah URL kemungkinan gambar (berdasarkan extension atau pola umum) */
function isImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  // Cek extension gambar
  if (/\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i.test(lower)) return true;
  // Cek pola CDN gambar umum
  if (lower.includes('/image/') || lower.includes('/foto/') || lower.includes('/photo/')) return true;
  if (lower.includes('akcdn.detik.net.id')) return true;
  if (lower.includes('asset.kompas.com')) return true;
  if (lower.includes('cdn-') && lower.includes('tribunnews')) return true;
  if (lower.includes('img.cnn')) return true;
  return false;
}

// ============================================================
// Step 1: Crawl RSS Feeds
// ============================================================

async function crawlFeeds() {
  const parser = new RSSParser({
    timeout: 10000,
    headers: { 'User-Agent': 'MenitLiveBot/1.0' },
    customFields: {
      item: [
        ['media:content', 'mediaContent', { keepArray: false }],
        ['media:thumbnail', 'mediaThumbnail', { keepArray: false }],
        ['enclosure', 'enclosure', { keepArray: false }],
      ],
    },
  });
  const cutoff = new Date(Date.now() - HOURS_WINDOW * 60 * 60 * 1000);
  const allItems = [];

  for (const portal of PORTALS) {
    for (const feedUrl of portal.feeds) {
      try {
        console.log(`📡 Fetching RSS: ${portal.name} — ${feedUrl}`);
        const feed = await parser.parseURL(feedUrl);

        for (const item of feed.items || []) {
          const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

          // Hanya ambil berita dalam window waktu
          if (pubDate < cutoff) continue;

          // Ekstrak gambar dari RSS item
          const rssImage = extractRSSImage(item);

          allItems.push({
            title: (item.title || '').trim(),
            link: item.link || '',
            description: (
              item.contentSnippet ||
              item.content ||
              item.description ||
              ''
            ).trim(),
            pubDate,
            portal: portal.name,
            hotScore: calcHotScore(item.title || ''),
            image: rssImage,
          });
        }
      } catch (err) {
        console.warn(`⚠️  Gagal fetch ${portal.name} (${feedUrl}): ${err.message}`);
      }
    }
  }

  console.log(`\n📊 Total berita dalam window ${HOURS_WINDOW} jam: ${allItems.length}`);

  // Sort: skor hotness tertinggi dulu, lalu terbaru
  allItems.sort((a, b) => b.hotScore - a.hotScore || b.pubDate - a.pubDate);

  // Load history untuk cross-session dedup
  let history = loadHistory();
  
  // Jika history kosong/sedikit, rebuild dari file MDX yang sudah ada
  if (history.length < 10) {
    console.log('🔄 Rebuilding history from existing MDX files...');
    const rebuiltHistory = rebuildHistoryFromExistingFiles();
    console.log(`📚 Rebuilt history: ${rebuiltHistory.length} entries`);
    
    // Merge dengan history yang ada (jika ada)
    const mergedHistory = [...history, ...rebuiltHistory];
    // Deduplicate by slug
    const uniqueHistory = Array.from(
      new Map(mergedHistory.map(h => [h.slug, h])).values()
    );
    
    // Save merged history
    saveHistory(uniqueHistory);
    history = uniqueHistory;
  }
  
  const historySlugs = new Set(history.map((h) => h.slug));
  const historyTitles = history.map((h) => h.title);
  const historySourceTitles = history.map((h) => h.sourceTitle || '');
  const historyUrls = new Set(history.map((h) => h.sourceUrl).filter(Boolean));

  // Deduplicate berdasarkan slug, URL, dan similarity judul
  const seen = new Set();
  const seenTitles = [];
  const seenUrls = new Set();
  const unique = allItems.filter((item) => {
    const key = slugify(item.title);
    if (!key || key.length < 5) return false;
    if (seen.has(key) || articleExists(key)) return false;
    
    // Cross-session dedup: cek history
    if (historySlugs.has(key)) return false;
    
    // URL dedup: cek apakah URL sudah pernah diproses dalam 48 jam terakhir
    if (isUrlInRecentHistory(item.link, 2) || historyUrls.has(item.link)) {
      console.log(`⏭️  Skip (URL sudah diproses): ${item.title.slice(0, 60)}...`);
      return false;
    }
    
    // URL dedup dalam session saat ini
    if (seenUrls.has(item.link)) return false;
    
    // Similarity check: cek dengan judul yang sudah ada (history + current session)
    const allExistingTitles = [...historyTitles, ...historySourceTitles, ...seenTitles];
    if (isSimilarToExisting(item.title, allExistingTitles, 0.6)) {
      console.log(`⏭️  Skip (judul mirip): ${item.title.slice(0, 60)}...`);
      return false;
    }
    
    seen.add(key);
    seenTitles.push(item.title);
    seenUrls.add(item.link);
    return true;
  });

  console.log(`📊 Berita unik setelah dedup: ${unique.length}`);

  // Ambil cadangan 2x lipat dari target maksimal
  return unique.slice(0, MAX_ARTICLES * 2);
}

// ============================================================
// Step 2: Fetch Full Content via Jina Reader
// ============================================================

async function fetchFullContent(url) {
  try {
    console.log(`🔍 Jina Reader: ${url}`);
    const res = await axios.get(`${JINA_PREFIX}${url}`, {
      timeout: 15000,
      headers: {
        Accept: 'text/markdown',
        'X-Return-Format': 'markdown',
      },
    });
    const text = typeof res.data === 'string' ? res.data : '';

    // Ekstrak gambar dari Jina content
    const jinaImage = extractImageFromContent(text);

    // Batasi panjang agar tidak melebihi konteks Groq
    return { content: text.slice(0, 4000), image: jinaImage };
  } catch (err) {
    console.warn(`⚠️  Jina gagal: ${err.message}`);
    return { content: null, image: null };
  }
}

// ============================================================
// Step 3: Rewrite Artikel via Groq AI
// ============================================================

async function rewriteArticle(title, content, portal, retries = 1) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const prompt = `Kamu adalah jurnalis senior portal berita Indonesia "Menit Live" (menit.live).
Tugasmu: tulis ulang berita berikut menjadi artikel BARU yang sepenuhnya original.

ATURAN KETAT:
1. Parafrase TOTAL — tidak boleh ada kalimat yang sama persis dengan sumber
2. Gaya bahasa netral, formal tapi mudah dipahami (seperti portal berita Indonesia)
3. Panjang artikel: 600-800 kata
4. Tambahkan sudut pandang dampak untuk Indonesia jika relevan
5. Struktur: paragraf pembuka yang kuat, lalu beberapa subjudul (## Heading), dan penutup
6. Jangan gunakan frontmatter/metadata, langsung tulis konten artikelnya saja
7. JANGAN tulis "Sumber:" atau "Referensi:" di dalam artikel
8. Gunakan Bahasa Indonesia baku yang baik dan benar

BERITA SUMBER (${portal}):
Judul: ${title}

Konten:
${content}

Tulis artikelnya sekarang:`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`🤖 Groq rewrite (attempt ${attempt + 1}): "${title.slice(0, 60)}..."`);

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: GROQ_MODEL,
        temperature: TEMPERATURE,
        max_completion_tokens: MAX_TOKENS,
        top_p: 1,
        stream: false,
      });

      const result = completion.choices?.[0]?.message?.content;
      if (result && result.length > 200) {
        return result.trim();
      }

      console.warn('⚠️  Response terlalu pendek, retry...');
    } catch (err) {
      console.warn(`⚠️  Groq error (attempt ${attempt + 1}): ${err.message}`);
      if (attempt < retries) await delay(3000);
    }
  }

  return null;
}

// ============================================================
// Step 4: Generate Judul Baru via Groq
// ============================================================

async function generateTitle(originalTitle, articleContent) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    const res = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Buat judul berita baru yang menarik dan berbeda dari judul asli. Aturan:
- Berbeda dari judul asli tapi tetap akurat dengan isi artikel
- Menarik dan informatif (bukan clickbait menipu)
- Bahasa Indonesia, 8-15 kata
- Tanpa tanda kutip di awal/akhir

Judul asli: ${originalTitle}
Isi singkat: ${articleContent.slice(0, 300)}

Tulis HANYA judul baru (1 baris saja):`,
        },
      ],
      model: GROQ_MODEL,
      temperature: 0.8,
      max_completion_tokens: 80,
      stream: false,
    });

    const title = res.choices?.[0]?.message?.content?.trim();
    if (title && title.length > 10 && title.length < 150) {
      // Hapus quotes jika AI menambahkan
      return title.replace(/^["']|["']$/g, '');
    }
  } catch (err) {
    console.warn(`⚠️  Gagal generate judul: ${err.message}`);
  }

  return originalTitle; // Fallback
}

// ============================================================
// Step 5: Generate Deskripsi SEO
// ============================================================

async function generateDescription(title, articleContent) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    const res = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Buat deskripsi/ringkasan singkat (1-2 kalimat, maksimal 160 karakter) untuk artikel berita ini.
Harus informatif dan menarik untuk SEO. Bahasa Indonesia.

Judul: ${title}
Isi: ${articleContent.slice(0, 500)}

Tulis HANYA deskripsi (1-2 kalimat, tanpa tanda kutip):`,
        },
      ],
      model: GROQ_MODEL,
      temperature: 0.5,
      max_completion_tokens: 80,
      stream: false,
    });

    const desc = res.choices?.[0]?.message?.content?.trim();
    if (desc && desc.length > 20) {
      return desc.replace(/^["']|["']$/g, '');
    }
  } catch (err) {
    console.warn(`⚠️  Gagal generate deskripsi: ${err.message}`);
  }

  // Fallback: ambil awal konten sebagai deskripsi
  return (
    articleContent
      .replace(/^#+\s.+/gm, '')
      .replace(/\n+/g, ' ')
      .trim()
      .slice(0, 155) + '...'
  );
}

// ============================================================
// Step 6: Write MDX File
// ============================================================

function writeMDX({ slug, title, description, tags, content, sourceUrl, portal, image }) {
  const date = todayDate();
  const time = currentTime();

  // Escape double quotes di title dan description untuk frontmatter
  const safeTitle = title.replace(/"/g, '\\"');
  const safeDesc = description.replace(/"/g, '\\"');

  // Build frontmatter dengan optional image
  const imageLine = image ? `\nimage: "${image}"` : '';

  const mdxContent = `---
title: "${safeTitle}"
date: "${date}"
time: "${time}"
description: "${safeDesc}"
tags: ${JSON.stringify(tags)}${imageLine}
---

${content}

---

*Sumber referensi: [${portal}](${sourceUrl})*
`;

  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  fs.writeFileSync(filePath, mdxContent, 'utf-8');
  console.log(`✅ Tersimpan: blog/${slug}.mdx`);
}

// ============================================================
// Main — Orchestrator
// ============================================================

async function main() {
  console.log('🚀 Menit News Bot dimulai...\n');
  console.log(`📅 Tanggal: ${todayDate()}`);
  console.log(`⏰ Waktu: ${new Date().toISOString()}\n`);

  // Validasi API key
  if (!process.env.GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY tidak ditemukan! Set sebagai environment variable.');
    process.exit(1);
  }

  // Pastikan folder blog/ ada
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

  // Step 1: Crawl RSS feeds
  const candidates = await crawlFeeds();

  if (candidates.length === 0) {
    console.log('\n📭 Tidak ada berita baru yang memenuhi kriteria. Selesai.');
    process.exit(0);
    return;
  }

  // Step 2-6: Proses setiap kandidat
  let generated = 0;

  // Randomisasi jumlah artikel antara MIN_ARTICLES dan MAX_ARTICLES
  const targetArticles = MIN_ARTICLES + Math.floor(Math.random() * (MAX_ARTICLES - MIN_ARTICLES + 1));
  console.log(`🎯 Target artikel kali ini: ${targetArticles} (range ${MIN_ARTICLES}-${MAX_ARTICLES})\n`);

  for (const item of candidates) {
    if (generated >= targetArticles) break;

    try {
      console.log(
        `\n${'─'.repeat(60)}\n📰 Proses: "${item.title.slice(0, 70)}..." (${item.portal})\n${'─'.repeat(60)}`
      );

      // Fetch full content via Jina Reader
      const jinaResult = await fetchFullContent(item.link);
      let fullContent = jinaResult.content;
      const jinaImage = jinaResult.image;

      // Fallback ke RSS description jika Jina gagal
      if (!fullContent || fullContent.length < 100) {
        console.log('📝 Fallback ke RSS description');
        fullContent = item.description;
      }

      // Skip jika konten terlalu pendek
      if (!fullContent || fullContent.length < 50) {
        console.log('⏭️  Skip: konten terlalu pendek');
        continue;
      }

      // Rewrite via Groq AI
      const rewritten = await rewriteArticle(
        item.title,
        fullContent,
        item.portal
      );
      if (!rewritten) {
        console.log('⏭️  Skip: Groq gagal rewrite');
        continue;
      }

      await delay(500); // Rate limit

      // Generate judul baru
      const newTitle = await generateTitle(item.title, rewritten);
      await delay(500);

      // Generate deskripsi SEO
      const description = await generateDescription(newTitle, rewritten);
      await delay(500);

      // Auto-detect tags
      const tags = detectTags(newTitle, rewritten);

      // Buat slug
      const slug = slugify(newTitle);
      if (!slug || slug.length < 5 || articleExists(slug)) {
        console.log('⏭️  Skip: slug sudah ada atau invalid');
        continue;
      }

      // Pilih gambar terbaik: RSS image > Jina image > null
      const articleImage = item.image || jinaImage || null;
      if (articleImage) {
        console.log(`🖼️  Gambar ditemukan: ${articleImage.slice(0, 80)}...`);
      } else {
        console.log('⚠️  Tidak ada gambar ditemukan');
      }

      // Tulis file MDX
      writeMDX({
        slug,
        title: newTitle,
        description,
        tags,
        content: rewritten,
        sourceUrl: item.link,
        portal: item.portal,
        image: articleImage,
      });

      // Simpan ke history untuk dedup cross-session
      appendHistory({
        slug,
        title: newTitle,
        sourceTitle: item.title,
        sourceUrl: item.link,
        portal: item.portal,
        date: todayDate(),
      });

      generated++;
      await delay(1000); // Jeda antar artikel
    } catch (err) {
      console.error(`❌ Error: ${err.message}`);
    }
  }

  console.log(`\n🏁 Selesai! ${generated} artikel baru di-generate.`);
  process.exit(0);
}

// Jalankan
main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
