import Handlebars from "handlebars";
import template from "./main_menu.hbs";

export default function componentMainMenu() {
  Handlebars.registerPartial("main_menu", template);
};
