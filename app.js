const express = require("express");
const fs = require("fs");
const puppeteer = require("puppeteer");
const https = require("https");

const app = express();
const PORT = 3000;

async function downloadMp3(youtubeUrl) {}

// Usage
const youtubeUrl = "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"; // Replace with your YouTube video URL
downloadMp3(youtubeUrl);

// Endpoint to convert YouTube video to MP3
app.get("/convert", async (req, res) => {
  const youtubeUrl = req.query.url;

  if (!youtubeUrl) {
    return res.status(400).send({ error: "Invalid YouTube URL" });
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the website
    await page.goto("https://y2mate.nu/en-1naP/", {
      waitUntil: "networkidle2",
    });

    // Enter the YouTube URL
    await page.type("#video", youtubeUrl);
    await page.click("#format"); // Click the "Start" button
    await page.waitForSelector(".mp3 > a"); // Wait for the MP3 section to appear

    // Click on the MP3 button
    await page.click("button > a");
    await page.waitForNavigation()
    const downloadButton = await page.$x("//button[text()='Download']");
    if (downloadButton.length > 0) {
      await downloadButton[0].click();
    }

    // Extract the download link
    const downloadLink = await page.$eval(".btn-download", (a) => a.href);
    console.log("Download link:", downloadLink);

    // Download the MP3 file
    const fileName = "downloaded_audio.mp3";
    const file = fs.createWriteStream(fileName);

    https.get(downloadLink, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`MP3 file downloaded: ${fileName}`);
      });
    });
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
