const { Events, ActivityType, EmbedBuilder } = require("discord.js")
const db = require("../../../index.js")
module.exports = {
    name: Events.ClientReady,
    async execute(client) {

        client.guilds.cache.forEach(async guild => {
            let data = await db.get(`compteurs_${guild.id}`) || []
            
            setInterval(() => {
            data.forEach((channelData) => {
                guild.channels.cache.get(channelData.channel).edit({
                    name: channelData.text
                    .replaceAll("[server.roles]", `${guild.roles.cache.size}`)
                    .replaceAll("[server.channels]", `${guild.channels.cache.size}`)
                    .replaceAll("[server.boosts]", `${guild.premiumSubscriptionCount}`)
                    .replaceAll("[server.onlines]", `${guild.members.cache.filter(m => m.presence && m.presence.status != "offline").size}`)
                    .replaceAll("[server.memberCount]", `${guild.memberCount}`)
                })
            })
        })
    }, 450000)
    }
}