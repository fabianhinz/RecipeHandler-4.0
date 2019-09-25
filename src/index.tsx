import * as serviceWorker from "./serviceWorker";
import App from "./Components/App";
import React from "react";
import ReactDOM from "react-dom";
import "typeface-roboto";
import "react-perfect-scrollbar/dist/css/styles.css";

ReactDOM.render(<App />, document.getElementById("root"));

if (process.env.NODE_ENV === "production") serviceWorker.register();
