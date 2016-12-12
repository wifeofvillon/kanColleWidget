import React from "react";
import { render } from "react-dom";
// import { Provider } from "react-redux"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();
// require("react-tap-event-plugin")();

// import { createStore } from "redux"
// let store = createStore((state = {}, action) => {
//   return state;
// })
import "font-awesome-webpack";

import WikiView from "../../Components/Views/Wiki";

render(
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <WikiView />
  </MuiThemeProvider>,
  document.getElementById("main")
);
