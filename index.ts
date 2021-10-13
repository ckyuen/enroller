import DiscordJS, { Intents } from 'discord.js'
import dotenv from 'dotenv'
import { editVacancies, joinMatch, withdraw } from './join'

dotenv.config()

const client = new DiscordJS.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
})

client.on("ready", () => {
    console.log("The bot is ready")

    //register command
    const guildId = "881125024730349598"      //test server
    const guild = client.guilds.cache.get(guildId)
    let commandManager  
    
    if (guild) {
        commandManager = guild.commands
    } else {
        //if guild not exists
        commandManager = client.application?.commands
    }
    
    commandManager?.create({
        name: 'create',
        description: '開球局時用',
        options: 
            [{
                name: 'vacancies',
                description: "球局人數",
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            }]
        
    })

    commandManager?.create({
        name: 'join',
        description: '參加球局時用',
    })

    commandManager?.create({
        name: 'withdraw',
        description: '退出球局時用',
    })

    commandManager?.create({
        name: 'a',
        description: 'a',
        options: 
            [{
                name: 'response',
                description: "response",
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            }]
        
    })

    commandManager?.create({
        name: 'editvacancies',
        description: '更改球局人數時用',
        options: 
            [{
                name: 'vacancies',
                description: "球局人數",
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            }]
        
    })

})

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return

    await interaction.deferReply()
    if (!interaction.channel?.isThread()){
        await interaction.editReply({
            content: 'This command must be used in a thread.',
            //ephemeral: true
        })
        return
    }
    const  { commandName, options , user} = interaction
    if (commandName === "create"){
        console.log("isThread")
        //check if a list is created already 
        var isListCreated = false;
        let botId = client.user?.id;
        let massageManager = interaction.channel.messages
        await massageManager.fetchPinned().then((pinnedMessages) => {
            console.log("Fetched " + pinnedMessages.size + " pinned messages.")
            if(pinnedMessages.size > 0){
                pinnedMessages.forEach((pinned) =>{
                    console.log("Bot Id: " + botId + " meessage author: " + pinned.member?.user.id)
                    if (pinned.member?.user.id == botId){
                        console.log("List found")
                        isListCreated = true;
                        
                    }
                })
            }
        })
        if(isListCreated){
            interaction.editReply({
                content: 'A Participant List is already created.',
                //ephemeral: true
            })
            return 
        }
        
        const createrTag = '<@' + user.id + '>'
        const participantList:string[] = [createrTag];
        const vacancies = options.getNumber("vacancies")
        const json = {vacancies, participantList}
        interaction.channel.send({
            content: '報名表\n1. ' + createrTag + "```" + JSON.stringify(json) +"```",
        })
        .then((message) => {
            message.pin()
            interaction.editReply({
                content: 'Successfully create a participant list.',
                //ephemeral: true
            })
        })
    } else if (commandName === "join"){
        let botId = client.user?.id;
        let massageManager = interaction.channel?.messages
        let memberId = user.id
        await massageManager?.fetchPinned().then((pinnedMessages) => {
            console.log("Fetched " + pinnedMessages.size + " pinned messages.")
            if(pinnedMessages.size > 0){
                pinnedMessages.forEach((pinned) =>{
                    console.log("Bot Id: " + botId + " meessage author: " + pinned.member?.user.id)
                    if (pinned.member?.user.id == botId){
                        console.log("List found for /join")

                        let updatedContent = joinMatch(pinned.content, memberId)
                        pinned.edit({
                            content: updatedContent,
                        }).then( () => {interaction.editReply({
                            content: 'Joined successfully.',
                            })
                        })
                    }
                })
            }
        })
    } else if (commandName === "withdraw"){
        let botId = client.user?.id;
        let massageManager = interaction.channel?.messages
        let memberId = user.id
        await massageManager?.fetchPinned().then((pinnedMessages) => {
            //console.log("Fetched " + pinnedMessages.size + " pinned messages.")
            if(pinnedMessages.size > 0){
                pinnedMessages.forEach((pinned) =>{
                    console.log("Bot Id: " + botId + " meessage author: " + pinned.member?.user.id)
                    if (pinned.member?.user.id == botId){
                        console.log("List found for /withdraw")

                        let updatedContent = withdraw(pinned.content, memberId)
                        console.log(updatedContent)
                        
                        if (updatedContent === ""){
                            console.log("You have not joined the match yet.")
                            interaction.editReply({
                                content: 'You have not joined the match yet.',
                                })
                                .then(() => {console.log("withdraw form empty list, warning sent.")})
                                .catch(() => {console.log("Exception when withdrawing from empty list.")})
                            return      
                        }
                        pinned.edit({
                            content: updatedContent,
                        }).then( () => {interaction.editReply({
                            content: 'Withdraw successfully.',
                            })
                        })
                        
                    }
                })
            }
        })
    } else if (commandName === "a"){
        var content = {content: "0"}
        console.log("response init to 0")
        if (options.getNumber("response") === 1){
            content = {content: "1"}
            console.log("response set to 1")
        }
        console.log("sending reply")
        interaction.editReply(content)
        console.log("Finished")
    } else if (commandName == "editvacancies"){
        let botId = client.user?.id;
        let massageManager = interaction.channel?.messages
        let newVacancies = options.getNumber("vacancies")!
        await massageManager?.fetchPinned().then((pinnedMessages) => {
            //console.log("Fetched " + pinnedMessages.size + " pinned messages.")
            if(pinnedMessages.size > 0){
                pinnedMessages.forEach((pinned) =>{
                    console.log("Bot Id: " + botId + " meessage author: " + pinned.member?.user.id)
                    if (pinned.member?.user.id == botId){
                        console.log("List found for /editVacancies")

                        let updatedContent = editVacancies(pinned.content, newVacancies)
                        console.log(updatedContent)
                        
                        pinned.edit({
                            content: updatedContent,
                        }).then( () => {interaction.editReply({
                            content: `Edited vacancies to ${newVacancies} `,
                            })
                        })
                        
                    }
                })
            }
        })
    }
})

/*
client.on("threadCreate" , (thread) => {
    var ownerId = thread.ownerId
    
    let creater = thread.fetchOwner().then((owner) =>{
        ownerName = owner?.user?.username.get
        console.log(ownerName)
        thread.send({
            content: ownerName,
        }) 
    })
    
    thread.send({
        content: '1. <@' + ownerId + '>',
    }) 
}) 
*/

client.login(process.env.TOKEN);