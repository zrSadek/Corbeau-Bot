const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType } = require("discord.js")
const db = require("../../../index.js")

exports.help = {
    name: 'variables',
    aliases: ["var"],
    description: "Renvoit la liste des variables disponibles.",
    perms: 1,
}

exports.run = async (client, message, args) => {
    message.reply({
        embeds: [
            new EmbedBuilder()
          .setTitle("`🗒️` Liste des variables disponibles")
          .setColor(client.color)
          .addFields(
            { name: "[user]", value: "Renvoit une mention de l'utilisateur.", inline: true },
            { name: "[user.id]", value: "Renvoit l'identifiant de l'utilisateur.", inline: true },
            { name: "[user.tag]", value: "Renvoit le pseduo complet de l'utilisateur en plus de son tag.", inline: true },
            { name: "[user.username]", value: "Renvoit le nom de l'utilisateur", inline: true },
            { name: "[user.createdAt]", value: "Renvoit la date de création du compte du membre.", inline: true },
            { name: "[server]", value: "Renvoit le nom du serveur.", inline: true },
            { name: "[server.id]", value: "Renvoit l'identifiant du serveur.", inline: true },
            { name: "[server.owner]", value: "Renvoit une mention du propriétaire du serveur", inline: true },
            { name: "[server.owner.id]", value: "Renvoit l'identifiant du propriétaire du serveur", inline: true },
            { name: "[server.owner.username]", value: "Renvoit le pseudo propriétaire du serveur", inline: true },
            { name: "[server.owner.tag]", value: "Renvoit le pseduo complet du proprietaire du serveur en plus de son tag.", inline: true },
            { name: "[server.memberCount]", value: "Renvoit le nombre de membres du serveur.", inline: true },
            { name: "[server.boosts]", value: "Renvoit le nombre de boosts du serveur.", inline: true},
            { name: "[server.onlines]", value: "Renvoit le nombre d'utilisateurs en ligne", inline: true},
            { name: "[server.channels]", value: "Renvoit le nombre de salons du serveur.", inline: true },
            { name: "[server.roles]", value: "Renvoit le nombre de rôles du serveur.", inline: true },
            { name: "[server.createdAt]", value: "Renvoit la date de création du serveur.", inline: true },
            { name: "[server.voice]", value: "Renvoit le nombre de membres en voc", inline: true },
          )
        ]
    })

}