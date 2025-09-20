import { AnyProps, Block } from "../../core/block";
import Input from "../../components/input";
import Button from "../../components/button";
import Form from "../../components/sign_up";
import template from "./template.hbs";
import "./style.scss";
import { 
  on_change_input_checker,
  validateLogin,
  validatePassword,
  validateEmail,
  validatePhone,
  validateName
} from "../../core/validation";

let is_valid_login: boolean = false;
let is_valid_first_name: boolean = false;
let is_valid_second_name: boolean = false;
let is_valid_password: boolean = false;
let is_valid_phone: boolean = false;
let is_valid_email: boolean = false;

let login_value: string = "";
let password_value: string = "";
let first_name_value: string = "";
let second_name_value: string = "";
let email_value: string = "";
let phone_value: string = "";


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

function change_first_name_input (event: Event): void {
  if (event instanceof FocusEvent) {
    const target = event.target as HTMLInputElement;
    first_name_value = target.value;
    if (on_change_input_checker(target, validateName)) {
      is_valid_first_name = true;
    } else {
      is_valid_first_name = false;
    }
  }
}

function change_second_name_input (event: Event): void {
  if (event instanceof FocusEvent) {
    const target = event.target as HTMLInputElement;
    second_name_value = target.value;
    if (on_change_input_checker(target, validateName)) {
      is_valid_second_name = true;
    } else {
      is_valid_second_name = false;
    }
  }
}

function change_email_input (event: Event): void {
  if (event instanceof FocusEvent) {
    const target = event.target as HTMLInputElement;
    email_value = target.value;
    if (on_change_input_checker(target, validateEmail)) {
      is_valid_email = true;
    } else {
      is_valid_email = false;
    }
  }
}

function change_phone_input (event: Event): void {
  if (event instanceof FocusEvent) {
    const target = event.target as HTMLInputElement;
    phone_value = target.value;
    if (on_change_input_checker(target, validatePhone)) {
      is_valid_phone = true;
    } else {
      is_valid_phone = false;
    }
  }
}

function validate_and_submit(event: Event): void {
  event.preventDefault();
  if (event instanceof SubmitEvent) {
    if (
      is_valid_login &&
      is_valid_password &&
      is_valid_first_name &&
      is_valid_second_name &&
      is_valid_phone &&
      is_valid_email
    ) {
      console.log({
        login: login_value,
        password: password_value,
        first_name: first_name_value,
        second_name: second_name_value,
        email: email_value,
        phone: phone_value
      })
    } else {
      console.log("Проверьте значения полей");
    }
  }
}

class Page extends Block {
  constructor(props: AnyProps) {
    super("div", props);
  }
  render(): DocumentFragment {
    return this.compile(template, {
      header: this.props.header,
      form: this.props.form
    });
  }
}

const name_input: Block = new Input({
  title: "Имя",
  name: "first_name",
  type: "text",
  events: {
    "blur": change_first_name_input
  }
})

const surname_input: Block = new Input({
  title: "Фамилия",
  name: "second_name",
  type: "text",
  events: {
    "blur": change_second_name_input
  }
})

const login_input: Block = new Input({
  title: "Логин",
  name: "login",
  type: "text",
  events: {
    "blur": change_login_input
  }
})

const email_input: Block = new Input({
  title: "E-mail",
  name: "email",
  type: "text",
  events: {
    "blur": change_email_input
  }
})

const phone_input: Block = new Input({
  title: "Телефон",
  name: "phone",
  type: "text",
  events: {
    "blur": change_phone_input
  }
})

const password_input: Block = new Input({
  title: "Пароль",
  name: "password",
  type: "password",
  events: {
    "blur": change_password_input
  }
})

const submit_button: Block = new Button({
  text: "Зарегистрироваться",
  type: "submit"
})

const sign_up_form: Block = new Form({
  name: name_input,
  surname: surname_input,
  login: login_input,
  email: email_input,
  phone: phone_input,
  password: password_input,
  button: submit_button,
  events: {
    "submit": validate_and_submit
  }
})

export const SignUp: Page = new Page({
  header: "Регистрация",
  form: sign_up_form
})
