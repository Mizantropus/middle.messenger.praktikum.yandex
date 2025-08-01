import Handlebars from "handlebars";
import template from "./button.hbs";

export default function componentButton() {
  Handlebars.registerPartial("button", template);
};
