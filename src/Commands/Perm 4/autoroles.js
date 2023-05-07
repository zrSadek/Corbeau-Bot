const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, ActionRowBuilder, RoleSelectMenuBuilder } = require("discord.js");
const db = require("../../../index.js");

exports.help = {
  name: 'autorole',
  aliases: ["auto-roles", "autoroles"],
  description: "Permet de configurer les autoroles (roles à attribuer quand un membre rejoint).",
  perms: 4,
};

exports.run = async (client, message, args) => {
  const embed = client.template

  embed.setDescription("**Loading . . .**");
  const msg = await message.channel.send({ embeds: [embed] });

  async function updateEmbed() {
    let autoroles = await db.get(`autoroles_${message.guild.id}`);

    let embed = new EmbedBuilder()
    .setColor(client.color)
    .setTimestamp()
    .setFooter({
        text: client.footer,
        iconURL: client.user.displayAvatarURL()
    })
    .addFields({
        name: "Auto-roles actuels:",
        value: autoroles && autoroles.length > 0 ? "<@&" + autoroles.join(">\n<@&") + ">" : "*Aucun*",
    })

    const roleMenu = new RoleSelectMenuBuilder()
    .setCustomId("autoroles")
    .setPlaceholder("Sélectionnez les nouveaux roles à attribuer")
    .setMinValues(0)
    .setMaxValues(message.guild.roles.cache.size > 25 ? 25 : message.guild.roles.cache.size)

    await msg.edit({ embeds: [embed], components: [new ActionRowBuilder().addComponents(roleMenu)] });
  }

  await updateEmbed();
  const collector = await msg.createMessageComponentCollector({  componentType: ComponentType.RoleSelect, filter: i => i.user.id === message.author.id, time: 60000 })

  collector.on("collect", async i => {
      i.deferUpdate()
      await db.set(`autoroles_${message.guild.id}`, i.values)
      await updateEmbed()
  })
}