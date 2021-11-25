import DiscordJS, { Intents, GuildApplicationCommandManager} from 'discord.js'
import dotenv from 'dotenv'
import { createMatch, editRemark, editVacancies, joinMatch, Participant, withdraw, insertPlayer, validateVancancies} from './join'
import {setCommands} from './commands'

const version = "1.0.2";

dotenv.config();
console.log("App started");

const client = new DiscordJS.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
})

client.on("ready", () => {

    //register command
    console.log("The bot is ready");
    const guildId = process.env.SERVER_ID;
    const guild = client.guilds.cache.get(guildId || '881125024730349598');
    let commandManager:GuildApplicationCommandManager;
    
    if (guild) {
        commandManager = guild.commands;
    } else {
        //if guild not exists
        console.log("Guild ID is invalid. Exit application now.");
        return;
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
        let massageManager = interaction.channel.messages;
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
        if (!Number.isInteger(vacancies) || !validateVancancies(vacancies, maxVacancies)){
            await interaction.editReply({
                content: `Vacancies must be an integer between 1 to ${maxVacancies}.`,
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
        let isListFound = false;

        //check remark length
        if (remark !== null){
            let maxRemarkLength = Number(process.env.MAX_REMARK_LEN) | 30;
            if (remark.length > maxRemarkLength){
                interaction.editReply({
                    content: `The length of a remark must be less than ${maxRemarkLength} characters.`,
                    })
                return;
            }
        }

        await massageManager?.fetchPinned().then((pinnedMessages) => {
            if(pinnedMessages.size > 0){
                pinnedMessages.forEach((pinned) =>{
                    if (pinned.member?.user.id == botId){

                        isListFound = true;
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
                            }).catch( (e) => {
                                interaction.editReply({
                                    content: 'Failed to update the list.',
                                    })
                                    console.error(e);
                            })
                        })
                    }
                })
            }
            if(!isListFound){
                interaction.editReply({
                    content: 'Participant List is not created yet.',
                    })
            }
        })
    } else if (commandName === "withdraw"){
        let botId = client.user?.id;
        let massageManager = interaction.channel?.messages
        let memberId = user.id
        let isListFound = false;
        await massageManager?.fetchPinned().then((pinnedMessages) => {
            if(pinnedMessages.size > 0){
                pinnedMessages.forEach((pinned) =>{
                    if (pinned.member?.user.id == botId){

                        isListFound = true;
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
                            }).catch( (e) => {
                                interaction.editReply({
                                    content: 'Failed to update the list.',
                                    })
                                    console.error(e);
                            })
                        })
                        
                    }
                })
            }
            if(!isListFound){
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
        let isListFound = false;
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
        if (!Number.isInteger(newVacancies) || !validateVancancies(newVacancies, maxVacancies)){
            await interaction.editReply({
                content: `Vacancies must be an integer between 1 to ${maxVacancies}.`,
            })
            return;
        }

        await massageManager?.fetchPinned().then((pinnedMessages) => {
            if(pinnedMessages.size > 0){
                pinnedMessages.forEach((pinned) =>{
                    if (pinned.member?.user.id == botId){

                        isListFound = true;
                        let updatedContent = editVacancies(pinned.content, newVacancies)
                        
                        pinned.edit({
                            content: updatedContent,
                        }).then( () => {interaction.editReply({
                            content: `Edited vacancies to ${newVacancies}. `,
                            }).catch( (e) => {
                                interaction.editReply({
                                    content: 'Failed to update the list.',
                                    })
                                console.error(e);
                            })
                        })
                        
                    }
                })
            }
            if(!isListFound){
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
        let isListFound = false;

        //check remark length
        if (newRemark !== null){
            let maxRemarkLength = Number(process.env.MAX_REMARK_LEN) | 30;
            if (newRemark.length > maxRemarkLength){
                interaction.editReply({
                    content: `The length of a remark must be less than ${maxRemarkLength} characters.`,
                    })
                return;
            }
        }

        await massageManager?.fetchPinned().then((pinnedMessages) => {
            if(pinnedMessages.size > 0){
                pinnedMessages.forEach((pinned) =>{
                    if (pinned.member?.user.id == botId){

                        
                        isListFound = true;
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
                            }).catch( (e) => {
                                interaction.editReply({
                                    content: 'Failed to update the list.',
                                    })
                                console.error(e);
                            })
                        })
                        
                    }
                })
            }
            if(!isListFound){
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
        let isListFound = false;
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
        if (!Number.isInteger(position) ||  !validateVancancies(position, maxVacancies)){
            await interaction.editReply({
                content: `Position must be an integer an between 1 to ${maxVacancies}.`,
            })
            return;
        }

        //check remark length
        if (remark !== null){
            let maxRemarkLength = Number(process.env.MAX_REMARK_LEN) | 30;
            if (remark.length > maxRemarkLength){
                interaction.editReply({
                    content: `The length of a remark must be less than ${maxRemarkLength} characters.`,
                    })
                return;
            }
        }

        await massageManager?.fetchPinned().then((pinnedMessages) => {
            if(pinnedMessages.size > 0){
                pinnedMessages.forEach((pinned) =>{
                    if (pinned.member?.user.id == botId){
                        
                        isListFound = true;
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
                        }).catch( (e) => {
                            interaction.editReply({
                                content: 'Failed to update the list.',
                                })
                            console.error(e);
                        })
                    }
                })
            }
        })
        if(!isListFound){
            interaction.editReply({
                content: 'Participant List is not created yet.',
                })
        }
    } else if (commandName === "ownereditremark"){
        let botId = client.user?.id;
        let massageManager = interaction.channel?.messages;
        let participant = options.getUser("participant")!;
        let newRemark = options.getString("remark")!;
        let isFromOwner = true;
        let isListFound = false;
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

        //check remark length
        if (newRemark !== null){
            let maxRemarkLength = Number(process.env.MAX_REMARK_LEN) | 30;
            if (newRemark.length > maxRemarkLength){
                interaction.editReply({
                    content: `The length of a remark must be less than ${maxRemarkLength} characters.`,
                    })
                return;
            }
        }

        await massageManager?.fetchPinned().then((pinnedMessages) => {
            if(pinnedMessages.size > 0){
                pinnedMessages.forEach((pinned) =>{
                    if (pinned.member?.user.id == botId){

                        isListFound = true;
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
                            }).catch( (e) => {
                                interaction.editReply({
                                    content: 'Failed to update the list.',
                                    })
                                console.error(e);
                            })
                        })
                    }
                })
            }
            if(!isListFound){
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
        let isListFound = false;
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

                        isListFound = true;
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
                            }).catch( (e) => {
                                interaction.editReply({
                                    content: 'Failed to update the list.',
                                    })
                                console.error(e);
                            })
                        })
                        
                    }
                })
            }
            if(!isListFound){
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
