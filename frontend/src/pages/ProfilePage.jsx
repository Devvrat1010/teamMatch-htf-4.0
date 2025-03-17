import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfilePic from "../assets/pfp.png";
import TeamDetails from "../components/TeamDetails";
import AddSkills from "../components/AddSkills";
import { useNavigate } from "react-router-dom";
import { backendLink } from "../utils";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowDropright } from "react-icons/io";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

export default function ProfilePage() {
    const [showForm, setShowForm] = useState(false);

    const [updatedDetails, setUpdatedDetails] = useState({
        fullName: "",
        description: "",
        image: "",
    });
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

    const saveDetails = () => {
        console.log(updatedDetails, "updatedDetails");
        fetch(backendLink + "/userCRUD/updateUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: currUser.username,
                image: updatedDetails.image,
                bio: updatedDetails.description,
                fullName: updatedDetails.fullName,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                // navigate("/profile");
                window.location.reload();

                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const uploadImage = (e) => {
        reader.onload = (e) => {
            setUpdatedDetails({ ...updatedDetails, image: e.target.result });
        };
        // console.log(e.target.files[0],"file")
        const f = e.target.files[0];
        const check = reader.readAsDataURL(f);
        console.log(check, "check");
    };
    const [edit, setEdit] = useState(false);
    const editDetails = () => {
        setEdit(!edit);

        // You can replace this with your own logic to handle the form submission
        console.log(edit, "Edit details");
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
        <div className="h-full flex flex-col">
            <Navbar />
            <div className="flex h-full gap-7 p-5">
                <div className="rounded-xl w-1/4 flex flex-col flex-grow gap-2 items-center">
                    <div className="flex flex-col items-center bg-green-200 w-full rounded-xl p-4">
                        <div className="h-44 object-contain">
                            {
                                currUser.image ? <img
                                    src={currUser.image}
                                    className="cursor-pointer rounded-full h-44 "

                                    alt="Profile"
                                /> :
                                    <img
                                        src={ProfilePic}
                                        className="rounded-3xl cursor-pointer"
                                        style={{ height: "250px" }}
                                        alt="Profile"
                                    />
                            }
                        </div>
                        <h1 className="text-3xl font-bold tracking-wide mt-10">{currUser.fullName}</h1>
                        <p className="mt-2 text-lg whitespace-pre-line">{currUser.email}</p>
                    </div>
                    {/* {
                        currUser.bio ? <p className="mt-2 text-lg">{currUser.bio}</p> : <p className="mt-2 text-lg">Update Bio...</p>
                    } */}

                    <div className="w-full flex gap-2">
                        <button className="bg-green-200 hover:bg-green-500 text-black font-bold py-2 px-4 rounded-xl w-1/2" onClick={editDetails}>
                            {
                                edit ? "Done" : "Edit Profile"
                            }
                        </button>

                        <button className="bg-green-200 hover:bg-green-500 text-black font-bold py-2 px-4 rounded-xl w-1/2" onClick={logout}>
                            Log Out
                        </button>
                    </div>
                    <div className="border max-h-screen border-gray-500 w-full rounded-xl p-2 flex flex-col gap-2">
                        <h1 className="text-2xl font-bold">About Me</h1>
                        <hr className="border border-t-0 border-gray-400" />
                        <div className="text-lg whitespace-pre-line overflow-auto flex-grow min-h-0">
                            {currUser.bio ? currUser.bio : "Update Bio..."}
                        </div>
                    </div>
                </div>

                <div className="rounded-xl w-3/4">
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
                    {
                        edit &&
                        <div className="absolute right-0 top-0 bg-green-200 h-full w-1/3  p-4 flex flex-col gap-2">
                            <div className="w-full flex justify-end" onClick={editDetails}>
                                <MdOutlineKeyboardDoubleArrowRight className="hover:bg-green-400 p-1 rounded-full cursor-pointer" size={30} />
                            </div>

                            <input type="text" className="border border-black p-2 rounded-xl" placeholder={currUser.fullName} onChange={
                                (e) => {
                                    setUpdatedDetails({ ...updatedDetails, fullName: e.target.value })
                                }
                            } />
                            {/* <input type="textarea" className="border border-black p-2 rounded-full" placeholder="New Name..."/> */}
                            <textarea
                                name="about"
                                id="about"
                                cols="30"
                                rows="10"
                                className="border border-black p-2 rounded-xl w-full"
                                placeholder="About me..."
                                value={updatedDetails.description || ""}
                                onChange={(e) => {
                                    const newText = e.target.value;
                                    console.log(newText, "e.target.value");
                                    setUpdatedDetails({ ...updatedDetails, description: newText });
                                }}
                            ></textarea>


                            <div className="flex gap-2">
                                <button className="rounded-md w-fit">
                                    <div className="relative inline-block">
                                        <label
                                            htmlFor="file-upload"
                                            className="flex items-center w-full gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg cursor-pointer transition hover:bg-green-700 active:bg-green-800 border-2 border-transparent"
                                        >
                                            📷 Update Profile Picture
                                        </label>
                                        <input
                                            id="file-upload"
                                            onChange={uploadImage}
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    {/* <input type="file" id="files" className="hidden cursor-pointer" accept="image/*" onChange={uploadImage}/>
                                <label for="files" className="cursor-pointer w-full">Add a profile pic ?</label> */}
                                </button>

                                <button type="submit" className="text-white bg-green-600 flex-grow hover:bg-green-500 font-bold py-2 px-4 rounded-lg" onClick={saveDetails}>
                                    Save
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>

    );
}
