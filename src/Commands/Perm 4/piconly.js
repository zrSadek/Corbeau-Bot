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
    name: 'piconly',
    aliases: ["pics"],
    description: "N'autorise que les messages qui contiennt une image.",
    usage: "<channel> <on/off>",
    example: "#salon off",
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
  
    let data = await db.get(`piconly_${channel.id}`)
  
    if (args[1] == "remove" || args[1] == "delete" || args[1] == "off") {

      if (!data) {
        embed.data.description = "`❌` Ce salon n'est pas en pic only !"

        return message.reply({
        embeds: [embed]
      });
      }
  
        db.delete(`piconly_${channel.id}`)
  
      embed.data.description = "`✅` Le salon n'est donc plus en piconly."
      return message.reply({
        embeds: [embed]
      });
    }
    else {
        if (data) {
            embed.data.description = "`❌` Ce salon est déjà en pic only !"
    
            return message.reply({
            embeds: [embed]
          });
          }

      db.set(`piconly_${channel.id}`, true )
  
      embed.data.description = "`✅` Le salon est désormais en pic only."
      return message.reply({
        embeds: [embed]
      });
    }
  }