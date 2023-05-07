const { EmbedBuilder } = require("discord.js");

exports.help = {
  name: "serverinfo",
  aliases: ["si"],
  description: "Affiche les informations du serveur",
  perms: 1
};

exports.run = async (client, message) => {
  const guild = message.guild;
  const owner = await guild.fetchOwner();
  const createdAt = guild.createdAt;
  const region = guild.region;
  const verificationLevel = guild.verificationLevel;
  const explicitContentFilter = guild.explicitContentFilter;
  const roles = guild.roles.cache.size;
  const channels = guild.channels.cache.size;
  const members = guild.memberCount;
  const online = guild.members.cache.filter(m => m.presence && m.presence.status != "offline").size;
  const bots = guild.members.cache.filter(m => m.user.bot).size;
  const humans = members - bots;
  const emojis = guild.emojis.cache.size;
  const boosts = guild.premiumSubscriptionCount;
  const boostsLevel = guild.premiumTier;
  const afkChannel = guild.afkChannel;
  const afkTimeout = guild.afkTimeout;

  const embed = new EmbedBuilder()
    .setColor(client.color)
    .setTitle(`Informations sur le serveur ${guild.name}`)
    .setThumbnail(guild.iconURL())
    .addFields(
      { name: "Propriétaire", value: `${owner.user.tag} (\`${owner.id}\`)` },
      { name: "Créé le", value: `<t:${Math.floor(createdAt / 1000)}:d>`, inline: true },
      { name: "Niveau de vérification", value: `${verificationLevel}`, inline: true },
      { name: "Filtre de contenu explicite", value: `${explicitContentFilter}`, inline: true },
      { name: "Roles", value: `${roles}`, inline: true },
      { name: "Salons", value: `${channels}`, inline: true },
      { name: "Membres", value: `${members}`, inline: true },
      { name: "Humains", value: `${humans}`, inline: true },
      { name: "Bots", value: `${bots}`, inline: true },
      { name: "En ligne", value: `${online}`, inline: true },
      { name: "Emojis", value: `${emojis}`, inline: true },
      { name: "Boosts", value: `${boosts} (${boostsLevel})`, inline: true },
      { name: "Salon AFK", value: afkChannel ? afkChannel.name : "Aucun", inline: true },
      { name: "Délai AFK", value: `${afkTimeout / 60} minutes`, inline: true }
    )
    .setTimestamp()
    .setFooter({ text: client.footer, iconURL: client.user.displayAvatarURL() });

  message.reply({ embeds: [embed] });
};
