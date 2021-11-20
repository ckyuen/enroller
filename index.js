"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = __importStar(require("discord.js"));
var dotenv_1 = __importDefault(require("dotenv"));
var join_1 = require("./join");
var commands_1 = require("./commands");
var version = "1.0.0";
dotenv_1.default.config();
console.log("App started");
var client = new discord_js_1.default.Client({
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_MEMBERS],
});
client.on("ready", function () {
    console.log("The bot is ready");
    //register command
    var guildId = process.env.SERVER_ID;
    var guild = client.guilds.cache.get(guildId || '881125024730349598');
    var commandManager;
    if (guild) {
        commandManager = guild.commands;
    }
    else {
        //if guild not exists
        //commandManager = client.application?.commands
        console.log("Guild ID is invalid. Exit application now.");
    }
    (0, commands_1.setCommands)(commandManager);
});
client.on("interactionCreate", function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var commandName, options, user, isListCreated_1, isFromOwner_1, botId_1, massageManager, vacancies, maxVacancies, messageContent, botId_2, massageManager, memberId_1, remark_1, botId_3, massageManager, memberId_2, botId_4, massageManager, newVacancies_1, isFromOwner_2, maxVacancies, botId_5, massageManager, memberId_3, newRemark_1, botId_6, massageManager, position_1, newParticipant_1, remark_2, isFromOwner_3, maxVacancies, botId_7, massageManager, participant_1, newRemark_2, isFromOwner_4, botId_8, massageManager, participant_2, isFromOwner_5;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    return __generator(this, function (_s) {
        switch (_s.label) {
            case 0:
                if (!interaction.isCommand())
                    return [2 /*return*/];
                return [4 /*yield*/, interaction.deferReply()];
            case 1:
                _s.sent();
                if (!!((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.isThread())) return [3 /*break*/, 3];
                return [4 /*yield*/, interaction.editReply({
                        content: 'This command must be used in a thread.',
                    })];
            case 2:
                _s.sent();
                return [2 /*return*/];
            case 3:
                commandName = interaction.commandName, options = interaction.options, user = interaction.user;
                //Log 
                console.log("/".concat(commandName, " form ").concat(user.tag));
                if (!(commandName === "ownercreate")) return [3 /*break*/, 13];
                isListCreated_1 = false;
                isFromOwner_1 = true;
                botId_1 = (_b = client.user) === null || _b === void 0 ? void 0 : _b.id;
                massageManager = interaction.channel.messages;
                vacancies = options.getNumber("vacancies");
                //check if the user is the owner
                return [4 /*yield*/, interaction.channel.fetchOwner().then(function (owner) {
                        if ((owner === null || owner === void 0 ? void 0 : owner.id) !== user.id && user.id !== process.env.SUPER_USER_ID) {
                            isFromOwner_1 = false;
                        }
                    })];
            case 4:
                //check if the user is the owner
                _s.sent();
                if (!!isFromOwner_1) return [3 /*break*/, 6];
                return [4 /*yield*/, interaction.editReply({
                        content: 'You are not the owner of this thread.',
                    })];
            case 5:
                _s.sent();
                return [2 /*return*/];
            case 6:
                maxVacancies = Number(process.env.MAX_VACANCIES) || 100;
                if (!!(0, join_1.validateVancancies)(vacancies, maxVacancies)) return [3 /*break*/, 8];
                return [4 /*yield*/, interaction.editReply({
                        content: "Vacancies must be between 0 to ".concat(maxVacancies, "."),
                    })];
            case 7:
                _s.sent();
                return [2 /*return*/];
            case 8: 
            //check if created
            return [4 /*yield*/, massageManager.fetchPinned().then(function (pinnedMessages) {
                    if (pinnedMessages.size > 0) {
                        pinnedMessages.forEach(function (pinned) {
                            var _a;
                            if (((_a = pinned.member) === null || _a === void 0 ? void 0 : _a.user.id) == botId_1) {
                                isListCreated_1 = true;
                            }
                        });
                    }
                })];
            case 9:
                //check if created
                _s.sent();
                if (!isListCreated_1) return [3 /*break*/, 11];
                return [4 /*yield*/, interaction.editReply({
                        content: 'Only one list is allowed.',
                        //ephemeral: true
                    })];
            case 10:
                _s.sent();
                return [2 /*return*/];
            case 11:
                messageContent = (0, join_1.createMatch)(user.id, vacancies);
                return [4 /*yield*/, interaction.channel.send({
                        content: messageContent,
                    })
                        .then(function (message) {
                        message.pin();
                        interaction.editReply({
                            content: 'Participant list created successfully.',
                        });
                    })];
            case 12:
                _s.sent();
                return [3 /*break*/, 44];
            case 13:
                if (!(commandName === "join")) return [3 /*break*/, 15];
                botId_2 = (_c = client.user) === null || _c === void 0 ? void 0 : _c.id;
                massageManager = (_d = interaction.channel) === null || _d === void 0 ? void 0 : _d.messages;
                memberId_1 = user.id;
                remark_1 = options.getString("remark");
                return [4 /*yield*/, (massageManager === null || massageManager === void 0 ? void 0 : massageManager.fetchPinned().then(function (pinnedMessages) {
                        if (pinnedMessages.size > 0) {
                            pinnedMessages.forEach(function (pinned) {
                                var _a;
                                if (((_a = pinned.member) === null || _a === void 0 ? void 0 : _a.user.id) == botId_2) {
                                    var updatedContent = (0, join_1.joinMatch)(pinned.content, memberId_1, remark_1);
                                    if (updatedContent === "") {
                                        interaction.editReply({
                                            content: 'You have already joined.',
                                        });
                                        return;
                                    }
                                    pinned.edit({
                                        content: updatedContent,
                                    }).then(function () {
                                        interaction.editReply({
                                            content: 'Joined successfully.',
                                        });
                                    });
                                }
                            });
                        }
                        else {
                            interaction.editReply({
                                content: 'Participant List is not created yet.',
                            });
                        }
                    }))];
            case 14:
                _s.sent();
                return [3 /*break*/, 44];
            case 15:
                if (!(commandName === "withdraw")) return [3 /*break*/, 17];
                botId_3 = (_e = client.user) === null || _e === void 0 ? void 0 : _e.id;
                massageManager = (_f = interaction.channel) === null || _f === void 0 ? void 0 : _f.messages;
                memberId_2 = user.id;
                return [4 /*yield*/, (massageManager === null || massageManager === void 0 ? void 0 : massageManager.fetchPinned().then(function (pinnedMessages) {
                        if (pinnedMessages.size > 0) {
                            pinnedMessages.forEach(function (pinned) {
                                var _a;
                                if (((_a = pinned.member) === null || _a === void 0 ? void 0 : _a.user.id) == botId_3) {
                                    var updatedContent = (0, join_1.withdraw)(pinned.content, memberId_2);
                                    if (updatedContent === "") {
                                        interaction.editReply({
                                            content: 'You have not joined yet.',
                                        });
                                        return;
                                    }
                                    pinned.edit({
                                        content: updatedContent,
                                    }).then(function () {
                                        interaction.editReply({
                                            content: 'Withdraw successfully.',
                                        });
                                    });
                                }
                            });
                        }
                        else {
                            interaction.editReply({
                                content: 'Participant List is not created yet.',
                            });
                        }
                    }))];
            case 16:
                _s.sent();
                return [3 /*break*/, 44];
            case 17:
                if (!(commandName === "ownereditvacancies")) return [3 /*break*/, 24];
                botId_4 = (_g = client.user) === null || _g === void 0 ? void 0 : _g.id;
                massageManager = (_h = interaction.channel) === null || _h === void 0 ? void 0 : _h.messages;
                newVacancies_1 = options.getNumber("vacancies");
                isFromOwner_2 = true;
                return [4 /*yield*/, interaction.channel.fetchOwner().then(function (owner) {
                        if ((owner === null || owner === void 0 ? void 0 : owner.id) !== user.id && user.id !== process.env.SUPER_USER_ID) {
                            isFromOwner_2 = false;
                        }
                    })];
            case 18:
                _s.sent();
                if (!!isFromOwner_2) return [3 /*break*/, 20];
                return [4 /*yield*/, interaction.editReply({
                        content: 'You are not the owner of this thread.',
                    })];
            case 19:
                _s.sent();
                return [2 /*return*/];
            case 20:
                maxVacancies = Number(process.env.MAX_VACANCIES) || 100;
                if (!!(0, join_1.validateVancancies)(newVacancies_1, maxVacancies)) return [3 /*break*/, 22];
                return [4 /*yield*/, interaction.editReply({
                        content: "Vacancies must be between 1 to ".concat(maxVacancies, "."),
                    })];
            case 21:
                _s.sent();
                return [2 /*return*/];
            case 22: return [4 /*yield*/, (massageManager === null || massageManager === void 0 ? void 0 : massageManager.fetchPinned().then(function (pinnedMessages) {
                    if (pinnedMessages.size > 0) {
                        pinnedMessages.forEach(function (pinned) {
                            var _a;
                            if (((_a = pinned.member) === null || _a === void 0 ? void 0 : _a.user.id) == botId_4) {
                                var updatedContent = (0, join_1.editVacancies)(pinned.content, newVacancies_1);
                                pinned.edit({
                                    content: updatedContent,
                                }).then(function () {
                                    interaction.editReply({
                                        content: "Edited vacancies to ".concat(newVacancies_1, ". "),
                                    });
                                });
                            }
                        });
                    }
                    else {
                        interaction.editReply({
                            content: 'Participant List is not created yet.',
                        });
                    }
                }))];
            case 23:
                _s.sent();
                return [3 /*break*/, 44];
            case 24:
                if (!(commandName === "editremark")) return [3 /*break*/, 26];
                botId_5 = (_j = client.user) === null || _j === void 0 ? void 0 : _j.id;
                massageManager = (_k = interaction.channel) === null || _k === void 0 ? void 0 : _k.messages;
                memberId_3 = user.id;
                newRemark_1 = options.getString("remark");
                return [4 /*yield*/, (massageManager === null || massageManager === void 0 ? void 0 : massageManager.fetchPinned().then(function (pinnedMessages) {
                        if (pinnedMessages.size > 0) {
                            pinnedMessages.forEach(function (pinned) {
                                var _a;
                                if (((_a = pinned.member) === null || _a === void 0 ? void 0 : _a.user.id) == botId_5) {
                                    if (newRemark_1 === null)
                                        newRemark_1 = "";
                                    var returnMassage_1 = (0, join_1.editRemark)(pinned.content, memberId_3, newRemark_1);
                                    if (returnMassage_1.content === "") {
                                        interaction.editReply({
                                            content: 'You have not joined yet.',
                                        });
                                        return;
                                    }
                                    pinned.edit({
                                        content: returnMassage_1.content,
                                    }).then(function () {
                                        interaction.editReply({
                                            content: "Edited remark from ".concat(returnMassage_1.oldValue, " to ").concat(newRemark_1, "."),
                                        });
                                    });
                                }
                            });
                        }
                        else {
                            interaction.editReply({
                                content: 'Participant List is not created yet.',
                            });
                        }
                    }))];
            case 25:
                _s.sent();
                return [3 /*break*/, 44];
            case 26:
                if (!(commandName === "ownerinsertplayer")) return [3 /*break*/, 33];
                botId_6 = (_l = client.user) === null || _l === void 0 ? void 0 : _l.id;
                massageManager = (_m = interaction.channel) === null || _m === void 0 ? void 0 : _m.messages;
                position_1 = options.getNumber("position");
                newParticipant_1 = options.getUser("participant");
                remark_2 = options.getString("remark");
                isFromOwner_3 = true;
                return [4 /*yield*/, interaction.channel.fetchOwner().then(function (owner) {
                        if ((owner === null || owner === void 0 ? void 0 : owner.id) !== user.id && user.id !== process.env.SUPER_USER_ID) {
                            isFromOwner_3 = false;
                        }
                    })];
            case 27:
                _s.sent();
                if (!!isFromOwner_3) return [3 /*break*/, 29];
                return [4 /*yield*/, interaction.editReply({
                        content: 'You are not the owner of this thread.',
                    })];
            case 28:
                _s.sent();
                return [2 /*return*/];
            case 29:
                maxVacancies = Number(process.env.MAX_VACANCIES) || 100;
                if (!!(0, join_1.validateVancancies)(position_1, maxVacancies)) return [3 /*break*/, 31];
                return [4 /*yield*/, interaction.editReply({
                        content: "Position must be between 1 to ".concat(maxVacancies, "."),
                    })];
            case 30:
                _s.sent();
                return [2 /*return*/];
            case 31: return [4 /*yield*/, (massageManager === null || massageManager === void 0 ? void 0 : massageManager.fetchPinned().then(function (pinnedMessages) {
                    if (pinnedMessages.size > 0) {
                        pinnedMessages.forEach(function (pinned) {
                            var _a;
                            if (((_a = pinned.member) === null || _a === void 0 ? void 0 : _a.user.id) == botId_6) {
                                var returnMassage_2 = (0, join_1.insertPlayer)(pinned.content, newParticipant_1.id, position_1, remark_2);
                                pinned.edit({
                                    content: returnMassage_2.content,
                                }).then(function () {
                                    if (returnMassage_2.oldValue === "true") {
                                        interaction.editReply({
                                            content: "<@".concat(newParticipant_1.id, "> is appended to the list."),
                                        });
                                    }
                                    else {
                                        interaction.editReply({
                                            content: "<@".concat(newParticipant_1.id, "> is inserted to position ").concat(position_1, "."),
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        interaction.editReply({
                            content: 'Participant List is not created yet.',
                        });
                    }
                }))];
            case 32:
                _s.sent();
                return [3 /*break*/, 44];
            case 33:
                if (!(commandName === "ownereditremark")) return [3 /*break*/, 38];
                botId_7 = (_o = client.user) === null || _o === void 0 ? void 0 : _o.id;
                massageManager = (_p = interaction.channel) === null || _p === void 0 ? void 0 : _p.messages;
                participant_1 = options.getUser("participant");
                newRemark_2 = options.getString("remark");
                isFromOwner_4 = true;
                return [4 /*yield*/, interaction.channel.fetchOwner().then(function (owner) {
                        if ((owner === null || owner === void 0 ? void 0 : owner.id) !== user.id && user.id !== process.env.SUPER_USER_ID) {
                            isFromOwner_4 = false;
                        }
                    })];
            case 34:
                _s.sent();
                if (!!isFromOwner_4) return [3 /*break*/, 36];
                return [4 /*yield*/, interaction.editReply({
                        content: 'You are not the owner of this thread.',
                    })];
            case 35:
                _s.sent();
                return [2 /*return*/];
            case 36: return [4 /*yield*/, (massageManager === null || massageManager === void 0 ? void 0 : massageManager.fetchPinned().then(function (pinnedMessages) {
                    if (pinnedMessages.size > 0) {
                        pinnedMessages.forEach(function (pinned) {
                            var _a;
                            if (((_a = pinned.member) === null || _a === void 0 ? void 0 : _a.user.id) == botId_7) {
                                if (newRemark_2 === null)
                                    newRemark_2 = "";
                                var returnMassage_3 = (0, join_1.editRemark)(pinned.content, participant_1.id, newRemark_2);
                                if (returnMassage_3.content === "") {
                                    interaction.editReply({
                                        content: "<@".concat(participant_1.id, "> has not joined yet."),
                                    });
                                    return;
                                }
                                pinned.edit({
                                    content: returnMassage_3.content,
                                }).then(function () {
                                    interaction.editReply({
                                        content: "Updated <@".concat(participant_1.id, "> remark from ").concat(returnMassage_3.oldValue, " to ").concat(newRemark_2, "."),
                                    });
                                });
                            }
                        });
                    }
                    else {
                        interaction.editReply({
                            content: 'Participant List is not created yet.',
                        });
                    }
                }))];
            case 37:
                _s.sent();
                return [3 /*break*/, 44];
            case 38:
                if (!(commandName === ("ownerkickplayer"))) return [3 /*break*/, 43];
                botId_8 = (_q = client.user) === null || _q === void 0 ? void 0 : _q.id;
                massageManager = (_r = interaction.channel) === null || _r === void 0 ? void 0 : _r.messages;
                participant_2 = options.getUser("participant");
                isFromOwner_5 = true;
                return [4 /*yield*/, interaction.channel.fetchOwner().then(function (owner) {
                        if ((owner === null || owner === void 0 ? void 0 : owner.id) !== user.id && user.id !== process.env.SUPER_USER_ID) {
                            isFromOwner_5 = false;
                        }
                    })];
            case 39:
                _s.sent();
                if (!!isFromOwner_5) return [3 /*break*/, 41];
                return [4 /*yield*/, interaction.editReply({
                        content: 'You are not the owner of this thread.',
                    })];
            case 40:
                _s.sent();
                return [2 /*return*/];
            case 41: return [4 /*yield*/, (massageManager === null || massageManager === void 0 ? void 0 : massageManager.fetchPinned().then(function (pinnedMessages) {
                    if (pinnedMessages.size > 0) {
                        pinnedMessages.forEach(function (pinned) {
                            var _a;
                            if (((_a = pinned.member) === null || _a === void 0 ? void 0 : _a.user.id) == botId_8) {
                                var updatedContent = (0, join_1.withdraw)(pinned.content, participant_2.id);
                                if (updatedContent === "") {
                                    interaction.editReply({
                                        content: "<@".concat(participant_2.id, "> has not joined yet."),
                                    });
                                    return;
                                }
                                pinned.edit({
                                    content: updatedContent,
                                }).then(function () {
                                    interaction.editReply({
                                        content: "<@".concat(participant_2.id, "> is kicked."),
                                    });
                                });
                            }
                        });
                    }
                    else {
                        interaction.editReply({
                            content: 'Participant List is not created yet.',
                        });
                    }
                }))];
            case 42:
                _s.sent();
                return [3 /*break*/, 44];
            case 43:
                if (commandName === ("enrollerversion")) {
                    interaction.editReply({
                        content: "Current version: ".concat(version),
                    });
                }
                _s.label = 44;
            case 44: return [2 /*return*/];
        }
    });
}); });
client.login(process.env.TOKEN);
