const { Events, ActivityType, EmbedBuilder } = require("discord.js")
const db = require("../../../index.js")
module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        console.log('\x1b[33m' + 'Connectés à ' + '\x1b[35m' + `${client.user.username}` + '\x1b[33m' + ' !\n' + '\x1b[33m' + '-> Le bot est utilisé sur ' + '\x1b[35m' + `${client.guilds.cache.size}` + '\x1b[33m' + ' serveurs pour un total de ' + '\x1b[35m' + `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}` + '\x1b[33m' + ' membres !')
client.guilds.cache.forEach((g) => {
    console.log(g.name)
})
        let status = await db.get(`bot_${client.user.id}`)
        status = status && status.status ? status.status : `${client.users.cache.size} membres | v1.0.2`

        client.user.setPresence({
            activities: [{ name: status, type: ActivityType.Watching }],
            status: 'dnd'
        })
    }
}