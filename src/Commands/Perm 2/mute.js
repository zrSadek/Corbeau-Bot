const { EmbedBuilder } = require("discord.js")
const ms = require("ms")

exports.help = {
    name: "mute",
    aliases: ["to", "timeout"],
    description: "Permet de mute un utilisateur en l'excluant temporairement.",
    usage: "<@user> <temps>",
    example: "@Hawk 12h",
    perms: 2,
};

exports.run = async (client, message, args) => {
    const embed = client.template
    embed.data.description = "`❌` Je n'ai pas trouvé d'utilisateur à expulser."

    let member;
    if (message.mentions.members && message.mentions.members.first()) {
        member = message.mentions.members.first();
    } else {
        member = await message.guild.members.cache.get(args[0])
    }    

    if(!member) return message.reply({embeds: [embed]})

    embed.data.description = "`❌` Vous ne pouvez mute que les membres hiérarchiquement inferieurs à vous."
    if(message.member.roles.highest.position <= member.roles.highest.position) return message.reply({embeds: [embed]})

    if(!args[1]) {
        args[1] = 2419200
    } else {
        args[1] = ms(args[1]);
    }

    embed.data.description = "`❌` Le temps indiqué est invalide."
    if(isNaN(args[1]))  return message.reply({embeds: [embed]})

    member.timeout(args[1]).then(() => {
        embed.data.description = "`✅` Membre mute avec succès."
        return message.reply({embeds: [embed]})
    }).catch((error) => {
        console.log(error)
        embed.data.description = "`❌` Je ne peux pas mute ce membre."
        return message.reply({embeds: [embed]})
    })

}