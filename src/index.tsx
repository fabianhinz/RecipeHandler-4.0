import * as serviceWorker from "./serviceWorker";
import App from "./Components/App";
import React from "react";
import ReactDOM from "react-dom";
import "typeface-roboto";
import "animate.css";

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.register();
