const { cmd } = require("../command"); const yts = require("yt-search"); const axios = require("axios");

cmd({ pattern: "song", react: '🎵', desc: "Download audio from YouTube with details and thumbnail.", category: "music", use: ".song <song name or keywords>", filename: __filename }, async (conn, mek, msg, { from, args, reply }) => { try { const searchQuery = args.join(" "); if (!searchQuery) { return reply("Please provide a song name or keywords to search for."); }

const searchResults = await yts(searchQuery);
if (!searchResults.videos || searchResults.videos.length === 0) {
  return reply(`❌ No results found for "${searchQuery}".`);
}

const firstResult = searchResults.videos[0];
const videoUrl = firstResult.url;
const thumbnailUrl = firstResult.thumbnail;

let songDetails = `🎵 *Song Found!*

+📌 Title: ${firstResult.title} +⏳ Duration: ${firstResult.timestamp} +👁 Views: ${firstResult.views} +🎤 Author: ${firstResult.author.name} `;

await conn.sendMessage(from, {
  image: { url: thumbnailUrl },
  caption: songDetails
}, { quoted: mek });

// Call the API to download the audio
const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp3?url=${videoUrl}`;
const response = await axios.get(apiUrl);
if (!response.data.success) {
  return reply(`❌ Failed to fetch audio for "${searchQuery}".`);
}

const { title, download_url } = response.data.result;

// Send the audio file without showing URL
await conn.sendMessage(from, {
  audio: { url: download_url },
  mimetype: 'audio/mp4',
  ptt: false
}, { quoted: mek });

} catch (error) { console.error(error); reply("❌ An error occurred while processing your request."); } });
