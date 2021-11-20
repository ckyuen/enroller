export type Participant = {
    name:string,
    remark:string,
};

export type ReturnMessage = {
    content:string,
    oldValue:string,
};

export function createMatch(createrId:string, vacancies:number):string{
    const createrTag = '<@' + createrId + '>';
        const creater:Participant = {name:createrTag, remark:""};
        const participantList:Participant[] = [creater];
        let jsonString = JSON.stringify({vacancies, participantList});
        
        return toDisplayList(vacancies, participantList) + '\n```' + jsonString + '```';
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

export function editVacancies(content:string, newVacancies:number):string{
    let jsonString = content.split("```")[1];
    let {vacancies, participantList} = JSON.parse(jsonString!);

    vacancies = newVacancies;

    jsonString = JSON.stringify({vacancies, participantList});
    return toDisplayList(vacancies, participantList) + '\n```' + jsonString + '```';
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

