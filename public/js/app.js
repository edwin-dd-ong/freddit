import User, { Post } from "./user.js";
import apiRequest from "./apirequest.js";
import sharedFunctions from "./sharedFunctions.js";

export default class App extends sharedFunctions {
  constructor() {
    super();
    this.user = null;

    this.loginForm = document.querySelector("#loginForm");
    this.postOrComment = document.querySelector("#postOrCommentForm");
    this.table = document.querySelector(".alternate-table");

    this.login = this.login.bind(this);
    this.createPost = this.createPost.bind(this);
    this.handleLink = this.handleLink.bind(this);

    this.loginForm.addEventListener("submit", this.login);
    this.postOrComment.addEventListener("submit", this.createPost);
    document.querySelector(".brand").addEventListener("click", this.brandClick);

    if (localStorage.getItem("username") !== null) {
      this.user = new User(localStorage.getItem("username"));
      this.postOrComment.classList.remove("hidden");
      this.postOrComment.querySelector("#loginName").textContent = "Logged in as: " + this.user.userId;
    }
    this.loadPosts();
  }

  async loadPosts() {
    this.table.innerHTML = "";
    let postList = await apiRequest("GET", "/posts");
    let arrayOfPosts = [];
    for (let element of postList) {
      arrayOfPosts.push(new Post(element));
    }
    for (let element of arrayOfPosts) {
      this._displayPost(element);
    }
  }

  async handleLink(event, postId) {
    location.href = "/pages" + "/comments.html" + "?postId=" + postId;
  }

  _displayPost(post) {
    /* Make sure we receive a Post object. */
    if (!(post instanceof Post)) throw new Error("displayPost wasn't passed a Post object");

    const newRow = document.createElement("tr");
    const td = document.createElement("td");
    newRow.append(td);
    const postTitle = document.createElement("div");
    postTitle.classList.add("postTitle");
    postTitle.textContent = post.title;
    postTitle.addEventListener("click", (e) => this.handleLink(e, post._id));
    const postData = document.createElement("div");
    postData.classList.add("postData");
    postData.textContent = "submitted by: " + post.userId + " on " + post.time.toLocaleString();
    td.append(postTitle, postData);
    this.table.append(newRow);
  }

  async createPost(event) {
    event.preventDefault();
    let postTitle = document.querySelector("#newTitle");
    if (postTitle === "") {
      alert("please enter a title");
      return;
    }
    let postText = document.querySelector("#newPost");
    if (postText === "") {
      alert("please enter text for your post");
      return;
    }
    await this.user.makePost(postTitle.value, postText.value);
    await this.loadPosts();
  }
}

const main = () => {
  new App();
};
main();
