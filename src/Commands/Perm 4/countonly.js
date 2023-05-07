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
    name: 'countonly',
    description: "Rend un salon un salon de comptage.",
    usage: "<channel> <on/off>",
    example: "#salon",
    perms: 4,
  };
  
  exports.run = async (client, message, args) => {
    const embed = client.template
    embed.data.description = "Vous devez spécifier un salon après la commande."
  
    if (!args[0]) return message.reply({
      embeds: [embed]
    });
  
    let channel;
    if (message.mentions && message.mentions.channels.first()) {
      channel = message.mentions.channels.first();
    }
    else {
      channel = message.guild.channels.cache.get(args[0]);
    }
  
    if (!channel) return message.reply({
      embeds: [embed]
    });
  
    let data = await db.get(`countonly_${channel.id}`)
  
    if (args[1] == "remove" || args[1] == "delete" || args[1] == "off") {

      if (!data) {
        embed.data.description = "`❌` Ce salon n'est pas en count only!"

        return message.reply({
        embeds: [embed]
      });
      }
  
        db.delete(`countonly_${channel.id}`)
  
      embed.data.description = "`✅` Le salon n'est donc plus en count only."
      return message.reply({
        embeds: [embed]
      });
    }
    else {
        if (data) {
            embed.data.description = "`❌` Ce salon est déjà en count only !"
    
            return message.reply({
            embeds: [embed]
          });
          }

      db.set(`countonly_${channel.id}`, { lastnumber: 0 })
  
      embed.data.description = "`✅` Le salon est désormais en count only."
      return message.reply({
        embeds: [embed]
      });
    }
  }