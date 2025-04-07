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
        // Check if user gave a query
        if (!q) return reply("⚠️ Please provide a query for ChatGPT.\n\nExample:\n.gpt What is AI?");

        const text = q;
        const encodedText = encodeURIComponent(text);
        const url = `https://api.dreaded.site/api/chatgpt?text=${encodedText}`;

        console.log('Requesting URL:', url);
        await conn.sendPresenceUpdate('composing', from); // typing indicator

        // API call
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json',
            },
            timeout: 10000
        });

        console.log("API RAW Response:", JSON.stringify(response.data, null, 2));

        // Safer response parsing
        let gptResponse = "";

        if (typeof response.data === "string") {
            gptResponse = response.data;
        } else if (typeof response.data.result === "string") {
            gptResponse = response.data.result;
        } else if (typeof response.data.result?.prompt === "string") {
            gptResponse = response.data.result.prompt;
        } else {
            gptResponse = response.data.result?.response ||
                          response.data.response ||
                          response.data.answer ||
                          response.data.message ||
                          JSON.stringify(response.data);
        }

        // If still empty
        if (!gptResponse || gptResponse.length < 1) {
            return reply("❌ The API returned an empty response. Try again later.");
        }

        // Image and message formatting
        const ALIVE_IMG = 'https://i.imgur.com/R4ebueM.jpeg';
        const formattedInfo = `🤖 *ChatGPT Response:*\n\n${gptResponse}`;

        // Send image + response
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
            || "Unknown error occurred.";

        const errorMessage = `
❌ An error occurred while processing the GPT command.
🛠 *Error Details*:
${errorDetails}

Please report this issue or try again later.
        `.trim();

        return reply(errorMessage);
    }
});
