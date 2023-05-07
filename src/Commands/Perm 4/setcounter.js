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
    name: 'setcounter',
    aliases: ["setcompteur", "compteur"],
    description: "Permet d'ajouter ou supprimer un compteur.",
    usage: "<channel> <del>",
    example: "#salon",
    perms: 4,
  };
  
  exports.run = async (client, message, args) => {
    const embed = client.template
    embed.data.description = "Vous devez spécifier un salon après la commande."

    if (!args[0]) return message.reply({
      embeds: [embed]
    });
  
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
    if(!channel) return message.reply({ embeds: [embed] });

    embed.data.description = "Vous devez mentionner un salon vocal."
    if(channel.type != 2) return message.reply({ embeds: [embed] });

    let data = await db.get(`compteurs_${message.guild.id}`) || []

    if(args[1] == "del" || args[1] == "delete" || args[1] == "remove") {
        let chan = data.find(x => x.channel == channel.id)

        embed.data.description = "Compteur introuvable."
        if(!chan) return message.reply({ embeds: [embed] });

        data = data.filter(x => x.channel != channel.id);

        db.set(`compteurs_${message.guild.id}`, data)
        embed.data.description = "`✅` Le compteur a bien été supprimé."
        return message.reply({ embeds: [embed] });

    } else {

    embed.data.description = "Ce salon est déjà un salon compteur !"
     if( data.find(x => x.channel == channel.id)) return message.reply({ embeds: [embed] });


     embed.data.description = "Vous avez déjà le nombre maximum de compteur."
     if(data.length == 5) return message.reply({ embeds: [embed] });

     embed.data.description = "Indiquez le texte du compteur. Exemple: `Membres: [server.memberCount]`"
     let a = await message.channel.send({embeds: [embed]})


     let text = await message.channel.awaitMessages({ filter: m => m.author.id == message.author.id, max: 1, time: 30000})
     a.delete()

     if(!text || text.size == 0) {
         embed.data.description = "`❌` Vous devez indiquer le texte du compteur."
         return message.channel.send({ embeds: [embed]}).then((a) => {setTimeout(() => a.delete(), 3000)})
     }

     db.push(`compteurs_${message.guild.id}`, { channel: channel.id, text: text.first().content})
     embed.data.description = "`📁` Le compteur a bien été crée."
     return message.reply({ embeds: [embed] });

    }

  }