import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Item from "./components/Item";
import LogoutButton from "./components/LogoutButton";
import SearchBar from "./components/SearchBar";
// import itemService from "./services/items";
// import loginService from "./services/login";
// import userService from "./services/users";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import { initialiseLoggedInUser } from "./reducers/loginReducer";
import { initialiseItems } from "./reducers/itemsReducer";

function App() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items);
  const loggedInUser = useSelector((state) => state.login);

  const [showAll, setShowAll] = useState(true);
  const [searchStr, setSearchStr] = useState(" ");
  // const [user, setUser] = useState(null);

  useEffect(() => {
    dispatch(initialiseLoggedInUser());
    dispatch(initialiseItems());
    // dispatch(initializeAllUsers())
  }, [dispatch]);

  // const handleLogin = async (userObject) => {
  //   const { username } = userObject;
  //   const { password } = userObject;
  //   try {
  //     const loggedInUser = await loginService.login({
  //       username,
  //       password,
  //     });

  //     window.localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

  //     userService.setToken(loggedInUser.token);
  //     setUser(loggedInUser);
  //   } catch (exception) {
  //     alert("Invalid credentials", exception);
  //   }
  // };

  const itemsToShow = showAll
    ? items
    : items.filter(
        (item) =>
          item.latin.toLowerCase().includes(searchStr) ||
          item.common[0].toLowerCase().includes(searchStr)
      );

  const handleSearchChange = (event) => {
    setShowAll(false);
    setSearchStr(event.target.value.toLowerCase());
  };

  const loginForm = () => (
    <Togglable buttonLabel="show login">
      <LoginForm />
    </Togglable>
  );

  const itemList = () => (
    <div>
      <h1>Items</h1>
      <SearchBar searchStr={searchStr} onChange={handleSearchChange} />
      {itemsToShow.map((item) => (
        <Item key={item.id} item={item} found={loggedInUser.items.includes(item.id)} />
      ))}
    </div>
  );

  const handleLogout = () => {
    window.localStorage.removeItem("loggedInUser");
  };

  return (
    <div>
      <h1>Foradex</h1>
      {loggedInUser === null ? loginForm() : <h2>{loggedInUser.name} logged in</h2>}
      {loggedInUser !== null && <LogoutButton onClick={() => handleLogout()} />}
      {loggedInUser !== null && itemList()}
    </div>
  );
}

export default App;
