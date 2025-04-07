ඔයාගේ WhatsApp bot එකෙන් Facebook video downloader functionality එකක් ක්‍රියාත්මක කිරීමට, අපි තවත් WhatsApp bot API එකට link කරන backend logic එකක් update කරන්නෙ. මගේ ගමන:

User: WhatsApp bot එකට Facebook video URL එක යවනවා.

Bot: URL එක API එකට එවලා, response එකෙන් video URL එක ලබා ගන්නවා.

Bot: Video URL එක user එකට reply කරන්න.


මෙම API එකක්, WhatsApp bot (Baileys or Twilio) වලින් user request එකට response කරන්න.

Code Updates:

API request: WhatsApp bot, Facebook video URL එක ලබා ගනී.

Video Download link: API එකෙන් response එක ලබාගෙන video එක reply කරනවා.


Step-by-Step Code Update:

1. WhatsApp Bot Command (fb, facebook, fbdl)



const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  desc: "Download Facebook videos",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    // Check if URL is valid
    if (!q || !q.startsWith("https://")) {
      return reply("*`Please provide a valid Facebook URL!`*");
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Use the API to get Facebook video
    const apiUrl = `https://lance-frank-asta.onrender.com/api/downloader?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    // Check if data contains the necessary video information
    if (!data?.content?.status || !data?.content?.data?.result?.length) {
      throw new Error("Invalid API response or no video found.");
    }

    // Find the best video quality
    let videoData = data.content.data.result.find(v => v.quality === "HD") ||
                    data.content.data.result.find(v => v.quality === "SD");

    if (!videoData) {
      throw new Error("No valid video URL found.");
    }

    // Format the video info and send it back to user
    const formattedInfo = `📥 *Downloaded in ${videoData.quality} Quality*\n\n> 🔗 *Powered by NIMA-MD*`;

    // Send the video back to the user on WhatsApp
    await conn.sendMessage(from, {
      video: { url: videoData.url },
      caption: formattedInfo,
      contextInfo: { 
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
      }
    }, { quoted: m });

  } catch (error) {
    console.error("FB Download Error:", error);

    // Send error details to the bot owner
    const ownerNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    await conn.sendMessage(ownerNumber, {
      text: `⚠️ *FB Downloader Error!*\n\n📍 *Group/User:* ${from}\n💬 *Query:* ${q}\n❌ *Error:* ${error.message || error}`
    });

    // Notify the user
    reply("❌ *Error:* Unable to process the request. Please try again later.");
  }
});

How This Works:

User sends a Facebook video URL: The user sends a message like fb https://facebook.com/somevideo.

Bot: The bot calls the API (https://lance-frank-asta.onrender.com/api/downloader) to fetch the video details.

Bot sends the video: The bot sends the HD or SD quality video back to the user via WhatsApp.


Step 2: Backend API - Facebook Video Downloader

This is the API that the bot queries to get the video URL. You have already used https://lance-frank-asta.onrender.com/api/downloader in the code, so we don’t need to create a new one unless you want to implement it on your own.


---

Next Steps:

1. Deploy this code: Implement it within your WhatsApp bot server.


2. Test: Users will send Facebook video URLs to the bot, and the bot will fetch the video URL, process it, and send the video file back.


3. Logging Errors: If there are any errors, it will log them and send a message to the bot owner.




---

If you need further help on setting up the environment for WhatsApp bot (e.g., Baileys or Twilio), let me know! You can also ask if you want to implement custom API or video quality choices.

