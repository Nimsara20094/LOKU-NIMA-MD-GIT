NIMSARA updated version:

N   N III M   M SSS  AAAAA RRRR   AAAAA
NN  N  I  MM MM S    A   A R   R  A   A
N N N  I  M M M SSS  AAAAA RRRR   AAAAA
N  NN  I  M   M   S  A   A R  R   A   A
N   N III M   M SSS  A   A R   R  A   A

CODE BY: Nimsara (Telegram: @NimsaraDev | GitHub: github.com/NimsaraDev)

PLEASE GIVE PROPER CREDIT IF YOU USE OR MODIFY THIS CODE.
*/

const { cmd } = require('../command');
const yts = require('yt-search');

cmd({
  pattern: "yts",
  alias: ["ytsearch"],
  use: ".yts <keywords>",
  react: "🔎",
  desc: "Search and show YouTube video results.",
  category: "search",
  filename: __filename
}, async (conn, mek, m, {
  from,
  q, // search query
  reply
}) => {
  try {
    if (!q) return reply("*Please provide search keywords.*");

    const searchResults = await yts(q);
    const videos = searchResults.videos;

    if (!videos.length) return reply("*No results found.*");

    let text = `🔎 *Search Results for:* ${q}\n\n`;

    videos.slice(0, 6).forEach((video, i) => {
      text += `${i + 1}. *${video.title}*\n`;
      text += `📺 Channel: ${video.author.name}\n`;
      text += `⏱ Duration: ${video.timestamp} | 👁 ${video.views} views\n`;
      text += `🔗 Link: ${video.url}\n\n`;
    });

    await conn.sendMessage(from, { text }, { quoted: mek });

  } catch (e) {
    console.error("YTS Search Error:", e);
    reply("*❌ An error occurred. Please try again later.*");
  }
});
