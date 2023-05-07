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
    name: 'suggest',
    description: "Permet de faire une suggestion s'il y'en a un.",
    usage: "<suggestion>",
    example: "bah une suggestion fin t con ou quoi",
    perms: 1,
  };
  
  exports.run = async (client, message, args) => {
    const embed = client.template
  
    let data = await db.get(`suggest_${message.guild.id}`);

    embed.data.description = "`❌` Aucun salon de suggestion n'est configuré sur ce serveur."
    if(!data || !message.guild.channels.cache.get(data)) return

    let suggestion = args.join(" ");

    let suggestEmbed = new EmbedBuilder()
    .addFields({
        name: "Nouvelle suggestion :",
        value: suggestion
    })
    .setTimestamp()
    .setColor(client.color)
    .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL()
    })
    .setFooter({
        text: client.footer,
        iconURL: client.user.displayAvatarURL()
    })

    return message.guild.channels.cache.get(data).send({
        embeds: [suggestEmbed]
    }).then( async (msg) => {
        await msg.react("✅")
        .then(() => {
            msg.react("❌")
        })
        message.react("✅")
    })
  }