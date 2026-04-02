const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8080');
  const sizes = await page.evaluate(() => {
    const track = document.querySelector('.carousel-track');
    const viewport = document.querySelector('.carousel-viewport');
    return {
      track: track.getBoundingClientRect(),
      trackScrollWidth: track.scrollWidth,
      viewport: viewport.getBoundingClientRect(),
      firstSlide: document.querySelector('.carousel-slide').getBoundingClientRect(),
      lastSlide: document.querySelectorAll('.carousel-slide')[6].getBoundingClientRect()
    };
  });
  console.log(JSON.stringify(sizes, null, 2));
  await browser.close();
})();
