import React, { useContext, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import UserDetailContext from "../../context/UserDetailContext";
import { useMutation } from "react-query";
import { createUser } from "../../utils/api";
// import useFavourites from "../../hooks/useFavourites";
// import useBookings from "../../hooks/useBookings";

const Layout = () => {

  // useFavourites()
  // useBookings()

  const { isAuthenticated, user, getAccessTokenWithPopup, getAcc } = useAuth0();
  // console.log("User Details: ", user)
  const { setUserDetails } = useContext(UserDetailContext);


  const { mutate } = useMutation({
    mutationKey: [user?.email],
    mutationFn: (token) => createUser(user?.email, token),
  });

  useEffect(() => {
    // ensure popre blocked
    const getTokenAndRegsiter = async () => {
      const res = await getAccessTokenWithPopup({
        authorizationParams: {
          audience: "https://dev-ejjut34veu43h66o.us.auth0.com/api/v2/",
          scope: "openid profile email",
        },
      });
      console.log("Response: ", res)
      localStorage.setItem("access_token", res);
      setUserDetails((prev) => ({ ...prev, token: res }));
      mutate(res)
    };
    console.log("isAuthenticated: ", isAuthenticated)
    isAuthenticated && getTokenAndRegsiter();
  }, [isAuthenticated]);

  return (
    <>
      <div style={{ background: "var(--black)", overflow: "hidden" }}>
        <Header />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
