/*𝐒𝐓𝐀𝐓𝐔𝐒 𝐊𝐈𝐍𝐆 𝐋𝐎𝐊𝐔 𝐍𝐈𝐌𝐀𝐇*/

const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "gpt",
    alias: "ai",
    desc: "Interact with ChatGPT using the Dreaded API.",
    category: "ai",
    react: "🤖",
    use: "<your query>",
    filename: __filename,
}, async (conn, mek, m, { from, args, q, reply }) => {
    try {
        // Check for user input
        if (!q) return reply("⚠️ Please provide a query for ChatGPT.\n\nExample:\n.gpt What is AI?");

        const text = q;
        const encodedText = encodeURIComponent(text);
        const url = `https://api.dreaded.site/api/chatgpt?text=${encodedText}`;

        console.log('Requesting URL:', url);

        // Call API with headers and timeout
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json',
            },
            timeout: 10000 // 10 seconds
        });

        console.log('Full API Response:', response.data);

        // Parse response
        const gptResponse = response.data.result?.prompt 
            || response.data.result 
            || response.data.response 
            || response.data.answer 
            || "⚠️ Couldn't parse a valid response from the API.";

        if (!gptResponse || gptResponse.length < 1) {
            return reply("❌ The API returned an empty response. Try again later.");
        }

        // Image to attach
        const ALIVE_IMG = 'https://i.imgur.com/R4ebueM.jpeg'; // Use your own image URL if needed
        const formattedInfo = `🤖 *ChatGPT Response:*\n\n${gptResponse}`;

        // Send message with image
        await conn.sendMessage(from, {
            image: { url: ALIVE_IMG },
            caption: formattedInfo,
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363357955960414@newsletter',
                    newsletterName: '𝐍𝐈𝐌𝐀-𝐌𝐃 𝐀𝐈',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in GPT command:", error);

        const errorDetails = error.response?.data?.message 
            || error.response?.data 
            || error.message 
            || "Unknown error";

        const errorMessage = `
❌ An error occurred while processing the GPT command.
🛠 *Error Details*:
${errorDetails}

Please report this issue or try again later.
        `.trim();

        return reply(errorMessage);
    }
});
