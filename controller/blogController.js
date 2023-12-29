import mongoose from "mongoose";
import Blog from "../model/blogModel.js";
import User from "../model/userModel.js";

// All Blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("user");
    if (!blogs.length) {
      return res.status(404).json({ error: "No Blogs Found" });
    }
    return res.status(200).json({ blogs });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Add New Blog
export const addBlog = async (req, res) => {
  const { title, description, image, user  } = req.body;

  try {
    const exUser = await User.findById(user);
    if (!exUser) {
      return res.status(404).json({ error: "Unable to find User by this id" });
    }

    const blog = new Blog({
      title,
      description,
      image,
      user,
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({ session });
    exUser.blogs.push(blog);
    await exUser.save({ session });
    await session.commitTransaction();
    
    return res.status(200).json({ blog });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update
export const updateBlog = async (req, res) => {
  const { title, description, image } = req.body;
  const id = req.params.id;

  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: id },
      { title, description, image },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ error: "Unable to update blog" });
    }

    return res.status(200).json({ blog });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get a blog
export const getByid = async (req, res) => {
  const id = req.params.id;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "No Blog found" });
    }
    return res.status(200).json({ blog });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete a blog
export const deleteBlog = async (req, res) => {
  const id = req.params.id;

  try {
    const blog = await Blog.findById(id).populate("user");
    if (!blog) {
      return res.status(404).json({ error: "No Blog found" });
    }

    await blog.deleteOne();
    await blog.user.blogs.pull(blog);
    await blog.user.save();

    return res.status(200).json({ message: "Blog Deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get blogs by user id
export const getByUserId = async (req, res) => {
  const userId = req.params.id;

  try {
    const userBlogs = await User.findById(userId).populate("blogs");
    if (!userBlogs) {
      return res.status(404).json({ error: "No Blog found" });
    }
    return res.status(200).json({ user: userBlogs });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
