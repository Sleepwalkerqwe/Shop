const express = require("express");
const User = require("./UserModel");
const generateToken = require("../middleware/generateToken");
const router = express.Router();

// Register API endpoint

router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Проверка на существующий email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Проверка на существующий username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already in use" });
    }

    // Если всё ок, создаем пользователя
    const user = new User({ username, email, password, role });

    await user.save();
    console.log("User registered successfully", `User email - ${email}`);
    res.status(200).send({ message: "User registered successfully" });
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(500).send({ message: "Error registering user" });
  }
});

// Login endpoing
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send({ message: "Email and password are required" });
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
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    res.status(200).send({
      message: "Logged in successfully",
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
      },
    });
    //
  } catch (err) {
    console.error("Error logged in user", err.message);
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

router.get("/user", async (req, res) => {
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
    res.status(200).send({ user: { username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Error updating user", err);
    res.status(500).send({ message: "Error updating" });
  }
});

//
router.patch("/edit-profile", async (req, res) => {
  try {
    const { userId, username, profileImage, bio } = req.body;

    if (!userId) return res.status(400).send({ message: "User id is required" });

    const user = await User.findById(userId);

    // update profile
    if (username !== undefined) user.username = username;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (bio !== undefined) user.bio = bio;

    await user.save();
    res.status(200).send({ message: "user updated successfully", user });
  } catch (err) {
    console.error("Error updating user profile", err);
    res.status(500).send({ message: "Error updating user profile" });
  }
});
module.exports = router;
