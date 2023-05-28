exports.help = {
    name: 'kick',
    description: "Permet de kick un utilisateur.",
    usage: "<user/id>",
    example: "@Sadek | 513066398847729696",
    perms: 2,
}

exports.run = async (client, message, args) => {
    const embed = client.template
    embed.data.description = "`❌` Je n'ai pas trouvé d'utilisateur à expulser."

    let userToKick;
    if (message.mentions.members && message.mentions.members.first()) {
        userToKick = message.mentions.members.first().user;
    } else {
      userToKick = await message.guild.members.cache.get(args[0]).catch(err => {})
    }    if(!userToKick) return message.reply({embeds: [embed]})

    embed.data.description = "`❌` Vous ne pouvez pas vous expulser vous même."
    if(userToKick.id === message.author.id) return message.reply({embebs: [embed]})

    embed.data.description = "`❌` Vous ne pouvez kick que les membres hiérarchiquement inferieurs à vous."
    if(!message.member.roles || userToKick.member && message.member.roles.highest.position <= member.roles.highest.position) return message.reply({embeds: [embed]})

    message.guild.members.cache.get(userToKick.id).kick({reason: `Expulsé par ${message.author.tag}`})
        .then(() => {
        embed.data.description = "`✅` Le membre a bien été expulsé avec succès."
        return message.reply({embeds: [embed]})
    })
        .catch(err => {
        embed.data.description = "`❌` Je ne peux pas expulser ce membre."
        return message.reply({embeds: [embed]})
    })
}