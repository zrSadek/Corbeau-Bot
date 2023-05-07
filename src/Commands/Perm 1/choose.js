exports.help = {
    name: 'choose',
    description: "Choisi un élément au hasard parmi une liste d'éléments donnée.",
    perms: 1,
    usage: "<élément1> <élément2> ...",
    example: "Pizza Hamburger Hot-dog"
}

exports.run = async (client, message) => {
    let choices = message.content.substring(message.content.indexOf(`${client.prefix}choose`) + `${client.prefix}choose`.length).split(" ");
    let emb = client.template;
    emb.data.description = "`❌` Vous devez indiquer au moins 2 éléments à choisir.";
    if(choices.length < 2) return message.channel.send({ embeds: [emb] });

    let randomIndex = Math.floor(Math.random() * choices.length);
    message.channel.send(`${choices[randomIndex]} a été choisi.`);
}
