const { Events, ActivityType, EmbedBuilder } = require("discord.js")
const db = require("../../../index.js")

module.exports = {
    name: Events.MessageCreate,
    async execute(client, message) {
        if(message.author.id == client.user.id) return;

        let data = await db.get(`countonly_${message.channel.id}`)
        if(!data) return;

        if( !message.content || message.content != data.lastnumber + 1) {

            message.reply({ content: `${message.author} Le prochain nombre correcte est **${data.lastnumber + 1}** !`})
            .then((m) => {
                message.delete()
                setTimeout(() => { m.delete() }, 2500)
            })
        } else {
            db.set(`countonly_${message.channel.id}`, { lastnumber: data.lastnumber + 1 })
        }

    }
}