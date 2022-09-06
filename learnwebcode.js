"use strict";

const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const cron = require("node-cron");
// requiring fs promises so we don't have to deal with messy callbacks
// and have it return promises

async function start() {
  // launching the browser
  const browser = await puppeteer.launch();
  // creating a new page
  const page = await browser.newPage();
  await page.goto("https://learnwebcode.github.io/practice-requests/");
  // navigating page to the url
  // await page.goto("https://en.wikipedia.org/wiki/JavaScript");
  // take png screenshot of page
  // pass in an object and list the path
  // saves it to the current directory as path name
  // can pass additional args to object
  // by default it will be viewport size
  // await page.screenshot({ path: "wikiJS.png", fullPage: true });


  // Retrieve an array of strings
  // await page.evaluate gives us the ability to call any client side
  // javascript
  // evaluate is generic catch all javascript base function
  const names = await page.evaluate(() => {
    // inside here we are in browser land, not node js
    // returns node list, so we will convert it to an array
    return Array.from(document.querySelectorAll(".info strong")).map(x => x.textContent);
  });
  // add them to a txt file on their own line
  // takes two args (name of file, content)
  // "r\n\" => return to a new line
  await fs.writeFile("names.txt", names.join("\r\n"));

  /*
  Function is for selecting multiple elements...
    wont need to do array.from, puppeteer does it on its own
    first parameter is a css selector
    second is a callback which will take each thing its find from
      the css selector and will pass it to the callback function
  */
  const photos = await page.$$eval("img", imgs => {
    return imgs.map(img => img.src);
  });

  /*
  similuates a click event passing in the CSS selector for that button
  */
  await page.click("#clickme");
  // page.$eval selects the first elem that matches
  const clickedData = await page.$eval("#data", elem => elem.textContent);
  console.log(clickedData);

  /**
   * Takes two arguments, first is the CSS selector for the input element
   *  The second value is the second value for the input field to be typed
   */
  await page.type("#ourfield", "blue");

  await Promise.all([page.click("#ourform button"), page.waitForNavigation()]);
  // await page.click("#ourform button");
  // await page.waitForNavigation(); // Waits for page to change once info is submitted
  const info = await page.$eval("#message", elem => elem.textContent);
  console.log(info);


  for (let photo of photos) {
    // going to the image url
    const imagePage = await page.goto(photo);
    // writing the file, taking the file name and saving the contents of that file
    await fs.writeFile(photo.split("/").pop(), await imagePage.buffer());
  }

  await browser.close();
}

start();
// setting up automation, every 5 secs
// setInterval(start, 5000);


// cron schedule takes 5 vals but 6 optional for seconds
// can google how to do other types of automation
// node system has to be running the entire time, but easier
//  if it was on a linux system to run on the operating system
// cron.schedule("*/5 * * * * *", start);


/*
body > div > div > div > strong
*/