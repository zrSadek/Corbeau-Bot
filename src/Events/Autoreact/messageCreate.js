const { Events, ActivityType, EmbedBuilder } = require("discord.js")
const db = require("../../../index.js")

module.exports = {
    name: Events.MessageCreate,
    async execute(client, message) {
        let data = await db.get(`autoreact_${message.channel.id}`)
        if(!data) return;

        console.log(data)

        data.forEach(async (emoji) => {
                await message.react(emoji).catch(err => {})
        });
    }
}