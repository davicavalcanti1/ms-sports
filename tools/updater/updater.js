const axios = require('axios');
const cheerio = require('cheerio');
const Client = require('ssh2-sftp-client');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const YUPOO_CATEGORIES = [
    "https://limingstore.x.yupoo.com/categories/5146602",
    "https://limingstore.x.yupoo.com/categories/4289565"
];

// Use environment variables (will be set in .bat) or fallback
const VPS_HOST = process.env.VPS_HOST || '31.97.24.35';
const VPS_USER = process.env.VPS_USER || 'root';
const VPS_PASS = process.env.VPS_PASS || 'Imago321123##';
const REMOTE_HTML_DIR = '/var/www/html';
const REMOTE_IMG_DIR = '/var/www/html/products';
const LOCAL_IMG_TEMP = path.join(__dirname, 'temp_images');

// Fetch remote catalog to know what we already have
async function fetchRemoteCatalog(sftp) {
    const remotePath = `${REMOTE_HTML_DIR}/catalog.json`;
    try {
        const exists = await sftp.exists(remotePath);
        if (!exists) return [];
        const buffer = await sftp.get(remotePath);
        return JSON.parse(buffer.toString('utf8'));
    } catch (err) {
        console.error("Error fetching remote catalog.json", err.message);
        return [];
    }
}

async function scrapeCategories() {
   const albums = [];
   for (const catUrl of YUPOO_CATEGORIES) {
        console.log(`Scraping category: ${catUrl}`);
        const { data } = await axios.get(catUrl);
        const $ = cheerio.load(data);
        $('a').each((i, el) => {
            let url = $(el).attr('href');
            if (url && url.includes('/albums/')) {
                if (url.startsWith('/albums')) {
                   url = `https://limingstore.x.yupoo.com${url}`;
                }
                albums.push(url);
            }
        });
   }
   return [...new Set(albums)];
}

async function scrapeAlbum(albumUrl) {
     try {
         const { data } = await axios.get(albumUrl);
         const $ = cheerio.load(data);
         const title = $('span.showalbumheader__gallerytitle').text().trim() || $('title').text().trim();
         
         const images = [];
         $('img').each((i, el) => {
             if (images.length < 3) { // Only take up to 3 images as requested
                 const src = $(el).attr('data-src') || $(el).attr('data-origin-src') || $(el).attr('src');
                 if(src && src.includes('photo.yupoo.com')) {
                     const fullSrc = src.startsWith('//') ? 'https:' + src : src;
                     images.push(fullSrc);
                 }
             }
         });
         
         const match = albumUrl.match(/albums\/(\d+)/);
         const id = match ? match[1] : null; // Raw ID numbers
         
         // Extract some category logic if possible
         const t = title.toLowerCase();
         let category = 'Novos'; 
         if (t.includes('nba') || t.includes('basquete') || t.includes('basketball')) category = 'Basquete';
         else if (t.includes('f1') || t.includes('formula 1')) category = 'F1';
         else if (t.includes('feminina') || t.includes('woman')) category = 'Feminino';
         else if (t.includes('kid') || t.includes('infantil')) category = 'Infantil';
         else if (t.includes('flamengo') || t.includes('palmeiras') || t.includes('futebol')) category = 'Futebol';

         return { id, title, category, images, original_url: albumUrl };
     } catch (err) {
         console.error(`Error scraping album ${albumUrl}`, err.message);
         return null;
     }
}

async function downloadImage(url, destPath) {
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const writer = fs.createWriteStream(destPath);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
        headers: {
           'Referer': 'https://limingstore.x.yupoo.com/'
        }
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

(async () => {
    const sftp = new Client();
    try {
        console.log("Connecting to VPS...");
        await sftp.connect({
            host: VPS_HOST,
            port: 22,
            username: VPS_USER,
            password: VPS_PASS
        });
        
        console.log("Fetching Remote catalog.json...");
        const catalog = await fetchRemoteCatalog(sftp);
        
        // Ensure format is an array
        if (!Array.isArray(catalog)) {
             console.error("Remote catalog is not an array format. Aborting.");
             process.exit(1);
        }
        
        const existingUrls = new Set();
        let maxYupooId = 0;
        catalog.forEach(item => {
            if (item.original_url) existingUrls.add(item.original_url.split('?')[0]); // ignore query params
            
            // Track highest yupoo-X id
            const match = item.id.match(/^yupoo-(\d+)$/);
            if (match) {
                const num = parseInt(match[1]);
                if (num > maxYupooId) maxYupooId = num;
            }
        });

        console.log(`Found ${catalog.length} existing items in catalog. Current max ID: yupoo-${maxYupooId}`);
        
        const albumLinks = await scrapeCategories();
        console.log(`Found ${albumLinks.length} total albums in target categories.`);
        
        const newAlbums = albumLinks.filter(link => !existingUrls.has(link.split('?')[0]));
        console.log(`${newAlbums.length} albums are NEW and will be downloaded.`);
        
        let newItemsAdded = 0;
        for (const link of newAlbums) {
            console.log(`Processing: ${link}`);
            const data = await scrapeAlbum(link);
            
            if (data && data.images.length > 0) {
                maxYupooId++;
                const newId = `yupoo-${maxYupooId}`;
                
                // Keep local records
                const newProduct = {
                    id: newId,
                    title: data.title,
                    description: data.title,
                    category: data.category,
                    price: 150, // default, updated in frontend
                    stock_status: "in_stock",
                    stock_quantity: 100,
                    images: data.images, // We still store original Yupoo URLs
                    image: data.images[0],
                    original_url: data.original_url
                };

                // Add to catalog
                catalog.unshift(newProduct); // Add at the top
                
                // Upload images via SFTP
                const remoteProductDir = `${REMOTE_IMG_DIR}/${newId}`;
                try {
                     await sftp.mkdir(remoteProductDir, true);
                     
                     for (let i = 0; i < data.images.length; i++) {
                         const imgUrl = data.images[i];
                         const ext = imgUrl.toLowerCase().endsWith('.png') ? '.png' : '.jpg';
                         const localTempPath = path.join(LOCAL_IMG_TEMP, `${newId}_${i+1}${ext}`);
                         
                         console.log(`   Downloading ${imgUrl}...`);
                         await downloadImage(imgUrl, localTempPath);
                         
                         const remotePath = `${remoteProductDir}/${i+1}${ext}`;
                         console.log(`   Uploading to ${remotePath}...`);
                         await sftp.fastPut(localTempPath, remotePath);
                         
                         // cleanup
                         fs.unlinkSync(localTempPath);
                     }
                     newItemsAdded++;
                } catch (e) {
                     console.error(`   Failed to upload images for ${newId}:`, e.message);
                }
            }
        }
        
        if (newItemsAdded > 0) {
            console.log(`Uploading updated catalog.json (${newItemsAdded} new items)...`);
            const tempCat = path.join(__dirname, 'catalog.json');
            fs.writeFileSync(tempCat, JSON.stringify(catalog, null, 2));
            await sftp.fastPut(tempCat, `${REMOTE_HTML_DIR}/catalog.json`);
            fs.unlinkSync(tempCat);
            console.log("SUCESSO: Catálogo atualizado na VPS!");
        } else {
            console.log("Nenhum item novo pra atualizar.");
        }
        
    } catch (err) {
        console.error("Fatal Error: ", err);
    } finally {
        sftp.end();
        console.log("Conexão encerrada.");
    }
})();
