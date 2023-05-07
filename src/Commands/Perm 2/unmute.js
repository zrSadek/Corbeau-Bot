const { EmbedBuilder } = require("discord.js")
const ms = require("ms")

exports.help = {
    name: "unmute",
    aliases: ["unto", "untimeout"],
    description: "Permet de unmute un utilisateur.",
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

    member.timeout(1).then(() => {
        embed.data.description = "`✅` Membre unmute avec succès."
        return message.reply({embeds: [embed]})
    }).catch((error) => {
        console.log(error)
        embed.data.description = "`❌` Je ne peux pas unmute ce membre."
        return message.reply({embeds: [embed]})
    })

}