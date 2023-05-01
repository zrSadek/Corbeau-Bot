const { EmbedBuilder } = require("discord.js")

exports.help = {
    name: "clear",
    aliases: ["purge"],
    description: "Permet de supprimer les message.",
    usage: "<nombre>",
    example: "10",
    perms: 2,
};

exports.run = async (client, message, args) => {
    if(!args[0] || isNaN(parseInt(args[0])) || parseInt(args[0]) < 1 || parseInt(args[0]) > 999 ) return message.channel.send("Veuillez fournir un nombre de messages à supprimer entre `1` et `999`.")
    let amount = parseInt(args[0])
       
    let deletedCount = 0;
        while (deletedCount < amount) {
          const messages = await message.channel.messages.fetch({ limit: Math.min(amount - deletedCount, 99) });
          if (messages.size === 0) break;
          await message.channel.bulkDelete(messages);
          deletedCount += messages.size;
    }

    let embed = client.template
    embed.data.description = "`🗑️` J'ai supprimé **`" + deletedCount + "`** messages."

    const confirmation = await message.channel.send({ embeds: [embed]});
    setTimeout(() => confirmation.delete().catch(err => {}), 5000);

}