import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { CiBookmarkPlus } from "react-icons/ci";
import { CiBookmarkCheck } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import ProfileCard from "../components/ProfileCard";
import { Link } from "react-router-dom";
import { backendLink } from "../utils";

export default function Peoples() {

    const [hackathons, setHackathons] = useState([]);
    const [currUser, setCurrUser] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [selectedHackathon, setSelectedHackathon] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        fetch(backendLink + "/auth/getLoggedInUser", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: document.cookie.split("; ").find((row) => row.startsWith("LOGIN_INFO")).split("=")[1],
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setCurrUser(data.user);
            })
            .catch((err) => {
                console.log(err);
            });

        fetch(backendLink + "/hackathonsCRUD/getAllHackathons")
            .then((response) => response.json())
            .then((data) => {
                setHackathons(data);
                // console.log(data, "hackathons");
            });

        fetch(backendLink + "/userCRUD/getUsers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setAllUsers(data);
                setFilteredUsers(data);
                // console.log(data, "allUsers");
            })
            .catch((err) => {
                console.log(err);
            });

    }, []);


    const addHackathonInterested = (e) => {

        const currElement = e.target.parentElement.parentElement.children[0].innerText

        fetch(backendLink + '/hackathonsCRUD/updateHackathon', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: currUser.username,
                hackName: currElement
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const [searchedUser, setSearchedUser] = useState("");

    const searching = (e) => {
        if (e.target.value === "") {
            setFilteredUsers(allUsers);
            return;
        }
        console.log(allUsers, "allUsers");
        setSearchedUser(e.target.value);
        const temp = allUsers.filter((user) => user.skills.map((skill) => skill.toLowerCase()).includes(e.target.value.toLowerCase()));
        setFilteredUsers(temp);
        console.log(temp, "temp");
    }



    return (
        // <div className="bg-green-100 h-screen overflow-y-scroll">
        //     <Navbar />
        //     <div className="flex gap-7 flex-grow pb-10">
        //         <div className="bg-white mt-10 ml-7 rounded-3xl w-1/3 overflow-y-scroll flex-grow">
        //             <div className="p-5">
        //                 <h1 className="text-2xl font-bold tracking-wide mb-8">
        //                     Hey There! Browse Your Hackathons{" "}
        //                 </h1>
        //                 {hackathons.map((hackathon, i) => (
        //                     <div
        //                         key={i}
        //                         className="border-2 border-green-800 rounded-xl p-2 w-full mb-2"
        //                     >
        //                         <div className="flex justify-between items-center">
        //                             <Link to={hackathon.link} target="blank">
        //                                 <h3 className="hover:text-green-900">{hackathon.name} </h3>
        //                             </Link>
        //                             <button onClick={addHackathonInterested}>
        //                                 <CiBookmarkPlus size={20} />
        //                             </button>
        //                         </div>
        //                     </div>
        //                 ))}
        //             </div>
        //         </div>
        //         <div className="mt-10 rounded-xl w-full pr-10 overflow-y-scroll flex-grow">
        //             <div className="flex border-black rounded-2xl mb-10">
        //                 <input
        //                     className="p-3 flex-grow border-0 outline-none	"
        //                     type="text"
        //                     placeholder="Search for your mate"
        //                     onChange={searching}
        //                 />
        //                 <div className="bg-white p-3 	">
        //                     <FiSearch size={24} />
        //                 </div>
        //             </div>
        //             <div className="h-full grid grid-cols-3 gap-10 overflow-y-scroll ">
        //                 {filteredUsers.map((user, i) => (
        //                     user.username !== currUser.username &&
        //                     <ProfileCard user={user} currUser={currUser} key={i} />
        //                 ))}
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="bg-green-100 h-screen flex flex-col">
            <Navbar />
            <div className="flex gap-7 flex-grow pb-10 overflow-hidden">
                {/* Left Sidebar - Takes only necessary space */}
                <div className="bg-white mt-10 ml-7 rounded-3xl w-1/4 overflow-y-scroll flex-shrink-0">
                    <div className="p-5">
                        <h1 className="text-2xl font-bold tracking-wide mb-8">
                            Hey There! Browse Your Hackathons{" "}
                        </h1>
                        {hackathons.map((hackathon, i) => (
                            <div
                                key={i}
                                className="border-2 border-green-800 rounded-xl p-2 w-full mb-2"
                            >
                                <div className="flex justify-between items-center">
                                    <Link to={hackathon.link} target="blank">
                                        <h3 className="hover:text-green-900">{hackathon.name} </h3>
                                    </Link>
                                    <button onClick={addHackathonInterested}>
                                        <CiBookmarkPlus size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content - Expands to Fill Remaining Height */}
                <div className="mt-10 rounded-xl w-full pr-10 flex flex-col flex-grow overflow-hidden">
                    {/* Search Bar */}
                    <div className="flex border-black rounded-2xl mb-4">
                        <input
                            className="p-3 flex-grow border-0 outline-none"
                            type="text"
                            placeholder="Search for your mate"
                            onChange={searching}
                        />
                        <div className="bg-white p-3">
                            <FiSearch size={24} />
                        </div>
                    </div>

                    {/* Profiles Grid - Expands Fully */}
                    <div className="flex-grow grid grid-cols-3 gap-10 overflow-y-auto">
                        {filteredUsers.map(
                            (user, i) =>
                                user.username !== currUser.username && (
                                    <ProfileCard user={user} currUser={currUser} key={i} />
                                )
                        )}
                    </div>
                </div>
            </div>
        </div>


    );
};

