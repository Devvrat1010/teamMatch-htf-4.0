import React, { useState } from 'react';
import ProfilePic from "../assets/pfp.png";
import { FiUserPlus } from "react-icons/fi";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { CiTwitter } from "react-icons/ci";
import { FiMessageCircle } from "react-icons/fi";
import { backendLink } from "../utils";

// ... (import statements remain the same)

const ProfileCard = ({ user, currUser }) => {

    const [currSelectedUser, setCurrSelectedUser] = useState("")
    console.log(user, "userThisss")
    console.log(currUser, "currUserThisss")

    const addFriend = (e) => {
        const currElement = e.target.parentElement.parentElement.parentElement.children[0].innerText
        console.log(currElement, "curele")
        console.log(currUser.username, "currUser")

        fetch(backendLink + '/userCRUD/addFriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: currUser.username,
                friend: currElement
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                alert("friend added")
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }


    return (
        <div className="bg-white rounded-lg p-4 shadow-lg flex flex-col justify-between">
            <div className='flex h-full justify-between'>
                <div className="flex flex-col items-center w-1/3">
                    {user.image ? (
                        <img
                            src={user.image}
                            alt="Profile"
                            className="rounded-full h-20 w-20"
                        />
                    ) : (
                        <img
                            src={ProfilePic}
                            alt="Profile"
                            className="rounded-full h-20 w-20"
                        />
                    )}
                    <p className="text-xl font-bold text-center">{user.fullName}</p>
                </div>
                <div className="text-balance grid grid-cols-auto-fit gap-2 w-2/3 py-2">
                    {user.skills?.map((skill, index) => (
                        <span
                            key={index}
                            className="bg-gray-200 shadow rounded py-1 px-2 border-gray-300 hover:border-gray-500 text-center h-fit"
                        >
                            {skill.length > 10 ? `${skill.substring(0, 10)}...` : skill}
                        </span>
                    ))}
                </div>
            </div>

            <style>
                {`
        .grid-cols-auto-fit {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    }
    `}
            </style>

            <div className="flex justify-between">
                <button className="hover:bg-green-200 text-black rounded-full p-2 flex items-center" onClick={addFriend}>
                    <FiUserPlus />
                </button>
                <button className="hover:bg-green-200 text-black rounded-full p-2 flex items-center">
                    <FaLinkedin />
                </button>
                <button className="hover:bg-green-200 text-black rounded-full p-2 flex items-center">
                    <FaGithub />
                </button>
                <button className="hover:bg-green-200 text-black rounded-full p-2 flex items-center">
                    <CiTwitter />
                </button>
            </div>
        </div>
    );
};

export default ProfileCard;
