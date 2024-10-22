import NavBar from "../components/NavBar/NavBar";
import Profile from "../components/User Profile/Profile";
import ChangePassword from "../components/User Profile/ChangePassword";
import TheatreAdminRequest from "../components/User Profile/RequestforTheatreAdmin";

const UserProfile = () => (
  <div>
    <NavBar />
    <Profile />
    <ChangePassword />
    <TheatreAdminRequest />
  </div>
);

export default UserProfile;