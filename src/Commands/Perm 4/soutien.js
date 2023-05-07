const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType } = require("discord.js")
const db = require("../../../index.js")

exports.help = {
    name: 'soutien',
    description: " permet d'âttribuer un rôle de soutien.",
    perms: 4,
}

exports.run = async (client, message, args) => {
    const embed = client.template

    embed.data.description = "**Loading . . .**"

    const msg = await message.channel.send({ embeds: [embed] })


    async function updateEmbed(i) {        
        let config = await db.get(`soutien_${message.guild.id}`) || {}

         config = {
            state: `${config.state}` || "false",
            role: `<@&${config.role}>` || "*Aucun*",
            text: config.text || "Aucun" 
        }


        const soutienEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp()
        .setFooter({
            text: `${client.footer}`,
            iconURL: client.user.displayAvatarURL()
        })
        .addFields(
        { name: "🚦 Etat du soutien", value: `${config.state === undefined ? "`🔴`" : config.state ? "`🟢`" : "`🔴`"} - ${config.state === undefined ? "Désactivé" : config.state ? "Activé" : "Désactivé"}`, inline: true },
        { name: "👤 Rôle à attribuer", value: config.role.replace("<@&undefined>", "Aucun"), inline: true },
        { name: "🔗 Texte à mettre en status", value: "```" + config.text.replace("undefined", "Aucun") + "```"}
        )
        soutienEmbed.description = ""

        const soutienMenu = new StringSelectMenuBuilder()
        .setPlaceholder("Faites un choix")
        .setCustomId("soutien")
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel("Modifier l'état du soutien")
            .setEmoji("🚦")
            .setValue("State"),

            new StringSelectMenuOptionBuilder()
            .setLabel("Modifier le rôle à attribuer")
            .setEmoji("👤")
            .setValue("Role"),

            new StringSelectMenuOptionBuilder()
            .setLabel("Modifier le texte à mettre en status")
            .setEmoji("🔗")
            .setValue("Text")
        )

        msg.edit({ embeds: [soutienEmbed], components: [new ActionRowBuilder().addComponents(soutienMenu)] })
    }

    await updateEmbed()

    const collector = await msg.createMessageComponentCollector({  componentType: ComponentType.StringSelect, filter: i => i.user.id === message.author.id, time: 60000 })

    collector.on("collect", async i => {
        let data = await db.get(`soutien_${message.guild.id}`) || {}
        i.deferUpdate()
        switch (i.values[0]) {
            case "State":
                await db.set(`soutien_${message.guild.id}`, {
                    ...data,
                    state: data ? !data.state : true
                  });
                await updateEmbed()
                break;

            case "Role":
                embed.data.description = "`❓` Veuillez méntionner le rôle à attribuer ou fournir son identifiant."

                await msg.edit({ embeds: [embed], components: [] });

                let msgRole = await message.channel.awaitMessages({ filter: m => m.author.id == message.author.id, max: 1, time: 30000})
                
                if(!msgRole || msgRole.size == 0) {
                    updateEmbed()
                    embed.data.description = "`❌` Vous devez mentionner un rôle ou fouurnir son identifiant."
                    return msg.channel.send({ embeds: [embed]}).then((a) => {setTimeout(() => a.delete(), 3000)})
                }

                await msgRole.first().delete()
                
                if (msgRole.first().mentions && msgRole.first().mentions.roles.first()) {
                    role = msgRole.first().mentions.roles.first();
                } else {
                    role = await message.guild.roles.cache.get(msgRole.first().content)
                }
                
                if(!role) {
                    updateEmbed()
                    embed.data.description = "`❌` Vous devez mentionner un rôle ou attribuer son identifiant."
                    return msg.channel.send({ embeds: [embed]}).then((a) => {setTimeout(() => a.delete(), 3000)})
                }

                await db.set(`soutien_${message.guild.id}`,  {...data, role: role.id})
                updateEmbed()
                break;

                case "Text":
                    embed.data.description = "`❓` Quel sera le texte à mettre en status."
                    await msg.edit({ embeds: [embed], components: [] });
    
                    let msgText = await message.channel.awaitMessages({ filter: m => m.author.id == message.author.id, max: 1, time: 30000})
                    
                    if(!msgText || msgText.size == 0) {
                        updateEmbed()
                        embed.data.description = "`❌` Vous devez indiquer le texte à mettre en status."
                        return msg.channel.send({ embeds: [embed]}).then((a) => {setTimeout(() => a.delete(), 3000)})
                    }
    
                    await msgText.first().delete()
                   
                    await db.set(`soutien_${message.guild.id}`, {...data, text: msgText.first().content});
                    updateEmbed()

                    break;                    
        }
    })

}