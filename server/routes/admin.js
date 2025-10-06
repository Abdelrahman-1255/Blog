import express from "express";
const router = express.Router();
import Post from "../models/post.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth.js";

const adminLayout = "../views/layouts/admin";

router
  .route("/admin")
  .get((req, res) => {
    try {
      const locals = {
        title: "Admin",
        description: "Admin Page",
      };
      res.render("admin/index", { locals, layout: adminLayout });
    } catch (err) {
      console.error(err);
    }
  })
  .post(async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).send("Invalid credentials");
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send("Invalid credentials");
      }
      const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
      if (!process.env.JWT_SECRET) {
        console.warn(
          "Warning: JWT_SECRET environment variable is not set. Using default value."
        );
      }
      const token = jwt.sign({ userId: user._id }, jwtSecret);
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/dashboard");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  });

router.get("/dashboard", auth, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Dashboard Page",
    };
    const posts = await Post.find().sort({ createdAt: -1 });
    res.render("admin/dashboard", { locals, data: posts, layout: adminLayout });
  } catch (err) {
    console.error(err);
  }
});

router
  .route("/add-post")
  .get(auth, async (req, res) => {
    try {
      const locals = {
        title: "Add Post",
        description: "Add Post Page",
      };
      res.render("admin/add-post", { locals, layout: adminLayout });
    } catch (err) {
      console.error(err);
    }
  })
  .post(auth, async (req, res) => {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });
      await newPost.save();
      res.redirect("/dashboard");
    } catch (err) {
      console.error(err);
    }
  });
router
  .route("/edit-post/:id")
  .get(auth, async (req, res) => {
    try {
      const locals = {
        title: "Edit Post",
        description: "Edit Post Page",
      };
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).send("Post not found");
      }
      res.render("admin/edit-post", { data: post, layout: adminLayout });
    } catch (err) {
      console.error(err);
    }
  })
  .put(auth, async (req, res) => {
    try {
      await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now(),
      });
      res.redirect(`/edit-post/${req.params.id}`);
    } catch (err) {
      console.error(err);
    }
  });

router.delete("/delete-post/:id", auth, async (req, res) => {
  try {
    await Post.findByIdAndDelete({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.send(newUser);
  } catch (err) {
    console.error(err);
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

export default router;
