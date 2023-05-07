const { PermissionsBitField } = require('discord.js');

exports.help = {
    name: 'derank',
    description: "Permet de derank un Utilisateur.",
    usage: "<user/id>",
    example: "@Hawk | 382936822860218370",
    perms: 3,
}

exports.run = async (client, message, args) => {
    const embed = client.template
    embed.data.description = "`❌` Je n'ai pas trouvé d'utilisateur à derank."

    let member;
    if (message.mentions.members && message.mentions.members.first()) {
        member = message.mentions.members.first();
    } else {
        member = await message.guild.members.cache.get(args[0])
    }    
    if(!member) return message.reply({embeds: [embed]})


    embed.data.description = "`❌` Vous ne pouvez derank que les membres hiérarchiquement inferieurs à vous."
    if(message.member.roles && (message.member.roles.highest.position <= member.roles.highest.position)) return message.reply({embeds: [embed]})

        try {
          const guild = message.guild;
      
          const bot = guild.members.cache.get(client.user.id);
      
          if (bot.roles.highest.position > member.roles.highest.position) {
            const permissionFlags = [
               PermissionsBitField.Flags.Administrator,
               PermissionsBitField.Flags.ManageGuild,
               PermissionsBitField.Flags.KickMembers,
               PermissionsBitField.Flags.BanMembers,
               PermissionsBitField.Flags.ManageMessages,
               PermissionsBitField.Flags.ManageWebhooks,
               PermissionsBitField.Flags.ManageGuildExpressions,
               PermissionsBitField.Flags.ManageRoles,
               PermissionsBitField.Flags.ManageChannels,
               PermissionsBitField.Flags.ViewAuditLog,
               PermissionsBitField.Flags.MentionEveryone,
               PermissionsBitField.Flags.ManageNicknames,
               PermissionsBitField.Flags.DeafenMembers,
               PermissionsBitField.Flags.MuteMembers,
               PermissionsBitField.Flags.MoveMembers
            ]

            const rolesToRemove = member.roles.cache.filter(role => role.permissions.has(permissionFlags));
      
            await Promise.all(
              rolesToRemove.map(role =>
                member.roles.remove(role.id).catch(err => {
                  console.error(`Error removing role ${role.name} (${role.id}): ${err}`);
                })
              )
            );

            embed.data.description = "`✅` Utilisateur derank avec succès.\nRôles retirés:\n" + rolesToRemove.map((x) => `<@&${x.id}>`).join("\n")
            return message.reply({embeds: [embed]})

          } else {
            embed.data.description = "`❌` Je ne suis pas assez haut gradé pour derank cette personne."
            return message.reply({embeds: [embed]})
          }
        } catch (error) {
            console.error(error.message);
            embed.data.description = "`❌` Je ne peux pas derank cette personne."
            return message.reply({embeds: [embed]})
        }

}