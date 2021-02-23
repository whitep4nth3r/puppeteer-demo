const puppeteer = require("puppeteer");

(async () => {
  var args = process.argv.slice(2);

  for (let i = 0; i < args.length; i++) {
    if (args[i].includes("https://")) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
      });
      await page.goto(args[i]);
      await page.screenshot({ path: `./screenshots/${args[i].replace("https://", "")}.png` });
      await browser.close();
      console.log(`✅ Screenshot of ${args[i]} saved!`);
    } else {
      console.error(`❌ Could not save screenshot of ${args[i]}!`);
    }
  }
})();
