const User = require("../UserSchema");

const Users = [
    new User({
        username: process.env.DEFAULT_ADMIN_USERNAME,
        email: "defaultadmin@example.com",
        password: process.env.DEFAULT_ADMIN_PASSWORD,
        role: "admin"
    }),
    new User({
        username: "admin2",
        email: "admin2@example.com",
        password: "admin2123",
        role: "admin"
    }),
    new User({
        username: "john",
        email: "john@example.com",
        password: "john123",
        role: "user"
    }),
    new User({
        username: "jane",
        email: "jane@example.com",
        password: "jane123",
        role: "user"
    })
];

async function seedUsers() {
    try {
        const documentCount = await User.countDocuments();

        if (documentCount < 1) {
            for (const user of Users) {
                await user?.save();
                console.log(`Saved user: ${user?._id}`);
            }
        } else {
            console.log("Users seeds already exist, skipping seeding.");
        }
    } catch (err) {
        console.error("Error seeding Users:", err);
    }
}

module.exports = seedUsers;
