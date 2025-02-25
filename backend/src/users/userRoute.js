const express = require("express");
const User = require("./UserModel");
const generateToken = require("../middleware/generateToken");
const router = express.Router();

// Register API endpoint
router.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const user = new User({ userName, email, password });

    await user.save();
    console.log("user registered successfully", ` user email - ${email}`);
    res.status(200).send({ message: "User registered successfully" });
  } catch (err) {
    console.log(`error -${err}`);
    res.status(500).send({ message: "Error registering user" });
  }
});

// Login endpoing
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: "No users with that email was found" });

    const isMatch = await user.comparePassword(password);

    if (!isMatch) return res.status(401).send({ message: "Password not match" });

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).send({
      message: "Logged in successfully",
      token,
      user: {
        _id: user._id,
        email: user.email,
        userName: user.userName,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        proffession: user.proffesion,
      },
    });
    //
  } catch (err) {
    console.error("Error logged in user", error);
    res.status(500).send({ message: "error logged in" });
  }
});

// logout endpoint
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ message: "logged out successfully" });
});

// delete
router.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) return res.status(404).send({ message: "user not found" });

    res.status(200).send({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user", err);
    res.status(500).send({ message: "error deleting" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "id email role").sort({ createdAt: -1 });

    res.status(200).send(users);
  } catch (err) {
    console.error("Error getting user", err);
    res.status(500).send({ message: "error getting" });
  }
});

// update user role
router.put("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });

    if (!user) res.status(404).send({ message: "user not found" });
    res.status(200).send({ userInfo: { userName: user.userName, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Error updating user", err);
    res.status(500).send({ message: "Error updating" });
  }
});
module.exports = router;
