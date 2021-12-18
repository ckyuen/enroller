import DiscordJS from 'discord.js'

export type Participant = {
    name:string,
    remark:string,
};

export type ReturnMessage = {
    content:string,
    oldValue:string,
};

export type ReturnMessageNew = {
    content:Message,
    oldValue:string,
};

export type Message = {
    displayString:string,
    jsonString:string
};

export async function fetchMessages(massageManager:DiscordJS.MessageManager, botId:string){
    let jsonMessage!:DiscordJS.Message | null;
    let displayMessage!:DiscordJS.Message | null;
    
    await massageManager?.fetchPinned().then((pinnedMessages) => {
        if(pinnedMessages.size > 0){
            pinnedMessages.forEach((pinned) =>{
                if (pinned.member?.user.id === botId){
                    if (pinned.content.startsWith("報名表")){
                        displayMessage = pinned;
                    } else if (pinned.content.startsWith("LIST")){
                        jsonMessage = pinned;
                    }
                }
            })
        }
    })
    console.log("display: " + displayMessage?.id);
    console.log("json: " + jsonMessage?.id);
    return {displayMessage, jsonMessage};
    
}

export function createMatch(createrId:string, vacancies:number):string{
    const createrTag = '<@' + createrId + '>';
        const creater:Participant = {name:createrTag, remark:""};
        const participantList:Participant[] = [creater];
        let jsonString = JSON.stringify({vacancies, participantList});
        
        return toDisplayList(vacancies, participantList) + '\n```' + jsonString + '```';
}


export function createMatchNew(createrId:string, vacancies:number):Message{
    const createrTag = '<@' + createrId + '>';
    const creater:Participant = {name:createrTag, remark:""};
    const participantList:Participant[] = [creater];
    let jsonString = 'LIST\n```' + JSON.stringify({vacancies, participantList}) + '```' ;
    let displayString = toDisplayList(vacancies, participantList);

    //testing
    /*
    for (let i = 0; i < 31; i++){
        participantList.push({name:createrTag, remark:"999999999999999"});
    }
    displayString = toDisplayList(vacancies, participantList);
    jsonString = 'LIST\n```' + JSON.stringify({vacancies, participantList}) + '```' ;
    */
    //testing

    return {displayString:displayString, jsonString:jsonString};
}

export function joinMatch(content:string, memberId:string, remark:string):string{
        let jsonString = content.split("```")[1];
        let {vacancies, participantList} = JSON.parse(jsonString!);

        let isJoined = false;
        if(participantList.length > 0){
            for(let i = 0; i < participantList.length ; i++){
                if (participantList[i].name.includes(memberId)){
                    isJoined = true;
                    //participantList.splice(i, 1); 
                    break; 
                }
            }
        }
        if (isJoined) return "";

        if (remark === null) remark = "";
        let newParticipant:Participant = {name:"<@" + memberId + ">", remark:remark}

        participantList.push(newParticipant);
        jsonString = JSON.stringify({vacancies, participantList});

        return toDisplayList(vacancies, participantList) + '\n```' + jsonString + '```';
        
}

export function joinMatchNew(content:string, memberId:string, remark:string):Message{
    let jsonString = content.split("```")[1];
    let displayString = "";
    let {vacancies, participantList} = JSON.parse(jsonString!);
    let isJoined = false;
    let maxVacancies = Number(process.env.MAX_VACANCIES) || 100;

    if(participantList.length >= maxVacancies){
        return {displayString:"FULL", jsonString:""};
    }

    if(participantList.length > 0){
        for(let i = 0; i < participantList.length ; i++){
            if (participantList[i].name.includes(memberId)){
                isJoined = true;
                break; 
            }
        }
    }
    if (isJoined) return {displayString:displayString, jsonString:jsonString};

    if (remark === null) remark = "";
    let newParticipant:Participant = {name:"<@" + memberId + ">", remark:remark}

    participantList.push(newParticipant);
    jsonString = 'LIST\n```' + JSON.stringify({vacancies, participantList})+ '```' ;
    displayString = toDisplayList(vacancies, participantList);
    return {displayString:displayString, jsonString:jsonString};
    
}

export function withdraw(content:string, memberId:string):string{
    let jsonString = content.split("```")[1];
    let {vacancies, participantList} = JSON.parse(jsonString!);
    let isJoined = false;

    if(participantList.length > 0){
        for(let i = 0; i < participantList.length ; i++){
            if (participantList[i].name.includes(memberId)){
                isJoined = true;
                participantList.splice(i, 1);
                break; 
            }
        }
    }

    if (!isJoined) return "";

    jsonString = JSON.stringify({vacancies, participantList});
    return toDisplayList(vacancies, participantList) + '\n```' + jsonString + '```';
}

export function withdrawNew(content:string, memberId:string):Message{
    let jsonString = content.split("```")[1];
    let displayString = "";
    let {vacancies, participantList} = JSON.parse(jsonString!);
    let isJoined = false;

    if(participantList.length > 0){
        for(let i = 0; i < participantList.length ; i++){
            if (participantList[i].name.includes(memberId)){
                isJoined = true;
                participantList.splice(i, 1);
                break; 
            }
        }
    }

    if (!isJoined) return {displayString:displayString, jsonString:jsonString};;

    jsonString = 'LIST\n```' + JSON.stringify({vacancies, participantList})+ '```' ;
    displayString = toDisplayList(vacancies, participantList);
    return {displayString:displayString, jsonString:jsonString};
}

export function editVacancies(content:string, newVacancies:number):string{
    let jsonString = content.split("```")[1];
    let {vacancies, participantList} = JSON.parse(jsonString!);

    vacancies = newVacancies;

    jsonString = JSON.stringify({vacancies, participantList});
    return toDisplayList(vacancies, participantList) + '\n```' + jsonString + '```';
}

export function editVacanciesNew(content:string, newVacancies:number):Message{
    let jsonString = content.split("```")[1];
    let {vacancies, participantList} = JSON.parse(jsonString!);
    let displayString = "";

    vacancies = newVacancies;

    jsonString = 'LIST\n```' + JSON.stringify({vacancies, participantList})+ '```' ;
    displayString = toDisplayList(vacancies, participantList);
    return {displayString:displayString, jsonString:jsonString};
}

export function editRemark(content:string, memberId:string, newRemark:string):ReturnMessage{
    let jsonString = content.split("```")[1];
    let {vacancies, participantList} = JSON.parse(jsonString!);
    let isJoined = false;
    let oldRemark:string = "";

    if(participantList.length > 0){
        for(let i = 0; i < participantList.length ; i++){
            if (participantList[i].name.includes(memberId)){
                isJoined = true;
                oldRemark = participantList[i].remark
                participantList[i].remark = newRemark;
                break; 
            }
        }
    }

    if (!isJoined) return {content:"", oldValue: ""};

    jsonString = JSON.stringify({vacancies, participantList});
    return {
        content:toDisplayList(vacancies, participantList) + '\n```' + jsonString + '```',
        oldValue: `${oldRemark}`
            };
}

export function editRemarkNew(content:string, memberId:string, newRemark:string):ReturnMessageNew{
    let jsonString = content.split("```")[1];
    let {vacancies, participantList} = JSON.parse(jsonString!);
    let isJoined = false;
    let oldRemark:string = "";
    let displayString = "";

    if(participantList.length > 0){
        for(let i = 0; i < participantList.length ; i++){
            if (participantList[i].name.includes(memberId)){
                isJoined = true;
                oldRemark = participantList[i].remark
                participantList[i].remark = newRemark;
                break; 
            }
        }
    }

    if (!isJoined) return {content:{displayString:displayString, jsonString:jsonString}, oldValue: ""};

    jsonString = 'LIST\n```' + JSON.stringify({vacancies, participantList})+ '```' ;
    displayString = toDisplayList(vacancies, participantList);
    return {
        content:{displayString:displayString, jsonString:jsonString},
        oldValue: `${oldRemark}`
            };
}

export function insertPlayer(content:string, memberId:string, newPosition:number, remark:string):ReturnMessage{
    let jsonString = content.split("```")[1];
    let {vacancies, participantList} = JSON.parse(jsonString!);
    let isAppended = false;

    //remove player if already joined
    if(participantList.length > 0){
        for(let i = 0; i < participantList.length ; i++){
            if (participantList[i].name.includes(memberId)){
                participantList.splice(i, 1);
                break; 
            }
        }
    }
    if (remark === null) remark = "";
    let newParticipant:Participant = {name:"<@" + memberId + ">", remark:remark};
    if(newPosition > participantList.length){
        isAppended = true;
    }

    participantList.splice(newPosition-1, 0, newParticipant);

    jsonString = JSON.stringify({vacancies, participantList});
    return {content: toDisplayList(vacancies, participantList) + '\n```' + jsonString + '```',
        oldValue: String(isAppended)
        }
    ;
}

export function insertPlayerNew(content:string, memberId:string, newPosition:number, remark:string):ReturnMessageNew{
    let jsonString = content.split("```")[1];
    let {vacancies, participantList} = JSON.parse(jsonString!);
    let isAppended = false;
    let displayString = "";

    //remove player if already joined
    if(participantList.length > 0){
        for(let i = 0; i < participantList.length ; i++){
            if (participantList[i].name.includes(memberId)){
                participantList.splice(i, 1);
                break; 
            }
        }
    }
    if (remark === null) remark = "";
    let newParticipant:Participant = {name:"<@" + memberId + ">", remark:remark};
    if(newPosition > participantList.length){
        isAppended = true;
    }

    participantList.splice(newPosition-1, 0, newParticipant);

    jsonString = 'LIST\n```' + JSON.stringify({vacancies, participantList})+ '```' ;
    displayString = toDisplayList(vacancies, participantList);
    return {content: {displayString:displayString, jsonString:jsonString},
        oldValue: String(isAppended)
        }
    ;
}

export function validateVancancies(input:number, maxValue:number):boolean{

    if (maxValue == NaN || input > maxValue || input < 0){
        return false;
    }
    return true;
}

function toDisplayList(vacancies:number, participantList:Participant[]):string{
    let updatedContent = "報名表    最大人數: " + vacancies;

    if(participantList.length > 0){ 
        for(let i = 0; i < vacancies ; i++){
            updatedContent += "\n";
            if (i < participantList.length){
                if (participantList[i].remark !== ""){
                    updatedContent += `${i+1}. ${participantList[i].name}   (${participantList[i].remark})`;
                } else {
                    updatedContent += `${i+1}. ${participantList[i].name}`;
                }
            } else {
                updatedContent += `${i+1}. `;
            }
        }
    }

    if (participantList.length > vacancies){
        updatedContent += "\n排隊: ";
        for (let i = vacancies; i < participantList.length ; i++){
            if (participantList[i].remark !== ""){
                updatedContent += `\n${i+1}. ${participantList[i].name}   (${participantList[i].remark})`;
            }else{
                updatedContent += `\n${i+1}. ${participantList[i].name}`;
            }
        }
    }

    return updatedContent;
}

export function patchList(content:string):Message{
    let jsonString = content.split("```")[1];
    let displayString = "";
    let {vacancies, participantList} = JSON.parse(jsonString!);

    jsonString = 'LIST\n```' + JSON.stringify({vacancies, participantList})+ '```' ;
    displayString = toDisplayList(vacancies, participantList);
    return {displayString:displayString, jsonString:jsonString};
}
