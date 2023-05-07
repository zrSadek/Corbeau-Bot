const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder, ComponentType, SelectMenuOptionBuilder } = require("discord.js")
const db = require("../../../index.js")

exports.help = {
    name: 'eval',
    description: "n'utilise pas cette commande si t un skid.",
    perms: 6,
}

exports.run = async (client, message, args) => {
    const code = args.join(" ");

    try {
      const result = eval(code);
      message.channel.send(`\`\`\`js\n${result}\n\`\`\``);
    } catch (error) {
      message.channel.send(`\`\`\`js\n${error}\n\`\`\``);
    }
  };
