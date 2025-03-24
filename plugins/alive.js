const { cmd } = require("../command");
const moment = require("moment");

let botStartTime = Date.now(); // Bot start time record

// ✅ Random Voice Clips List එක
const VOICE_CLIPS = [
    "https://files.catbox.moe/r4r0hz.mp3",
    "https://files.catbox.moe/3pzzgr.mp3",
    "https://files.catbox.moe/qvpa5o.mp3",
    "https://files.catbox.moe/y29b3n.mp3",
    "https://files.catbox.moe/w7yg8f.mp3",
    "https://files.catbox.moe/4rm2fz.mp3",
    "https://files.catbox.moe/gr8wlt.mp3",
    "https://files.catbox.moe/xvue61.mp3",
    "https://files.catbox.moe/uosvov.mp3",
    "https://files.catbox.moe/2vgkwr.mp3",
    "https://files.catbox.moe/gqw8fl.m4a",
    "https://files.catbox.moe/mc5r2s.mp3",
    "https://files.catbox.moe/ck4reh.mp3",
    "https://files.catbox.moe/ypbfyt.mp3",
    "https://files.catbox.moe/75p1zt.mp3",
    "https://files.catbox.moe/rd21pi.mp3",
    "https://files.catbox.moe/ggebie.mp3",
    "https://files.catbox.moe/r4r0hz.mp3"
];

const ALIVE_VIDEO = "https://files.catbox.moe/hgltsd.mp4"; // මෙතැන valid MP4 video link එකක් දාන්න

cmd({
    pattern: "alive",
    desc: "Check if the bot is active.",
    category: "info",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { reply, from }) => {
    try {
        const pushname = m.pushName || "User";
        const currentTime = moment().format("HH:mm:ss");
        const currentDate = moment().format("dddd, MMMM Do YYYY");

        const runtimeMilliseconds = Date.now() - botStartTime;
        const runtimeSeconds = Math.floor((runtimeMilliseconds / 1000) % 60);
        const runtimeMinutes = Math.floor((runtimeMilliseconds / (1000 * 60)) % 60);
        const runtimeHours = Math.floor(runtimeMilliseconds / (1000 * 60 * 60));

        const formattedInfo = `
🌟 *NIMA MD V1 STATUS* 🌟
Hey 👋🏻 ${pushname}
🕒 *Time*: ${currentTime}
📅 *Date*: ${currentDate}
⏳ *Uptime*: ${runtimeHours} hours, ${runtimeMinutes} minutes, ${runtimeSeconds} seconds

*🤖sᴛᴀᴛᴜs*: *ᴇꜱᴋᴏʙᴀ-ᴍᴅ ᴀʟɪᴠᴇ ᴀɴᴅ ʀᴇᴀᴅʏ*

*🤍ᴍᴀᴅᴇ ᴡɪᴛʜ ʟᴏᴠᴇ*
        `.trim();

        // ✅ Random Voice Clip එකක් Select කරනවා
        const randomVoice = VOICE_CLIPS[Math.floor(Math.random() * VOICE_CLIPS.length)];

        // Check if video & voice URLs are valid
        if (!ALIVE_VIDEO || !ALIVE_VIDEO.startsWith("http")) {
            throw new Error("Invalid ALIVE_VIDEO URL. Please set a valid video URL.");
        }
        if (!randomVoice || !randomVoice.startsWith("http")) {
            throw new Error("Invalid Voice Clip URL. Please set a valid URL.");
        }

        // ✅ Random Voice Clip එක යවනවා
        await conn.sendMessage(from, {
            audio: { url: randomVoice },
            mimetype: 'audio/mp4', // MP3 / OGG formats සඳහා auto detect වේ
            ptt: true // 🎤 PTT (Push to Talk) වගේ play වේ
        }, { quoted: mek });

        // ✅ Video message with autoplay (GIF style)
        await conn.sendMessage(from, {
            video: { url: ALIVE_VIDEO }, // Video එකේ direct URL එක
            caption: formattedInfo,
            gifPlayback: true, // GIF වගේ autoplay වෙනවා (Sound play වෙන්නේ නැහැ)
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401928208566@newsletter',
                    newsletterName: 'ESKOBA 𝐌Ɗ 🍁',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in alive command: ", error);
        
        const errorMessage = `
❌ An error occurred while processing the alive command.
🛠 *Error Details*:
${error.message}

Please report this issue or try again later.
        `.trim();
        return reply(errorMessage);
    }
});
