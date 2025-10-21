import { StateUserModel } from "./types";
import { isUserObject } from "../../components/chats/users/service";
import store from "../../store";


export let scroll_chat_to_bottom = function (): void {
  let chat = document.getElementById("chat_body_field");
  if (!chat) return;
  const waitAndScroll = () => {
    chat = document.getElementById("chat_body_field");
    if (!chat) return;
    if (chat.lastElementChild) {
      chat.lastElementChild.scrollIntoView({ behavior: "auto" });
    } else {
      setTimeout(waitAndScroll, 150);
    }
  };
  requestAnimationFrame(waitAndScroll);
}

export function getFormattedDate(input: string | null): string {
  let now = new Date();
  if (input) {
    now = new Date(input);
  }
  const pad = (n: number) => n.toString().padStart(2, "0");
  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function get_current_user(): StateUserModel | undefined {
  let state = store.getState();
  if (state.user) {
    if (isUserObject(state.user)) {
      return state.user;
    }
  }
}
