import pfannkuchenImg from "../images/pfannkuchen.jpg";

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

export const MOCK_RESULTS = [
  {
    name: "Pfannkuchen",
    created: new Date().toLocaleDateString(),
    categories: {
      time: ["10 - 20 Minuten"],
      type: ["Vegetarisch"]
    },
    attachements: [{ dataUrl: pfannkuchenImg, name: "", size: 123 }],
    ingredients:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
  }
];
