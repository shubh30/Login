import { Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";

import './App.css';

// theme
import theme from "./project.theme";

// routes
import routes from "./routes";

// routes management
import { PublicRoute, PrivateRoute } from "./routeManagments";

// components
import Notification from "./components/notification/Notification";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className="main-wrapper">
          <Switch>
            {routes.map((route, idx) => {
              return !!route.isProtected ? (
                <PrivateRoute {...route} key={idx} />
              ) : (
                <PublicRoute {...route} key={idx} />
              );
            })}
          </Switch>
          <Notification />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
