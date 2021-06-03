const botConfig = require("./config.json")

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // client.channels.cache.get('849673551933472768').send("Hello! Message me for help!")
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
          .then(s => {
              console.log("Sent the embed!")

              const replyEmbed = new Discord.MessageEmbed()
              .setTitle("Message Recieved!")
              .setColor(0x8cf5ab)
              .setDescription(`Hello! Your message has been recieved and will be responded to as soon as possible. Please refrain from sending multiple messages unless ABSOLUTELY necessary. Abuse will result in a ban from the system.`)
              .setTimestamp(new Date())
              message.reply(replyEmbed)
                  .then(f => {
                      console.log("Reply sent successfully.")
                  })
                  .catch(e => {
                      console.error(e)
                      message.reply("An error occured when replying to the user: " + e)
                  })
          })
          .catch(e => {
              console.error(e)
              message.reply("Something went wrong when sending your message. Please try again later. If the problem persists, contact the bot owner.")
          })
  }

  if (message.channel.id === botConfig.channel) {
      if (message.mentions.has(client.user.id)) {
          client.channels.cache.get(botConfig.channel).messages.fetch(message.reference.messageID)
              .then(m => {
                  let usrId = m.embeds[0].fields[2].value

                  console.log(client.users.cache.get(usrId), usrId)
                  const dmEmbed = new Discord.MessageEmbed()
                      .setTitle("You have a reply!")
                      .setColor(0xfffafa)
                      .setDescription("Hello! Your message has been recieved and responded to by staff.")
                      .addField("Response", message.content)
                      .setTimestamp(new Date())
                  client.users.fetch(usrId)
                      .then(r => {
                          r.send(dmEmbed)
                      })
                      .catch(e => {
                          console.error(e)
                      })
              })
              .catch(e => {
                  console.error(e)
              })
      }
  }
});

client.login(botConfig.token);