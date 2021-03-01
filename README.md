![Puppeteer logo](./puppeteer.png)

# How to use Puppeteer to take webpage screenshots and generate dynamic Open Graph images for social sharing

It's no secret that beautiful images shared with your links on social media drive more engagement. Unfortunately, it can be incredibly time-consuming to generate fresh images each time you publish a new blog post. The good news is, we can use a tool called Puppeteer to take screenshots of browser pages to generate dynamic images to share on your social media accounts.

Let's take a look!

## What is Puppeteer?

Puppeteer is a Node library which provides a high-level API to control headless Chrome or Chromium. It can also be configured to use full (non-headless) Chrome or Chromium.

Most things that you can do manually in the browser can be done using Puppeteer!

This repository contains some example code of how you can get started with Puppeteer to generate screenshots of browser pages.

[Read the Puppeteer docs here.](https://developers.google.com/web/tools/puppeteer/get-started)

## Requirements

Puppeteer uses Node to execute. If you want to host a project using Puppeteer, you'll need to use a service that can run Node functions such as [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/) or [Heroku](https://www.heroku.com/) - other options are, of course, available.

## Ready to try it out?

Fork this repository to your GitHub account, and clone it to your local machine using git or the GitHub CLI.

## Open your terminal and install dependencies

```bash
cd puppeteer-demo
yarn install
```

## Generate your first screenshot

Run the following command at the root of the project directory:

```bash
node demo.js https://whitep4nth3r.com
```

You'll notice that a new .png file has been created in the `screenshots` directory from the url provided.

You can also pass in multiple urls.

```bash
node demo.js https://whitep4nth3r.com https://stefanjudis.com
```

## Let's look at the code

```js
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
```

## Generating dynamic social share images for Open Graph

![Screenshot of a whitep4nth3r tweet showing dynamic Open Graph images](./tweet-screenshot.png)

[Read more about the Open Graph protocol here.](https://ogp.me/)

Open Graph meta tags are used in the `<head>` of an HTML page to expose information about web pages to social media platforms and other applications that unfurl URL meta data.

This is an Open Graph meta tag that provides a url to an image that is used to represent the web page.

```html
<meta property="og:image" content="https://example.com/image.png" />
```

A great way to up your OG image game is to harness the power of Puppeteer by providing a link in your OG image tags that calls out to a serverless function that generates a screenshot of a browser page.

## How I generated my own dynamic Open Graph images for whitep4nth3r.com

To create dynamic Open Graph images for [my own blog posts](https://whitep4nth3r.com/blog), I forked [this repository from Vercel](https://github.com/vercel/og-image) and created [my own custom service](https://github.com/whitep4nth3r/p4nth3rblog-og-image) which I host on Vercel.

[The application is available to experiment with here](https://p4nth3rblog-og-image.vercel.app/).

The application renders an HTML page based on the title of a blog post or page, which then uses Puppeteer to screenshot the page, and cache it.

The url parameters in the request hold the key to the magic being performed here. Here's a look at the code that generates my dynamic Open Graph images, [which you can find in full here](https://github.com/whitep4nth3r/p4nth3rblog/blob/main/utils/OpenGraph.js).

```js
// Get a random light/dark theme to switch things up
function getRandomTheme() {
  const themes = ["light", "dark"];
  return themes[Math.floor(Math.random() * themes.length)];
}

// Get a random panther SVG to switch things up even more
function getRandomPanther() {
  const panthers = ["cool", "dolla", "fire", "heart", ...];
  return panthers[Math.floor(Math.random() * panthers.length)];
}

// Get the base panther image uri - it's important to use encodeURIComponent() here
// to ensure all characters of the image url are encoded
 function getBaseImageEncodedUri() {
  return encodeURIComponent(
    "https://examplebaseurl.com/dir/to/images",
  );
}

// And the magic happens here
function generateImageUrl(title) {
    return `https://url.to.the.service/${encodeURI(
      title,
    )}.png?theme=${getRandomTheme()}&md=0fontSize=80px&images=${getBaseImageEncodedUri()}${getRandomPanther()}.svg`;
}

// And this code calls the generateImageUrl function in the head of my blog pages (which use Next.js)
 <meta property="og:image" content={generateImageUrl(title)} />
```

## Deploying a serverless function to Vercel to screenshot a web page

This repository contains a serverless function in the `/api` directory that takes a screenshot of a web page and returns it the browser. It works in the same way as described in `demo.js` above and takes a query parameter of `page`.

Click the button below to deploy your own instance to Vercel to try it out.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fwhitep4nth3r%2Fpuppeteer-demo)

The serverless function is available to execute at:

```bash
https://your-project.vercel.app/api/screenshot?https://example.com`
```

To see an example of the raw serverless function in action for this repository, visit the following URL in your browser:

```bash
https://puppeteer-screenshot-demo.vercel.app/api/screenshot?page=https://whitep4nth3r.com
```

## Node version

Due to some potential quirks with Puppeteer and Node 14, you'll need to set your Node version to 12.x in the Vercel settings. [Click here for more information](https://developers.google.com/web/tools/puppeteer/troubleshooting).

![Set your Node version in Vercel to 12.x](./node12-screenshot.png)

## Puppeteer vs Puppeteer Core

Vercel serverless functions can have a maximum size of 50MB. If you look at the code in `api/screenshot.js` you'll notice that we're using the `puppeteer-core` package instead of `puppeteer` on the server, which comes without any headless browser installed. We also install `chome-aws-lambda` on the server, which is a light version of Chrome, which keeps the function size down.

Additionally, we configure the `puppeteer.launch()` options differently for development and production.

## Developing locally

To run the serverless function locally, you'll need to [install the Vercel CLI.](https://vercel.com/download)

Then, in your terminal:

```bash
cd puppeteer-demo
vercel dev
```

To ensure Puppeteer is passed the correct options for the development environment, pass the query parameter `isDev=true` to the function like so.

```bash
http://localhost:3000/api/screenshot?page=https://whitep4nth3r.com&isDev=true
```
