exports.help = {
    name: 'mocking',
    description: "Applique l'effet spongemock à votre texte.",
    perms: 1,
    usage: "<texte>",
    example: "je suis très sérieux."
}

exports.run = async (client, message) => {
    let text = message.content.substring(message.content.indexOf(`${client.prefix}mocking`) + `${client.prefix}mocking`.length);
    let emb = client.template;
    emb.data.description = "`❌` Vous devez indiquer un texte.";
    if(!text) return message.channel.send({ embeds: [emb] });

    let mockText = "";
    for(let i = 0; i < text.length; i++) {
        mockText += i % 2 === 0 ? text[i].toUpperCase() : text[i].toLowerCase();
    }

    message.channel.send({
        content: mockText
    });
}
