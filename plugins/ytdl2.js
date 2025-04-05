case 'song': {
    try {
        if (!text) {
            reply('🎵 Enter a YouTube Link or Search Query!\nExample: *song Blinding Lights*');
            await doReact("❌");
            return;
        }

        reply('⏳ Fetching audio, please wait...');
        await doReact("🕘");

        const isUrl = ytdl.validateURL(text);
        let videoInfo;

        if (isUrl) {
            videoInfo = await ytdl.getInfo(text);
        } else {
            const searchResult = await yts(text);
            if (!searchResult.videos.length) {
                reply('❌ No results found. Try a different query.');
                await doReact("❌");
                return;
            }
            videoInfo = await ytdl.getInfo(searchResult.videos[0].url);
        }

        const { videoDetails } = videoInfo;
        if (parseInt(videoDetails.lengthSeconds) > 600) {
            reply('⚠️ The audio is too long (max 10 minutes).');
            return;
        }

        const audioStream = ytdl(videoDetails.video_url, { filter: 'audioonly', quality: 'highestaudio' });

        await saitama.sendMessage(m.chat, {
            image: { url: videoDetails.thumbnails[0].url },
            caption: 
╭═════════•∞•══╮
│ 🎶 *TIFFANY'S MUSIC HQ*
│ 🎵 *YouTube Audio Player*
│ 🎼 *Title:* ${videoDetails.title}
│ 📅 *Upload Date:* ${videoDetails.uploadDate}
│ ⏱ *Duration:* ${formatDuration(videoDetails.lengthSeconds)}
│ 📽 *Channel:* ${videoDetails.author.name}
╰══•∞•═════════╯

        }, { quoted: m });

        await saitama.sendMessage(m.chat, { audio: { stream: audioStream }, mimetype: 'audio/mpeg' }, { quoted: m });
        await doReact("✅");

    } catch (error) {
        console.error('Error fetching song:', error);
        reply('❌ An error occurred. Try again later.');
        await doReact("❌");
    }
        }
