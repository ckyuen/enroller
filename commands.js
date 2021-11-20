"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCommands = void 0;
var discord_js_1 = __importDefault(require("discord.js"));
function setCommands(commandManager) {
    commandManager.set([
        {
            name: 'ownercreate',
            description: '開球局時用(場主用)',
            options: [{
                    name: 'vacancies',
                    description: "球局人數",
                    required: true,
                    type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.NUMBER
                }]
        },
        {
            name: 'join',
            description: '參加球局時用',
            options: [{
                    name: 'remark',
                    description: "optional:備注",
                    required: false,
                    type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.STRING
                }]
        },
        {
            name: 'withdraw',
            description: '退出球局時用',
        },
        {
            name: 'ownereditvacancies',
            description: '更改球局人數時用(場主用)',
            options: [{
                    name: 'vacancies',
                    description: "球局人數",
                    required: true,
                    type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.NUMBER
                }]
        },
        {
            name: 'editremark',
            description: '更改備注時用',
            options: [{
                    name: 'remark',
                    description: "備注",
                    type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.STRING
                }]
        },
        {
            name: 'ownerinsertplayer',
            description: '將參加者直接加到指定排位(場主用)',
            options: [{
                    name: 'participant',
                    description: "參加者",
                    required: true,
                    type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.USER
                },
                {
                    name: 'position',
                    description: "排位",
                    required: true,
                    type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.NUMBER
                },
                {
                    name: 'remark',
                    description: "optional:備注",
                    required: false,
                    type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.STRING
                }
            ]
        },
        {
            name: 'ownereditremark',
            description: '更改備注時用(場主用)',
            options: [{
                    name: 'participant',
                    description: "參加者",
                    required: true,
                    type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.USER
                },
                {
                    name: 'remark',
                    description: "備注",
                    type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.STRING
                },
            ]
        },
        {
            name: 'ownerkickplayer',
            description: '將參加者於列表中除去(場主用)',
            options: [{
                    name: 'participant',
                    description: "參加者",
                    required: true,
                    type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.USER
                },
            ]
        },
        {
            name: 'enrollerversion',
            description: 'Display current version',
        }
    ]).catch(console.error);
}
exports.setCommands = setCommands;
