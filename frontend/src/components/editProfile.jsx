import { useState } from "react";
import { backendLink } from "../utils";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

export default function EditProfile(props) {
    const currUser = props.currUser;
    const [reader, setReader] = useState();

    const [updatedDetails, setUpdatedDetails] = useState({
        fullName: "",
        description: "",
        image: "",
    });

    const uploadImage = (e) => {
        const reader = new FileReader();
        console.log(e.target.files[0]);
        reader.onload = (e) => {
            setUpdatedDetails({ ...updatedDetails, image: e.target.result });
        };
        const f = e.target.files[0];
        const check = reader.readAsDataURL(f);
    };

    const edit = props.edit;
    const setEdit = props.setEdit;

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

    return (
        <div
            className={`absolute right-0 top-0 bg-secondary h-full w-1/3 p-4 flex flex-col gap-3 transition-all duration-300 ease-in-out border-l border-textHeading ${edit ? "translate-x-0 " : "translate-x-full "
                }`}
        >
            {/* Close Button */}
            <div className="w-full flex justify-between items-center" onClick={() => setEdit(!edit)}>
                <p className="text-xl font-serif font-semibold">Edit Profile</p>
                <MdOutlineKeyboardDoubleArrowRight className="hover:bg-tertiary rounded-full cursor-pointer" size={35} />
            </div>
            <hr />

            <input
                type="text"
                className="border-2 border-textHeading p-2 rounded-xl"
                placeholder={currUser.fullName}
                onChange={(e) => {
                    setUpdatedDetails({ ...updatedDetails, fullName: e.target.value });
                }}
            />

            <textarea
                name="about"
                id="about"
                cols="30"
                rows="10"
                className="border-2 border-textHeading p-2 rounded-xl w-full"
                placeholder="About me..."
                value={updatedDetails.description || ""}
                onChange={(e) => {
                    setUpdatedDetails({ ...updatedDetails, description: e.target.value });
                }}
            ></textarea>

            {/* Profile Picture Upload & Save Button */}
            <div className="flex gap-2 text-textBody">
                <button className="rounded-md w-fit">
                    <div className="relative inline-block">
                        <label
                            htmlFor="file-upload"
                            className="flex items-center w-full gap-2 px-4 py-2 bg-tertiary font-semibold rounded-lg cursor-pointer transition border-2 border-transparent"
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
                </button>

                <button
                    type="submit"
                    className=" bg-tertiary flex-grow hover:bg-quaternary font-bold py-2 px-4 rounded-lg"
                    onClick={saveDetails}
                >
                    Save
                </button>
            </div>
        </div>

    )
}