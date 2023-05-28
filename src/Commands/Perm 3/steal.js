const { parseEmoji } = require('discord.js');
const axios = require('axios');

exports.help = {
  name: 'create',
  description: 'Permet de créer un emoji.',
  aliases: ['steal', 'add'],
  usage: '<emoji>',
  example: '<:trash:1098999012125855814>',
  perms: 3,
};

exports.run = async (client, message, args) => {
  const embed = client.template;
  embed.data = {
    description: 'Vous devez spécifier un emoji à voler.',
    color: 0xFF0000,
  };


  if(!args[0]) return message.reply({ embeds: [embed] })

  const customEmojis = parseEmoji(args[0]);
  if (!customEmojis.id) {
    return message.reply({ embeds: [embed] });
  }

  const extension = customEmojis.animated ? '.gif' : '.png';
  const url = `https://cdn.discordapp.com/emojis/${customEmojis.id}${extension}`;

  message.guild.emojis.create({ attachment: url, name: customEmojis.name})
  .then(() => {
    embed.data.description = "Emoj créer avec succès !"
    message.reply({ embeds: [embed] });
  })
  .catch((err) => {
    embed.data.description = "Une erreur est survenue, veuillez réessayer plus tard."
    message.reply({ embeds: [embed] });
    console.log(err);
    return;
  })

};
