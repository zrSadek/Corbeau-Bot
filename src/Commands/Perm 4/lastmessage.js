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
    name: 'lastmsg',
    aliases: ["lastmessage"],
    description: "Envois un message configuré à chaque message et supprime le précedent.",
    usage: "<channel> <remove/message>",
    example: "#salon Salut !",
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
  
    let data = await db.get(`lastmsg_${channel.id}`)
  
    if (args[1] == "remove" || args[1] == "delete" || args[1] == "del") {
      embed.data.description = "`❌` Ce salon n'a aucun last message configuré !"
      if (!data) return message.reply({
        embeds: [embed]
      });
  
        db.delete(`lastmsg_${channel.id}`)
  
      embed.data.description = "`✅` Last message supprimé avec succès."
      return message.reply({
        embeds: [embed]
      });
    }
    else {
  
      embed.data.description = "`❌` Vous devez indiquer message après le salon !"
      if (!args[1]) return message.reply({
        embeds: [embed]
      });
  
      db.set(`lastmsg_${channel.id}`, { message: (args.join(" ")).replace(args[0], "")} )
  
      embed.data.description = "`✅` Last message crée avec succès."
      return message.reply({
        embeds: [embed]
      });
    }
  }