const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, ActionRowBuilder } = require("discord.js");
const db = require("../../../index.js");

exports.help = {
  name: 'greet',
  description: "Te permet de changer le greet message.",
  perms: 3,
};

exports.run = async (client, message, args) => {
  const embed = client.template
    .setDescription("`❌` Vous devez faire partie de la whitelist.");

  embed.setDescription("**Loading . . .**");
  const msg = await message.channel.send({ embeds: [embed] });

  async function updateEmbed() {
    const config = await db.get(`greet_${message.guild.id}`) || {};

    const greetEmbed = new EmbedBuilder()
      .setColor(client.color)
      .addFields(
        { name: "🚦 Etat du greet", value: `${config.state ? "Activé" : "Désactivé"}`},
        { name: "📂 Salon du message", value: `<#${config.channel || "undefined"}>`.replace("<#undefined>", "*Aucun*")},
        { name: "⏰ Temps du greet", value: `${config.time || "0s"}`, },
        { name: "💬 Texte du greet", value: "```" + (config.message || "Aucun") + "```" }
      );

    const greetMenu = new StringSelectMenuBuilder()
      .setCustomId("greet")
      .setPlaceholder("Sélectionnez une action")
      .addOptions(
        new StringSelectMenuOptionBuilder().setLabel("Modifier l'état du greet").setEmoji("🚦").setValue("greetState"),
        new StringSelectMenuOptionBuilder().setLabel("Modifier le salon du message").setEmoji("📂").setValue("greetChannel"),
        new StringSelectMenuOptionBuilder().setLabel("Modifier le temps du greet").setEmoji("⏰").setValue("greetTime"),
        new StringSelectMenuOptionBuilder().setLabel("Modifier le message du greet").setEmoji("💬").setValue("greetMessage")
      );

    await msg.edit({ embeds: [greetEmbed], components: [new ActionRowBuilder().addComponents(greetMenu)] }).catch (err => { console.log(err)})
  }

  await updateEmbed();
  const collector = await msg.createMessageComponentCollector({  componentType: ComponentType.StringSelect, filter: i => i.user.id === message.author.id, time: 60000 })

  collector.on("collect", async i => {
      let data = await db.get(`greet_${message.guild.id}`) || {}
      i.deferUpdate()

      switch (i.values[0]) {
        case "greetState":
          await db.set(`greet_${message.guild.id}`, {...data.state === true ? {...data, state: false } : {...data, state: true } });
          updateEmbed();
          break

        case "greetChannel":
          embed.data.description = "`❓` Veuillez méntionner le salon de greet message."
          msg.edit({ embeds: [embed], components: [] });

          let msgChannel = await message.channel.awaitMessages({ filter: m => m.author.id == message.author.id, max: 1, time: 30000})
          
          if(!msgChannel || msgChannel.size == 0) {
              updateEmbed()
              embed.data.description = "`❌` Vous devez mentionner un salon ou fournir son identifiant."
              return msg.channel.send({ embeds: [embed]}).then((a) => {setTimeout(() => a.delete(), 3000)})
          }

          await msgChannel.first().delete()
          
          let channel;
          if (msgChannel.first().mentions && msgChannel.first().mentions.channels.first()) {
              channel = msgChannel.first().mentions.channels.first();
          } else {
              channel = await message.guild.channels.cache.get(msgChannel.first().content)
          }
          
          if(!channel || channel.type != 0) {
              updateEmbed()
              embed.data.description = "`❌` Vous devez mentionner un salon __textuel__ ou fournir son identifiant."
              return msg.channel.send({ embeds: [embed]}).then((a) => {setTimeout(() => a.delete(), 3000)})
          }

          await db.set(`greet_${message.guild.id}`,  {...data, channel: channel.id})
          updateEmbed()
          break;

        case "greetTime":
          embed.data.description = "`❓` Veuillez fournir un nombre de secondes."
          msg.edit({ embeds: [embed], components: [] });

          let msgTime = await message.channel.awaitMessages({ filter: m => m.author.id == message.author.id, max: 1, time: 30000})
          
          if(!msgTime || msgTime.size == 0 || !msgTime.first() || !msgTime.first().content) {
              updateEmbed()
              embed.data.description = "`❌` Vous devez fournir un nombre de secondes."
              return msg.channel.send({ embeds: [embed]}).then((a) => {setTimeout(() => a.delete(), 3000)})
          }

          await msgTime.first().delete()
          
          let time = parseInt(msgTime.first().content);

          if(isNaN(time) || time < 1 ) {
            updateEmbed()
              embed.data.description = "`❌` Vous devez fournir un nombre de secondes supérieur à 1s."
              return msg.channel.send({ embeds: [embed]}).then((a) => {setTimeout(() => a.delete(), 3000)})
          } 
          
          await db.set(`greet_${message.guild.id}`,  {...data, time: time})
          updateEmbed()
          break;

          case "greetMessage":
            embed.data.description = "`❓` Quel sera le texte du greet message."
            msg.edit({ embeds: [embed], components: [] });

            let msgText = await message.channel.awaitMessages({ filter: m => m.author.id == message.author.id, max: 1, time: 30000})
            
            if(!msgText || msgText.size == 0) {
                updateEmbed()
                embed.data.description = "`❌` Vous devez indiquer le texte du greet message."
                return msg.channel.send({ embeds: [embed]}).then((a) => {setTimeout(() => a.delete(), 3000)})
            }

            await msgText.first().delete()
           
            await db.set(`greet_${message.guild.id}`, {...data, message: msgText.first().content});
            updateEmbed()

            break; 
      }
  })

}