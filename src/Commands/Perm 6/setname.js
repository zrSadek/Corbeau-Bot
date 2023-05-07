const {
    EmbedBuilder
  } = require("discord.js")
  const db = require("../../../index.js")
  
  exports.help = {
    name: 'setname',
    description: "Te permet de changer le pseudo du bot.",
    aliases: ["setusername"],
    usage: "<name>",
    example: "corbeau bot",
    perms: 6,
  }
  
  exports.run = async (client, message, args) => {

    const embed = client.template
    embed.data.description = "`❌` Vous devez indiquer un pseudo."

    if(!args[0]) return message.reply({ embeds: [embed]})

    client.user.setUsername(args.join(" "))
    .then(() => {
        embed.data.description = "`✅` Le pseudo du bot a été changée avec succès."
        message.reply({ embeds: [embed] })
    })
    .catch(err => {
        embed.data.description = "`❌` Une erreur est survenue (Vous changez possiblement trop rapidement de pseudo)."
        message.reply({ embeds: [embed] })
    })
    
 }