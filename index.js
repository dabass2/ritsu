const botConfig = require("./ritsuConfig.json")
const fs = require("fs")

const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

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

client.on('guildMemberAdd', member => {
    let role = member.guild.roles.cache.get('856374422063153193')

    member.roles.add(role).catch((e) => {
        console.error(e)
    })
})

client.on('message', message => {
    let prefix = botConfig.prefix;

    if (message.author.bot || message.content.slice(0, prefix.length) !== prefix) return;

    const args = message.content.slice(prefix.length + 1).split(' ');
    const cmd = args.shift().toLowerCase();
    // console.log(cmd, args)

    if (botConfig.adminUsers.includes(message.author.id)) {
        if (cmd === "createnotifmessage") {
            const embed = new Discord.MessageEmbed()
                .setColor(0x9af59f)
                .setTitle("Get Roles Here")
                .setDescription("React with the appropriate emote to get updates on that manga.")
                .addField("Reincarnated as an Aristocrat with an Appraisal Skill", "1️⃣",)
                .addField("Clearing the Isekai with a Zero-Believer Goddess", "2️⃣")
                .addField("Breakthrough brought by Forbidden Master and Disciple", "3️⃣")
                .setTimestamp(new Date())
            message.channel.send(embed).then(async sent => {
                await sent.react("1️⃣")
                await sent.react("2️⃣")
                await sent.react("3️⃣")
                botConfig.roleMsg = sent.id
                fs.writeFileSync("./ritsuConfig.json", JSON.stringify(botConfig, null, 2));
            });
        }

        if (cmd === "appraisal") {
            if (args.length < 1) {
                message.reply("no new chapter link? dumbasss...LMFAO")
                return;
            }

            let chapterLink = args.splice(0, 1)
            let comment = args.join(" ")

            const embed = new Discord.MessageEmbed()
                .setColor(0x9af59f)
                .setThumbnail("https://strapi.wehateisekai.club/uploads/51376_b55361b130.jpg")
                .setTitle("New Chapter")
                .setDescription("There's a new chapter of Appraisal!")
                .addField("Read Chapter:", chapterLink)
                .addField("Next Chapter Release", "~2 weeks")
                .addField("Comment", (comment ? comment : "No upload comment because nothing cool happened."))
                .setTimestamp(new Date())
            client.channels.cache.get("856374920698265661").send(embed).then( () => {
                client.channels.cache.get("856374920698265661").send(`<@&${"856375305921101836"}>`)
            })
        }

        if (cmd === "breakthrough") {
            if (args.length < 1) {
              message.reply("no new chapter link? dumbasss...LMFAO")
              return;
            }

            let chapterLink = args.splice(0, 1)
            let comment = args.join(" ")

            const embed = new Discord.MessageEmbed()
                .setColor(0x9af59f)
                .setThumbnail("https://strapi.wehateisekai.club/uploads/47371_e310fbcba5.jpg")
                .setTitle("New Chapter")
                .setDescription("There's a new chapter of Breakthrough!")
                .addField("Read Chapter:", chapterLink)
                .addField("Next Chapter Release", "~1 month")
                .addField("Comment", (comment ? comment : "No upload comment because nothing cool happened."))
                .setTimestamp(new Date())
            client.channels.cache.get("856374936913838100").send(embed).then( () => {
                client.channels.cache.get("856374936913838100").send(`<@&${"856375356494708766"}>`)
            })
        }

        if (cmd === "shinja") {
            if (args.length < 1) {
              message.reply("no new chapter link? dumbasss...LMFAO")
              return;
            }

            let chapterLink = args.splice(0, 1)
            let comment = args.join(" ")

            const embed = new Discord.MessageEmbed()
                .setColor(0x9af59f)
                .setThumbnail("https://strapi.wehateisekai.club/uploads/49655_e030b16e36.png")
                .setTitle("New Chapter")
                .setDescription("There's a new chapter of Shinja!")
                .addField("Read Chapter:", chapterLink)
                .addField("Next Chapter Release", "~1 month")
                .addField("Comment", (comment ? comment : "No upload comment because nothing cool happened."))
                .setTimestamp(new Date())
            client.channels.cache.get("856374950990446632").send(embed).then( () => {
                client.channels.cache.get("856374950990446632").send(`<@&${"856375381303885924"}>`)
            })
        }
        // console.log("admin user")
    }
});

function addRole(guild, emojiName, user) {
    switch (emojiName) {
        case '1️⃣':
            role = guild.roles.cache.get('856375305921101836')
            break;
        case '2️⃣':
            role = guild.roles.cache.get('856375381303885924')
            break;
        case '3️⃣':
            role = guild.roles.cache.get('856375356494708766')
            break;
        default:
            role = null
    }

    guild.members.fetch(user.id).then((m) => {
        m.roles.add(role).catch((e) => {
            console.error(e)
        })
    })
}

client.on('messageReactionAdd', async (message, user) => {
    if (message.message.id != botConfig.roleMsg) return;
    if (message.emoji.name != '1️⃣' && message.emoji.name != '2️⃣' && message.emoji.name != '3️⃣') return;

    addRole(message.message.guild, message.emoji.name, user)
})

function removeRole(guild, emojiName, user) {
    switch (emojiName) {
      case '1️⃣':
          role = guild.roles.cache.get('856375305921101836')
          break;
      case '2️⃣':
          role = guild.roles.cache.get('856375381303885924')
          break;
      case '3️⃣':
          role = guild.roles.cache.get('856375356494708766')
          break;
      default:
          role = null
    }

    guild.members.fetch(user.id).then((m) => {
        m.roles.remove(role).catch((e) => {
            console.error(e)
        })
    })
}

client.on('messageReactionRemove', async (message, user) => {
    if (message.message.id != botConfig.roleMsg) return;
    if (message.emoji.name != '1️⃣' && message.emoji.name != '2️⃣' && message.emoji.name != '3️⃣') return;

    removeRole(message.message.guild, message.emoji.name, user)
})

client.login(botConfig.token);
