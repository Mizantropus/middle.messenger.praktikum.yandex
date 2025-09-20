import Block from "../../core/block";
import Input from "../../components/input";
import Button from "../../components/button";
import template from "./template.hbs";
import "./style.scss";
import { 
  on_change_input_checker,
  validateLogin,
  validatePassword,
  validateEmail,
  validatePhone,
  validateFullName,
  validateName
} from "../../core/validation"

let is_valid_login: boolean = true;
let is_valid_first_name: boolean = true;
let is_valid_second_name: boolean = true;
let is_valid_phone: boolean = true;
let is_valid_email: boolean = true;
let is_valid_display_name: boolean = true;
let is_valid_password: boolean = false;
let is_valid_new_password: boolean = false;

let display_name_value: string = "Richard Sapogov";
let login_value: string = "antonio_pachino";
let password_value: string = "";
let new_password_value: string = "";
let first_name_value: string = "Richard";
let second_name_value: string = "Sapogov";
let email_value: string = "mario@mushrooms.it";
let phone_value: string = "+399167772255";


function change_login_input(event: InputEvent): void {
  const target = event.target as HTMLInputElement;
  login_value = target.value;
  if (on_change_input_checker(target, validateLogin)) {
    is_valid_login = true;
  } else {
    is_valid_login = false;
  }
}

function change_password_input(event: InputEvent): void {
  const target = event.target as HTMLInputElement;
  password_value = target.value;
  if (on_change_input_checker(target, validatePassword)) {
    is_valid_password = true;
  } else {
    is_valid_password = false;
  }
}

function change_new_password_input(event: InputEvent): void {
  const target = event.target as HTMLInputElement;
  new_password_value = target.value;
  if (on_change_input_checker(target, validatePassword) &&
      new_password_value === password_value) {
    target.classList.remove("invalid");
    is_valid_new_password = true;
  } else {
    target.classList.add("invalid");
    is_valid_new_password = false;
  }
}

function change_first_name_input(event: InputEvent): void {
  const target = event.target as HTMLInputElement;
  first_name_value = target.value;
  if (on_change_input_checker(target, validateName)) {
    is_valid_first_name = true;
  } else {
    is_valid_first_name = false;
  }
}

function change_second_name_input(event: InputEvent): void {
  const target = event.target as HTMLInputElement;
  second_name_value = target.value;
  if (on_change_input_checker(target, validateName)) {
    is_valid_second_name = true;
  } else {
    is_valid_second_name = false;
  }
}

function change_email_input(event: InputEvent): void {
  const target = event.target as HTMLInputElement;
  email_value = target.value;
  if (on_change_input_checker(target, validateEmail)) {
    is_valid_email = true;
  } else {
    is_valid_email = false;
  }
}

function change_phone_input(event: InputEvent): void {
  const target = event.target as HTMLInputElement;
  phone_value = target.value;
  if (on_change_input_checker(target, validatePhone)) {
    is_valid_phone = true;
  } else {
    is_valid_phone = false;
  }
}

function change_display_name_input (event: InputEvent): void {
  const target = event.target as HTMLInputElement;
  display_name_value = target.value;
  if (on_change_input_checker(target, validateFullName)) {
    is_valid_display_name = true;
    Profile.setProps({
      display_name_value: display_name_value
    });
  } else {
    is_valid_display_name = false;
  }
}

function validate_and_submit(event: MouseEvent): void {
  event.preventDefault();
  if (
    is_valid_login &&
    is_valid_first_name &&
    is_valid_second_name &&
    is_valid_phone &&
    is_valid_display_name &&
    is_valid_email
  ) {
    console.log({
      login: login_value,
      first_name: first_name_value,
      second_name: second_name_value,
      email: email_value,
      display_name: display_name_value,
      phone: phone_value
    })
  } else {
    console.log("Проверьте значения полей");
  }
}

function validate_and_submit_passwords(event: MouseEvent): void {
  event.preventDefault();
  if (
    is_valid_password &&
    is_valid_new_password
  ) {
    console.log({
      old_password: password_value,
      new_password: new_password_value
    })
  } else {
    console.log("Проверьте значения полей");
  }
}


class Page extends Block {
  constructor(props) {
    super("div", props);
  }
  render(): DocumentFragment {
    return this.compile(template, {
      avatar: this.props.avatar,
      display_name_value: this.props.display_name_value,
      name: this.props.name,
      surname: this.props.surname,
      display_name: this.props.display_name,
      login: this.props.login,
      email: this.props.email,
      phone: this.props.phone,
      button_save_profile: this.props.button_save_profile,
      old_password: this.props.old_password,
      new_password: this.props.new_password,
      button_save_password: this.props.button_save_password
    });
  }
}

const name_input: Block = new Input({
  title: "Имя",
  name: "first_name",
  type: "text",
  value: first_name_value,
  events: {
    "change": change_first_name_input
  }
})

const surname_input: Block = new Input({
  title: "Фамилия",
  name: "second_name",
  type: "text",
  value: second_name_value,
  events: {
    "change": change_second_name_input
  }
})

const display_name_input: Block = new Input({
  title: "Отображаемое имя",
  name: "display_name",
  type: "text",
  value: display_name_value,
  events: {
    "change": change_display_name_input
  }
})

const login_input: Block = new Input({
  title: "Логин",
  name: "login",
  type: "text",
  value: login_value,
  events: {
    "change": change_login_input
  }
})

const email_input: Block = new Input({
  title: "E-mail",
  name: "email",
  type: "text",
  value: email_value,
  events: {
    "change": change_email_input
  }
})

const phone_input: Block = new Input({
  title: "Телефон",
  name: "phone",
  type: "text",
  value: phone_value,
  events: {
    "change": change_phone_input
  }
})

const old_password_input: Block = new Input({
  title: "Старый пароль",
  name: "oldPassword",
  type: "password",
  events: {
    "change": change_password_input
  }
})

const new_password_input: Block = new Input({
  title: "Новый пароль",
  name: "newPassword",
  type: "password",
  events: {
    "change": change_new_password_input
  }
})

const button_save_profile: Block = new Button({
  text: "Сохранить",
  type: "submit",
  events: {
    "click": validate_and_submit
  }
})

const button_save_password: Block = new Button({
  text: "Сохранить пароль",
  type: "submit",
  events: {
    "click": validate_and_submit_passwords
  }
})

export const Profile: Page = new Page({
  avatar: "https://url.to.picture/perfect-photo.jpeg",
  display_name_value: display_name_value,
  name: name_input,
  surname: surname_input,
  display_name: display_name_input,
  login: login_input,
  email: email_input,
  phone: phone_input,
  button_save_profile: button_save_profile,
  old_password: old_password_input,
  new_password: new_password_input,
  button_save_password: button_save_password
})
