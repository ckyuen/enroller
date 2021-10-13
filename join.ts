

export function joinMatch(content:string, memberId:string):string{
        var jsonString = content.split("```")[1]
        var {vacancies, participantList} = JSON.parse(jsonString!)

        participantList.push("<@" + memberId + ">")
        jsonString = JSON.stringify({vacancies, participantList})

        return toDisplayList(vacancies, participantList) + '```' + jsonString + '```'
        
}

export function withdraw(content:string, memberId:string){
    var jsonString = content.split("```")[1]
    var {vacancies, participantList} = JSON.parse(jsonString!)
    var isJoined = false

    if(participantList.length > 0){
        for(let i = 0; i < participantList.length ; i++){
            if (participantList[i].includes(memberId)){
                isJoined = true
                participantList.splice(i, 1);
                break; 
            }
        }
    }

    if (!isJoined) return ""

    jsonString = JSON.stringify({vacancies, participantList})
    return toDisplayList(vacancies, participantList) + '```' + jsonString + '```'
}

export function editVacancies(content:string, newVacancies:number){
    var jsonString = content.split("```")[1]
    var {vacancies, participantList} = JSON.parse(jsonString!)
    var isJoined = false

    vacancies = newVacancies

    jsonString = JSON.stringify({vacancies, participantList})
    return toDisplayList(vacancies, participantList) + '```' + jsonString + '```'
}

function toDisplayList(vacancies:number, participantList:string[]):string{
    var updatedContent = "報名表    最大人數: " + vacancies

    if(participantList.length > 0){ 
        for(let i = 0; i < vacancies ; i++){
            updatedContent += "\n"
            if (i < participantList.length){
                updatedContent += `${i+1}. ${participantList[i]}`;
            }else{
                updatedContent += `${i+1}. `;
            }
        }
    }

    if (participantList.length > vacancies){
        updatedContent += "\n排隊: "
        for (let i = vacancies; i < participantList.length ; i++){
            updatedContent += `\n${i+1}. ${participantList[i]}`;
        }
    }

    return updatedContent
}