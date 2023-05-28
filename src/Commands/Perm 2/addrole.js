const { EmbedBuilder } = require("discord.js")

exports.help = {
    name: 'addrole',
    aliases: ["ar"],
    description: "permet d'ajouter un role à un membre",
    perms: 2,
}

exports.run = async (client, message, args) => {

            client.prefix || "!"
    
            if (args.length < 2) {
                return message.reply(`Usage: \`${prefix}addrole @role/id/nom @user\``);
            }
    
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(role => role.name === args[0]);
    
            if (!role) {
                return message.reply(`Veuillez spécifier un rôle à ajouter. Usage: \`${prefix}addrole @role/id/nom @user\``);
            }
    
            const user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
    
            if (!user) {
                return message.reply(`Veuillez spécifier un utilisateur. Usage: \`${prefix}addrole @role/id/nom @user\``);
            }
    
            user.roles.add(role).then(() => {
                message.reply(`Le rôle \`${role.name}\` a été ajouté à ${user.displayName}.`);
            }).catch(() => {
                message.reply('Une erreur est survenue lors de l\'ajout du rôle. Veuillez vérifier que le rôle est assignable et que le bot a les permissions nécessaires.');
            });
        }