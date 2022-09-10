import DiscordJS from "discord.js";

export type Participant = {
  name: string;
  remark: string;
};

//v2.1.0 add tagList in message object
export type ReturnMessageEdit = {
  content: Message;
  oldValue: string;
  tagList: Array<string>;
};

export type ReturnMessageWithTags = {
  content: Message;
  tagList: Array<string>;
};

export type Message = {
  displayString: string;
  jsonString: string;
};

export async function fetchMessages(
  massageManager: DiscordJS.MessageManager,
  botId: string
) {
  let jsonMessage!: DiscordJS.Message | null;
  let displayMessage!: DiscordJS.Message | null;

  await massageManager?.fetchPinned().then((pinnedMessages) => {
    if (pinnedMessages.size > 0) {
      pinnedMessages.forEach((pinned) => {
        if (pinned.member?.user.id === botId) {
          if (pinned.content.startsWith("報名表")) {
            displayMessage = pinned;
          } else if (pinned.content.startsWith("LIST")) {
            jsonMessage = pinned;
          }
        }
      });
    }
  });
  console.log("display: " + displayMessage?.id);
  console.log("json: " + jsonMessage?.id);
  return { displayMessage, jsonMessage };
}

export function createMatch(createrId: string, vacancies: number): string {
  const createrTag = "<@" + createrId + ">";
  const creater: Participant = { name: createrTag, remark: "" };
  const participantList: Participant[] = [creater];
  let jsonString = JSON.stringify({ vacancies, participantList });

  return (
    toDisplayList(vacancies, participantList) + "\n```" + jsonString + "```"
  );
}

export function createMatchNew(createrId: string, vacancies: number): Message {
  const createrTag = "<@" + createrId + ">";
  const creater: Participant = { name: createrTag, remark: "" };
  const participantList: Participant[] = [creater];
  let jsonString =
    "LIST\n```" + JSON.stringify({ vacancies, participantList }) + "```";
  let displayString = toDisplayList(vacancies, participantList);

  return { displayString: displayString, jsonString: jsonString };
}

export function joinMatchNew(
  content: string,
  memberId: string,
  remark: string
): Message {
  let jsonString = content.split("```")[1];
  let displayString = "";
  let { vacancies, participantList } = JSON.parse(jsonString!);
  let isJoined = false;
  let maxVacancies = Number(process.env.MAX_VACANCIES) || 32;

  if (participantList.length >= maxVacancies) {
    return { displayString: "FULL", jsonString: "" };
  }

  if (participantList.length > 0) {
    for (let i = 0; i < participantList.length; i++) {
      if (participantList[i].name.includes(memberId)) {
        isJoined = true;
        break;
      }
    }
  }
  if (isJoined) return { displayString: displayString, jsonString: jsonString };

  if (remark === null) remark = "";
  let newParticipant: Participant = {
    name: "<@" + memberId + ">",
    remark: remark,
  };

  participantList.push(newParticipant);
  jsonString =
    "LIST\n```" + JSON.stringify({ vacancies, participantList }) + "```";
  displayString = toDisplayList(vacancies, participantList);
  return { displayString: displayString, jsonString: jsonString };
}

export function withdrawNew(
  content: string,
  memberId: string
): ReturnMessageWithTags {
  let jsonString = content.split("```")[1];
  let displayString = "";
  let { vacancies, participantList } = JSON.parse(jsonString!);
  let isJoined = false;
  let originalPosition: number = -1; //To check if any player is pushed into the playlist

  if (participantList.length > 0) {
    for (let i = 0; i < participantList.length; i++) {
      if (participantList[i].name.includes(memberId)) {
        isJoined = true;
        participantList.splice(i, 1);
        originalPosition = i;
        break;
      }
    }
  }

  if (!isJoined) {
    return {
      content: {
        displayString: displayString,
        jsonString: jsonString,
      },
      tagList: [],
    };
  }

  //v2.1.0 Set a flag to indicate new player is pushed into the player list
  let tagList = [];
  //count the withdrawn player too
  if (originalPosition < vacancies && participantList.length + 1 > vacancies) {
    tagList.push(participantList[vacancies - 1].name); //v2.1.0 tag player at the end of the list
  }

  jsonString =
    "LIST\n```" + JSON.stringify({ vacancies, participantList }) + "```";
  displayString = toDisplayList(vacancies, participantList);

  return {
    content: {
      displayString: displayString,
      jsonString: jsonString,
    },
    tagList: tagList,
  };
}

export function editVacanciesNew(
  content: string,
  newVacancies: number
): ReturnMessageWithTags {
  let jsonString = content.split("```")[1];
  let { vacancies, participantList } = JSON.parse(jsonString!);
  let displayString = "";
  let tagList = [];
  //check if any players are moved from participant list to waitlist or vice versa
  if (newVacancies > vacancies && participantList.length > vacancies) {
    //player moved to participant list
    tagList = participantList
      .slice(vacancies, newVacancies)
      .map((element: Participant) => {
        return element.name;
      });
    tagList[0] += "-p";
  } else if (
    vacancies > newVacancies &&
    participantList.length > newVacancies
  ) {
    //player moved to waitlist
    tagList = participantList
      .slice(newVacancies, vacancies)
      .map((element: Participant) => {
        return element.name;
      });
    tagList[0] += "-w";
  }

  vacancies = newVacancies;

  jsonString =
    "LIST\n```" + JSON.stringify({ vacancies, participantList }) + "```";
  displayString = toDisplayList(vacancies, participantList);
  return {
    content: { displayString: displayString, jsonString: jsonString },
    tagList: tagList,
  };
}

export function editRemarkNew(
  content: string,
  memberId: string,
  newRemark: string
): ReturnMessageEdit {
  let jsonString = content.split("```")[1];
  let { vacancies, participantList } = JSON.parse(jsonString!);
  let isJoined = false;
  let oldRemark: string = "";
  let displayString = "";

  if (participantList.length > 0) {
    for (let i = 0; i < participantList.length; i++) {
      if (participantList[i].name.includes(memberId)) {
        isJoined = true;
        oldRemark = participantList[i].remark;
        participantList[i].remark = newRemark;
        break;
      }
    }
  }

  if (!isJoined)
    return {
      content: { displayString: displayString, jsonString: jsonString },
      oldValue: "",
      tagList: [],
    };

  jsonString =
    "LIST\n```" + JSON.stringify({ vacancies, participantList }) + "```";
  displayString = toDisplayList(vacancies, participantList);
  return {
    content: { displayString: displayString, jsonString: jsonString },
    oldValue: `${oldRemark}`,
    tagList: [],
  };
}

export function insertPlayerNew(
  content: string,
  memberId: string,
  newPosition: number,
  remark: string
): ReturnMessageEdit {
  let jsonString = content.split("```")[1];
  let { vacancies, participantList } = JSON.parse(jsonString!);
  let isAppended = false;
  let displayString = "";
  let originalPosition = -1; //v2.1.0 tag player if wait list updated
  let maxVacancies = Number(process.env.MAX_VACANCIES) || 32; //v2.1.0  fix checking for maxVacancy in ownerinsertplayer

  //remove player if already joined
  if (participantList.length > 0) {
    for (let i = 0; i < participantList.length; i++) {
      if (participantList[i].name.includes(memberId)) {
        participantList.splice(i, 1);
        originalPosition = i;
        break;
      }
    }
  }

  //v2.1.0 add missing check if the list is full after insert new player
  if (participantList.length >= maxVacancies) {
    return {
      content: { displayString: "FULL", jsonString: "" },
      oldValue: "",
      tagList: [],
    };
  }

  if (remark === null) remark = "";
  let newParticipant: Participant = {
    name: "<@" + memberId + ">",
    remark: remark,
  };
  if (newPosition > participantList.length) {
    isAppended = true;
  }

  participantList.splice(newPosition - 1, 0, newParticipant);

  // v2.1.0 check if palyer needs to be tagged
  let tagList = [];

  if (participantList.length > vacancies) {
    //if waitlist exists
    if (originalPosition == -1) {
      //inserting new player into partcipant list
      if (newPosition <= vacancies) {
        tagList.push(participantList[vacancies].name + "-w"); //ending with "-w" = player moved to waitlist
      }
    } else {
      //swapping existing player position
      if (originalPosition < vacancies && newPosition > vacancies) {
        //move player backward from participant list to waitlist
        tagList.push(participantList[vacancies - 1].name + "-p"); //ending with "-p" = player moved to participant list
      } else if (originalPosition >= vacancies && newPosition <= vacancies) {
        //move player forward from waitlist to participant list
        tagList.push(participantList[vacancies].name + "-w"); //ending with "-w" = player moved to waitlist
      }
    }
  }
  jsonString =
    "LIST\n```" + JSON.stringify({ vacancies, participantList }) + "```";
  displayString = toDisplayList(vacancies, participantList);
  return {
    content: { displayString: displayString, jsonString: jsonString },
    oldValue: String(isAppended),
    tagList: tagList,
  };
}

export function validateVancancies(input: number, maxValue: number): boolean {
  if (maxValue == NaN || input > maxValue || input < 0) {
    return false;
  }
  return true;
}

function toDisplayList(
  vacancies: number,
  participantList: Participant[]
): string {
  let updatedContent = "報名表    最大人數: " + vacancies;

  if (participantList.length > 0) {
    for (let i = 0; i < vacancies; i++) {
      updatedContent += "\n";
      if (i < participantList.length) {
        if (participantList[i].remark !== "") {
          updatedContent += `${i + 1}. ${participantList[i].name}   (${
            participantList[i].remark
          })`;
        } else {
          updatedContent += `${i + 1}. ${participantList[i].name}`;
        }
      } else {
        updatedContent += `${i + 1}. `;
      }
    }
  }

  if (participantList.length > vacancies) {
    updatedContent += "\n排隊: ";
    for (let i = vacancies; i < participantList.length; i++) {
      if (participantList[i].remark !== "") {
        updatedContent += `\n${i + 1}. ${participantList[i].name}   (${
          participantList[i].remark
        })`;
      } else {
        updatedContent += `\n${i + 1}. ${participantList[i].name}`;
      }
    }
  }

  return updatedContent;
}

export function patchList(content: string): Message {
  let jsonString = content.split("```")[1];
  let displayString = "";
  let { vacancies, participantList } = JSON.parse(jsonString!);

  jsonString =
    "LIST\n```" + JSON.stringify({ vacancies, participantList }) + "```";
  displayString = toDisplayList(vacancies, participantList);
  return { displayString: displayString, jsonString: jsonString };
}
