// url
import { profile } from "../config/webURLs";

// page
import Profile from "../pages/profile/Profile";

const ProfileRoute = [
  {
    path: profile,
    exact: true,
    isProtected: true,
    component: Profile,
  },
];

export default ProfileRoute;