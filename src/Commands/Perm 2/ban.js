const { EmbedBuilder } = require("discord.js")
const db = require("../../../index.js")
const { PermissionsBitField } = require("discord.js")

exports.help = {
    name: 'ban',
    description: "Permet de ban un Utilisateur.",
    usage: "<user/id>",
    example: "@Sadek / 513066398847729696",
    perms: 2,
}

exports.run = async (client, message, args) => {
    const embed = client.template

    const banList = await message.guild.bans.fetch()

    if (args[0] == "list") {
      let embedList = new EmbedBuilder()
        .setTimestamp()
        .setFooter({text: client.footer, iconURL: client.user.displayAvatarURL()})
        .setColor(client.color)
        .addFields({
          name: "Liste des membres bannis",
          value: (banList.size > 0 ? banList.map(user => user.user.tag + " (`" + user.user.id + "`)").join("\n") : "*Aucun membre n'est bannis*")
        })

      return message.reply({
        embeds: [embedList]
      });
  
    }

    embed.data.description = "`❌` Je n'ai pas trouvé d'utilisateur à bannir."

    let userToBan;
    if (message.mentions.member && message.mentions.users.first()) {
      userToBan = message.mentions.users.first()
    } else {
      userToBan = await client.users.fetch(args[0]).catch(err => {})
    }    
    if(!userToBan) return message.reply({embeds: [embed]})

    embed.data.description = "`❌` Vous ne pouvez pas vous bannir vous même."
    if(userToBan.id === message.author.id) return message.reply({embebs: [embed]})

    embed.data.description = "`❌` Ce membrbe est déjà banni."

    if(banList.find(ban => ban.user.id === userToBan.id)) return message.reply({ 
      embeds: [embed]
    })

    embed.data.description = "`❌` Vous ne pouvez ban que les membres hiérarchiquement inferieurs à vous."
    if( !message.member.roles || userToBan.member && message.member.roles.highest.position <= userToBan.roles.highest.position) return message.reply({embeds: [embed]})

    message.guild.members.ban(userToBan, {reason: `Banni par ${message.author.tag} (force à toi)`})
        .then(() => {
        embed.data.description = "`✅` Le membre a bien été banni avec succès."
        return message.reply({embeds: [embed]})
    })
        .catch(err => {
        embed.data.description = "`❌` Je ne peux pas bannir ce membre."
        return message.reply({embeds: [embed]})
    })
}
