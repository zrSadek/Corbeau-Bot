const { Events, ActivityType, EmbedBuilder } = require("discord.js")
const db = require("../../../index.js")

module.exports = {
    name: Events.MessageCreate,
    async execute(client, message) {
        let data = await db.get(`piconly_${message.channel.id}`)
        if(!data) return;

        if(message.author.bot) return;
        if(!message.attachments.first()?.url) {
            message.delete();
            return message.channel.send({
                content: `${message.author} Ce salon est en piconly !`
            })
            .then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 2500)
            })
        } 
    }
}