import apiRequest from "./apirequest.js";

export class Post {
  /* data is the post data from the API. */
  constructor(data) {
    /* Technically we don't have a full User object here (no followers list), but this is still useful. */
    this._id = data._id;
    this.userId = data.userId;
    this.time = new Date(data.time);
    this.title = data.title;
    this.text = data.text;
    this.comments = [];
  }
}

export default class User {
  constructor(userId) {
    this.userId = userId;
  }
  async makePost(title, text) {
    await apiRequest("POST", "/posts", { "userId": this.userId, "title": title, "text": text });
  }
}
