const { EmbedBuilder } = require("discord.js")
const ms = require("ms")

exports.help = {
    name: "removerole",
    aliases: ["deleterole", "del", "remove"],
    description: "Permet de retirer un rôle à un membre.",
    usage: "<@user/id> <@role/id>",
    example: "@Sadek @role",
    perms: 2,
};

exports.run = async (client, message, args) => {
    const embed = client.template
    embed.data.description = "`❌` Je n'ai pas trouvé cet utilisateur."

    let member;
    if (message.mentions.members && message.mentions.members.first()) {
        member = message.mentions.members.first();
    } else {
        member = await message.guild.members.cache.get(args[0])
    }    

    if (!member) return message.channel.send({embeds: [embed]})

    let role;
    if (message.mentions.roles && message.mentions.roles.first()) {
        role = message.mentions.roles.first();
    } else {
        role = await message.guild.roles.cache.get(args[1])
    }    

    embed.data.description = "`❌` Je n'ai pas trouvé ce rôle."
    if (!role) return message.channel.send({embeds: [embed]})

    if(message.member.roles.highest.position <= role.position) {
        embed.data.description = "`❌` Vous devez être hierarchiquement supérieur à ce rôle."
        return message.channel.send({embeds: [embed]})
    }

    if(!member.roles.cache.has(role.id)) {
        embed.data.description = "`❌` Ce membre n'a pas le rôle <@&" + role.id + ">."
        return message.channel.send({embeds: [embed]})
    }

    member.roles.remove(role)
    .then(() => {
        embed.data.description = "`✅` Le rôle <@&" + role.id + "> a été retiré avec succès à " + member.user.tag
        message.channel.send({embeds: [embed]})
    })
    .catch(err => {
        embed.data.description = "`❌` Une erreur est survenue (le rôle est peut être trop haut par rapport au bot)."
        message.channel.send({embeds: [embed]})
    })

}