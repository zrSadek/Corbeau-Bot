const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ComponentType,
  ButtonStyle
} = require("discord.js")
const db = require("../../../index")

exports.help = {
  name: 'prevname',
  aliases: ["prev", "prev-name", "prevnames"],
  description: " permet d'obtenir les anciens pseudo d'une personne.",
  perms: 1,
}

exports.run = async (client, message, args) => {


  let templateEmbed = client.template
  if (args[0] == "clear") {
    let usernames = await db.get(`prevname_${message.author.id}`);
    if (!usernames) {
      templateEmbed.data.description = "`❌` Aucun ancien pseudo trouvé.";
      return message.reply({
        embeds: [templateEmbed]
      }).catch(err => {});
    }
    await db.delete(`prevname_${message.author.id}`);
    templateEmbed.setDescription(`\`✅\`${usernames.length} pseudo supprimés.`);
    return message.reply({
      embeds: [templateEmbed]
    }).catch(err => {})
  }
  else {
  let user;
  if (message.mentions.users.first()) {
    user = message.mentions.users.first();
  }
  else if (args[0]) {
    user = await client.users.fetch(args[0])
  }
  else {
    user = message.author;
  }
    let usernames = await db.get(`prevname_${user.id}`);
    if (!usernames) {
      templateEmbed.data.description = "`❌` Aucune donnée trouvé pour <@" + user.id + ">.";
      return message.reply({
        embeds: [templateEmbed]
      }).catch(err => console.log(err));
    }
    let pages = [];
    let page = "";
    let pageCounter = 0;

    let embed = new EmbedBuilder();
    embed.color = client.color;

    if (!Array.isArray(usernames)) {
      embed.description = `${usernames.substring(0, usernames.indexOf("/"))} \`-\` <t:${usernames.substring(usernames.indexOf("/") + 1)}:f>\n`
      return message.reply({
        embeds: [embed]
      }).catch(err => {});
    }

    for (let i = 0; i < usernames.length; i++) {
      let username = usernames[i];
      let formattedName = `${username.substring(0, username.indexOf("/"))} \`-\` <t:${username.substring(username.indexOf("/") + 1)}:f>\n`;

      if (page.length + formattedName.length > 1024) {
        pages.push(page);
        page = "";
      }

      page += formattedName;
    }

    pages.push(page);

    const right = new ButtonBuilder()
      .setLabel("▶")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("right")
      .setDisabled(!(pages.length > 1))

    const left = new ButtonBuilder()
      .setLabel("◀")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("left")
      .setDisabled(true)

    let buttons = new ActionRowBuilder().addComponents(left, right)

    embed.addFields({
      name: `Pseudo précedents de ${user.username}`,
      value: pages[pageCounter]})
    embed.setTimestamp()
    embed.setFooter({
      text: `Page ${pageCounter + 1}/${pages.length}`
    })

    let msg = await message.reply({
      embeds: [embed],
      components: [buttons]
    });
    let collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: i => i.user.id === message.author.id,
      time: 60000
    })

    collector.on("collected", async (i) => {

      if (i.customId === "right") {
        currentPage++;
        if (currentPage >= pages.length) {
          right.setDisabled(true);
          left.setDisabled(false);
        }
        else {
          left.setDisabled(false);
          right.setDisabled(false);
        }
      }
      else if (i.customId === "left") {
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

      let newButtons = new ActionRow(left, right)

      embed.footer = {
        text: `Page ${pageCounter + 1}/${pages.length}`
      }
      embed.fields[0].value = pages[pageCounter];
      i.deferUpdate()
      await msg.edit({
        embeds: [embed],
        components: [newButtons],
      });
    })
  }
}
