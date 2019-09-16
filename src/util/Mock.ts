import pfannkuchenImg from "../images/pfannkuchen.jpg";
import { RecipeAttachement } from "../components/recipe/create/RecipeCreate";
import { CategoriesAs } from "../components/category/Categories";

export const MOCK_TIME_CATEGORIES = [
  "~20 Minuten",
  "~30 Minuten",
  "~40 Minuten",
  "> 50 Minuten"
];

export const MOCK_CATEGORIES = ["Salat", "Fleisch", "vegetarisch"];

export const MOCK_RECIPES = [
  "Pfannkuchen",
  "Salat mit Pute",
  "herzhafte Muffins"
];

export interface Recipe {
  name: string;
  created: string;
  categories: CategoriesAs<Array<string>>;
  attachements: RecipeAttachement[];
  ingredients: string;
  description: string;
}

export const MOCK_RESULTS: Array<Recipe> = [
  {
    name: "Pfannkuchen",
    created: new Date().toLocaleDateString(),
    categories: {
      time: ["~20 Minuten"],
      type: ["vegetarisch"]
    },
    attachements: [
      { dataUrl: pfannkuchenImg, name: "PfannkuchenBild - nomnom", size: 123 }
    ],
    ingredients:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
  },
  {
    name: "Sauerbraten",
    created: new Date().toLocaleDateString(),
    categories: {
      time: ["> 50 Minuten"],
      type: ["Fleisch"]
    },
    attachements: [{ dataUrl: "", name: "not found", size: 123 }],
    ingredients:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
  }
];
