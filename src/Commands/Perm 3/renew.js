const { EmbedBuilder } = require("discord.js")

exports.help = {
    name: "renew",
    aliases: ["nuke"],
    description: "Recrée le salon.",
    perms: 3,
};

exports.run = async (client, message) => {
    let embed = client.template
    embed.data.description = "`❌` Je ne peux pas recrée ce type de salon."

    if(message.channel.type != 0 && message.channel.type != 5) return message.reply({ embeds: [embed]})

    let newChannel = await message.channel.clone()
    newChannel.position = message.channel.position + 1

    message.channel.delete().catch(err => {
        newChannel.delete().catch(err => {})

        embed.data.description = "`❌` Une erreur est survenue lors de la recréation du salon. (Il est possible que le salon ne peut pas être supprimé.)"
        message.channel.send({ embeds: [embed] })
    })
    .then(() => {
        newChannel.send({ content: "Salon recréé par " + `${message.author}`})
    })
}