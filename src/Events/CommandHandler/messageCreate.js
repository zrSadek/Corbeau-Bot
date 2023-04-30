module.exports = {
    name: "messageCreate",
    execute(client, message) {
        const prefix = client.prefix || "+";

        let embed = client.template
        embed.data.description = "`🚨` Mon prefix actuel est **`" + prefix + "`**."
        if (message.content == `${client.user}`) return message.reply({ embeds: [embed] })
        if (message.author.bot) return;
        if (message.channel.type === "DM") return;

        if (!message.content.startsWith(prefix)) return;

        const messageArray = message.content.split(" ");
        const cmd = messageArray[0].slice(prefix.length).toLowerCase();
        const args = messageArray.slice(1);

        const commandFile = client.commands.get(cmd) || client.commands.find(c => c.help.aliases && c.help.aliases.includes(cmd));
        if (commandFile) commandFile.run(client, message, args);
    }
}
