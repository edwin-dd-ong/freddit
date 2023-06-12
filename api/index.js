import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { MongoClient, ObjectId } from "mongodb";


let api = express.Router();
let Posts;

const initApi = async (app) => {
  app.set("json spaces", 2);
  app.use("/api", api);

  let conn = await MongoClient.connect("mongodb://127.0.0.1");
  let db = conn.db("Freddit");
  Posts = db.collection("posts");
};

api.use(bodyParser.json());
api.use(cors());

api.get("/", (req, res) => {
  res.json({ message: "Hello, world!" });
});

//TODO

api.get("/posts", async (req, res) => {
  let postList = await Posts.find().toArray();
  for (let post of postList) {
    delete post.comments;
  }
  postList.sort((a, b) => b.time - a.time);
  res.json( postList );
});


api.post("/posts", async (req, res) => {
  await Posts.insertOne({ userId: req.body.userId, time: new Date(), title: req.body.title, text: req.body.text, comments: [] });
  res.json({ "success": true });
});

api.get("/post", async (req, res) => {
  let post = await Posts.findOne({ _id: new ObjectId(req.query.postId) });
  res.json(post);
});

api.post("/comment", async (req, res) => {
  let text = req.body.text;
  let userId = req.body.userId;
  let post = await Posts.findOne({ _id: new ObjectId(req.body.postId) });
  post.comments.push({ text: text, userId: userId, time: new Date() });
  post.comments.sort((a, b) => b.time - a.time);
  await Posts.replaceOne({ _id: new ObjectId(req.body.postId) }, post);
  res.json({ "success": true });
});


/* Catch-all route to return a JSON error if endpoint not defined.
   Be sure to put all of your endpoints above this one, or they will not be called. */
api.all("/*", (req, res) => {
  res.status(404).json({ error: `Endpoint not found: ${req.method} ${req.url}` });
});

export default initApi;
