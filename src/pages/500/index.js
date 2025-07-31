import Handlebars from "handlebars";
import template from "./500.hbs";

export const Page500 = () => Handlebars.compile(template)({});