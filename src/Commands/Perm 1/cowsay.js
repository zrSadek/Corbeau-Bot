const cowsay = require('cowsay');
const { EmbedBuilder } = require('discord.js');

exports.help = {
  name: 'cowsay',
  description: 'Laisse une vache parlé à ta place.',
  perms: 1,
  usage: '<message>',
  example: 'Salut, j\'suis ta grosse daronne.'
};

exports.run = async (client, message) => {
  const Embed = new EmbedBuilder()
    .setColor(client.color)
    .setTimestamp()
    .setFooter({ text: client.footer, iconURL: client.user.displayAvatarURL() });

  let messageToSay = message.content.substring(message.content.indexOf(`${client.prefix}cowsay`) + `${client.prefix}cowsay`.length).trim();
  let emb = client.template;
  emb.data.description = '`❌` Tu dois indiquer un message à faire dire à une vâche.';
  if (!messageToSay) return message.channel.send({ embeds: [emb] });

  let cowSaid = cowsay.say({ text: messageToSay });
  message.channel.send(`\`\`\`${cowSaid}\`\`\``);
};
