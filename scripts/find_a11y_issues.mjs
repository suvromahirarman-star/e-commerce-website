import { chromium } from '@playwright/test';

async function checkAll() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const urls = [
    'http://localhost:5173/shop',
    'http://localhost:5173/product/soren-oversized-wool-trench-coat',
    'http://localhost:5173/cart',
    'http://localhost:5173/checkout',
  ];

  for (const url of urls) {
    await page.goto(url, { waitUntil: 'networkidle' });
    const imgs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).filter((img) => !img.hasAttribute('alt') || !img.getAttribute('alt').trim()).length;
    });
    const btns = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).filter((btn) => {
        const text = btn.innerText?.trim();
        const aria = btn.getAttribute('aria-label');
        const title = btn.getAttribute('title');
        return !text && !aria && !title;
      }).length;
    });
    console.log(`${url} => Missing Alt: ${imgs}, Unlabeled Buttons: ${btns}`);
  }

  await browser.close();
}

checkAll();
