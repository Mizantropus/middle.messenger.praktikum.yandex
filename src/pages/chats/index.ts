import { Block } from "../../core/block";
import { MessageType } from "./types";
import { 
  getFormattedDate,
  scroll_chat_to_bottom,
  get_current_user
} from "./service";
import {
  add_user_handler,
  delete_user_handler,
  delete_chat_handler
} from "./handlers"
import { LeftCol, Page, RightCol } from "./definitions";
import SearchInput from "../../components/chats/search_input";
import Friend from "../../components/chats/friend";
import Message from "../../components/chats/message";
import MessageButton from "../../components/chats/send_message_button";
import MessageInput from "../../components/chats/send_message_input";
import AddChat from "../../components/chats/add_chat";
import MenuItem from "../../components/chats/menu_item";
import Form from "../../components/chats/send_message_form";
import ChatsController from "../../api/controllers/chat";
import "./style.scss";
import {
  on_change_input_checker,
  validateMessage
} from "../../core/validation";
import store from "../../store";
import Socket from "../../core/socket";

const friends: Block[] = [];
let messages_to_render: Block[] = [];
let first_letter: string = "";
let message_value: string = "";
let is_valid_message: boolean = false;
let chat_socket: ChatSocket | undefined;

class ChatSocket extends Socket {
  constructor(user_id: number, chat_id: number, token: string) {
    super(user_id, chat_id, token);
  }
  on_message(event: MessageEvent): void {
    const parsed = JSON.parse(event.data);
    if (parsed.content) {
      if (validateMessage(parsed.content)) {
        const new_message_block = generate_message_from_socket(parsed);
        messages_to_render.push(new_message_block);
        message_handler();
      }
    } else if (Array.isArray(parsed)) {
      messages_to_render = generate_messages_list(parsed);
      message_handler();
    }
  }
}

let message_handler = function(): void {
  right_col.updateChildrenList(messages_to_render);
  send_message_input.setProps({
    value: ""
  });
  scroll_chat_to_bottom();
  requestAnimationFrame(() => {
    const mi = document.getElementById("message_input") as HTMLInputElement | null;
    if (mi && typeof mi.focus === "function") {
      try {
        mi.focus();
      } catch (e) {
        console.debug("Не удалось сфокусировать поле сообщения", e);
      }
    } else {
      console.debug("message_input не найден или нефокусируем");
    }
  });
}

let change_message_input = function (event: Event): void {
  if (event instanceof FocusEvent || event instanceof KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    if (on_change_input_checker(target, validateMessage, true)) {
      message_value = target.value;
      is_valid_message = true;
    } else {
      is_valid_message = false;
      console.debug("Сообщение не должно быть пустым");
    }
  }
}

async function validate_and_submit(event: Event): Promise<void> {
  event.preventDefault();
  if (event instanceof SubmitEvent) {
    if (message_value && is_valid_message) {
      if (!chat_socket?.is_connected()) {
        chat_socket?.reconnect();
        await chat_socket?.waitUntilOpen(5000);
      }
      chat_socket?.send_message(message_value);
      message_value = "";
      is_valid_message = false;
    }
  }
}

let generate_messages_list = function (messages_in: MessageType[]): Message[] {
  const messages: Message[] = [];
  if (messages_in) {
    for (let mess of messages_in.reverse()) {
      messages.push(generate_message_from_socket(mess));
    }
  }
  return messages;
}

let generate_message_from_socket = function (message: MessageType): Message {
  let mess_class: string = "message";
  let me = get_current_user();
  if (me) {
    if (message.user_id === me.id) {
      mess_class += " my_message";
    }
  }
  const message_block = new Message({
    m_class: mess_class,
    text: message.content,
    datetime: getFormattedDate(message.time)
  })
  return message_block;
}

let get_chat_by_id = async function(id: number | null, letter: string) {
  if (id) {
    const users = await new ChatsController().getChatUsers(id).catch((error) => {
      console.error("Ошибка обращения к серверу:", error);
    });
    store.set("chats.users", users);
    store.set("chats.current_chat_id", id);
    right_col.setProps({letter: letter});
  }
}

let get_socket_token = async function(chat_id: number): Promise<string> {
  const data: Record<string, string> = await new ChatsController().getChatToken(chat_id).catch((error) => {
    console.error("Ошибка обращения к серверу:", error);
  });
  store.set("chats.token", data.token);
  return data.token;
}

export let change_current_chat = async function (event: Event) {
  if (event instanceof MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const inner = target.querySelector('[data-friend-id]') as HTMLElement;
    if (inner) {
      let friendId = 0;
      let letter = inner.textContent;
      if (inner.dataset.friendId) {
        friendId = parseInt(inner.dataset.friendId, 10);
      }
      chat_socket?.close();
      let me = get_current_user();
      if (me) {
        await get_chat_by_id(friendId, letter);
        chat_socket = await connect_chat_socket(me.id, friendId);
        chat_socket?.send_message("0", "get old");
      }
    }
  }
}

let add_chat_handler = async function (event: Event) {
  if (event instanceof MouseEvent) {
    const chatTitle = prompt("Введите название нового чата:");
    if (chatTitle && chatTitle.trim().length > 0) {
      try {
        const newChat = await new ChatsController().createChat(chatTitle.trim()).catch((error) => {
          console.error("Ошибка обращения к серверу:", error);
        });
        const friend = new Friend({
          name: chatTitle,
          last_time: getFormattedDate(null),
          last_message: "",
          letter: chatTitle[0].toUpperCase(),
          unread: 0,
          id: newChat.id,
          events: {
            "click": change_current_chat
          }
        }, "chats_list_item");
        friends.push(friend);
        left_col.updateChildrenList(friends);
      } catch (error) {
        console.error(error);
      }
    }
  }
}

let send_message_input: Block = new MessageInput({
  type: "text",
  name: "message",
  value: "",
  placeholder: "Сообщение",
  events: {
    "blur": change_message_input,
    "keydown": change_message_input,
  }
}, "send_message_input")

let send_message_attach: Block = new MessageButton({
  image: "/images/attach.svg"
}, "send_message_attach")

let send_message_button: Block = new MessageButton({
  image: "/images/send_chat.svg",
}, "send_message_send")

const search_input: Block = new SearchInput({
  title: "Поиск",
  name: "search",
  type: "text",
  value: "",
  placeholder: "Поиск"
})

const message_form: Form = new Form({
  send_message_attach: send_message_attach,
  send_message_input: send_message_input,
  send_message_button: send_message_button,
  events: {
    "submit": validate_and_submit
  }
}, "right_col_send_message")

const add_chat: Block = new AddChat({
  pidor: "pidor",
  events: {
    "click": add_chat_handler
  }
}, "add_chat_button")

export const left_col: Block = new LeftCol({
  search_input: search_input,
  list: friends,
  add_chat: add_chat
}, "chats_left_col")

const add_user: Block = new MenuItem({
  title: "Добавить пользователя",
  id: "add_user_button",
  events: {
    "click": add_user_handler
  }
}, "additional_chat_item")

const delete_user: Block = new MenuItem({
  title: "Удалить пользователя",
  id: "delete_user_button",
  events: {
    "click": delete_user_handler
  }
}, "additional_chat_item")

const delete_chat: Block = new MenuItem({
  title: "Удалить чат",
  id: "delete_chat_button",
  events: {
    "click": delete_chat_handler
  }
}, "additional_chat_item")

const right_col: Block = new RightCol({
  send_message_form: message_form,
  letter: first_letter,
  add_user: add_user,
  delete_user: delete_user,
  delete_chat: delete_chat,
  list: messages_to_render
}, "chats_right_col")

export const Chats: Page = new Page({
  left_col: left_col,
  right_col: right_col
})

async function connect_chat_socket(user_id: number, chat_id: number): Promise<ChatSocket | undefined> {
  const chat_token = await get_socket_token(chat_id);
  chat_socket = new ChatSocket(user_id, chat_id, chat_token);
  try {
    await chat_socket.waitUntilOpen(5000);
    return chat_socket;
  } catch (err) {
    console.error('WS connect failed', err);
    chat_socket?.close();
    chat_socket = undefined;
  }
}

async function loadChatsOnPageInit() {
  try {
    const chats = await new ChatsController().getChats().catch((error) => {
      console.error("Ошибка обращения к серверу:", error);
    });
    store.set("chats.list", chats);
    let first_chat_id: number | null = null;
    let first_chat_letter: string = "";
    let counter: number = 0;
    for (const chat of chats) {
      friends.push(
        new Friend({
          name: chat.title,
          last_time: "",
          last_message: "",
          letter: chat.title[0].toUpperCase(),
          unread: 0,
          id: chat.id,
          events: {
            "click": change_current_chat
          }
        }, "chats_list_item")
      );
      if (!counter) {
        first_chat_id = chat.id;
        first_chat_letter = chat.title[0].toUpperCase();
      }
      counter++;
    }
    left_col.updateChildrenList(friends);
    await get_chat_by_id(first_chat_id, first_chat_letter);
    let me = get_current_user();
    if (me && first_chat_id) {
      chat_socket = await connect_chat_socket(me.id, first_chat_id);
      chat_socket?.send_message("0", "get old");
    }
  } catch (error) {
    console.error("Ошибка загрузки чатов", error);
  }
}

(async () => {
  await loadChatsOnPageInit();
})();
