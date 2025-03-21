import { Link } from "react-router-dom";
import logo from "../assets/logo_svg_white.svg";
import { useEffect, useState } from "react";
import { backendLink } from "../utils";

const Navbar = () => {
    const [currUser, setCurrUser] = useState({});
    const logoStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "2rem", // Adjust the height and width according to your logo size
        width: "2rem",
        animation: "rotation 1.5s linear infinite", // Adjust animation duration as needed
    };
    const keyframes = `
    @keyframes rotation {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `;

    useEffect(() => {
        try {
            const jwt = document.cookie
                .split("; ")
                .find((row) => row.startsWith("LOGIN_INFO"))
                .split("=")[1];
        } catch (err) {
            const path = window.location.pathname;
            if (path !== "/login" && path !== "/signup" && path !== "/") {
                window.location.href = "/login";
            }
        }
        try {
            fetch(backendLink + "/auth/getLoggedInUser", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: document.cookie
                        .split("; ")
                        .find((row) => row.startsWith("LOGIN_INFO"))
                        .split("=")[1],
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    setCurrUser(data.user);
                    console.log(data);
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (err) {
            console.log("err", err);
        }
    }, []);

    const [showProfileDropDown, setShowProfileDropDown] = useState(false);

    const toggleShowProfileDropDown = () => {
        setShowProfileDropDown(!showProfileDropDown);
    }

    return (
        <div className="bg-[#1e1e2f] font-bricolage fixed w-full text-[#fdb461]">
            <div className="flex justify-between p-3 ">
                <div className="flex items-center">
                    <div style={logoStyle}>
                        <style>{keyframes}</style>
                        <img src={logo} alt="Logo" />
                    </div>
                    <p className="text-lg absolute left-14">Match Maker Or What</p>
                </div>
                <div className="flex">
                    <a href="/" className="ml-10 text-lg hover:text-gray-400">
                        Home
                    </a>
                    <a href="/peoples" className="ml-10 text-lg hover:text-gray-400">
                        Peoples
                    </a>
                    <a href="/chats" className="ml-10 text-lg hover:text-gray-400">
                        Chat Room
                    </a>
                    <a href="https://github.com/Devvrat1010/teamMatch-htf-4.0" className="ml-10 text-lg hover:text-gray-400">
                        Github
                    </a>
                </div>
                <div className="flex">
                    {currUser.username && (
                        <div>
                            <div className="flex items-center gap-2 " onClick={toggleShowProfileDropDown}>
                                <img src={currUser.image} className="h-8 w-8 rounded-full hover:border border-white cursor-pointer" alt="" />
                                <button className="text-lg" onClick={toggleShowProfileDropDown}>
                                    {currUser.username}
                                </button>
                            </div>
                            {
                                showProfileDropDown && (
                                    <div className="absolute right-3 flex flex-col border font-light bg-secondary  border-black rounded-md">
                                        <Link to="/profilePage" className="text-lg hover:text-textBody hover:bg-tertiary px-2 py-1 rounded">
                                            Profile
                                        </Link>

                                        <Link to="/logout" className="text-lg hover:text-textBody hover:bg-tertiary px-2 py-1 rounded">
                                            Log Out
                                        </Link>
                                    </div>
                                )
                            }
                        </div>
                        // <Link to="/profilePage" className="ml-10 text-lg hover:text-gray-400">
                        //     {currUser.username}
                        // </Link>
                    )}

                    {!currUser.username && (
                        <div>
                            <Link to="/signup" className="ml-10 text-lg hover:text-gray-400">
                                Sign Up
                            </Link>
                            <Link to="/login" className="ml-10 text-lg hover:text-gray-400">
                                Log In
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <hr className="dark:text-black-900" />
            </div>
        </div>
    );
};

export default Navbar;
