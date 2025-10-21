import { 
  on_change_input_checker,
  validateLogin
} from "../../../core/validation";
import store from "../../../store";
import ChatsController from "../../../api/controllers/chat";
import { UserToDel } from "./definitions";
import { delete_users } from "./";
import { change_current_chat, left_col } from "../../../pages/chats";
import { StateChatUserModel, StateChatModel } from "../../../pages/chats/types";
import Friend from "../friend";


export function change_login_input(event: Event): void {
  if (event instanceof FocusEvent) {
    const target = event.target as HTMLInputElement;
    if (on_change_input_checker(target, validateLogin)) {
      store.set("chats.searching_login", target.value);
    } else {
      console.debug("Не корректный логин");
      store.set("chats.searching_login", null);
    }
  }
}

function isChatsSearchObject(value: unknown): value is {
  searching_login: string;
  current_chat_id: number;
  users: [StateChatUserModel];
} {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'searching_login' in value &&
    'users' in value &&
    'current_chat_id' in value
  );
}

function isChatsObject(value: unknown): value is {
  current_chat_id: number;
  users: [StateChatUserModel];
  list: [StateChatModel];
} {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'users' in value &&
    'list' in value &&
    'current_chat_id' in value
  );
}

export function isUserToDelObject(value: unknown): value is {
  login: string;
  id: number;
  avatar: string | null;
  display_name: string | null;
  first_name: string | null;
  role: string | null;
  second_name: string | null;
} {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'login' in value &&
    'id' in value &&
    'avatar' in value &&
    'display_name' in value &&
    'first_name' in value &&
    'role' in value &&
    'second_name' in value
  );
}

export function isUserObject(value: unknown): value is {
  login: string;
  id: number;
  avatar: string | null;
  display_name: string | null;
  first_name: string | null;
  email: string | null;
  phone: string | null;
  second_name: string | null;
} {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'login' in value &&
    'id' in value &&
    'avatar' in value &&
    'display_name' in value &&
    'first_name' in value &&
    'email' in value &&
    'phone' in value &&
    'second_name' in value
  );
}

export async function delete_this_user(event: Event) {
  if (event instanceof MouseEvent) {
    const parent = event.currentTarget as HTMLElement;
    const target = parent.querySelector(".user_to_delete") as HTMLElement;
    const userId = Number(target.getAttribute("data-user-id"));
    const state = store.getState();

    if (userId && isChatsObject(state.chats) && state.chats.current_chat_id) {
      const controller = new ChatsController();
      try {
        await controller.deleteUserFromChat({
          users: [userId],
          chatId: state.chats.current_chat_id
        }).catch((error) => {
          console.error("Ошибка обращения к серверу:", error);
        });
        let users = state.chats.users;
        const filtered_users = users.filter(item => item.id !== userId);
        store.set("chats.users", filtered_users);
        console.debug(`Пользователь ${userId} удалён из чата`);
        const current_chat_users = generate_delete_users();
        delete_users.updateChildrenList(current_chat_users);
      } catch (error) {
        console.error("Ошибка удаления пользователя из чата", error);
      }
    } else {
      console.debug("Не выбран пользователь или чат");
    }
  }
}

export function generate_delete_users(): UserToDel[] {
  const state = store.getState();
  let user_list = [];
  function isChatsObject(value: unknown): value is {
    current_chat_id: number;
    users: [StateChatUserModel];
  } {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      'current_chat_id' in value &&
      'users' in value
    );
  }
  if (state.chats && isChatsObject(state.chats)) {
    const users = state.chats.users;
    const me = state.user;
    if (isUserObject(me)) {
      for (let user of users) {
        if (isUserToDelObject(user)) {
          if (user.id != me.id) {
            user_list.push(new UserToDel({
              username: user.login,
              id: user.id,
              events: {
                "click": delete_this_user
              }
            }));
          }
        }
      }
    }
  }
  return user_list;
}

export async function search_and_invite_user(event: Event) {
  event.preventDefault();
  if (event instanceof SubmitEvent) {
    let state = store.getState();
    if ( state.chats ) {
      if ( isChatsSearchObject(state.chats) ) {
        const controller = new ChatsController();
        const searching_user = await controller.searchUser({
          login: state.chats.searching_login
        }).catch((error) => {
          console.error("Ошибка обращения к серверу:", error);
        });
        if (searching_user.length) {
          const invited_user = searching_user[0];
          await controller.inviteUserToChat({
            users: [invited_user.id],
            chatId: state.chats.current_chat_id
          }).catch((error) => {
            console.error("Ошибка обращения к серверу:", error);
          });
          let users = state.chats.users;
          users.push(invited_user);
          store.set("chats.users", users);
          return
        }
        console.error("Такой пользователь не найден, либо не выбран чат.");
      }
    }
  }
}

export async function delete_chat() {
  let state = store.getState();
  if ( state.chats ) {
    if (isChatsObject(state.chats)) {
      const chat_id: number = state.chats.current_chat_id;
      const controller = new ChatsController();
      await controller.deleteChat(chat_id).catch((error) => {
        console.error("Ошибка обращения к серверу:", error);
      });
      let chats = state.chats.list;
      const chat_list = chats.filter(item => item.id !== chat_id);
      store.set("chats.list", chat_list);
      let friends = [];
      for (const chat of chat_list) {
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
      }
      left_col.updateChildrenList(friends);
    }
  }
}
