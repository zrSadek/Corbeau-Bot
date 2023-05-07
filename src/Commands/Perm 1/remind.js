const { EmbedBuilder } = require("discord.js")
const db = require("../../../index")
const ms = require("ms")

exports.help = {
    name: 'remind',
    description: "Te rappelle quelque chose après x temps.",
    perms: 1,
    usage: "<temps> <texte>",
    example: "10m T'es beau"
}

exports.run = async (client, message, args) => {
    let emb = client.template

    emb.data.description = "`❌` Vous devez indiquer un temps en plus du texte à vous rappeler."
    if(!args || !args[0]) return message.channel.send({ embeds: [emb]})

    let time = ms(args[0])

    emb.data.description = "`❌` Vous devez indiquer un temps valide."
    if(!time || isNaN(time)) return message.channel.send({ embeds: [emb]})

    let query = args.join(" ").replace(args[0], "")

    emb.data.description = "`❌` Vous devez indiquer quelque chose à remind."
    if(!query) return message.channel.send({ embeds: [emb] });

    db.push("reminds", { authorId: message.author.id, content: query, date: Date.now() + time })

    emb.data.description = "`✅` Votre remind a été crée."
    message.channel.send({ embeds: [emb] })
}