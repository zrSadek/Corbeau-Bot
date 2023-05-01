const {
    EmbedBuilder
  } = require("discord.js")
  const db = require("../../../index.js")
  
  exports.help = {
    name: 'setprefix',
    description: "Te permet de changer le préfixe du bot",
    usage: "<prefix>",
    example: "a!",
    perms: 5,
  }
  
  exports.run = async (client, message, args) => {
    const embed = client.template
  
    embed.data.description = "`❌` Vous devez spécifier le prefix du bot."
    if (!args[0]) return message.reply({
      embeds: [embed]
    })
  
    embed.data.description = "`❌` Le prefix est déjà égal à **`" + args[0] + "`**."
    if (args[0] == client.prefix) return message.reply({
      embeds: [embed]
    })
  
    db.set("prefix", args[0])
    client.prefix = args[0]
  
    embed.data.description = "`✅` Le prefix a été changé en **`" + args[0] + "`**."
    message.reply({
      embeds: [embed]
    })
  }