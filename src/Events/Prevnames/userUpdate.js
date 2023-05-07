const { Events, ActivityType, EmbedBuilder } = require("discord.js")
const db = require("../../../index.js")

module.exports = {
    name: Events.UserUpdate,
    async execute(client, oldUser, newUser) {
        if (oldUser.username != newUser.username) {
            db.push(`prevname_${oldUser.id}`, `${oldUser.username}/${Math.floor(Date.now() / 1000)}`);
          }
    }
}