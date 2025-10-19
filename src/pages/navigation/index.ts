import { AnyProps, Block } from "../../core/block";
import Header from "../../components/header";
import MainMenu from "../../components/main_menu";
import MenuItem from "../../components/main_menu_item";
import SignInController from "../../api/controllers/sign-in";
import template from './template.hbs';
import './style.scss';


let log_out = async function (event: Event) {
  if (event instanceof MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    let signInController = new SignInController();
    await signInController.logout();
  }
}

export default class Page extends Block {
  constructor(props: AnyProps) {
    super("main", props);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template, {
      header: this.props.header,
      main_menu: this.props.main_menu
    });
  }
}

const main_menu_dict: string[][] = [
  ["Навигация", "/"],
  ["Вход", "/sign-in"],
  ["Регистрация", "/sign-up"],
  ["Чаты", "/chats"],
  ["Настройки профиля", "/profile"],
  ["Страница 404", "/404"],
  ["Страница 500", "/500"],
  ["Выйти", "/"]
]

const main_menu_items: Block[] = [];

let counter = 0;
for (let menu_item of main_menu_dict) {
  let menu_item_props: Record<string, any> = {
    name: menu_item[0],
    title: menu_item[0],
    url: menu_item[1],
  }
  if (counter === 7) {
    menu_item_props.events = {
      "click": log_out
    }
  }
  main_menu_items.push(new MenuItem(menu_item_props, `main_menu_item_${counter}`));
  counter++;
}

const header: Block = new Header({
  title: 'Мессенджер'
})

const main_menu: Block = new MainMenu({
  header: "Навигация",
  list: main_menu_items
}, "main")

export const Navigation: Page = new Page({
  header: header,
  main_menu: main_menu
})
