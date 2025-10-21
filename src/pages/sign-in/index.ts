import SignInController from "../../api/controllers/sign-in";
import { AnyProps, Block } from "../../core/block";
import Input from "../../components/input";
import Button from "../../components/button";
import Form from "../../components/sign_in";
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


function change_login_input (event: Event): void {
  if (event instanceof FocusEvent) {
    const target = event.target as HTMLInputElement;    
    login_value = target.value;
    if (on_change_input_checker(target, validateLogin)) {
      is_valid_login = true;
    } else {
      is_valid_login = false;
    }
  }
}

function change_password_input (event: Event): void {
  if (event instanceof FocusEvent) {
    const target = event.target as HTMLInputElement;
    password_value = target.value;
    if (on_change_input_checker(target, validatePassword)) {
      is_valid_password = true;
    } else {
      is_valid_password = false;
    }
  }
}

function validate_and_submit(event: Event): void {
  event.preventDefault();
  if (event instanceof SubmitEvent) {
    if (is_valid_login && is_valid_password) {
      let signInController = new SignInController();
      signInController.login({
        login: login_value,
        password: password_value
      }).catch((error) => {
        console.error("Ошибка обращения к серверу:", error);
      });
    } else {
      console.debug("Проверьте значения логина и/или пароля");
    }
  }
}

class Page extends Block {
  constructor(props: AnyProps) {
    super("div", props);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template, {
      header: this.props.header,
      form: this.props.form
    });
  }
}

const login_input: Input = new Input({
  title: "Логин",
  name: "login",
  type: "text",
  events: {
    "blur": change_login_input
  }
})

const password_input: Input = new Input({
  title: "Пароль",
  name: "password",
  type: "password",
  events: {
    "blur": change_password_input
  }
})

const submit_button: Button = new Button({
  text: "Войти",
  type: "submit",
})

export const sign_in_form: Form = new Form({
  login: login_input,
  password: password_input,
  button: submit_button,
  events: {
    "submit": validate_and_submit
  }
})

export const SignIn: Page = new Page({
  header: "Вход",
  form: sign_in_form
})
