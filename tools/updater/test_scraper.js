const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const { data } = await axios.get('https://limingstore.x.yupoo.com/categories/5146602');
    const $ = cheerio.load(data);
    const links = [];
    $('a').each((i, el) => {
        const h = $(el).attr('href');
        if (h && h.includes('/albums/')) {
            links.push(h);
        }
    });
    console.log("Album links found:", links.length);
    if(links.length > 0) {
        console.log("First:", links[0]);
        // test album page
        const url = 'https://limingstore.x.yupoo.com' + links[0];
        const { data: aData } = await axios.get(url);
        const $a = cheerio.load(aData);
        console.log("Title: ", $a('span.showalbumheader__gallerytitle').text() || $a('title').text());
        const imgs = [];
        $a('img').each((i, el) => {
             const src = $a(el).attr('data-src') || $a(el).attr('data-origin-src') || $a(el).attr('src');
             if(src && src.includes('photo.yupoo.com')) imgs.push(src);
        });
        console.log("Images found:", imgs.length);
        if(imgs.length > 0) console.log("First Image:", imgs[0]);
    }
}
test();
