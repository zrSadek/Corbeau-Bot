const {
    EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
  } = require("discord.js")
  
  exports.help = {
    name: 'sayanonyme',
    aliases: ["sayanonym", "anonymsay", "anonyme"],
    description: "Permret de faire dire quelque chose au bot sans avoir son pseudo écrit dans un boutton.",
    perms: 3,
  }
  
  exports.run = async (client, message, args) => {
    const embed = client.template
    embed.data.description = "`❌` Vous devez dire quelque chose après la commande."
  
    if(!args[0]) return message.channel.send({embeds: [embed]})

    message.delete()
    return message.channel.send({content: args.join(" "), allowedMentions: { parse: [] }});
  }