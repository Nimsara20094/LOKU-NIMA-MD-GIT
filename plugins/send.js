const { cmd } = require("../command");
const path = require("path");

cmd({
  pattern: "send",
  react: "📩",
  alias: ["save"],
  desc: "Download and send back a WhatsApp Status (image or video).",
  category: "media",
  use: ".send",
  filename: __filename,
}, async (bot, message, chat, { quoted, reply }) => {
  try {
    if (!quoted || quoted.key.remoteJid !== "status@broadcast") {
      return reply("❌ Please reply to a WhatsApp Status to download it.");
    }

    const mimeType = quoted.mtype || quoted.mediaType;
    if (!mimeType || (!mimeType.includes("image") && !mimeType.includes("video"))) {
      return reply("❌ Only image or video statuses can be downloaded.");
    }

    // Download Status
    const savedFilePath = await bot.downloadAndSaveMediaMessage(quoted);
    const resolvedFilePath = path.resolve(savedFilePath);

    // Prepare and send the media
    const mediaMessage = { caption: "✅ Status Downloaded!" };
    if (mimeType.includes("image")) {
      mediaMessage.image = { url: "file://" + resolvedFilePath };
    } else if (mimeType.includes("video")) {
      mediaMessage.video = { url: "file://" + resolvedFilePath };
    }

    await bot.sendMessage(chat.sender, mediaMessage, { quoted: message });
    await reply("✅ Status successfully downloaded and sent.");
  } catch (error) {
    console.error(error);
    reply("❌ Failed to download the status. Please try again.");
  }
});
