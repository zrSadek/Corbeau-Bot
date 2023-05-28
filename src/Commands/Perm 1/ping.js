const { EmbedBuilder } = require("discord.js")

exports.help = {
    name: 'ping',
    aliases: ["speed"],
    description: "permet d'obtenir la latence du bot.",
    perms: 1,
}

exports.run = async (client, message) => {
    const Embed = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp()
        .setFooter({ text: client.footer, iconURL: client.user.displayAvatarURL()})
 
        message.channel.send({
            embeds: [
                Embed.setDescription("`🏓` Ma latence est de : **" + Math.round(client.ws.ping) + "**ms")
            ]
        })
 
}