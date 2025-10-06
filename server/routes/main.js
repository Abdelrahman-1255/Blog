import express from "express";
const router = express.Router();
import Post from "../models/post.js";

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
  .post((req, res) => {
    const { name, email, message } = req.body;
    res.render("contact", {
      locals: {
        title: "Contact",
        description: "Thank you for your message!",
      },
      currentRoute: "/contact",
    });
  });

export default router;
