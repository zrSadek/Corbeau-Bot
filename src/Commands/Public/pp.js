const { EmbedBuilder } = require("discord.js")

exports.help = {
    name: 'pp',
    description: "Te permet d'obtenir la photo de profil d'un utilisateur.",
    perms: 1,
}

exports.run = async (client, message, args) => {
    const embed = client.template
    embed.data.description = "`❌` Vous devez mentionner l'utilisateur ou fournir son identifiant."

    let target;
    if (message.mentions.members.first()) {
        target = message.mentions.members.first().user;
    } else {
        target = await client.users.cache.get(args[0])
    }

    if(!target) return message.reply({ embeds: [embed] })

    const embedPp = new EmbedBuilder()
        .setColor(client.color)
        .setTitle("Photo de profil de " + target.tag)
        .setImage(target.displayAvatarURL({ format: 'png', dynamic: true, size: 1024}))
 
        message.reply({
            embeds: [embedPp]
        })
 
}