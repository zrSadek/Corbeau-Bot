exports.help = {
    name: 'mixnames',
    description: "Mélange deux noms",
    perms: 1,
    usage: "<nom1> <nom2>",
    example: "Lucie Julien"
}

exports.run = async (client, message) => {
    const Embed = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp()
        .setFooter({ text: client.footer, iconURL: client.user.displayAvatarURL()})

    let names = message.content.substring(message.content.indexOf(`${client.prefix}mixnames`) + `${client.prefix}mixnames`.length).split(" ");
    let emb = client.template;
    emb.data.description = "`❌` Vous devez indiquer deux noms.";
    if(names.length !== 2) return message.channel.send({ embeds: [emb] });

    let mix1 = names[0].slice(0, Math.floor(names[0].length / 2)) + names[1].slice(Math.floor(names[1].length / 2));
    let mix2 = names[1].slice(0, Math.floor(names[1].length / 2)) + names[0].slice(Math.floor(names[0].length / 2));

    message.channel.send({
        embeds: [
            Embed.addFields({
                name: "Voici vos noms mélangés :",
                value: `• ${mix1}\n• ${mix2}`
            })
        ]
    });
}
