const express = require("express");
const { default: downloadMp3WithPopup } = require("./converter");

const app = express();
const PORT = process.env.PORT || 3000;

// Validate if the url belongs to youtube or not
function isValidYouTubeUrl(url) {
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu.be)\/(watch\?v=)?([a-zA-Z0-9_-]{11})$/;
  return youtubeRegex.test(url);
}

// Endpoint to convert YouTube video to MP3
app.get("/convert", async (req, res) => {
  const youtubeUrls = req.query.yt_links;

  if (!(youtubeUrls instanceof Array)) {
    return res.status(400).send({ error: "You should pass url as array" });
  }

  if (!youtubeUrls.length) {
    return res.status(400).send({ error: "You should pass atleast one url" });
  }

  try {
    youtubeUrls.forEach((url) => {
      if (!isValidYouTubeUrl(url)) {
        throw new Error("Invalid url");
      }
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }

  try {
    downloadMp3WithPopup(youtubeUrls);
  } catch (error) {
    console.error("An error occurred:", error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
