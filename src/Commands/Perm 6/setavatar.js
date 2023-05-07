const {
    EmbedBuilder
  } = require("discord.js")
  const db = require("../../../index.js")
  
  exports.help = {
    name: 'setavatar',
    description: "Te permet de changer la pp du bot.",
    aliases: ["setpp"],
    usage: "<image>",
    example: "https://image.png",
    perms: 6,
  }
  
  exports.run = async (client, message, args) => {
    const embed = client.template
    embed.data.description = "`❌` Image invalide"

    let image = message.attachments.first()?.url
    if(!image) return message.reply({ embeds: [embed]})

    client.user.setAvatar(image)
    .then(() => {
        embed.data.description = "`✅` La pp du bot a été changée avec succès."
        message.reply({ embeds: [embed] })
    })
    .catch(err => {
        embed.data.description = "`❌` Une erreur est survenue (Vous changez possiblement trop rapidement de pp)."
        message.reply({ embeds: [embed] })
    })
    
 }