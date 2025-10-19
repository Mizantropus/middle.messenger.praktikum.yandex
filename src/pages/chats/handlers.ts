import { showPopUp } from "../../components/pop_up";
import { invite_user, delete_users } from "../../components/chats/users";
import { generate_delete_users, delete_chat } from "../../components/chats/users/service";


export async function add_user_handler() {
  const elem = invite_user.getContent();
  showPopUp(elem);
}

export function delete_user_handler() {
  const current_chat_users = generate_delete_users();
  delete_users.updateChildrenList(current_chat_users);
  const elem = delete_users.getContent();
  showPopUp(elem);
}

export async function delete_chat_handler() {
  await delete_chat();
}
