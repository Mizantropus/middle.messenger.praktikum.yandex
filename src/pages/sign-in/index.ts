import Block from "../../core/block";
import Input from "../../components/input";
import Button from "../../components/button";
import template from "./template.hbs";
import {
  on_change_input_checker,
  validateLogin,
  validatePassword
} from "../../core/validation";
import "./style.scss";

let is_valid_login: boolean = false;
let is_valid_password: boolean = false;
let login_value: string = "";
let password_value: string = "";


function change_login_input (event: InputEvent): void {
  const target = event.target as HTMLInputElement;
  login_value = target.value;
  if (on_change_input_checker(target, validateLogin)) {
    is_valid_login = true;
  } else {
    is_valid_login = false;
  }
}

function change_password_input (event: InputEvent): void {
  const target = event.target as HTMLInputElement;
  password_value = target.value;
  if (on_change_input_checker(target, validatePassword)) {
    is_valid_password = true;
  } else {
    is_valid_password = false;
  }
}

function validate_and_submit(event: MouseEvent): void {
  event.stopPropagation();
  event.preventDefault();
  if (is_valid_login && is_valid_password) {
    console.log({
      login: login_value,
      password: password_value,
    })
  } else {
    console.log("Проверьте значения логина и/или пароля")
  }
}

class Page extends Block {
  constructor(props) {
    super("div", props);
  }
  render(): DocumentFragment {
    return this.compile(template, {
      header: this.props.header,
      login: this.props.login,
      password: this.props.password,
      button: this.props.button
    });
  }
}

const login_input: Block = new Input({
  title: "Логин",
  name: "login",
  type: "text",
  events: {
    "change": change_login_input
  }
})

const password_input: Block = new Input({
  title: "Пароль",
  name: "password",
  type: "password",
  events: {
    "change": change_password_input
  }
})

const submit_button: Block = new Button({
  text: "Войти",
  type: "submit",
  events: {
    "click": validate_and_submit
  }
})

export const SignIn: Page = new Page({
  header: "Вход",
  login: login_input,
  password: password_input,
  button: submit_button
})
