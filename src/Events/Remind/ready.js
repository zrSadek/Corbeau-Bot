const { Events, ActivityType, EmbedBuilder } = require("discord.js")
const db = require("../../../index.js")
module.exports = {
    name: Events.ClientReady,
    async execute(client) {

        setInterval(async () => {
            let time = Date.now()
            let data = await db.get("reminds") || []
            db.set("reminds", data.filter(x => x.date > time))
            data = data.filter(x => x.date <= time)
            data.forEach(x => {
                let user = client.users.cache.get(x.authorId)
                user.send("⏰ **Remind:**" + x.content).catch(err => {})
            });

        }, 2000)
    }
}