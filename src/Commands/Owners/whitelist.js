const { EmbedBuilder } = require("discord.js")
const db = require("../../../index.js")

exports.help = {
    name: 'whitelist',
    description: "Te permet de configurer la whitelist du bot.",
    aliases: ["wl"],
    usage: "<add/remove/list/clear> <user || id>",
    example: "add @user",
    perms: 5
}

exports.run = async (client, message, args) => {
    const embed = client.template

    embed.data.description = "`❌` Vous devez spécifier un des arguments suivants: `add`, `remove`, `list` et `clear`."
    if(!args[0]) return message.reply({ embeds: [embed] })

    const whitelist = await db.get(`whitelist`) || []

    const wlEmbed = new EmbedBuilder()
    wlEmbed.setColor(client.color)
    
    switch (args[0]) {
        case "list":
            wlEmbed.addFields({
                name: "`📝` Liste des membres whitelistés",
                value: whitelist.map(m => `<@${m}> (\`${m}\`) `).join("\n") || "*Aucun membre n'est whitelisté.*"
            })

            message.reply({ embeds: [wlEmbed] })
            break;

        case "add":
            embed.data.description = "`❌` Vous devez spécifier mentionner un utiilisateur après la commande."
            if(!args[1]) return message.reply({ embeds: [embed] })
            
            let userToWl;
            if (message.mentions.members.first()) {
                userToWl = message.mentions.members.first().user;
            } else {
                userToWl = await client.users.fetch(args[1])
            }
            embed.data.description = "`❌` Utilisateur introuvable ou invalde."
            if(!userToWl) return message.reply({embeds: [embed]})

            db.push("whitelist", userToWl.id)
            embed.data.description = "`✅` Membre whitelisté avec succès."
            message.reply({embeds: [embed]})

            break;

        case "remove":
            embed.data.description = "`❌` Vous devez spécifier mentionner un utiilisateur après la commande."
            if(!args[1]) return message.reply({ embeds: [embed] })
            
            let userToRemove;
            if (message.mentions.members.first()) {
                userToRemove = message.mentions.members.first().user;
            } else {
                userToRemove = await client.users.fetch(args[1])
            }
            embed.data.description = "`❌` Utilisateur introuvable ou invalde."
            if(!userToRemove) return message.reply({embeds: [embed]})
            
            db.pull("whitelist", userToRemove.id)
            embed.data.description = "`✅` Membre whitelisté avec succès."
            message.reply({embeds: [embed]})
            
            break;
            
        case "clear":
            db.delete("whitelist")
            embed.data.description = "`✅` Whitelist clear avec succès."
            message.reply({embeds: [embed]})
            
            break;
    }
}