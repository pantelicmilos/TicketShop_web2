import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaUserPlus, FaUserAlt } from "react-icons/fa";
import { RiLoginBoxFill } from "react-icons/ri";

const Layout = () => {
  const [isCustomer, setIsCustomer] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSalesman, setIsSalesman] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    setUserLoggedIn();
    setCustomer();
    setAdmin();
    setSalesman();
    setApproved();
  }, []);

  const setUserLoggedIn = () => {
    if (
      localStorage.getItem("id") !== null &&
      localStorage.getItem("username") !== null &&
      localStorage.getItem("role") !== null &&
      localStorage.getItem("token") !== null &&
      localStorage.getItem("status") !== null
    ) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  const setCustomer = () => {
    if (localStorage.getItem("role") == "Customer") {
      setIsCustomer(true);
    } else {
      setIsCustomer(false);
    }
  };

  const setAdmin = () => {
    if (localStorage.getItem("role") == "Admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const setSalesman = () => {
    if (localStorage.getItem("role") == "Salesman") {
      setIsSalesman(true);
    } else {
      setIsSalesman(false);
    }
  };

  const setApproved = () => {
    if (localStorage.getItem("status") == "Approved") {
      setIsApproved(true);
    } else {
      setIsApproved(false);
    }
  };

  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("status");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar sticky-top navbar-expand-sm navbar-black bg-black">
        <div
          className="collapse navbar-collapse"
          id="navbarNavDropdown"
          style={{ display: "inline-block" }}
        >
          <ul className="navbar-nav text-center">
            {!isLoggedIn && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/"
                  style={{
                    borderRightStyle: "solid",
                    borderRightWidth: "thick",
                    borderRightColor: "#ffcc00",
                    borderLeftStyle: "solid",
                    borderLeftWidth: "thick",
                    borderLeftColor: "#ffcc00",
                  }}
                >
                  <b className="text-warning">REGISTRACIJA</b>
                </Link>
              </li>
            )}
            {!isLoggedIn && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/login"
                  style={{
                    borderRightStyle: "solid",
                    borderRightWidth: "thick",
                    borderRightColor: "#ffcc00",
                  }}
                >
                  <b className="text-warning">ULOGUJ SE</b>
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/profile"
                  style={{
                    borderRightStyle: "solid",
                    borderRightWidth: "thick",
                    borderRightColor: "#ffcc00",
                    borderLeftStyle: "solid",
                    borderLeftWidth: "thick",
                    borderLeftColor: "#ffcc00",
                  }}
                >
                  <b className="text-warning">PROFIL</b>
                </Link>
              </li>
            )}
            {isLoggedIn && isSalesman && isApproved && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/addArticle"
                  style={{
                    borderRightStyle: "solid",
                    borderRightWidth: "thick",
                    borderRightColor: "#ffcc00",
                  }}
                >
                  <b className="text-warning">PROIZVOD</b>
                </Link>
              </li>
            )}
            {isLoggedIn && isCustomer && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/newOrder"
                  style={{
                    borderRightStyle: "solid",
                    borderRightWidth: "thick",
                    borderRightColor: "#ffcc00",
                  }}
                >
                  <b className="text-warning">DODAJ PORUDZBINU </b>
                </Link>
              </li>
            )}
            {isLoggedIn && (isCustomer || isSalesman) && isApproved && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/previousOrders"
                  style={{
                    borderRightStyle: "solid",
                    borderRightWidth: "thick",
                    borderRightColor: "#ffcc00",
                  }}
                >
                  <b className="text-warning">PRETHODNA PORUDZBINA</b>
                </Link>
              </li>
            )}
            {isLoggedIn && isAdmin && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/verification"
                  style={{
                    borderRightStyle: "solid",
                    borderRightWidth: "thick",
                    borderRightColor: "#ffcc00",
                  }}
                >
                  <b className="text-warning">VERIFIKACIJA</b>
                </Link>
              </li>
            )}
            {isLoggedIn && (isCustomer || isSalesman) && isApproved && (
              <Link
                className="nav-link"
                to="/newOrders"
                style={{
                  borderRightStyle: "solid",
                  borderRightWidth: "thick",
                  borderRightColor: "#ffcc00",
                }}
              >
                <b className="text-warning">NOVA PORUDZBINA</b>
              </Link>
            )}
            {isLoggedIn && isAdmin && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/allOrders"
                  style={{
                    borderRightStyle: "solid",
                    borderRightWidth: "thick",
                    borderRightColor: "#ffcc00",
                  }}
                >
                  <b className="text-warning">PORUDZBINA</b>
                </Link>
              </li>
            )}
          </ul>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav justify-content-end">
              {isLoggedIn && (
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                    onClick={logOut}
                    style={{
                      borderRightStyle: "solid",
                      borderRightWidth: "thick",
                      borderRightColor: "#ffcc00",
                      borderLeftStyle: "solid",
                      borderLeftWidth: "thick",
                      borderLeftColor: "#ffcc00",
                    }}
                  >
                    <b className="text-warning">IZLOGUJ SE</b>
                  </Link>
                </li>
              )}
              <Link className="nav-link" to="/*"></Link>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Layout;
