const {
  EmbedBuilder
} = require("discord.js")
const db = require("../../../index.js")

exports.help = {
  name: 'blacklist',
  description: "Te permet de configurer la blacklist du bot.",
  aliases: ["bl"],
  usage: "<add/remove/list/clear> <user || id>",
  example: "add @user",
  perms: 4,
}

exports.run = async (client, message, args) => {
  const embed = client.template
  embed.data.description = "`❌` Vous devez spécifier un des arguments suivants: `add`, `remove`, `list` et `clear`."
  if (!args[0]) return message.reply({
    embeds: [embed]
  })

  const blacklist = await db.get(`blacklist`) || []

  const blEmbed = new EmbedBuilder()
  blEmbed.setColor(client.color)

  switch (args[0]) {
    case "list":
      blEmbed.addFields({
        name: "`📝` Liste des membres blacklistés",
        value: blacklist.map(m => `<@${m}> (\`${m}\`) `).join("\n") || "*Aucun membre n'est blacklisté.*"
      })

      message.reply({
        embeds: [blEmbed]
      })
      break;

    case "add":
      embed.data.description = "`❌` Vous devez spécifier mentionner un utiilisateur après la commande."
      if (!args[1]) return message.reply({
        embeds: [embed]
      })

      let userToBl;
      if (message.mentions.members.first()) {
        userToBl = message.mentions.members.first().user;
      }
      else {
        userToBl = await client.users.fetch(args[1])
      }

      embed.data.description = "`❌` Utilisateur introuvable ou invalde."
      if (!userToBl) return message.reply({
        embeds: [embed]
      })

      embed.data.description = "`❌` Cet utilisateur est déjà blacklisté."
      if (blacklist.includes(userToBl.id)) return message.reply({
        embeds: [embed]
      })

      db.push("blacklist", userToBl.id)

      let bl = 0;

      await Promise.all(client.guilds.cache.map(async (g) => {
        try {
          message.guild.members.ban(userToBl.id, {reason: "Blacklist by " + message.author.tag})
          bl++;
        }
        catch (err) {}
      }));

      embed.data.description = "`✅` Membre blacklisté de **`" + bl + "`** serveurs avec succès."
      await message.reply({
        embeds: [embed]
      })

      break;

    case "remove":
      embed.data.description = "`❌` Vous devez spécifier mentionner un utiilisateur après la commande."
      if (!args[1]) return message.reply({
        embeds: [embed]
      })

      let userToRemove;
      if (message.mentions.members.first()) {
        userToRemove = message.mentions.members.first().user;
      }
      else {
        userToRemove = await client.users.fetch(args[1]).catch(err => {})
      }
      embed.data.description = "`❌` Utilisateur introuvable ou invalde."
      if (!userToRemove) return message.reply({
        embeds: [embed]
      })

      db.pull("blacklist", userToRemove.id)

      let a = 0
      await Promise.all(client.guilds.cache.map(async (g) => {
        try {
          await g.unban(userToRemove.id);
          bl++;
        }
        catch (err) {}
      }));

      embed.data.description = "`✅` Membre unblacklisté de **`" + a + "`** serveurs avec succès."
      await message.reply({
        embeds: [embed]
      })

      break;

    case "clear":

      await blacklist.forEach(async (userToRemove) => {
        await Promise.all(client.guilds.cache.map(async (g) => {
          try {
            const guildMember = await g.members.fetch(userToRemove.id);
            await guildMember.unban({
              reason: "Unblacklist by " + message.author.tag
            });
            bl++;
          }
          catch (err) {}
        }));
      })

      db.delete("blacklist")
      embed.data.description = "`✅` Blacklist clear avec succès."
      message.reply({
        embeds: [embed]
      })

      break;
  }
}