const { Events, ActivityType, EmbedBuilder } = require("discord.js")
const db = require("../../../index.js")

module.exports = {
    name: Events.MessageCreate,
    async execute(client, message) {

        
        if(message.content.includes("lastmsg")) return;
        let data = await db.get(`lastmsg_${message.channel.id}`)
        if(!data) return;

        if(message.author.id == client.user.id) return;
        
        if(data.lastmsg) {
                message.channel.messages.fetch(data.lastmsg).then((m) => {
                m.delete().catch(err => {})
            })
        } 

        return await message.channel.send({
            content: data.message
        })
        .then((m) => {
            db.set(`lastmsg_${message.channel.id}`, { message: data.message, lastmsg: m.id } )
        })

    }
}