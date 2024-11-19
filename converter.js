const puppeteer = require("puppeteer");

async function downloadMp3WithPopup(youtubeUrls) {
  if (!youtubeUrls) {
    console.error("YouTube URL is required.");
    return;
  }

  const browser = await puppeteer.launch({
    headless: false, // Set to false to allow manual interaction for file save popup
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();

  try {
    // Navigate to the website
    await page.goto("https://y2mate.nu/en-1naP/", {
      waitUntil: "networkidle2",
    });

    // Listen for new tabs being opened
    browser.on("targetcreated", async (target) => {
      const newPage = await target.page();
      if (newPage) {
        console.log("New tab opened. Closing it...");
        await newPage.close(); // Close the new tab immediately
      }
    });

    for (let youtubeUrl of youtubeUrls) {
      console.log("Downloading new video ", youtubeUrl);
      // Enter the YouTube URL
      await page.type("#video", youtubeUrl);
      // wait for few seconds
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await page.click("button[type='submit']"); // Click the "Start" button
      // await page.waitForNavigation(); // Wait for the MP3 section to appear

      const download = await page.waitForSelector("button ::-p-text(Download)");
      download.click();

      console.log(
        "The file download process should now be handled by the browser. Check the popup to save the file."
      );

      // Wait some time to ensure the download process completes (optional)
      await new Promise((resolve) => setTimeout(resolve, 20 * 1000)); // Adjust time as needed

      // Goto homepage for next video
      const next = await page.waitForSelector("button ::-p-text(Next)");
      next.click();

      await new Promise((resolve) => setTimeout(resolve, 2 * 1000)); // Adjust time as needed
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
  }
}

// Usage
// const youtubeUrl = [
//   "https://www.youtube.com/watch?v=aRE1XDVLDlU",
//   "https://www.youtube.com/watch?v=Kf6MsltI7lQ",
//   "https://www.youtube.com/watch?v=AvNLHtpEUo0",
// ]; // Replace with your YouTube video URL
// downloadMp3WithPopup(youtubeUrl);

export default downloadMp3WithPopup;
