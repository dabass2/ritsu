const botConfig = require("./ritsuConfig.json")
const fs = require("fs")

const Discord = require('discord.js');
const { resolveSoa } = require("dns");
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // client.channels.cache.get('849673551933472768').send("Hello! Message me for help!")
    if (!fs.existsSync("./ritsuConfig.json")) {
        console.log("no config file")
    }
    // if (!botConfig.test) {
    //   console.log("No test variable!")
    // }
    // botConfig.test = "hey"
    // fs.writeFileSync("./ritsuConfig.json", JSON.stringify(botConfig, null, 2));
});

client.on('message', message => {
    let prefix = botConfig.prefix;
    const args = message.content.slice(prefix.length).split(' ');
    const cmd = args.shift().toLowerCase();

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
        client.channels.cache.get(botConfig.outputChannel).send(contactEmbed)
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

    if (message.channel.id === botConfig.outputChannel) {
        if (message.mentions.has(client.user.id)) {
            client.channels.cache.get(botConfig.outputChannel).messages.fetch(message.reference.messageID)
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

    if (botConfig.adminUsers.includes(message.author.id)) {
        if (args[0] === "setChannel") {
            botConfig.outputChannel = message.channel.id
            fs.writeFileSync("./ritsuConfig.json", JSON.stringify(botConfig, null, 2));
            message.reply(`Set message output channel to be current channel. Id: ${message.channel.id}`)
        }

        if (args[0] === "createAlerts") {
            const alertEmbed = new Discord.MessageEmbed()
                .setTitle("Reacts")
                .setDescription("React with the appropriate emote for whatever series you want to get alerts for.")
                .addField("Appraisal", '1️⃣')
                .addField("Shinja", '2️⃣')
                .addField("Breakthrough", '3️⃣')
                message.channel.send(alertEmbed).then(async sent => {
                    await sent.react('1️⃣')
                    await sent.react('2️⃣')
                    await sent.react('3️⃣')
                    const filter = (reaction) => {
                      return reaction.emoji.name === '1️⃣' || reaction.emoji.name === '2️⃣' || reaction.emoji.name === '3️⃣';
                    };
                    let collector = new Discord.ReactionCollector(sent, filter, {dispose: true})
                    collector.on("collect", (reaction, user) => {
                        console.log(reaction.emoji.name, user.id)
                        let emojiName = reaction.emoji.name
                        // let user = user.id
                        if (emojiName === '1️⃣') {
                            let role = message.guild.roles.cache.get("849662899005292584")
                            message.member.roles.add(role)
                        } else if (emojiName === '2️⃣') {
                            let role = message.guild.roles.cache.get("849663088763994112")
                            message.member.roles.add(role)
                        } else if (emojiName === '3️⃣') {
                            let role = message.guild.roles.cache.get("849663164877504573")
                            message.member.roles.add(role)
                        }
                    })

                    collector.on("remove", (reaction, user) => {
                      console.log(reaction.emoji.name, user.id)
                      let emojiName = reaction.emoji.name
                      // let user = user.id
                      if (emojiName === '1️⃣') {
                          let role = message.guild.roles.cache.get("849662899005292584")
                          message.member.roles.remove(role)
                      } else if (emojiName === '2️⃣') {
                          let role = message.guild.roles.cache.get("849663088763994112")
                          message.member.roles.remove(role)
                      } else if (emojiName === '3️⃣') {
                          let role = message.guild.roles.cache.get("849663164877504573")
                          message.member.roles.remove(role)
                      }
                  })
                })
        }
    }
});

client.login(botConfig.token);