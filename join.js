"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVancancies = exports.insertPlayer = exports.editRemark = exports.editVacancies = exports.withdraw = exports.joinMatch = exports.createMatch = void 0;
function createMatch(createrId, vacancies) {
    var createrTag = '<@' + createrId + '>';
    var creater = { name: createrTag, remark: "" };
    var participantList = [creater];
    var jsonString = JSON.stringify({ vacancies: vacancies, participantList: participantList });
    return toDisplayList(vacancies, participantList) + '\n```' + jsonString + '```';
}
exports.createMatch = createMatch;
function joinMatch(content, memberId, remark) {
    var jsonString = content.split("```")[1];
    var _a = JSON.parse(jsonString), vacancies = _a.vacancies, participantList = _a.participantList;
    var isJoined = false;
    if (participantList.length > 0) {
        for (var i = 0; i < participantList.length; i++) {
            if (participantList[i].name.includes(memberId)) {
                isJoined = true;
                //participantList.splice(i, 1);
                break;
            }
        }
    }
    if (isJoined)
        return "";
    if (remark === null)
        remark = "";
    var newParticipant = { name: "<@" + memberId + ">", remark: remark };
    participantList.push(newParticipant);
    jsonString = JSON.stringify({ vacancies: vacancies, participantList: participantList });
    return toDisplayList(vacancies, participantList) + '\n```' + jsonString + '```';
}
exports.joinMatch = joinMatch;
function withdraw(content, memberId) {
    var jsonString = content.split("```")[1];
    var _a = JSON.parse(jsonString), vacancies = _a.vacancies, participantList = _a.participantList;
    var isJoined = false;
    if (participantList.length > 0) {
        for (var i = 0; i < participantList.length; i++) {
            if (participantList[i].name.includes(memberId)) {
                isJoined = true;
                participantList.splice(i, 1);
                break;
            }
        }
    }
    if (!isJoined)
        return "";
    jsonString = JSON.stringify({ vacancies: vacancies, participantList: participantList });
    return toDisplayList(vacancies, participantList) + '\n```' + jsonString + '```';
}
exports.withdraw = withdraw;
function editVacancies(content, newVacancies) {
    var jsonString = content.split("```")[1];
    var _a = JSON.parse(jsonString), vacancies = _a.vacancies, participantList = _a.participantList;
    vacancies = newVacancies;
    jsonString = JSON.stringify({ vacancies: vacancies, participantList: participantList });
    return toDisplayList(vacancies, participantList) + '\n```' + jsonString + '```';
}
exports.editVacancies = editVacancies;
function editRemark(content, memberId, newRemark) {
    var jsonString = content.split("```")[1];
    var _a = JSON.parse(jsonString), vacancies = _a.vacancies, participantList = _a.participantList;
    var isJoined = false;
    var oldRemark = "";
    if (participantList.length > 0) {
        for (var i = 0; i < participantList.length; i++) {
            if (participantList[i].name.includes(memberId)) {
                isJoined = true;
                oldRemark = participantList[i].remark;
                participantList[i].remark = newRemark;
                break;
            }
        }
    }
    if (!isJoined)
        return { content: "", oldValue: "" };
    jsonString = JSON.stringify({ vacancies: vacancies, participantList: participantList });
    return {
        content: toDisplayList(vacancies, participantList) + '\n```' + jsonString + '```',
        oldValue: "".concat(oldRemark)
    };
}
exports.editRemark = editRemark;
function insertPlayer(content, memberId, newPosition, remark) {
    var jsonString = content.split("```")[1];
    var _a = JSON.parse(jsonString), vacancies = _a.vacancies, participantList = _a.participantList;
    var isAppended = false;
    //remove player if already joined
    if (participantList.length > 0) {
        for (var i = 0; i < participantList.length; i++) {
            if (participantList[i].name.includes(memberId)) {
                participantList.splice(i, 1);
                break;
            }
        }
    }
    if (remark === null)
        remark = "";
    var newParticipant = { name: "<@" + memberId + ">", remark: remark };
    if (newPosition > participantList.length) {
        isAppended = true;
    }
    participantList.splice(newPosition - 1, 0, newParticipant);
    jsonString = JSON.stringify({ vacancies: vacancies, participantList: participantList });
    return { content: toDisplayList(vacancies, participantList) + '\n```' + jsonString + '```',
        oldValue: String(isAppended)
    };
}
exports.insertPlayer = insertPlayer;
function validateVancancies(input, maxValue) {
    if (maxValue == NaN || input > maxValue || input < 0) {
        return false;
    }
    return true;
}
exports.validateVancancies = validateVancancies;
function toDisplayList(vacancies, participantList) {
    var updatedContent = "報名表    最大人數: " + vacancies;
    if (participantList.length > 0) {
        for (var i = 0; i < vacancies; i++) {
            updatedContent += "\n";
            if (i < participantList.length) {
                if (participantList[i].remark !== "") {
                    updatedContent += "".concat(i + 1, ". ").concat(participantList[i].name, "   (").concat(participantList[i].remark, ")");
                }
                else {
                    updatedContent += "".concat(i + 1, ". ").concat(participantList[i].name);
                }
            }
            else {
                updatedContent += "".concat(i + 1, ". ");
            }
        }
    }
    if (participantList.length > vacancies) {
        updatedContent += "\n排隊: ";
        for (var i = vacancies; i < participantList.length; i++) {
            if (participantList[i].remark !== "") {
                updatedContent += "\n".concat(i + 1, ". ").concat(participantList[i].name, "   (").concat(participantList[i].remark, ")");
            }
            else {
                updatedContent += "\n".concat(i + 1, ". ").concat(participantList[i].name);
            }
        }
    }
    return updatedContent;
}
