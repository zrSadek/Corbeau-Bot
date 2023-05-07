const { Events, ActivityType, EmbedBuilder } = require("discord.js")
const db = require("../../../index.js")

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client, member) {
        let data = await db.get(`autoroles_${member.guild.id}`)
        if(!data || data <= 0) return;

        data.forEach(role => {
            member.roles.add(role).catch(err => {})
        });
    }
}