const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedAssertions } = require("discord.js");
const db = require("../../../index.js");

exports.help = {
  name: 'reactrole',
  aliases: ["rr"],
  description: "permet de créer un react role mais avec un bouton pour donner ou retirer un rôle.",
  perms: 3,
};

exports.run = async (client, message, args) => {
    
    async function awaitReply(question) {
        embed.data.description = question
        msg.edit({
            embeds: [embed]
        })

        let response = await message.channel.awaitMessages({ filter: m => m.author.id == message.author.id, max: 1, time: 30000})
        if(!response || !response.first() || !response.first().content) return err("`⏰` Le temps est écoulé.")
        response.first().delete()
        return response.first()
    }

    async function err(texte) {
        embed.data.description = texte
        msg.edit({
            embeds: [embed]
        })
    }
    
    const embed = client.template
    embed.data.description = "`❌` Vous devez indiquer un argument après la commande (`add`, `remove`, `list` ou `clear`)."

    if(!args[0]) return message.reply({embeds: [embed]})

    embed.data.description = "`💤` 2spi mon gars, ça charge..."
    const msg = await message.channel.send({embeds: [embed]})

    switch (args[0]) {
        case "add":
            let role = await awaitReply("`❓` Quel sera le __rôle__ à attribuer ?")

            if (role && role.mentions && role.mentions.roles.first()) {
                role = role.mentions.roles.first();
            } else {
                role = await message.guild.roles.cache.get(role.content)
            }

            if(!role) return err("`❌` Vous devez indiquer un rôle valide.")

            let emoji = await awaitReply("`☠️` Quel sera __l'emoji__ du réact rôle (fin react button dcp) ? Répondez par `skip` si vous n'en souhaitez pas.")
            if(!emoji && !emoji.content) return err("`❌` Vous devez indiquer un emoji valide.")

            const emojiRegex = /<a?:\w+:(\d+)>|(:\w+:)|([\u{1F300}-\u{1F5FF}]|[\u{1F1E6}-\u{1F1FF}])/u;

            const match = emoji.content.match(emojiRegex);
            let trueEmoji = null;
            if (match) {
                if (match[1]) {
                    trueEmoji = match[1];
                } else if (match[2]) {
                    trueEmoji = match[2].replace(/:/g, '');
                } else {
                    trueEmoji = match[3];
                }
            }

            if(!trueEmoji && emoji.content.toLowerCase() != "skip") return err("`❌` Vous devez indiquer un emoji valide.")

            let textQuestion = await awaitReply("`📤` Quel sera le __texte__ du bouton ? Répondez par `skip` si vous n'en souhaitez pas.")

            if(!textQuestion) return err("`❌` Vous devez indiquer un texte valide.")
            if(textQuestion.content.toLowerCase() == "skip") textQuestion.content = null

            if(!textQuestion.content && !trueEmoji) return err("`❌` Vous devez indiquer au minimum un emoji ou un texte !")

            let channelQuestion = await awaitReply("`🗒️` Quel sera le __salon__ du react rôle ?")

            let channel = null;

            if (channelQuestion && channelQuestion.mentions && channelQuestion.mentions.channels.first()) {
                channel = channelQuestion.mentions.channels.first();
            } else {
                channel = await message.guild.channels.cache.get(channelQuestion.content)
            }

            if(!channel) return err("`❌` Vous devez indiquer un salon valide.")

            let e = new EmbedBuilder()
            .setColor(client.color)
            .addFields({
                name: "React rôle",
                value: "Cliquez sur le bouton pour recevoir le rôle <@&" + role.id + ">",
            })

            let butt = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId("reactrole")

            if(textQuestion.content) {
                butt.setLabel(textQuestion.content)
            }

            if(trueEmoji) {
                butt.setEmoji(trueEmoji)
            }

            let o = new ActionRowBuilder().addComponents(butt)

            await channel.send({ embeds: [e], components: [o]})
            .then(async (x) => {
                db.push(`reactrole_${message.guild.id}`, { role: role.id, message: x.id, channel: channel.id })
                return err("`✅` React role créé avec succès.")
            })
            .catch(e => {
                return err("`❌` Une erreur est survenue lors de la création du react role.")
            })

            break;

        case "list":
            const data = await db.get(`reactrole_${message.guild.id}`)

            let r = new EmbedBuilder()
            .setColor(client.color)
            .setDescription( data && data.length > 0 ? data.map(x => `<@&${x.role}> - [Clique ici](https://discord.com/channels/${message.guild.id}/${x.channel}/${x.message})`).join("\n") : "Aucun react role n'a été trouvé.")

            msg.edit({ embeds: [r]})
            break;

        case "clear":
            const dataToClear = await db.get(`reactrole_${message.guild.id}`)
            if(!dataToClear) return err("`😿` Aucun react role n'a été trouvé.")

            db.delete(`reactrole_${message.guild.id}`)
            .then(() => {
                return err("`✅` React role supprimé avec succès.")
            })
            .catch((err) => {
                return err("`❌` Une erreur est survenue lors de la suppression des react roles.")
            })

        case "remove":
            if(args[1]) {
                const dat = await db.get(`reactrole_${message.guild.id}`)
                if(!dat || !dat.length > 0) return err("`❌` Aucun react role n'a été trouvé")

                const index = dat.findIndex(x => x.message == args[1]);
                if (index > -1) {
                const deleted = dat.splice(index, 1)[0];
                await db.set( `reactrole_${message.guild.id}`, deleted)
                    .then(() => {
                    return err("`✅` Role react supprimé avec succès.");
                    })
                    .catch(() => {
                    return err("`❌` Une erreur est survenue lors de la suppression du role react.");
                    });
                } else {
                return err("`❌` Aucun rôle react n'a été trouvé pour ce message.");
                }

            } else {{
                return err("`❌` Vous devez indiquer l'identifiant du message après la commande.")

            }}

            break;

    }
}