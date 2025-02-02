import instance from "@/axios/axios.config";
import { type SendChat } from "@/types/Chat";

export async function SendChat(body:SendChat){
  let res = await instance.post('/chat',body)
  return res
}