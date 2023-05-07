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
    name: 'setsuggest',
    aliases: ["suggest-config", "confiig-suggest"],
    description: "Permet de configurer le salon des suggestions.",
    perms: 4,
  };
  
  exports.run = async (client, message, args) => {
    const embed = client.template
  
    let data = await db.get(`suggest_${message.guild.id}`);
  
    if (!args[0]) {
      embed.data.description = data ? `Salon de suggestion actuel: <#${data}>` : "`❌` Aucun salon de suggestions n'a été configuré.";
      return message.reply({
        embeds: [embed]
      })
    }
  
    if (args[0] == "remove" || args[0] == "delete" || args[0] == "del") {
      if (!data) {
        embed.data.description = "`❌` Aucun salon de suggestions n'a été configuré.";
        return message.reply({
          embeds: [embed]
        })
      }
      else {
        db.delete(`suggest_${message.guild.id}`);
        embed.data.description = "`✅` Salon de suggestions supprimé.";
        return message.reply({
          embeds: [embed]
        })
      }
    }

    let channel;
    if(message.mentions && message.mentions.channels.first()) {
        channel = message.mentions.channels.first();
    } else {
        channel = message.guild.channels.cache.get(args[0]);
    }

    if(!channel) { 
        embed.data.description = "`❌` Vous devez mentionner un salon de suggestions.";
        return message.reply({
          embeds: [embed]
        })
    }

    db.set(`suggest_${message.guild.id}`, channel.id);
    embed.data.description = "`✅` Salon de suggestions configuré.";
    return message.reply({
      embeds: [embed]
    })

  }