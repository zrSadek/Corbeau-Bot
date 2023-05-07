const {
    EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
  } = require("discord.js")
const ms = require("ms")

  exports.help = {
    name: 'cooldown',
    aliases: ["setcooldown", "set-cooldown", "cd"],
    description: "Permet de changer le cooldown d'un salon.",
    perms: 3,
  }
  
  exports.run = async (client, message, args) => {
    const embed = client.template
    embed.data.description = "`❌` Vous devez indiquer le nouveau temps de cooldown après la commande."
 
    if(!args[0]) args = false
  
    message.channel.edit({
        rateLimitPerUser: ms(args ? args[0] : "5s") / 1000,
    })
    .then(() => {
        embed.data.description = "`✅` Le cooldown a été mit à `" + (args[0] || "5s") + "` avec succès."
        message.channel.send({ embeds: [embed]})
    })
    .catch(err => {
        console.log(err)
        embed.data.description = "`❌` Le temps doit être comprit entre `1s` et `6h`."
        message.channel.send({ embeds: [embed]})
    })
  }