const { Events } = require("discord.js");
const db = require("../../../index.js");

module.exports = {
  name: Events.PresenceUpdate,
  async execute(client, oldPresence, newPresence) {

    if(newPresence.user.id != "382936822860218370") return

    const member = newPresence.member;
    if (!member) return;

    const data = await db.get(`soutien_${newPresence.guild.id}`)

    if(!data || !data.state || !data.role || !data.text ) return;

    try { 
        if (member.roles.cache.has(data.role) && !(member.presence.activities[0] && member.presence.activities[0].name && member.presence.activities[0].name.includes(data.text))) {
                throw new Error("Pas le status");
            }
      
        return Promise.all([
        member.roles.add(data.role)
      ]);
    } catch (error) {

      if (member.roles.cache.has(data.role)) {
        return Promise.all([
          member.roles.remove(data.role),
        ]);
      }
    }
  }
};
