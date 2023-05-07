const {
    EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
  } = require("discord.js")
  
  exports.help = {
    name: 'say',
    description: "Permret de faire dire quelque chose au bot.",
    perms: 1,
  }
  
  exports.run = async (client, message, args) => {
    const embed = client.template
    embed.data.description = "`❌` Vous devez dire quelque chose après la commande."
  
    if(!args[0]) return message.channel.send({embeds: [embed]})
  

    let author = new ButtonBuilder()
    author.setLabel(`Envoyé par ${message.author.tag}`)
    author.setStyle(ButtonStyle.Link)
    author.setURL(`https://discord.com/channels//@me/${message.author.id}`)

    message.delete()
    return message.channel.send({content: args.join(" "), components: [new ActionRowBuilder().addComponents(author)], allowedMentions: { parse: [] }});
  }