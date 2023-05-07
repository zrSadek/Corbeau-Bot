const { Events, ActivityType, EmbedBuilder } = require("discord.js")
const db = require("../../../index.js")

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction) {
        if(!interaction.isButton() || interaction.customId != "reactrole") return;

        const emb = client.template
        const dat = await db.get(`reactrole_${interaction.guild.id}`)

        if(!dat || !(dat.length > 0)) return interaction.reply({ content: "Ce react rôle n'est plus valable.", ephemeral: true });

        const data = dat.find(x => x.message == interaction.message.id)

        if(!data || !data.channel || !data.role || !data.message) return interaction.reply({ content: "Ce react rôle n'est plus valable.", ephemeral: true});

        const successDescription = (role) => {
            return "`✅` Le rôle <@&" + role + "> vous a été donné avec succès."
        }

        const errorDescription = "`❌` Une erreur est survenue... (Mon rôle n'est peut être pas assez élevé)"

        const handleRoleChange = (promise, role) => {
            promise.then(() => {
                emb.data.description = successDescription(role)
                interaction.reply({
                    embeds: [emb],
                    ephemeral: true
                })
            }).catch(err => {
                emb.data.description = errorDescription
                interaction.reply({
                    embeds: [emb],
                    ephemeral: true
                })
            })
        }

        if(interaction.member.roles.cache.has(data.role)) {
            interaction.member.roles.remove(data.role)
            emb.data.descriptiono = "`✅` Le rôle <@&" + role + "> vous a été retiré avec succès."
           interaction.reply({
                    embeds: [emb],
                    ephemeral: true
                })
        } else {
            handleRoleChange(interaction.member.roles.add(data.role), data.role)
        }
    }
}
