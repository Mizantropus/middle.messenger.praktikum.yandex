import { ChatData, MessageType } from "./types";

export let scroll_chat_to_bottom = function (): void {
  const chat = document.getElementById('chat_body_field');
  if (chat) {
    chat.lastElementChild?.scrollIntoView({ behavior: 'auto' });
  }
}

export let find_messages_by_id = function (id: number, data: ChatData): MessageType[] {
  for (let thread of data) {
    if (thread.id === id) {
      return thread.messages;
    }
  }
  throw new Error('Чата с указанным id не существует');
}

export let find_letter_by_id = function (id: number, data: ChatData): string {
  for (let thread of data) {
    if (thread.id === id) {
      return thread.letter;
    }
  }
  throw new Error('Чата с указанным id не существует');
}

export function getFormattedDate(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}
