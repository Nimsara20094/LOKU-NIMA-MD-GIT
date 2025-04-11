const { reactionMessage } = require('@whiskeysockets/baileys')

module.exports = {
  name: 'status-reaction',
  description: 'React to just now seen WhatsApp status with an emoji',

  async handler(conn) {
    conn.ev.on('messages.upsert', async ({ messages }) => {
      const msg = messages[0]
      if (!msg.message || msg.key.fromMe) return

      const isStatus = msg.key.remoteJid === 'status@broadcast'
      const msgTimestamp = msg.messageTimestamp * 1000
      const now = Date.now()

      if (isStatus && (now - msgTimestamp < 60000)) { // Just now seen status
        console.log('Reacting to Status:', msg.pushName || msg.participant)

        try {
          // Optional: mark as read
          await conn.readMessages([msg.key])

          // Send a reaction (you can change the emoji here)
          await conn.sendMessage(msg.key.remoteJid, {
            react: {
              text: '❤️',
              key: msg.key,
            },
          })
        } catch (err) {
          console.error('Error reacting to status:', err)
        }
      }
    })
  }
}
