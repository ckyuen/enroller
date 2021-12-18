import DiscordJS, { GuildApplicationCommandManager } from "discord.js"

export function setCommands(commandManager:GuildApplicationCommandManager){

    commandManager.set([
            {
                name: 'ownercreate',
                description: '開球局時用(場主用)',
                options: 
                    [{
                        name: 'vacancies',
                        description: "球局人數",
                        required: true,
                        type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
                    }]
                
            },
            {
                name: 'join',
                description: '參加球局時用',
                options: 
                [{
                    name: 'remark',
                    description: "optional:備注",
                    required: false,
                    type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
                }]
            },
            {
                name: 'withdraw',
                description: '退出球局時用',
            },
            {
                name: 'ownereditvacancies',
                description: '更改球局人數時用(場主用)',
                options: 
                    [{
                        name: 'vacancies',
                        description: "球局人數",
                        required: true,
                        type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
                    }]
                
            },
            {
                name: 'editremark',
                description: '更改備注時用',
                options: 
                    [{
                        name: 'remark',
                        description: "備注",
                        type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
                    }]
                
            },
            {
                name: 'ownerinsertplayer',
                description: '將參加者直接加到指定排位(場主用)',
                options: 
                    [{
                        name: 'participant',
                        description: "參加者",
                        required: true,
                        type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
                    }, 
                    {
                        name: 'position',
                        description: "排位",
                        required: true,
                        type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
                    },
                    {
                        name: 'remark',
                        description: "optional:備注",
                        required: false,
                        type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
                    }
                ]
                
            },
            {
                name: 'ownereditremark',
                description: '更改備注時用(場主用)',
                options: 
                    [{
                        name: 'participant',
                        description: "參加者",
                        required: true,
                        type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
                    },
                    {
                        name: 'remark',
                        description: "備注",
                        type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
                    },
                ]
                
            },
            {
                name: 'ownerkickplayer',
                description: '將參加者於列表中除去(場主用)',
                options: 
                    [{
                        name: 'participant',
                        description: "參加者",
                        required: true,
                        type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
                    },
                ]
                
            },
            {
                name: 'enrollerversion',
                description: 'Display current version',
            },
            {
                name: 'patchlist',
                description: 'Patch command for version 2.0.0.',
            }

        ]).catch(console.error);

}