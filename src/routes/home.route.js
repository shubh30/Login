import { home } from "../config/webURLs";

// page
import Home from "../pages/home/Home";

const HomeRoute = [
  {
    path: home,
    exact: true,
    isProtected: false,
    component: Home,
  },
];

export default HomeRoute;