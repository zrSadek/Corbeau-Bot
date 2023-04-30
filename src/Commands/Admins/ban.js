const { EmbedBuilder } = require("discord.js")
const db = require("../../../index.js")
const { PermissionsBitField } = require("discord.js")

exports.help = {
    name: 'ban',
    description: "Te permet de bannir un membre.",
    usage: "<user/id>",
    example: "@Hawk / 382936822860218370",
    perms: 2,
}

exports.run = async (client, message, args) => {
    const embed = client.template
    embed.data.description = "`❌` Je n'ai pas trouvé d'utilisateur à bannir."

    let userToBan;
    if (message.mentions.member && message.mentions.members.first()) {
      userToBan = message.mentions.members.first().user;
    } else {
      userToBan = await client.users.fetch(args[0]).catch(err => {})
    }    if(!userToBan) return message.reply({embeds: [embed]})

    embed.data.description = "`❌` Vous ne pouvez pas vous bannir vous même."
    if(userToBan.id === message.author.id) return message.reply({embebs: [embed]})

    message.guild.members.cache.get(userToBan.id).ban({reason: `Banni par ${message.author.tag} (force à toi)`})
    .catch(err => {
        embed.data.description = "`❌` Je ne peux pas bannir ce membre."
        return message.reply({embeds: [embed]})
    })
    .then(() => {
        embed.data.description = "`✅` Le membre a bien été banni avec succès."
        return message.reply({embeds: [embed]})
    })
}