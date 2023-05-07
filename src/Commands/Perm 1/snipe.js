const { EmbedBuilder } = require("discord.js")

exports.help = {
    name: 'snipe',
    description: "Permet de voir le dernier message supprimé.",
    perms: 1,
    usage: "<nombre>",
    example: "12"
}

exports.run = async (client, message, args) => {
    
    const snipeMap = client.snipeMap

    const emb = client.template
    emb.data.description = "`❌` Il n'y a aucun message supprimé à snipe."

    if(!snipeMap || !snipeMap.get(message.channel.id)) return message.reply({ embeds: [emb]})

    let snipeNumber = 0

    if(args[0] && !isNaN(parseInt(args[0]))) {
        snipeNumber = parseInt(args[0]) - 1
    }

    let snipe = snipeMap.get(message.channel.id)
    if(snipe.length <= snipeNumber || snipeNumber < 1 ) snipeNumber = snipe.length - 1

    const embed = new EmbedBuilder()
    .setColor(client.color)
    .setTimestamp()
    .setFooter({
        text: `Snipe ${snipeNumber + 1}/${snipe.length}`,
    })
    .setImage(snipe[snipeNumber].image ? snipe[snipeNumber].image : null)
    .setAuthor({
        name: `${snipe[snipeNumber].author.tag}`,
        iconURL: snipe[snipeNumber].author.displayAvatarURL()
    })
    
    if(snipe[snipeNumber].content) {
        embed.addFields({
            name: "Contenu du message",
            value: snipe[snipeNumber].content,
            inline: true
        })
    }

    message.reply({ embeds: [embed] })
}