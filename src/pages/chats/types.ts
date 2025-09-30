export interface MessageType {
  type: string;
  text: string;
  datetime: string;
}
interface ChatThread {
  name: string;
  last_time: string;
  last_message: string;
  letter: string;
  unread: number;
  id: number;
  messages: MessageType[];
}
export type ChatData = ChatThread[];
