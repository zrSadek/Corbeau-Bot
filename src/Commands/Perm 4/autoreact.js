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
    name: 'autoreact',
    description: "Ajoute une ou plusieurs réaction(s) à chaque message envoyé dans un salon.",
    usage: "<channel> <remove/reaction(s)>",
    example: "#salon 🍆 🍑",
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
  
    let data = await db.get(`autoreact_${channel.id}`)
  
    if (args[1] == "remove" || args[1] == "delete" || args[1] == "del") {
      embed.data.description = "`❌` Ce salon n'a aucun autoreact !"
      if (!data) return message.reply({
        embeds: [embed]
      });
  
      await db.delete(`autoreact_${channel.id}`)
  
      embed.data.description = "`✅` Autoreact supprimés avec succès."
      return message.reply({
        embeds: [embed]
      });
    }
    else {
    
        const regex = /<a?:\w+:\d+>|[\u{1F000}-\u{1F6FF}]|[\u{1F780}-\u{1F7FF}]|[\u{1F900}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|\w+/gu;
        const emojis = message.content.match(regex) || [];
  
      embed.data.description = "`❌` Vous devez indiquer un ou plusieurs émojis après le salon !"
      if (!emojis || !emojis[0]) return message.reply({
        embeds: [embed]
      });
  
      db.set(`autoreact_${channel.id}`, emojis)
  
      embed.data.description = "`✅` Autoreact crée avec succès."
      return message.reply({
        embeds: [embed]
      });
    }
  }