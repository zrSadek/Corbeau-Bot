const { Events, ActivityType, EmbedBuilder } = require("discord.js")
const db = require("../../../index.js")

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client, member) {
        let blUsers = await db.get("blacklist")
        if(blUsers && blUsers.includes(member.user.id)) {
            member.ban({ reason: "Blacklisted" }).catch(err => {})
        }
    }
}