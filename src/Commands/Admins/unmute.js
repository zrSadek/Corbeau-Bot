const { EmbedBuilder } = require("discord.js")
const ms = require("ms")

exports.help = {
    name: "mute",
    aliases: ["to", "timeout"],
    description: "Permet de mute un utilisateur en l'excluant temporairement.",
    usage: "<@user> <temps>",
    example: "12h",
    perms: 2,
};

exports.run = async (client, message, args) => {
    const embed = client.template
    embed.data.description = "`❌` Je n'ai pas trouvé d'utilisateur à unmute."

    let member;
    if (message.mentions.members && message.mentions.members.first()) {
        member = message.mentions.members.first();
    } else {
        member = await message.guild.members.cache.get(args[0])
    }    

    if(!member) return message.reply({embeds: [embed]})

    embed.data.description = "`❌` Vous ne pouvez unmute que les membres hiérarchiquement inferieurs à vous."
    if(message.member.roles.highest >= member.roles.highest) return message.reply({embeds: [embed]})

    member.timeout(0).then(() => {
        embed.data.description = "`✅` Membre unmute avec succès."
        return message.reply({embeds: [embed]})
    }).catch((error) => {
        console.log(error)
        embed.data.description = "`❌` Je ne peux pas unmute ce membre (le membre ne doit pas avoir de permissions)."
        return message.reply({embeds: [embed]})
    })

}