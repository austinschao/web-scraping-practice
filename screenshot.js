"use strict";

const puppeteer = require("puppeteer");

async function takeScreenShot() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://google.com");
  await page.screenshot({ path: "google.png" });
  await browser.close();
}

takeScreenShot();