import React, { useState, useEffect } from "react";
import { backendLink } from "../utils";
import { CiSearch } from "react-icons/ci";
import { softwareEngineeringSkills } from "../utils";
import { IoMdClose } from "react-icons/io";

const AddSkills = (props) => {

    console.log(props.user, "props.currUser")
    // const [currUser,setCurrUser] = useState({});
    // console.log(currUser, "currUser")
    const [skill, setSkill] = useState("");
    const [skills, setSkills] = useState([]);
    const [findingSkills, setFindingSkills] = useState(false);
    const [filteredSkills, setFilteredSkills] = useState([]);

    const addSkill = (currWord) => {
        const currSkill = currWord;

        //write a code to check if the currSkill exists in filteredSkills
        const regex = new RegExp(currSkill, 'i'); // 'i' makes it case-insensitive
        // const isAvailableInFilteredSkills = filteredSkills.filter(item => regex.test(item));
        // console.log(isAvailableInFilteredSkills, "filteredSkillssssssss")
        const isAvailableInFilteredSkills = filteredSkills.some(item => item.toLowerCase() === currSkill.toLowerCase());
        console.log(isAvailableInFilteredSkills, "isAvailableInFilteredSkills")
        console.log(currSkill, "currSkill")

        console.log(currSkill, "currSkill")
        if (currSkill && !skills.includes(currSkill)) {
            setSkills([...skills, currSkill]);
            fetch(backendLink + "/userCRUD/updateSkills/addSkill", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: document.cookie.split("; ").find((row) => row.startsWith("LOGIN_INFO")).split("=")[1],
                },
                body: JSON.stringify({
                    username: props.user.username,
                    skill: currSkill,
                }),
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    console.log("data", data);
                })
                .catch((err) => {
                    console.log(err);
                });

            setSkill("");
        }
        setFindingSkills(false);
        window.location.reload();
    };


    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            console.log("Enter key pressed");
            console.log(skill, "skill")
            console.log(filteredSkills, "filteredSkillskeydown")
            addSkill(skill);
        }
        else if (event.key === "Tab" && filteredSkills.length > 0) {
            event.preventDefault();
            console.log("Tab key pressed");
            console.log(skill, "skill")
            console.log(filteredSkills, "filteredSkillskeydown")
            setSkill(filteredSkills[0]);
        }
        console.log("props.user.skills", props.user.skills)
        console.log("props.user.skills", props.user)
        // console.log("skills", skills)
    }

    const [showcaseSkills, setShowcaseSkills] = useState(false);

    const showSkills = (e) => {
        e.preventDefault()
        setShowcaseSkills(!showcaseSkills);
    }

    const removeSkill = (e) => {
        e.preventDefault();
        console.log(e.target.parentNode.innerText, "e.target.parentNode.innerText")
        const skill = e.target.parentNode.innerText;
        const category = e.target.parentNode.parentNode.firstChild.innerText;
        console.log(skill, "skill")
        console.log(category, "category")

        fetch(backendLink + "/userCRUD/updateSkills/removeSkill", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: document.cookie.split("; ").find((row) => row.startsWith("LOGIN_INFO")).split("=")[1],
            },
            body: JSON.stringify({
                username: props.user.username,
                skill: skill,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("data", data);
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });

    };

    const filterSkills = (e) => {
        console.log("filterSkill ran")
        setSkill(e.target.value);
        if (e.target.value == "") {
            setFindingSkills(false);
            return;
        }
        else {
            setFindingSkills(true);
        }
        const regex = new RegExp(e.target.value, 'i');
        const filteredSkills = softwareEngineeringSkills.filter(item => regex.test(item));
        setFilteredSkills(filteredSkills);
        console.log(filteredSkills, "filteredSkills")
    }

    return (
        <div className="border border-gray-500 rounded-xl p-4 flex flex-col gap-2 bg-secondary">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-serif">
                    Skillset
                </h1 >
                <div className="h-10 ">
                    <form className="flex gap-5 items-center bg-[#917595] p-2 rounded-lg border border-black ">
                        <input
                            type="text"
                            id="skill"
                            color="white"
                            placeholder="Add new skill"
                            className="focus:outline-none bg-[#917595] text-white placeholder:text-gray-200"
                            value={skill}
                            onChange={filterSkills}
                            onKeyDown={handleKeyDown}
                        />
                        <CiSearch className="text-black" />
                    </form>
                    {
                        findingSkills &&
                        <div className="mt-1 flex border flex-col relative border-black shadow-2xl shadow-[#917595] bg-[#665672] text-[#ffd19f] rounded-lg overflow-y-scroll z-10">

                            {filteredSkills.length > 0 &&
                                <div className="h-40">
                                    {filteredSkills.map((skill, index) => (
                                        <div
                                            key={index}
                                            onClick={(e) => addSkill(e.target.innerText)}
                                            className="p-2 border-b border-gray-400 w-full cursor-pointer hover:bg-[#1e1e2f]"
                                        >
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            }
                            {filteredSkills.length === 0 &&
                                <div className="p-2 w-full">
                                    No skills found
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
            <hr className="border border-t-0 border-gray-400 h-0" />
            <div className="flex flex-col flex-wrap gap-3">
                {
                    props?.user?.skills ?
                        Object.entries(props.user.skills).map(([category, skills]) => (
                            <div key={category} className="flex flex-col gap-1">
                                {/* <div> */}
                                <h3 className="font-medium text-[#ffce97]">{category}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills && skills.map((skill, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-1 pl-2 p-1 border border-textHeading font-light text-white rounded-md w-fit cursor-pointer"
                                        >
                                            {skill}
                                            <IoMdClose className="hover:bg-[#bf95b7] rounded-full p-1" size={25} onClick={removeSkill} />
                                        </div>
                                    ))}
                                </div>

                            </div>
                        )) :
                        <div>
                            <h3 className="font-bold">No skills added</h3>
                        </div>

                }
            </div>
        </div>
    );
};

export default AddSkills;
