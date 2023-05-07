const {
    EmbedBuilder
  } = require("discord.js")
  const db = require("../../../index.js")
  const {
    PermissionsBitField
  } = require("discord.js")
  
  exports.help = {
    name: 'unban',
    aliases: ['deban'],
    description: "Permet de unban un utilisateur.",
    usage: "<id>",
    example: "382936822860218370",
    perms: 2,
  }
  
  exports.run = async (client, message, args) => {
    const embed = client.template
  
    let banList = await message.guild.bans.fetch()
    if (banList.size == 0) {
      embed.data.description = "`❌` Aucune personne n'est bannie."
      return message.reply({
        embeds: [embed]
      })
    }

    if (args[0] == "all") {
  
        function unbanUsers(guild, banList) {
          console.log("Unbanning users...");
            return new Promise((resolve, reject) => {
              const unbannedUsers = [];
              const stillBannedUsers = [];
              let count = 0;
          
              banList.forEach(user => {
                guild.members.unban(user.user.id)
                  .then(unbannedUser => {
                    unbannedUsers.push(unbannedUser);
                  })
                  .catch(error => {
                    stillBannedUsers.push(user);
                  })
                  .finally(() => {
                    count++;
                    if (banList.size == 0) {
                      resolve([unbannedUsers]);
                    }
                  });
              });
            });          
          }
          
          let embedUnbanAll = new EmbedBuilder()
            .setColor(client.color)
            .setTimestamp()
            .setFooter({
              text: client.footer,
              iconURL: client.user.displayAvatarURL()
            })
          
          await unbanUsers(message.guild, banList)
            .then(([unbannedUsers]) => {

              if (unbannedUsers.length > 0) {
                embedUnbanAll.addFields({
                  name: "Membre(s) débannis",
                  value: unbannedUsers.map(user => user.tag).join("\n") || "Aucune personne na été debannie."
                });
              }
              message.reply({ embeds: [embedUnbanAll] }).catch(error => { conso })
            })
            .catch(error => {
              console.log(error);
              embedUnbanAll.setDescription("`❌` Une erreur est survenue.");
              message.reply({ embeds: [embedUnbanAll] });
            });
            
    } else {
  
      let userToUnban;
      if (args[0]) {
        userToUnban = await client.users.fetch(args[0]).catch(err => {})
      }
  
      embed.data.description = "`❌` Je n'ai pas trouvé cet utilisateur parmis la liste des bannis."
      if (!userToUnban) return message.reply({
        embeds: [embed]
      })
  
      message.guild.members.unban(userToUnban.id)
        .then(() => {
          embed.data.description = "`✅` " + userToUnban.tag + "a été débanni avec succès."
          message.reply({
            embeds: [embed]
          })
        })
        .catch(() => {
          embed.data.description = "`❌` Je n'ai pas trouvé cet utilisateur parmis la liste des bannis."
          message.reply({
            embeds: [embed]
          })
        })
  
    }
  }