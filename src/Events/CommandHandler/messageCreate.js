const cooldowns = new Map();

module.exports = {
  name: "messageCreate",
  execute(client, message) {
    const prefix = client.prefix || "+";

    let embed = client.template;
    embed.data.description = "`🚨` Mon prefix actuel est **`" + prefix + "`**.";
    if (message.content == `${client.user}`) return message.reply({ embeds: [embed] });
    if (message.author.bot) return;
    if (message.channel.type === "DM") return;

    if (!message.content.startsWith(prefix)) return;

    const messageArray = message.content.split(" ");
    const cmd = messageArray[0].slice(prefix.length).toLowerCase();
    const args = messageArray.slice(1);

    const commandFile = client.commands.get(cmd) || client.commands.find(c => c.help.aliases && c.help.aliases.includes(cmd));
    if (!commandFile) return;

    const now = Date.now();
    const cooldownAmount = (commandFile.help.cooldown || 5) * 1000;

    if (cooldowns.has(message.author.id)) {
      const expirationTime = cooldowns.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        embed.data.description = `Merci d'attendre jusqu'à <t:${Math.floor(expirationTime / 1000)}:R> avant de réutiliser la commande \`${cmd}\`.`
        return message.reply({ embeds: [embed]})
        .then((m) => {
            setTimeout(() => m.delete(), 3000);
        })
      }
    }

    cooldowns.set(message.author.id, now);
    setTimeout(() => cooldowns.delete(message.author.id), cooldownAmount);

    commandFile.run(client, message, args);
  }
};
