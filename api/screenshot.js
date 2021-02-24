// Shout outs to the following repositories:

// https://github.com/vercel/og-image
// https://github.com/ireade/netlify-puppeteer-screenshot-demo

const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");

const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function getOptions(isDev) {
  let options;
  if (isDev) {
    options = {
      args: [],
      executablePath: exePath,
      headless: true,
    };
  } else {
    options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    };
  }
  return options;
}

module.exports = async (req, res) => {
  const pageToScreenshot = req.query.page;
  const isDev = req.query.isDev === "true";

  try {
    if (!pageToScreenshot.includes("https://")) {
      res.statusCode = 404;
      res.json({
        body: "Sorry, we couldn't screenshot that page. Did you include https://?",
      });
    }

    // get options for browser
    const options = await getOptions(isDev);

    // launch a new headless browser with dev / prod options
    const browser = await puppeteer.launch(options);

    const page = await browser.newPage();

    // set the viewport size
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    // tell the page to visit the url
    await page.goto(pageToScreenshot);

    // take a screenshot and save it in the screenshots directory
    const file = await page.screenshot({
      type: "png",
    });

    // close the browser
    await browser.close();

    res.statusCode = 200;
    res.setHeader("Content-Type", `image/png`);
    res.setHeader(
      "Cache-Control",
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    );

    // return the file!
    res.end(file);
  } catch (e) {
    res.statusCode = 500;
    res.json({
      body: "Sorry, Something went wrong!",
    });
  }
};
