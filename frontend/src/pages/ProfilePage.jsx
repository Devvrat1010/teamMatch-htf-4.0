import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfilePic from "../assets/pfp.png";
import TeamDetails from "../components/TeamDetails";
import AddSkills from "../components/AddSkills";
import EditProfile from "../components/editProfile";
import { useNavigate } from "react-router-dom";
import { backendLink } from "../utils";
import CreateNewHackathon from "../components/createNewHackathon";

export default function ProfilePage() {
    const [showForm, setShowForm] = useState(false);

    const [reader, setReader] = useState();

    const [currUser, setCurrUser] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the user's details
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

        setReader(new FileReader());
    }, []);


    const [edit, setEdit] = useState(false);
    const editDetails = () => {
        setEdit(!edit);
    };



    const logout = () => {
        document.cookie =
            "LOGIN_INFO=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/login");
    };

    return (
        <div className="h-screen flex flex-col bg-screenBG text-[#fdb461]">
            <Navbar />
            <div className="flex gap-7 max-h-screen p-5 pt-20">
                <div className="rounded-xl w-1/4 flex flex-col flex-grow gap-2 items-center">
                    <div className="flex flex-col items-center gap-2 bg-[#403950] w-full rounded-xl text-[#fdb461] p-4 h-fit">
                        <div className="object-contain h-44 w-44 rounded-full overflow-hidden ">
                            {
                                currUser.image ? <img
                                    src={currUser.image}
                                    className="cursor-pointer w-full h-full object-cover"
                                    alt="Profile"
                                /> :
                                    <img
                                        src={ProfilePic}
                                        className="rounded-3xl cursor-pointer w-full h-full object-cover"
                                        style={{ height: "250px" }}
                                        alt="Profile"
                                    />
                            }
                        </div>
                        <h1 className="text-3xl font-medium tracking-wide text-center font-serif">{currUser.fullName}</h1>
                        {/* <p className="text-lg whitespace-pre-line text-center">{currUser.email}</p> */}
                    </div>

                    <div className="w-full flex gap-2 text-[#ffc88a]">
                        <button className="bg-[#665672] hover:bg-[#917595] text- font-bold py-2 px-4 rounded-xl w-1/2" onClick={() => {
                            setEdit(!edit);
                        }}>
                            {
                                edit ? "Done" : "Edit Profile"
                            }
                        </button>

                        <button className="bg-[#665672] hover:bg-[#917595] text- font-bold py-2 px-4 rounded-xl w-1/2" onClick={logout}>
                            Log Out
                        </button>
                    </div>
                    <div className="border border-gray-500 w-full rounded-xl flex flex-col gap-2 overflow-hidden bg-[#403950]">
                        <h1 className="text-2xl font-bold font-serif px-2 pt-2">About Me</h1>
                        <hr className="border border-t-0 h-0 border-gray-400" />
                        <div className="text-lg text-white whitespace-pre-line overflow-auto font-poppins px-3 p-2">
                            {currUser.bio ? currUser.bio : "Update Bio..."}
                        </div>
                    </div>

                </div>

                <div className="rounded-xl w-3/4 h-fit">
                    <AddSkills user={currUser} />
                    <div className="mt-4">
                        <button
                            className="bg-tertiary hover:bg-quaternary font-semibold text-textBody text- rounded-xl py-3 px-5"
                            onClick={() => setShowForm(!showForm)}
                        >
                            New Hackathon
                        </button>

                        <CreateNewHackathon
                            showForm={showForm}
                            setShowForm={setShowForm}
                            currUser={currUser}
                        />
                    </div>
                    <EditProfile
                        currUser={currUser}
                        edit={edit}
                        setEdit={setEdit}

                    />
                </div>
            </div>
        </div>

    );
}
