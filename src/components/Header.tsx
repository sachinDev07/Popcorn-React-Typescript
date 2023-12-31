import { Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";

import NavigationLink from "./NavigationLink";
import { navigations } from "../config/constant";
import logo from "../assets/logo.png";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect } from "react";
import { addUser, removeUser } from "../redux/userSlice";

const Header = () => {
  const user = useSelector((store: RootState) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut(auth)
      .then(() => {})
      .catch((error) => {});
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(
          addUser({
            uid: uid,
            email: email,
            displayName: displayName,
            photoURL: photoURL,
          })
        );
        navigate("/browse");
      } else {
        dispatch(removeUser(null));
        navigate("/");
      }
    });
  }, []);

  return (
    <header className="fixed left-0 right-0 w-full mx-auto max-w-7xl py-3 background-transparent bg-black">
      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center space-x-4">
          <Link to="/">
            <img src={logo} alt="logo" className="w-28 md:w-36" />
          </Link>
          <nav className="flex space-x-6">
            {navigations.map((item) => (
              <NavigationLink key={item.page} to={item.to} page={item.page} />
            ))}
          </nav>
        </div>
        <div className="flex justify-between items-center space-x-4 text-black text-lg font-medium">
          <BsSearch className="text-2xl cursor-pointer" />
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-500 active:bg-red-700 transition duration-150 ease-in-out"
          >
            Sign Out
          </button>
          {user.photoURL !== null && (
            <div>
              <img
                src={user?.photoURL}
                alt="image"
                className="w-12 h-12 rounded-full"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
