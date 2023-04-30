const { Events, ActivityType, EmbedBuilder } = require("discord.js")
const db = require("../../../index.js")

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client, member) {
        let data = await db.get(`greet_${member.guild.id}`)
        if(!data || !data.message || !data.state || !data.time || !data.channel ) return;
        let channel = member.guild.channels.cache.get(data.channel)
        if(!channel) return

        let owner = await member.guild.fetchOwner()

        channel.send({
            content: data.message
            .replaceAll("[user]", `${member.user}`)
            .replaceAll("[user.id]", `${member.user.id}`)
            .replaceAll("[user.username]", `${member.user.username}`)
            .replaceAll("[user.tag]", `${member.user.tag}`)
            .replaceAll("[user.createdAt]", `${member.user.createdAt}`)
            .replaceAll("[server]", `${member.guild.name}`)
            .replaceAll("[server.id]", `${member.guild.id}`)
            .replaceAll("[server.memberCount]", `${member.guild.memberCount}`)
            .replaceAll("[server.owner]", `${owner.user}`)
            .replaceAll("[server.owner.id]", `${owner.user.id}`)
            .replaceAll("[server.owner.username]", `${owner.user.username}`)
            .replaceAll("[server.owner.tag]", `${owner.user.tag}`)
            .replaceAll("[server.icon]", `${member.guild.icon}`)
            .replaceAll("[server.createdAt]", `${member.guild.createdAt}`)
            .replaceAll("[server.roles]", `${member.guild.roles.cache.size}`)
            .replaceAll("[server.channels]", `${member.guild.channels.cache.size}`)
        })
        .then((msg) => {
            setTimeout(() => { msg.delete().catch(err => {}) }, data.time * 1000)
        })

    }
}