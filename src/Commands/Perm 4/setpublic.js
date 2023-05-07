
const {
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ComponentType,
    ActionRowBuilder,
    RoleSelectMenuBuilder
  } = require("discord.js");
  const db = require("../../../index.js");
  
  exports.help = {
    name: 'public',
    aliases: ["setpublic"],
    description: "Désactive les commandes de perm 1, au public.",
    usage: "<on/off>",
    example: "on",
    perms: 4,
  };
  
  exports.run = async (client, message, args) => {
    const embed = client.template
    embed.data.description = "Vous devez spécifier on `ou` `off` après la commande."
  

    let data = await db.get(`public_${message.guild.id}`)

    
    if (!args[0]) return message.reply({
      embeds: [embed]
    });

    if(args[0] === "on") {
        embed.data.description = "Le bot est déjà en public `on` !"
        if(!data) return message.reply({ embeds: [embed] })
        
        await db.delete(`public_${message.guild.id}`)

        embed.data.description = "Le bot est désormais en public `on`!"
        return message.reply({
          embeds: [embed]
        })
    } else {
        embed.data.description = "Le bot est déjà en public `off`!"
        if(data) return message.reply({ embeds: [embed] })
        
        await db.set(`public_${message.guild.id}`, true)
        
        embed.data.description = "Le bot est désormais en public `off`!"
        return message.reply({
          embeds: [embed]
        })
    }

}