const fs = require('fs');
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { ComponentType } = require("discord.js"); 
const db = require("../../../index");

exports.help = {
  name: "perms",
  aliases: ["perm"],
  description: "Permet de configurer les permissions.",
  usage: "<add/remove> <2/3> <user>",
  example: "add 3 @sadek",
  perms: 4,
};


exports.run = async (client, message, args) => {

  const commands = client.commands
    
    const temp = client.template

    let wl = await db.get(`whitelist_${message.guild.id}`)
    let owner = await message.guild.fetchOwner();
    let data = await db.get(`perms_${message.guild.id}`) || { perms2: [], perms3: []}

    if(args[0] == "add") {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[2])

      temp.data.description = "`❌` Vous devez mentionner quelqu'un après la commande."
      if(!member) return message.reply({ embeds: [temp] })

      switch (args[1]) {
        case "5":
        case "4":
        case "1": 

        temp.data.description = "`❌` Ces permissions ne sont pas configurables !"
        return message.reply({ embeds: [temp] })

          break;
        case "2":
          
        if(data.perms2.includes(member.id)) {
          temp.data.description = "`❌` Cette personne figure déjà dans la permission 2 !"
          return message.reply({ embeds: [temp] })
        }

        data.perms2.push(member.id)
        await db.set(`perms_${message.guild.id}`, { perms2: data.perms2, perms3: data.perms3 })

        temp.data.description = "`✅` Utilisateur ajouté à la permission 2."
        return message.reply({ embeds: [temp] })

        break;


        case "3":
          
          if(data.perms3.includes(member.id)) {
            temp.data.description = "`❌` Cette personne figure déjà dans la permission 3 !"
            return message.reply({ embeds: [temp] })
          }

          data.perms3.push(member.id)
          await db.set(`perms_${message.guild.id}`, { perms3: data.perms3, perms2: data.perms2 })

          temp.data.description = "`✅` Utilisateur ajouté à la permission 3."
          return message.reply({ embeds: [temp] })

          break;

        default:
          temp.data.description = "`❌` Vous devez spécifiier une des permmissions suivantes: `2` & `3`."
          return message.reply({ embeds: [temp]})
          break;
      
      }
  } else if(args[0] == "remove" || args[0] == "del" || args[0] == "delete")  {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[2])

      temp.data.description = "`❌` Vous devez mentionner quelqu'un après la commande."
      if(!member) return message.reply({ embeds: [temp] })

    switch (args[1]) {

      case "5":
        case "4":
        case "1": 

        temp.data.description = "`❌` Ces permissions ne sont pas configurables !"
        return message.reply({ embeds: [temp] })

          break;
        case "2":
          
        if(!data.perms2.includes(member.id)) {
          temp.data.description = "`❌` Cette personne ne figure pas dans la permission 2 !"
          return message.reply({ embeds: [temp] })
        }

        data.perms2.splice(data.perms2.indexOf(member.id), 1);
        await db.set(`perms_${message.guild.id}`, { perms2: data.perms2, perms3: data.perms3 })

        temp.data.description = "`✅` Utilisateur retiré de la permission 2."
        return message.reply({ embeds: [temp] })

        break;


        case "3":
          
          if(!data.perms3.includes(member.id)) {
            temp.data.description = "`❌` Cette personne ne figure pas dans la permission 3 !"
            return message.reply({ embeds: [temp] })
          }

          data.perms3.splice(data.perms2.indexOf(member.id), 1);
          await db.set(`perms_${message.guild.id}`, { perms3: data.perms3, perms2: data.perms2 })

          temp.data.description = "`✅` Utilisateur retiré de la permission 3."
          return message.reply({ embeds: [temp] })

          break;

        default:
          temp.data.description = "`❌` Vous devez spécifiier une des permmissions suivantes: `2` & `3`."
          return message.reply({ embeds: [temp]})
        break;

    }
    
  } else {
    const embed = new EmbedBuilder()
    .setDescription(`Utilisez \`${client.prefix}help [nom de la commande]\` pour plus d'informations sur une commande spécifique.`)
    .addFields(
        { name: "Perm 1 (Public) ", value: commands.filter(cmd => cmd.help.perms == 1 ).map(cmd => `\`${cmd.help.name}\``).join(" - ") + "\n\n@everyone" },
        { name: "Perm 2 (Modérateur) ", value: commands.filter(cmd => cmd.help.perms == 2).map(cmd => `\`${cmd.help.name}\``).join(" - ") + "\n\n" + ( data && data.perms2 && data.perms2.length > 0 ? ("<@"+ data.perms2.join(">\n<@") + ">") : "*Personne*") },
        { name: "Perm 3 (Admin) ", value: commands.filter(cmd => cmd.help.perms == 3).map(cmd => `\`${cmd.help.name}\``).join(" - ") + "\n\n" + ( data && data.perms3 && data.perms3.length > 0 ? ("<@"+ data.perms3.join(">\n<@") + ">") : "*Personne*") },
        { name: "Perm 4 (Whitelist) ", value: commands.filter(cmd => cmd.help.perms == 4).map(cmd => `\`${cmd.help.name}\``).join(" - ") + "\n\n" + (wl && wl.length > 0 ? ("<@" + wl.join(">\n<@") + ">") : "*Personne*")},
        { name: "Perm 5 (Owner) ", value: commands.filter(cmd => cmd.help.perms == 5).map(cmd => `\`${cmd.help.name}\``).join(" - ") + `\n\n${owner.user}`}
        ) 
    .setFooter({
      text: client.footer,
      iconURL: client.user.displayAvatarURL()
    })
    .setTimestamp()
    .setColor(client.color);
    


    message.reply({ embeds: [embed]});

  }

}