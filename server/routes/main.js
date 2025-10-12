import express from "express";
const router = express.Router();
import Post from "../models/post.js";
import { sendContactEmail } from "../Helpers/mailer.js";

router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "Home",
      description: "Simple blog created with NodeJs, Express & MongoDB",
    };
    let perPage = 10;
    let page = req.query.page || 1;
    const posts = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data: posts,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (err) {
    console.error(err);
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    let postId = req.params.id;
    const post = await Post.findById({ _id: postId });
    const locals = {
      title: post.title,
      description: post.description,
    };
    res.render("post", {
      locals,
      data: post,
      currentRoute: "/post/" + postId,
    });
  } catch (err) {
    console.error(err);
  }
});

router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Search Results",
    };
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
    const post = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });
    res.render("search", {
      locals,
      data: post,
      currentRoute: "/search",
    });
  } catch (err) {
    console.error(err);
  }
});

router.get("/about", (req, res) => {
  const locals = {
    title: "About",
    description: "Learn more about this blog",
  };
  res.render("about", { locals, currentRoute: "/about" });
});

router
  .route("/contact")
  .get((req, res) => {
    const locals = {
      title: "Contact",
      description: "Get in touch with us",
    };
    res.render("contact", { locals, currentRoute: "/contact" });
  })
  .post(async (req, res) => {
    const { name, email, message } = req.body;
    const locals = {
      title: "Contact",
      description: "Get in touch with us",
    };
    try {
      await sendContactEmail({ name, email, message });
      console.log("Email sent successfully");
      return res.render("contact", {
        locals: { ...locals, description: "Thank you for your message!" },
        currentRoute: "/contact",
        success: "Your message has been sent successfully.",
      });
    } catch (err) {
      console.error("Contact form email error:", err);
      return res.status(500).render("contact", {
        locals,
        currentRoute: "/contact",
        error: "Sorry, we couldn't send your message. Please try again later.",
      });
    }
  });

export default router;
