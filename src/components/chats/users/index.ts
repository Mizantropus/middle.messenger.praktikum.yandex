import {
  AddUser,
  DeleteUser
} from "./definitions";
import Input from "../../input";
import Button from "../../button";
import { change_login_input, search_and_invite_user, generate_delete_users } from "./service";


const login_find_user: Input = new Input({
  title: "Логин пользователя",
  name: "login",
  type: "text",
  events: {
    "blur": change_login_input
  }
})

const invite_button: Button = new Button({
  text: "Пригласить",
  type: "submit"
})

export const invite_user: AddUser = new AddUser({
  input: login_find_user,
  button: invite_button,
  events: {
    "submit": search_and_invite_user
  }
});

export const delete_users: DeleteUser = new DeleteUser({
  list: generate_delete_users()
});
