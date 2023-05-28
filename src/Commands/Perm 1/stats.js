const {
    EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Discord, MessageEmbed
  } = require("discord.js")
  
  exports.help = {
    name: 'stats',
    aliases: ["vc"],
    description: "Affiche les stats du serveur",
    perms: 1,
  }
  
  exports.run = async (client, message, args) => {


        const total = message.guild.memberCount
        const online = message.guild.presences.cache.filter((presence) => presence.status !== "offline").size
        const vocal = message.guild.members.cache.filter(m => m.voice.channel).size
        const boost = message.guild.premiumSubscriptionCount || '0'

        const embed = new EmbedBuilder()
            .setTitle(`${message.guild.name} Statistiques`)
            .setURL('https://discord.gg/eather')
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setDescription(`> *Membres :* **${total}** <:membres:1060325216057823242>\n> *En ligne :* **${online}** <:online:1108768076108931102> \n> *En vocal :* **${vocal}** <:voc:1108768104890236989> \n> *Boost :* **${boost}** <a:boost:1108768127870836866>`)
            .setFooter({ text: `Eather` })
            .setTimestamp()
        message.channel.send({ embeds: [embed] })
        message.delete()
}