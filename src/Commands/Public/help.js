const fs = require('fs');
const { EmbedBuilder } = require("discord.js");

exports.help = {
  name: "help",
  aliases: ["cmds"],
  description: "Liste toutes les commandes disponibles.",
  perms: 1,
};

exports.run = async (client, message, args) => {
  const commands = client.commands

  if (!args.length) {

    const ownerCommands = [...commands.values()].filter(cmd => cmd.help.perms === 4).map(cmd => `\`${client.prefix}${cmd.help.name}${cmd.help.usage ? " " + cmd.help.usage : ""}\` - ${cmd.help.description}`).join("\n");
    const adminCommands = [...commands.values()].filter(cmd => cmd.help.perms === 2).map(cmd => `\`${client.prefix}${cmd.help.name}${cmd.help.usage ? " " + cmd.help.usage : ""}\` - ${cmd.help.description}`).join("\n");
    const whitelistCommands = [...commands.values()].filter(cmd => cmd.help.perms === 3).map(cmd => `\`${client.prefix}${cmd.help.name}${cmd.help.usage ? " " + cmd.help.usage : ""}\` - ${cmd.help.description}`).join("\n");
    const publicCommands = [...commands.values()].filter(cmd => cmd.help.perms === 1).map(cmd => `\`${client.prefix}${cmd.help.name}${cmd.help.usage ? " " + cmd.help.usage : ""}\` - ${cmd.help.description}`).join("\n");

    const embed = new EmbedBuilder()
      .setTitle("Liste de toutes les commandes")
      .setDescription("Voici une liste de toutes les commandes disponibles. Utilisez `help [nom de la commande]` pour plus d'informations sur une commande spécifique.")
      .addFields(
        { name: "Perm 4", value: ownerCommands || "Aucune commande" },
        { name: "Perm 3", value: whitelistCommands || "Aucune commande" },
        { name: "Perm 2", value: adminCommands || "Aucune commande" },
        { name: "Public", value: publicCommands || "Aucune commande" }
      )
      .setColor(client.color);
    return message.channel.send({ embeds: [embed] });
  } else {
    const cmdName = args[0];
    const cmd = commands.get(cmdName) || commands.find(c => c.help.aliases && c.help.aliases.includes(cmdName));
    
    if (!cmd) {
      return message.reply("Commande introuvable. Utilisez `help` pour afficher une liste de toutes les commandes.");
    }
    
    const embed = new EmbedBuilder()
      .setTitle(`Aide pour la commande "${cmd.help.name}"`)
      .setDescription(cmd.help.description)
      .addFields({name: "Utilisation", value: `\`${client.prefix}${cmd.help.name} ${cmd.help.usage || ""}\``})
      .setColor(client.color);

    if (cmd.help.aliases) {
      embed.addFields({name: "Alias", value: "`" + cmd.help.aliases.join("`, ") + "`"});
    }

    if (cmd.help.example) {
      embed.addFields({ name: "Exemple", value: `\`${client.prefix}${cmd.help.name} ` + cmd.help.example + "`" });
    }

    message.channel.send({ embeds: [embed] });
  }
}