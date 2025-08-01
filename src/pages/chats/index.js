import Handlebars from "handlebars";
import template from "./chats.hbs";

export const Chats = () => Handlebars.compile(template)({});
