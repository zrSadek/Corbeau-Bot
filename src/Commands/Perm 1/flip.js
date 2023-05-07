exports.help = {
    name: 'flip',
    description: "Inverse votre texte.",
    perms: 1,
    usage: "<texte>",
    example: "Bonjour le monde !"
}

exports.run = async (client, message) => {
    const text = message.content.substring(message.content.indexOf(`${client.prefix}flip`) + `${client.prefix}flip`.length);

    let emb = client.template;
    emb.data.description = "`❌` Vous devez indiquer un texte.";
    if (!text) return message.channel.send({ embeds: [emb] });

    const reversed = text.split("").reverse().join("");
    message.channel.send(reversed);
}
