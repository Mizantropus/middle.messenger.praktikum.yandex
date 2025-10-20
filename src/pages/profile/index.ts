import { AnyProps, Block } from "../../core/block";
import Input from "../../components/input";
import Button from "../../components/button";
import { FormProfileFiltred, FormAvatarFiltred } from "../../components/profile";
import FormPassword from "../../components/password_change";
import store from "../../store";
import connect from "../../api/service";
import ProfileController from "../../api/controllers/profile";
import template from "./template.hbs";
import { Indexed } from "../../core/service/set";
import { isUserObject } from "./service";
import "./style.scss";
import { 
  on_change_input_checker,
  validateLogin,
  validatePassword,
  validateEmail,
  validatePhone,
  validateAvatar,
  validateFullName,
  validateName
} from "../../core/validation";

let is_valid_login: boolean = true;
let is_valid_first_name: boolean = true;
let is_valid_second_name: boolean = true;
let is_valid_phone: boolean = true;
let is_valid_email: boolean = true;
let is_valid_display_name: boolean = true;
let is_valid_password: boolean = false;
let is_valid_new_password: boolean = false;
let is_valid_file: boolean = false;

let avatar_file_value: File | null = null;
let password_value: string = "";
let new_password_value: string = "";
let state = store.getState();


export function change_login_input(event: Event): void {
  if (event instanceof FocusEvent) {
    const target = event.target as HTMLInputElement;
    if (on_change_input_checker(target, validateLogin)) {
      store.set("user.login", target.value);
      is_valid_login = true;
    } else {
      is_valid_login = false;
    }
  }
}

function change_password_input(event: Event): void {
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

function change_new_password_input(event: Event): void {
  if (event instanceof FocusEvent) {
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
}

function change_first_name_input(event: Event): void {
  if (event instanceof FocusEvent) {
    const target = event.target as HTMLInputElement;
    if (on_change_input_checker(target, validateName)) {
      store.set("user.first_name", target.value);
      is_valid_first_name = true;
    } else {
      is_valid_first_name = false;
    }
  }
}

function change_second_name_input(event: Event): void {
  if (event instanceof FocusEvent) {
    const target = event.target as HTMLInputElement;
    if (on_change_input_checker(target, validateName)) {
      is_valid_second_name = true;
      store.set("user.second_name", target.value);
    } else {
      is_valid_second_name = false;
    }
  }
}

function change_email_input(event: Event): void {
  if (event instanceof FocusEvent) {
    const target = event.target as HTMLInputElement;
    if (on_change_input_checker(target, validateEmail)) {
      store.set("user.email", target.value);
      is_valid_email = true;
    } else {
      is_valid_email = false;
    }
  }
}

function change_phone_input(event: Event): void {
  if (event instanceof FocusEvent) {
    const target = event.target as HTMLInputElement;
    if (on_change_input_checker(target, validatePhone)) {
      is_valid_phone = true;
      store.set("user.phone", target.value);
    } else {
      is_valid_phone = false;
    }
  }
}

function change_display_name_input (event: Event): void {
  if (event instanceof FocusEvent) {
    const target = event.target as HTMLInputElement;
    if (on_change_input_checker(target, validateFullName)) {
      is_valid_display_name = true;
      store.set("user.display_name", target.value);
      Profile.setProps({
        display_name: target.value
      });
    } else {
      is_valid_display_name = false;
    }
  }
}

function click_on_preview_ava (event: Event): void {
  if (event instanceof MouseEvent) {
    const target = event.target as HTMLInputElement;
    if (target.classList.contains("pic_preview")) {
      const avatar = document.getElementById("avatar") as HTMLElement;
      avatar.click();
    }
  }
}

function validate_and_submit(event: Event): void {
  event.preventDefault();
  if (event instanceof SubmitEvent) {
    if ( state.user ) {
      if (
        is_valid_login &&
        is_valid_first_name &&
        is_valid_second_name &&
        is_valid_phone &&
        is_valid_display_name &&
        is_valid_email &&
        isUserObject(state.user)
      ) {
        console.debug({
          login: state.user.login,
          first_name: state.user.first_name,
          second_name: state.user.second_name,
          email: state.user.email,
          display_name: state.user.display_name,
          phone: state.user.phone
        })
        let profileController = new ProfileController();
        profileController.save_user({
          login: state.user.login,
          first_name: state.user.first_name,
          display_name: state.user.display_name,
          second_name: state.user.second_name,
          email: state.user.email,
          phone: state.user.phone
        }).catch((error) => {
          console.error("Ошибка обращения к серверу:", error);
        });

      } else {
        console.debug("Проверьте значения полей");
      }
    } else {
      console.debug("Проверьте значения полей");
    }
  }
}

function validate_and_submit_passwords(event: Event): void {
  event.preventDefault();
  if (event instanceof SubmitEvent) {
    if (
      is_valid_password &&
      is_valid_new_password
    ) {
      console.debug({
        old_password: password_value,
        new_password: new_password_value
      })
      let profileController = new ProfileController();
      profileController.change_password({
        oldPassword: password_value,
        newPassword: new_password_value
      }).catch((error) => {
        console.error("Ошибка обращения к серверу:", error);
      });
    } else {
      console.debug("Проверьте значения полей");
    }
  }
}

function change_avatar_input (event: Event): void {
  if (event instanceof Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    if (validateAvatar(file)) {
      avatar_file_value = file;
      const reader = new FileReader();
      const preview = document.getElementsByClassName("pic_preview")[0] as HTMLDivElement;
      reader.onload = function () {
        preview.style.backgroundImage = `url(${reader.result})`;
      };
      reader.readAsDataURL(file);
      is_valid_file = true;
    } else {
      is_valid_file = false;
    }
  }
}

function validate_and_submit_avatar(event: Event): void {
  event.preventDefault();
  if (event instanceof SubmitEvent && is_valid_file && avatar_file_value) {
    const formData = new FormData();
    formData.append('avatar', avatar_file_value);
    let profileController = new ProfileController();
    profileController.save_avatar(formData).catch((error) => {
      console.error("Ошибка обращения к серверу:", error);
    });
  }
}

class Page extends Block {
  constructor(props: AnyProps) {
    super("div", props);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template, {
      avatar_form: this.props.avatar_form,
      display_name: this.props.display_name,
      profile: this.props.profile,
      password: this.props.password      
    });
  }
}

function filter_state_first_name(state: Indexed): Record<string, undefined | string> {
  if (
    state &&
    typeof state.user === 'object' &&
    state.user !== null &&
    !Array.isArray(state.user) &&
    'first_name' in state.user
  ) {
    const user = state.user as Indexed;
    const value = user.first_name;
    if (typeof value === 'string') {
      return { value: value };
    }
  }
  return { value: undefined };
}
const withUserName = connect(filter_state_first_name);
const InputFirstName = withUserName(Input);
const name_input: InstanceType<typeof InputFirstName> = new InputFirstName({
  title: "Имя",
  name: "first_name",
  type: "text",
  value: state.first_name,
  events: {
    "blur": change_first_name_input
  }
})


function filter_state_second_name(state: Indexed): Record<string, undefined | string> {
  if (
    state &&
    typeof state.user === 'object' &&
    state.user !== null &&
    !Array.isArray(state.user) &&
    'second_name' in state.user
  ) {
    const user = state.user as Indexed;
    const value = user.second_name;
    if (typeof value === 'string') {
      return { value: value };
    }
  }
  return { value: undefined };
}
const withUserSecondName = connect(filter_state_second_name);
const InputSecondName = withUserSecondName(Input);
const surname_input: InstanceType<typeof InputSecondName> = new InputSecondName({
  title: "Фамилия",
  name: "second_name",
  type: "text",
  value: state.second_name,
  events: {
    "blur": change_second_name_input
  }
})


function filter_state_display_name(state: Indexed): Record<string, undefined | string> {
  if (
    state &&
    typeof state.user === 'object' &&
    state.user !== null &&
    !Array.isArray(state.user) &&
    'display_name' in state.user
  ) {
    const user = state.user as Indexed;
    const value = user.display_name;
    if (typeof value === 'string') {
      return { value: value };
    }
  }
  return { value: undefined };
}
const withUserDisplayName = connect(filter_state_display_name);
const InputDisplayName = withUserDisplayName(Input);
const display_name_input: InstanceType<typeof InputDisplayName> = new InputDisplayName({
  title: "Отображаемое имя",
  name: "display_name",
  type: "text",
  value: state.display_name,
  events: {
    "blur": change_display_name_input
  }
})


function filter_state_login(state: Indexed): Record<string, undefined | string> {
  if (
    state &&
    typeof state.user === 'object' &&
    state.user !== null &&
    !Array.isArray(state.user) &&
    'login' in state.user
  ) {
    const user = state.user as Indexed;
    const value = user.login;
    if (typeof value === 'string') {
      return { value: value };
    }
  }
  return { value: undefined };
}
const withUserLogin = connect(filter_state_login);
const InputLogin = withUserLogin(Input);
const login_input: InstanceType<typeof InputLogin> = new InputLogin({
  title: "Логин",
  name: "login",
  type: "text",
  value: state.login,
  events: {
    "blur": change_login_input
  }
})


function filter_state_email(state: Indexed): Record<string, undefined | string> {
  if (
    state &&
    typeof state.user === 'object' &&
    state.user !== null &&
    !Array.isArray(state.user) &&
    'email' in state.user
  ) {
    const user = state.user as Indexed;
    const value = user.email;
    if (typeof value === 'string') {
      return { value: value };
    }
  }
  return { value: undefined };
}
const withUserEmail = connect(filter_state_email);
const InputEmail = withUserEmail(Input);
const email_input: InstanceType<typeof InputEmail> = new InputEmail({
  title: "E-mail",
  name: "email",
  type: "text",
  value: state.email,
  events: {
    "blur": change_email_input
  }
})


function filter_state_phone(state: Indexed): Record<string, undefined | string> {
  if (
    state &&
    typeof state.user === 'object' &&
    state.user !== null &&
    !Array.isArray(state.user) &&
    'phone' in state.user
  ) {
    const user = state.user as Indexed;
    const value = user.phone;
    if (typeof value === 'string') {
      return { value: value };
    }
  }
  return { value: undefined };
}
const withUserPhone = connect(filter_state_phone);
const InputPhone = withUserPhone(Input);
const phone_input: InstanceType<typeof InputPhone> = new InputPhone({
  title: "Телефон",
  name: "phone",
  type: "text",
  value: state.phone,
  events: {
    "blur": change_phone_input
  }
})


function filter_state_id(state: Indexed): Record<string, undefined | number> {
  if (
    state &&
    typeof state.user === 'object' &&
    state.user !== null &&
    !Array.isArray(state.user) &&
    'id' in state.user
  ) {
    const user = state.user as Indexed;
    const value = user.id;
    if (typeof value === 'number') {
      return { value: value };
    }
  }
  return { value: undefined };
}
const withUserId = connect(filter_state_id);
const InputId = withUserId(Input);
const id_input: InstanceType<typeof InputId> = new InputId({
  name: "id",
  type: "hidden",
  value: state.id
})


const old_password_input: Input = new Input({
  title: "Старый пароль",
  name: "oldPassword",
  type: "password",
  events: {
    "blur": change_password_input
  }
})

const new_password_input: Input = new Input({
  title: "Новый пароль",
  name: "newPassword",
  type: "password",
  events: {
    "blur": change_new_password_input
  }
})

const avatar_input: Input = new Input({
  title: "",
  accept: "image/jpeg,image/png,image/gif,image/webp",
  name: "avatar",
  type: "file",
  events: {
    "change": change_avatar_input
  }
})

const button_save_profile: Button = new Button({
  text: "Сохранить",
  type: "submit"
})

const button_save_password: Button = new Button({
  text: "Сохранить пароль",
  type: "submit"
})

const button_save_avatar: Button = new Button({
  text: "Сохранить аватарку",
  type: "submit"
})

const profile_form: InstanceType<typeof FormProfileFiltred> = new FormProfileFiltred({
  name: name_input,
  surname: surname_input,
  display_name: display_name_input,
  login: login_input,
  email: email_input,
  phone: phone_input,
  id: id_input,
  button_save_profile: button_save_profile,
  events: {
    "submit": validate_and_submit
  }
})

const password_form: FormPassword = new FormPassword({
  old_password: old_password_input,
  new_password: new_password_input,
  button_save_password: button_save_password,
  events: {
    "submit": validate_and_submit_passwords
  }
}, "profile_form_password")

const avatar_form: InstanceType<typeof FormAvatarFiltred> = new FormAvatarFiltred({
  avatar_url: state.avatar,
  button: button_save_avatar,
  input: avatar_input,
  events: {
    "submit": validate_and_submit_avatar
  }
})

function filter_state_display_name_page (state: Indexed): Record<string, undefined | string> {
  if (
    state &&
    typeof state.user === 'object' &&
    state.user !== null &&
    !Array.isArray(state.user) &&
    'display_name' in state.user
  ) {
    const user = state.user as Indexed;
    const value = user.display_name;
    if (typeof value === 'string') {
      return { display_name: value };
    }
  }
  return { display_name: undefined };
}
const withUserDisplayNamePage = connect(filter_state_display_name_page);
const PageFiltred = withUserDisplayNamePage(Page);
export const Profile: InstanceType<typeof PageFiltred> = new PageFiltred ({
  avatar: avatar_form,
  display_name: state.display_name,
  profile: profile_form,
  password: password_form,
  events: {
    "click": click_on_preview_ava
  }
})
