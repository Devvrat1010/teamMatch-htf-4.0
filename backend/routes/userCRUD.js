const express = require("express");
const router = express.Router();
const AllUsers = require("../models/users");
const ChatRooms = require("../models/chatRooms");
const softwareEngineeringSkills = require("../utils")
const temp = require('../utils');
const skillToCategory = require("../test")

router.post("/addFriend", async (req, res) => {
    try {

        const username = req.body.username;
        const friendRequest = req.body.friend;

        const user = await AllUsers.findOne({ username: username });
        const friend = await AllUsers.findOne({ username: friendRequest });
        const roomString = username < friendRequest ? username + friendRequest : friendRequest + username;

        if (friend) {
            if (user.friends.includes(friend.username)) {
                res.status(400).json({ error: "Already friends" });
            }
            else {
                user.friends.push(friend.username);
                await user.save();

                friend.friends.push(username);
                await friend.save();

                const chatRoom = await ChatRooms.create({
                    user1: username,
                    user2: friendRequest,
                    roomCode: roomString,
                });

                res.status(200).json({ message: "Friend added" });
            }
        } else {
            res.status(400).json({ error: "Friend not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "server side error" });
    }
});

const binarySearch = (arr, target) => {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return true;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return false;
};

router.put("/updateSkills/addSkill", async (req, res) => {
    try {
        const username = req.body.username;
        const skill = req.body.skill;

        const user = await AllUsers.findOne({ username: username });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        if (!user.skills) {
            user.skills = {}; // Ensure skills is an object
        }

        let skillAdded = false; // Track if skill was actually added

        for (const category in softwareEngineeringSkills) {
            // console.log("category", category)
            // console.log("softwareEngineeringSkills[category]", softwareEngineeringSkills[category])
            if (binarySearch(softwareEngineeringSkills[category], skill)) {
                if (!user.skills[category]) user.skills[category] = [];
                if (!binarySearch(user.skills[category], skill)) {
                    user.skills[category].push(skill);
                    skillAdded = true; // Mark that a skill was added
                }
            }
        }

        if (!skillAdded) {
            return res.status(400).json({ error: "Skill does not match any category" });
        }

        user.markModified("skills"); // Explicitly mark skills as modified
        await user.save();

        res.status(200).json({ message: "Skill added successfully", user });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Server-side error" });
    }
});

router.delete("/updateSkills/removeSkill", async (req, res) => {
    try {
        const username = req.body.username;
        const skill = req.body.skill;

        const user = await AllUsers.findOne({
            username:
                username
        });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        if (!user.skills) {
            return res.status(400).json({ error: "User has no skills" });
        }

        let skillRemoved = false; // Track if skill was actually removed
        console.log("user skills", user.skills)
        for (const category in user.skills) {
            console.log("category", category)
            console.log("user skills", user.skills[category])
            if (user.skills[category].includes(skill)) {
                console.log("skill found", user.skills[category])
                user.skills[category] = user.skills[category].filter((s) => s !== skill);
                skillRemoved = true; // Mark that a skill was removed
            }
            if (user.skills[category].length === 0) {
                delete user.skills[category];
            }
            // console.log("user skills", user
        }

        user.markModified("skills"); // Explicitly mark skills as modified
        await user.save();

        if (!skillRemoved) {
            return res.status(400).json({ error: "Skill not found" });
        }

        console.log("skill removed", user)

        res.status(200).json({ message: "Skill removed successfully", user });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Server-side error" });
    }
});


router.get("/getUserById/:username", async (req, res) => {
    try {
        const user = await AllUsers.find({ username: req.params.username });
        console.log("got user by id")
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(400).json({ error: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "server side error" });
    }
}
);

router.get("/getUsers", async (req, res) => {
    try {
        // console.log("get userssssss")
        const users = await AllUsers.find()
        // console.log(users)
        res.status(200).json(users)
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ error: "server side error" })
    }
})

router.post("/removeFriend", async (req, res) => {
    try {
        const username = req.body.username;
        const friendRequest = req.body.friend;

        const user = await AllUsers.findOne({
            username
        });
        const friend = await AllUsers.findOne({
            username:
                friendRequest
        });

        if (friend) {
            if (user.friends.includes(friend.username)) {
                user.friends = user.friends.filter((friend) => friend !== friendRequest);
                await user.save();

                friend.friends = friend.friends.filter((friend) => friend !== username);
                await friend.save();

                res.status(200).json({ message: "Friend removed" });
            } else {
                res.status(400).json({ error: "Not friends" });
            }
        } else {
            res.status(400).json({ error: "Friend not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "server side error" });
    }
}
);

router.post("/updateUser", async (req, res) => {
    try {
        const { username, bio, fullName, image } = req.body;
        console.log(username, bio, fullName, "username, image, bio")
        const user = await AllUsers.findOne({ username: username });

        if (user) {
            if (bio !== "") {
                user.bio = bio;
            }
            if (image !== "") {
                user.image = image;
            }
            if (fullName !== "") {
                user.fullName = fullName;
            }
            await user.save();

            res.status(200).json({ message: "User details updated" });
        }
        else {
            res.status(400).json({ error: "User not found" });
        }


    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "server side error" });
    }
});

router.patch("/deleteDuplicate", async (req, res) => {
    try {
        const users = await AllUsers.find();
        // const db = require("../models/db"); // Import the appropriate module that provides the `db` object

        const check = await AllUsers.aggregate(
            [
                {
                    $group: {
                        _id: "$username",
                        dups: { $push: "$_id" },
                        count: { $sum: 1 },
                    },
                },
                { $match: { count: { $gt: 1 } } },
            ],
            { allowDiskUse: true }
        )
        console.log(check, "check")
        check.forEach(function (doc) {
            doc.dups.shift();
            AllUsers.deleteMany({ _id: { $in: doc.dups } });
        });

        res.status(200).json({ message: "Duplicates removed" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "server side error" });
    }
});
router.get("/migrateSkillsList", async (req, res) => {
    try {
        const users = await AllUsers.find();

        for (const user of users) {
            const skillsList = user.skills; // Get existing skills
            console.log(skillsList, "skills");

            user.skills = {}; // Reset skills as an object

            for (const skill of skillsList) {
                try {
                    let skillAdded = false; // Track if skill was added

                    for (const category in softwareEngineeringSkills) {
                        if (binarySearch(softwareEngineeringSkills[category], skill)) {
                            if (!user.skills[category]) user.skills[category] = [];
                            if (!binarySearch(user.skills[category], skill.toLowerCase())) {
                                user.skills[category].push(skill);
                                skillAdded = true; // Mark that a skill was added
                            }
                        }
                    }

                    // No need to return an error response inside the loop
                } catch (error) {
                    console.error("Error processing skill:", skill, error);
                }
            }

            user.markModified("skills"); // Ensure skills update is saved
            await user.save(); // Wait for the save operation
        }

        res.status(200).json({ message: "Skills migrated successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server side error" });
    }
});


module.exports = router;