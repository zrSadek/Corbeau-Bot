const { EmbedBuilder } = require("discord.js")

exports.help = {
    name: '8ball',
    description: " permet de poser une quesiton au bot si t'as pas d'amis.",
    perms: 1,
    usage: "<question>",
    example: "es-que karma est gay ?"
}

exports.run = async (client, message) => {
    const Embed = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp()
        .setFooter({ text: client.footer, iconURL: client.user.displayAvatarURL()})
 
    let question = message.content.substring(message.content.indexOf(`${client.prefix}8ball`) + `${client.prefix}8ball`.length);

    let emb = client.template
    emb.data.description = "`❌` Vous devez indiquer une question."
    if(!question) return message.channel.send({ embeds: [emb] });

    let answers = ["Oui", "Non", "Peut être", "Mouais", "Je sais pas", "Pourquoi tu me demandes ça à moi ?", "Bonne question", "M'enfou", "Blc", "Lâche ma queue", "Carrément gros", "En vrai y'a moyen"]

        message.channel.send({
            embeds: [
                Embed.addFields({
                    name: answers[Math.floor(Math.random() * answers.length)],
                    value: question,
                })
            ]
        })
 
}