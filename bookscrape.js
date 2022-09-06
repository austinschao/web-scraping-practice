"use strict";

const puppeteer = require("puppeteer");

let scrape = async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto("http://books.toscrape.com/");
  await Promise.all([
    page.waitForNavigation(),
    page.click('section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a')
  ]);

  const result = await page.evaluate(() => {
    let title = document.querySelector('h1').textContent;
    let price = document.querySelector('.price_color').text;

    return {
      title,
      price
    };
  });

  browser.close();
  console.log(result);
  return result;
};

scrape().then((value) => {
  console.log(value);
});

