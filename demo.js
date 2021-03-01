const puppeteer = require("puppeteer");

(async () => {
  // Take the urls from the command line
  var args = process.argv.slice(2);

  try {
    // launch a new headless browser
    const browser = await puppeteer.launch();

    // loop over the urls
    for (let i = 0; i < args.length; i++) {
      
      // check for https for safety!
      if (args[i].includes("https://")) {
        const page = await browser.newPage();

        // set the viewport size
        await page.setViewport({
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
        });

        // tell the page to visit the url
        await page.goto(args[i]);

        // take a screenshot and save it in the screenshots directory
        await page.screenshot({ path: `./screenshots/${args[i].replace("https://", "")}.png` });

        // done!
        console.log(`✅ Screenshot of ${args[i]} saved!`);
      } else {
        console.error(`❌ Could not save screenshot of ${args[i]}!`);
      }
    }

    // close the browser
    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
