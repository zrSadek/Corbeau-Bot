const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, ActionRowBuilder } = require("discord.js");
const db = require("../../../index.js");

exports.help = {
  name: 'jointocreate',
  aliases: ["j2c", "j2"],
  description: "Te permet de configurer le j2c.",
  perms: 3,
};

exports.run = async (client, message, args) => {
  const embed = client.template


  embed.setDescription("**Loading . . .**");
  const msg = await message.channel.send({ embeds: [embed] });

  async function updateEmbed(i) {
  
    await msg.edit({});
  }

  await updateEmbed();
  const collector = await msg.createMessageComponentCollector({  componentType: ComponentType.StringSelect, filter: i => i.user.id === message.author.id, time: 60000 })

  collector.on("collect", async i => {
      let data = await db.get(`j2c_${message.guild.id}`) || {}
      i.deferUpdate()

      switch (i.values[0]) {
      }
  })
}