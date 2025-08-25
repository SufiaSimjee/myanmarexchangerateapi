const User = require("../UserSchema");

const Users = [
    new User({
        username: "admin",
        email: "admin@example.com",
        password: "admin123",
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
                await user.save();
                console.log(`Saved user: ${user.id}`);
            }
        } else {
            console.log("Users seeds already exist, skipping seeding.");
        }
    } catch (err) {
        console.error("Error seeding Users:", err);
    }
}

module.exports = seedUsers;
