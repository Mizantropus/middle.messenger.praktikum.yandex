import { AnyProps, Block } from "../../core/block";
import Header from "../../components/header";
import MainMenu from "../../components/main_menu";
import MenuItem from "../../components/main_menu_item";
import template from './template.hbs';
import './style.scss';


export default class Page extends Block {
  constructor(props: AnyProps) {
    super("main", props);
  }
  render(): DocumentFragment {
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
  ["Страница 500", "/500"]
]

const main_menu_items: Block[] = [];

for (let menu_item of main_menu_dict) {
  main_menu_items.push(new MenuItem({
    name: menu_item[0],
    title: menu_item[0],
    url: menu_item[1]
  }))
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
