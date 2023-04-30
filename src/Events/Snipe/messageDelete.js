const { Events, ActivityType, EmbedBuilder } = require("discord.js")

module.exports = {
    name: Events.MessageDelete,
    async execute(client, message) {
    if (message.author.bot) return; 
 
    const channelSnipes = client.snipeMap.get(message.channel.id) || [];
  
    channelSnipes.unshift({ 
      content: message.content, 
      author: message.author,
      image: message.attachments.first()?.url
    });
  
    client.snipeMap.set(message.channel.id, channelSnipes);
    }
}
  