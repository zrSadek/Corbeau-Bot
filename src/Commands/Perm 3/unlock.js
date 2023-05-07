const { EmbedBuilder } = require("discord.js")
const db = require("../../../index.js")
const { PermissionsBitField } = require("discord.js")

exports.help = {
    name: 'unlock',
    description: "Permet de unlock un ou plusieurs salons.",
    usage: "<role/id>",
    example: "@role",
    perms: 3,
}

exports.run = async (client, message, args) => {
    const embed = client.template
 
    let role = false;

    if (message.mentions && message.mentions.roles.first()) {
        role = message.mentions.roles.first();
    } else {
        role = await message.guild.roles.cache.get(args[0])
    }

    message.channel.permissionOverwrites.edit(role ? role.id : message.guild.id, { SendMessages: true })
    .then(() => {
        embed.data.description = "`🔓` La permission d'écrire a été donnée au rôle " + (role ? "<@&" + role.id + ">" : "@everyone" )+ "."
        return message.channel.send({embeds: [embed]})
    })
    .catch(() => {
        embed.data.description = "`❌` Une erreur est survenue lors du deverouillage du salon."
        return message.channel.send({embeds: [embed]})
    })
}