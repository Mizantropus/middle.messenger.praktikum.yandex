import { Block } from "../../core/block";
import { ChatData, MessageType } from "./types";
import { 
  getFormattedDate,
  find_letter_by_id,
  find_messages_by_id,
  scroll_chat_to_bottom } from "./service";
import { LeftCol, Page, RightCol } from "./definitions";
import friends_and_messages from "./friends.json";
import SearchInput from "../../components/chats/search_input";
import Friend from "../../components/chats/friend";
import Message from "../../components/chats/message";
import MessageButton from "../../components/chats/send_message_button";
import MessageInput from "../../components/chats/send_message_input";
import Form from "../../components/chats/send_message_form";
import "./style.scss";
import {
  on_change_input_checker,
  validateMessage
} from "../../core/validation"

const friends: Block[] = [];
let messages_to_render: Block[] = [];
const chat_data: ChatData = friends_and_messages;
let first_letter: string = "";
let message_value: string = "";
let is_valid_message: boolean = false;

let change_message_input = function (event: Event): void {
  if (event instanceof FocusEvent) {
    const target = event.target as HTMLInputElement;
    message_value = target.value;
    if (on_change_input_checker(target, validateMessage, true)) {
      is_valid_message = true;
    } else {
      is_valid_message = false;
      console.log("Сообщение не должно быть пустым");
    }
  }
}

let message_handler = function(): void {
  if (message_value && is_valid_message) {
    messages_to_render.push(new Message({
      m_class: "message my_message",
      text: message_value,
      datetime: getFormattedDate()
    }))
    right_col.updateChildrenList(messages_to_render);
    send_message_input.setProps({
      value: ""
    })
    message_value = "";
    scroll_chat_to_bottom();
    const message_input = document.getElementById('message_input');
    if (message_input) {
      message_input.focus();
    }
  }
}

function validate_and_submit(event: Event): void {
  event.preventDefault();
  if (event instanceof SubmitEvent) {
    message_handler();
  }
}

let generate_messages_list = function (messages_in: MessageType[]): Message[] {
  const messages: Message[] = [];
  for (let mess of messages_in) {
    let mess_class: string = "message";
    if (mess.type === "me") {
      mess_class += " my_message";
    }
    messages.push(new Message({
      m_class: mess_class,
      text: mess.text,
      datetime: mess.datetime
    }))
  }
  return messages;
}

let change_current_chat = function (event: Event): void {
  if (event instanceof MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const inner = target.querySelector('[data-friend-id]') as HTMLElement;
    if (inner) {
      let friendId = 0;
      if (inner.dataset.friendId) {
        friendId = parseInt(inner.dataset.friendId, 10);
      }
      let mess_ages = find_messages_by_id(friendId, chat_data);
      let new_letter = find_letter_by_id(friendId, chat_data);
      messages_to_render = generate_messages_list(mess_ages);
      right_col.updateChildrenList(messages_to_render);
      right_col.setProps({letter: new_letter});
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

let counter: number = 0;
for (let thread of chat_data) {
  friends.push(
    new Friend({
      name: thread.name,
      last_time: thread.last_time,
      last_message: thread.last_message,
      letter: thread.letter,
      unread: thread.unread,
      id: thread.id,
      events: {
        "click": change_current_chat
      }
    }, "chats_list_item")
  )
  if (!counter) {
    messages_to_render = generate_messages_list(thread.messages);
    first_letter = thread.letter;
  }
  counter++;
}

const message_form: Form = new Form({
  send_message_attach: send_message_attach,
  send_message_input: send_message_input,
  send_message_button: send_message_button,
  events: {
    "submit": validate_and_submit
  }
}, "right_col_send_message")

const left_col: Block = new LeftCol({
  search_input: search_input,
  list: friends
}, "chats_left_col")

const right_col: Block = new RightCol({
  send_message_form: message_form,
  letter: first_letter,
  list: messages_to_render
}, "chats_right_col")

export const Chats: Page = new Page({
  left_col: left_col,
  right_col: right_col
})
