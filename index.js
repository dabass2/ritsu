const botConfig = require("./config.json")

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if (message.author.bot) return;

  if (message.channel.type === "dm") {
      if (message.author.bot) return;

      console.log(message.content, message.author.id)
      const contactEmbed = new Discord.MessageEmbed()
          .setTitle("Contact Message")
          .setColor(0xffd4fe)
          .setThumbnail(message.author.displayAvatarURL())
          .addField("Message content", message.content)
          .addField("User Name", message.author.username)
          .addField("User id", message.author.id)
          .setTimestamp(new Date())
      client.channels.cache.get(botConfig.channel).send(contactEmbed)

      const replyEmbed = new Discord.MessageEmbed()
          .setTitle("Message Recieved!")
          .setColor(0x8cf5ab)
          .setDescription(`Hello! Your message has been recieved and will be responded to as soon as possible.\
                          Please refrain from sending multiple messages unless ABSOLUTELY necessary.\
                          Abuse will result in a ban from the system.`)
          .setTimestamp(new Date())
      message.reply(replyEmbed)
  }

  if (message.channel.id === botConfig.channel) {
      if (message.mentions.has(client.user.id)) {
          client.channels.cache.get(botConfig.channel).messages.fetch(message.reference.messageID)
              .then(m => {
                  let usrId = m.embeds[0].fields[2].value

                  const dmEmbed = new Discord.MessageEmbed()
                      .setTitle("You have a reply!")
                      .setColor(0xfffafa)
                      .setDescription("Hello! Your message has been recieved and responded to by staff.")
                      .addField("Response", message.content)
                      .setTimestamp(new Date())
                  client.users.cache.get(usrId).send(dmEmbed)
              })
      }
  }
});

client.login(botConfig.token);