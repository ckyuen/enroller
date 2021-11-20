import DiscordJS, { Intents, GuildApplicationCommandManager} from 'discord.js'
import dotenv from 'dotenv'
import { createMatch, editRemark, editVacancies, joinMatch, Participant, withdraw, insertPlayer, validateVancancies} from './join'
import {setCommands} from './commands'

const version = "1.0.0";

dotenv.config()

const client = new DiscordJS.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
})

client.on("ready", () => {
    console.log("The bot is ready")

    //register command
    const guildId = process.env.SERVER_ID;
    const guild = client.guilds.cache.get(guildId || '881125024730349598');
    let commandManager:GuildApplicationCommandManager;
    
    if (guild) {
        commandManager = guild.commands
    } else {
        //if guild not exists
        //commandManager = client.application?.commands
        console.log("Guild ID is invalid. Exit application now.");
    }

    setCommands(commandManager!);
})

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    await interaction.deferReply();
    if (!interaction.channel?.isThread()){
        await interaction.editReply({
            content: 'This command must be used in a thread.',
        })
        return;
    }
    const  {commandName, options , user} = interaction;
    //Log 
    console.log(`/${commandName} form ${user.tag}`);

    if (commandName === "ownercreate"){
        //check if a list is created already 
        let isListCreated = false;
        let isFromOwner = true;
        let botId = client.user?.id;
        let massageManager = interaction.channel.messages
        const vacancies = options.getNumber("vacancies")!

        //check if the user is the owner
        await interaction.channel.fetchOwner().then((owner) => {
            if (owner?.id !== user.id && user.id !== process.env.SUPER_USER_ID) {
                isFromOwner = false;
            }
        });
        if (!isFromOwner){
            await interaction.editReply({
                content: 'You are not the owner of this thread.',
            })
            return;
        }
        //validateVancancies
        let maxVacancies = Number(process.env.MAX_VACANCIES) || 100;
        if (!validateVancancies(vacancies, maxVacancies)){
            await interaction.editReply({
                content: `Vacancies must be between 0 to ${maxVacancies}.`,
            })
            return;
        }
        //check if created
        await massageManager.fetchPinned().then((pinnedMessages) => {
            if(pinnedMessages.size > 0){
                pinnedMessages.forEach((pinned) =>{
                    if (pinned.member?.user.id == botId){
                        isListCreated = true;
                        
                    }
                })
            }
            
        })
        if(isListCreated){
            await interaction.editReply({
                content: 'Only one list is allowed.',
                //ephemeral: true
            })
            return;
        }
        //create
        let messageContent = createMatch(user.id, vacancies);
        await interaction.channel.send({
            content: messageContent,
        })
        .then((message) => {
            message.pin()
            interaction.editReply({
                content: 'Participant list created successfully.',
            })
        })

    } else if (commandName === "join"){
        let botId = client.user?.id;
        let massageManager = interaction.channel?.messages
        let memberId = user.id
        let remark = options.getString("remark")!;
        await massageManager?.fetchPinned().then((pinnedMessages) => {
            if(pinnedMessages.size > 0){
                pinnedMessages.forEach((pinned) =>{
                    if (pinned.member?.user.id == botId){
                        
                        let updatedContent = joinMatch(pinned.content, memberId, remark);

                        if (updatedContent === ""){
                            interaction.editReply({
                                content: 'You have already joined.',
                                })
                            return;      
                        }

                        pinned.edit({
                            content: updatedContent,
                        }).then( () => {interaction.editReply({
                            content: 'Joined successfully.',
                            })
                        })
                    }
                })
            } else {
                interaction.editReply({
                    content: 'Participant List is not created yet.',
                    })
            }
        })
    } else if (commandName === "withdraw"){
        let botId = client.user?.id;
        let massageManager = interaction.channel?.messages
        let memberId = user.id
        await massageManager?.fetchPinned().then((pinnedMessages) => {
            if(pinnedMessages.size > 0){
                pinnedMessages.forEach((pinned) =>{
                    if (pinned.member?.user.id == botId){

                        let updatedContent = withdraw(pinned.content, memberId)
                        
                        if (updatedContent === ""){
                            interaction.editReply({
                                content: 'You have not joined yet.',
                                })
                            return;      
                        }
                        pinned.edit({
                            content: updatedContent,
                        }).then( () => {interaction.editReply({
                            content: 'Withdraw successfully.',
                            })
                        })
                        
                    }
                })
            } else {
                interaction.editReply({
                    content: 'Participant List is not created yet.',
                    })
            }
        })
    } else if (commandName === "ownereditvacancies"){
        let botId = client.user?.id;
        let massageManager = interaction.channel?.messages;
        let newVacancies = options.getNumber("vacancies")!;
        let isFromOwner = true;
        await interaction.channel.fetchOwner().then((owner) => {
            if (owner?.id !== user.id && user.id !== process.env.SUPER_USER_ID) {
                isFromOwner = false;
            }
        });
        if (!isFromOwner){
            await interaction.editReply({
                content: 'You are not the owner of this thread.',
            })
            return;
        }

        let maxVacancies = Number(process.env.MAX_VACANCIES) || 100;
        if (!validateVancancies(newVacancies, maxVacancies)){
            await interaction.editReply({
                content: `Vacancies must be between 1 to ${maxVacancies}.`,
            })
            return;
        }

        await massageManager?.fetchPinned().then((pinnedMessages) => {
            if(pinnedMessages.size > 0){
                pinnedMessages.forEach((pinned) =>{
                    if (pinned.member?.user.id == botId){

                        let updatedContent = editVacancies(pinned.content, newVacancies)
                        
                        pinned.edit({
                            content: updatedContent,
                        }).then( () => {interaction.editReply({
                            content: `Edited vacancies to ${newVacancies}. `,
                            })
                        })
                        
                    }
                })
            } else {
                interaction.editReply({
                    content: 'Participant List is not created yet.',
                    })
            }
        })
    } else if (commandName === "editremark") {
        let botId = client.user?.id;
        let massageManager = interaction.channel?.messages;
        let memberId = user.id;
        let newRemark = options.getString("remark")!;
        await massageManager?.fetchPinned().then((pinnedMessages) => {
            if(pinnedMessages.size > 0){
                pinnedMessages.forEach((pinned) =>{
                    if (pinned.member?.user.id == botId){

                        if(newRemark === null) newRemark = "";
                        let returnMassage = editRemark(pinned.content, memberId, newRemark);
                        
                        if (returnMassage.content === ""){
                            interaction.editReply({
                                content: 'You have not joined yet.',
                                })
                            return;      
                        }
                        pinned.edit({
                            content: returnMassage.content,
                        }).then( () => {interaction.editReply({
                            content: `Edited remark from ${returnMassage.oldValue} to ${newRemark}.`,
                            })
                        })
                        
                    }
                })
            } else {
                interaction.editReply({
                    content: 'Participant List is not created yet.',
                    })
            }
        })
    } else if (commandName === "ownerinsertplayer"){
        let botId = client.user?.id;
        let massageManager = interaction.channel?.messages;
        let position = options.getNumber("position")!;
        let newParticipant = options.getUser("participant")!;
        let remark = options.getString("remark")!;
        let isFromOwner = true;

        await interaction.channel.fetchOwner().then((owner) => {
            if (owner?.id !== user.id && user.id !== process.env.SUPER_USER_ID) {
            isFromOwner = false;
            }
        });
        if (!isFromOwner){
            await interaction.editReply({
                content: 'You are not the owner of this thread.',
            })
            return;
        }

        let maxVacancies = Number(process.env.MAX_VACANCIES) || 100;
        if (!validateVancancies(position, maxVacancies)){
            await interaction.editReply({
                content: `Position must be between 1 to ${maxVacancies}.`,
            })
            return;
        }

        await massageManager?.fetchPinned().then((pinnedMessages) => {
            if(pinnedMessages.size > 0){
                pinnedMessages.forEach((pinned) =>{
                    if (pinned.member?.user.id == botId){
                        
                        let returnMassage = insertPlayer(pinned.content, newParticipant.id, position, remark)
                        pinned.edit({
                            content: returnMassage.content,
                        }).then( () => {
                            if(returnMassage.oldValue === "true"){
                                interaction.editReply({
                                    content: `<@${newParticipant.id}> is appended to the list.`,
                                })
                            }else{
                                interaction.editReply({
                                    content: `<@${newParticipant.id}> is inserted to position ${position}.`,
                                })
                            }
                        })
                    }
                })
            } else {
                interaction.editReply({
                    content: 'Participant List is not created yet.',
                    })
            }
        })
    } else if (commandName === "ownereditremark"){
        let botId = client.user?.id;
        let massageManager = interaction.channel?.messages;
        let participant = options.getUser("participant")!;
        let newRemark = options.getString("remark")!;
        let isFromOwner = true;
        await interaction.channel.fetchOwner().then((owner) => {
            if (owner?.id !== user.id && user.id !== process.env.SUPER_USER_ID) {
            isFromOwner = false;
            }
        });
        if (!isFromOwner){
            await interaction.editReply({
                content: 'You are not the owner of this thread.',
            })
            return;
        }

        await massageManager?.fetchPinned().then((pinnedMessages) => {
            if(pinnedMessages.size > 0){
                pinnedMessages.forEach((pinned) =>{
                    if (pinned.member?.user.id == botId){
                        if(newRemark === null) newRemark = "";
                        let returnMassage = editRemark(pinned.content, participant.id, newRemark);

                        if (returnMassage.content === ""){
                            interaction.editReply({
                                content: `<@${participant.id}> has not joined yet.`,
                                })
                            return;      
                        }

                        pinned.edit({
                            content: returnMassage.content,
                        }).then( () => {interaction.editReply({
                            content: `Updated <@${participant.id}> remark from ${returnMassage.oldValue} to ${newRemark}.`,
                            })
                        })
                    }
                })
            } else {
                interaction.editReply({
                    content: 'Participant List is not created yet.',
                    })
            }
        })
    } else if (commandName === ("ownerkickplayer")){
        let botId = client.user?.id;
        let massageManager = interaction.channel?.messages;
        let participant = options.getUser("participant")!;
        let isFromOwner = true;
        await interaction.channel.fetchOwner().then((owner) => {
            if (owner?.id !== user.id && user.id !== process.env.SUPER_USER_ID) {
            isFromOwner = false;
            }
        });
        if (!isFromOwner){
            await interaction.editReply({
                content: 'You are not the owner of this thread.',
            })
            return;
        }

        await massageManager?.fetchPinned().then((pinnedMessages) => {
            if(pinnedMessages.size > 0){
                pinnedMessages.forEach((pinned) =>{
                    if (pinned.member?.user.id == botId){

                        let updatedContent = withdraw(pinned.content, participant.id);
                        
                        if (updatedContent === ""){
                            interaction.editReply({
                                content: `<@${participant.id}> has not joined yet.`,
                                })
                            return;      
                        }
                        pinned.edit({
                            content: updatedContent,
                        }).then( () => {interaction.editReply({
                            content: `<@${participant.id}> is kicked.`,
                            })
                        })
                        
                    }
                })
            } else {
                interaction.editReply({
                    content: 'Participant List is not created yet.',
                    })
            }
        })
    } else if (commandName === ("enrollerversion")){
        interaction.editReply({
            content: `Current version: ${version}`,
            })
    }
    
})

client.login(process.env.TOKEN);
