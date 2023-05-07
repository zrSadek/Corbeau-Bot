const fs = require('fs');
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { ComponentType } = require("discord.js"); 

exports.help = {
  name: "help",
  aliases: ["cmds"],
  description: "Liste toutes les commandes disponibles.",
  perms: 1,
};

exports.run = async (client, message, args) => {
  const commands = client.commands



  if (!args.length) {
    const sortedCommands = [...commands.values()].sort((a, b) => a.help.name.localeCompare(b.help.name));
    const commandList = sortedCommands.map(cmd => `\`${client.prefix}${cmd.help.name}${cmd.help.usage ? " " + cmd.help.usage : "" }\`\n${cmd.help.description}\n`);

    const pages = [];
    while (commandList.length > 0) {
      pages.push(commandList.splice(0, 9));
    }

    let currentPage = 1;

    const embed = new EmbedBuilder()
    .setTitle("Liste de toutes les commandes")
    .setDescription(`Voici une liste de toutes des \`${commands.size}\` commandes disponibles. Utilisez \`${client.prefix}help [nom de la commande]\` pour plus d'informations sur une commande spécifique.`)
    .addFields({ name: "Liste", value: pages[currentPage - 1].join("\n")})
    .setFooter({
      text: `Page ${currentPage}/${pages.length}`,
      iconURL: client.user.displayAvatarURL()
    })
    .setTimestamp()
    .setColor(client.color);
    
    const right = new ButtonBuilder()
    .setLabel("▶")
    .setStyle(ButtonStyle.Secondary)
    .setCustomId("right")

    const left = new ButtonBuilder()
    .setLabel("◀")
    .setStyle(ButtonStyle.Secondary)
    .setCustomId("left")
    .setDisabled(true)

    const naviButton = new ActionRowBuilder().addComponents(left, right)

    const helpMessage = await message.reply({ embeds: [embed], components: [naviButton] });
    const collector =  await helpMessage.createMessageComponentCollector({  componentType: ComponentType.Button, filter: i => i.user.id === message.author.id, time: 60000 })

    collector.on("collect", async i => {

      if (i.customId === "right") {
        currentPage++;
        if (currentPage >= pages.length) {
          right.setDisabled(true);
          left.setDisabled(false);
        } else {
          left.setDisabled(false);
          right.setDisabled(false);
        } 
      } else if (i.customId === "left") {
        currentPage--;
        if (currentPage <= 1) {
          left.setDisabled(true);
          right.setDisabled(false);
        }
        else {
          right.setDisabled(false);
          left.setDisabled(false);
        }
      }

      embed.data.fields = []
      embed.data.fields.push({ name: "Liste", value: pages[currentPage - 1].join("\n")})
      embed.data.footer = {
        text: `Page ${currentPage}/${pages.length}`
      }

      await i.update({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(left, right)],
      });

    })
    

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
      embed.addFields({name: "Alias", value: "`" + cmd.help.aliases.join("`, `") + "`"});
    }

    if (cmd.help.example) {
      embed.addFields({ name: "Exemple", value: `\`${client.prefix}${cmd.help.name} ` + cmd.help.example + "`" });
    }

    message.channel.send({ embeds: [embed] });
  }
}