const { EmbedBuilder } = require('discord.js');

exports.help = {
    name: 'fml',
    description: "permet d'afficher une histoire aléatoire de fml",
    perms: 1,
}

exports.run = async (client, message) => {
    const axios = require('axios').default;
    const Embed = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp()
        .setFooter({ text: client.footer, iconURL: client.user.displayAvatarURL() })

    try {
        const response = await axios.get('https://www.fmylife.com/random');
        const html = response.data;
        const regex = /<div class="panel-body">\n(.*)\n<\/div>/gm;
        const match = regex.exec(html);
        if (match && match.length > 1) {
            const fml = match[1].replace(/<br>/gm, '\n');
            message.channel.send({
                embeds: [
                    Embed.setDescription(fml)
                ]
            });
        } else {
            Embed.setDescription('Aucune histoire fml trouvée :(');
            message.channel.send({
                embeds: [Embed]
            });
        }
    } catch (error) {
        console.error(error);
        Embed.setDescription('Une erreur est survenue lors de la récupération de l\'histoire fml :(');
        message.channel.send({
            embeds: [Embed]
        });
    }
}
