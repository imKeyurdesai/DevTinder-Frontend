import React, { useCallback, useEffect } from "react";
import NavBar from "./NavBar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);

  const fetchUser = useCallback(async () => {
    try {
      const user = await axios.get(
        BASE_URL + "/profile/view",

        {
          withCredentials: true,
        },
      );

      dispatch(addUser(user.data?.data ?? user.data));
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        return navigate("/login");
      }
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!userData) {
      fetchUser();
      return;
    }

    if (location.pathname === "/" || location.pathname === "/login") {
      navigate("/feed");
    }
  }, [userData, fetchUser, location.pathname, navigate]);

  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Body;
