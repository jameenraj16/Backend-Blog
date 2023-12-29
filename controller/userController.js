import User from "../model/userModel.js";
import bcrypt from "bcryptjs";

//To View All Users
export const getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }
  if (!users) {
    return res.status(404).json({ message: "No Users Found " });
  }
  return res.status(200).json({ users });
};
//Signup
export const signup = async (req, res, next) => {
  const { firstName,lastName,dob, email, password } = req.body;
  let exUser;
  try {
    exUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (exUser) {
    return res.status(401).json({ message: "user Already Available" });
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = new User({
    firstName,
    lastName,
    dob,
    email,
    password: hashedPassword,
    blogs: [],
  });
  try {
    user.save();
    return res.status(200).json({ user });
  } catch (err) {
    return console.log(err);
  }
};
//Login
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let exUser;
  try {
    exUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (!exUser) {
    return res.status(404).json({ message: "No User Found" });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, exUser.password);
  if (!isPasswordCorrect) {
    return res.status(401).json("Incorrect Password");
  }
  return res.status(200).json({ message: "Login Successfull", user: exUser });
};
// Update User Details
export const updateUser = async (req, res, next) => {
  const userId = req.params.id;
  const { firstName,lastName,dob, email, password, } = req.body;

  let user;
  try {
    user = await User.findByIdAndUpdate(userId);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update user fields
  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.dob = dob || user.dob;
  user.email = email || user.email;

  // Check if a new password is provided and update it
  if (password) {
    const hashedPassword = bcrypt.hashSync(password);
    user.password = hashedPassword;
  }
  try {
    await user.save();
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
