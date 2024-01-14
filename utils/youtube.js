const axios = require("axios");

function ytSearch(query) {
  return axios.get("https://www.googleapis.com/youtube/v3/search", {
    params: {
      part: "snippet",
      q: query,
      key: process.env.YOUTUBE_API_KEY,
    },
  });
}

module.exports = { ytSearch };
