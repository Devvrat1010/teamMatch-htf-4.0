import { useState } from "react";
import { backendLink } from "../utils";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

export default function CreateNewHackathon(props) {
    const showForm = props.showForm;
    const setShowForm = props.setShowForm;
    const currUser = props.currUser;

    const [hackathon, setHackathon] = useState({
        name: "",
        website: "",
        venue: "",
        teamSize: "",
    });

    const handleInputChange = (event) => {
        setHackathon({ ...hackathon, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(hackathon); // You can replace this with your own logic to handle the form submission
    };

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
        setShowForm(false);
    }

    return (
        <form onSubmit={handleSubmit} className={`absolute right-0 top-0 bg-secondary h-full w-1/3 p-4 flex flex-col gap-4 transition-all duration-300 ease-in-out border-l border-textHeading ${showForm ? "translate-x-0 " : "translate-x-full "
            }`}>
            <div className="w-full flex justify-between items-center" onClick={() => setShowForm(false)}>
                <p className="text-xl font-serif font-semibold">Create Hackathon</p>
                <MdOutlineKeyboardDoubleArrowRight className="hover:bg-tertiary rounded-full cursor-pointer" size={35} />
            </div>
            <hr />
            <input
                type="text"
                name="name"
                placeholder="Name"
                value={hackathon.name}
                onChange={handleInputChange}
                className="border-2 border-textHeading p-2 rounded-xl outline-none"
            />
            <input
                type="text"
                name="website"
                placeholder="Website"
                value={hackathon.website}
                onChange={handleInputChange}
                className="border-2 border-textHeading p-2 rounded-xl outline-none"
            />
            <button
                type="submit"
                className="border-2 border-textHeading p-2 rounded-xl bg-tertiary hover:bg-quaternary font-semibold text-textBody"
                onClick={createHackathon}
            >
                Submit Hackathon
            </button>
        </form>
    )
}