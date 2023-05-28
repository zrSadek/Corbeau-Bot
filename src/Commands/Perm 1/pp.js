const { EmbedBuilder } = require("discord.js")

exports.help = {
    name: 'pp',
    aliases: ["avatar", "pic"],
    description: "permet d'obtenir la pp de quelqu'un.",
    perms: 1,
}

exports.run = async (client, message, args) => {

        let user;
        if(message.user ? args[0].length >= 1 : args >= 1) {
            user = message.user ? await client.users.fetch(message.mentions.users.first().id) : (message.mentions.users.first() || await client.users.fetch(args[0]))
        } else user =  message.mentions.users.first() || args[0] || message.author 
    
          if(!user) return;

          const bannerEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`${user.tag} | (\`${user.id}\`)`)
            .setImage(user.displayAvatarURL({dynamic: true, size: 4096}))
       
         await message.channel.send({embeds: [bannerEmbed]}); 
}