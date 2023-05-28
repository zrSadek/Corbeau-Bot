const { Discord, EmbedBuilder} = require("discord.js");
const db = require("quick.db");
const moment = require("moment");

exports.help = {
    name: 'booster',
    aliases: ["booster"],
    description: "permet d'obtenir la pp de quelqu'un.",
    perms: 1,
}
exports.run = async (client, message, args) => {
    let desc = "";

    await message.guild.members.cache
      .filter((m) => m.premiumSince)
      .map((m) => {
        desc += `${m} - ${moment(m.premiumSince).format(
          "[Le] DD/MM/YYYY [à] HH:mm:ss"
        )}\n`;
      });
    const embed = new EmbedBuilder()
      .setDescription(desc || "Ce serveur n'a aucun boost")
      .setTimestamp()
    message.channel.send({ embeds: [embed] });
  }

