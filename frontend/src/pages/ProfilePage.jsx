import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfilePic from "../assets/pfp.png";
import TeamDetails from "../components/TeamDetails";
import AddSkills from "../components/AddSkills";
import EditProfile from "../components/editProfile";
import { useNavigate } from "react-router-dom";
import { backendLink } from "../utils";

export default function ProfilePage() {
    const [showForm, setShowForm] = useState(false);

    const [reader, setReader] = useState();

    const [hackathon, setHackathon] = useState({
        name: "",
        website: "",
        venue: "",
        teamSize: "",
    });

    const [currUser, setCurrUser] = useState({});

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setHackathon({ ...hackathon, [event.target.name]: event.target.value });
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(hackathon); // You can replace this with your own logic to handle the form submission
    };

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

    //   return (
    const createHackathon = () => {
        fetch(backendLink + "/hackathonsCRUD/createHackathon", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: currUser.username,
                name: hackathon.name,
                link: hackathon.website,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex gap-7 max-h-screen p-5 pt-20">
                <div className="rounded-xl w-1/4 flex flex-col flex-grow gap-2 items-center">
                    <div className="flex flex-col items-center gap-2 bg-green-200 w-full rounded-xl p-4 h-fit">
                        <div className="object-contain h-44 w-44 rounded-full overflow-hidden">
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
                        <h1 className="text-3xl font-bold tracking-wide text-center">{currUser.fullName}</h1>
                        <p className="text-lg whitespace-pre-line text-center">{currUser.email}</p>
                    </div>

                    <div className="w-full flex gap-2">
                        <button className="bg-green-200 hover:bg-green-500 text-black font-bold py-2 px-4 rounded-xl w-1/2" onClick={() => {
                            setEdit(!edit);
                        }}>
                            {
                                edit ? "Done" : "Edit Profile"
                            }
                        </button>

                        <button className="bg-green-200 hover:bg-green-500 text-black font-bold py-2 px-4 rounded-xl w-1/2" onClick={logout}>
                            Log Out
                        </button>
                    </div>
                    <div className="border border-gray-500 w-full rounded-xl p-2 flex flex-col gap-2 overflow-hidden">
                        <h1 className="text-2xl font-bold">About Me</h1>
                        <hr className="border border-t-0 border-gray-400" />
                        <div className="text-lg whitespace-pre-line overflow-auto ">
                            {currUser.bio ? currUser.bio : "Update Bio..."}
                        </div>
                    </div>

                </div>

                <div className="rounded-xl w-3/4 h-fit">
                    <AddSkills user={currUser} />
                    <div className="mt-4">
                        <button
                            className="bg-green-900 hover:bg-green-700 text-white rounded-xl p-2 px-3"
                            onClick={() => setShowForm(!showForm)}
                        >
                            New Hackathon
                        </button>
                        {showForm && (
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={hackathon.name}
                                    onChange={handleInputChange}
                                    className="border-2 border-black rounded-xl p-2 w-full mb-2 mt-7"
                                />
                                <input
                                    type="text"
                                    name="website"
                                    placeholder="Website"
                                    value={hackathon.website}
                                    onChange={handleInputChange}
                                    className="border-2 border-black rounded-xl p-2 w-full mb-2"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white rounded-xl p-2 px-3 mt-2"
                                    onClick={createHackathon}
                                >
                                    Submit Hackathon
                                </button>
                            </form>
                        )}
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
