const { Events, ActivityType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")
const db = require("../../../index.js")

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client, member) {

        if(member.guild.id == "1047251885121343488") return;
        if(member.user.bot) return;
        let data = await db.get(`dmmessage_${member.guild.id}`) || { message: "Bienvenue dans **" + member.guild.name + ".**\nN'hésite pas à rejoindre mon serveur support ou à m'ajouter !\nhttps://discord.gg/Ff5gRBBnBq"}

        let author = new ButtonBuilder()
        author.setLabel(`Envoyé depuis ${member.guild.name}`)
        author.setStyle(ButtonStyle.Link)
        author.setURL(`https://discord.com/channels/@me/${member.guild.id}`)

        member.user.send({ content: data.message, components: [new ActionRowBuilder().addComponents(author)]}).catch(err => { })
    }
}