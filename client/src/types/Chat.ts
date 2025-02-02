export type Message = {
    kind:"user"|"system",
    content: string,
}

export type SendChat = {
 title:string,
 messages: Message[]  
}