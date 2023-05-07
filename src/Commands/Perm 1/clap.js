exports.help = {
    name: 'clap',
    description: "Transforme le texte en emoji clap.",
    perms: 1,
    usage: "<texte>",
    example: "Bonjour tout le monde"
}

exports.run = async (client, message) => {
    let text = message.content.substring(message.content.indexOf(`${client.prefix}clap`) + `${client.prefix}clap`.length);
    let emb = client.template;
    emb.data.description = "`❌` Vous devez indiquer un texte à transformer en clap.";
    if(!text) return message.channel.send({ embeds: [emb] });

    message.channel.send(text.split(" ").join(" 👏 "));
}
