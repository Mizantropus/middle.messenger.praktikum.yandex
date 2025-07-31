import Handlebars from "handlebars";
import template from "./404.hbs";

export const Page404 = () => Handlebars.compile(template)({});