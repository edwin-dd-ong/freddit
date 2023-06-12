import User from "./user.js";
import apiRequest from "./apirequest.js";
import sharedFunctions from "./sharedFunctions.js";

export default class commentsApp extends sharedFunctions {
  constructor() {
    super();
    this.user = null;
    this.originalPost = {};

    const urlParams = new URLSearchParams(window.location.search);
    this.postId = urlParams.get("postId");

    this.loginForm = document.querySelector("#loginForm");
    this.postOrCommentForm = document.querySelector("#postOrCommentForm");
    this.table = document.querySelector(".alternate-table");

    this.login = this.login.bind(this);
    this.postComment = this.postComment.bind(this);
    this.brandClick = this.brandClick.bind(this);

    this.loginForm.addEventListener("submit", this.login);
    this.postOrCommentForm.addEventListener("submit", this.postComment);
    document.querySelector(".brand").addEventListener("click", this.brandClick);

    if (localStorage.getItem("username") !== null) {
      this.user = new User(localStorage.getItem("username"));
      this.postOrCommentForm.classList.remove("hidden");
      this.postOrCommentForm.querySelector("#loginName").textContent = "Logged in as: " + this.user.userId;
    }
    this.loadPage();
  }

  async loadPage() {
    //get the post data from mongodb and then update dom
    this.originalPost = await apiRequest("GET", "/post?postId=" + this.postId);
    document.querySelector(".postTitle").textContent = this.originalPost.title;
    document.querySelector(".originalPostText").textContent = this.originalPost.text;
    document.querySelector(".postData").textContent = "submitted by: " + this.originalPost.userId + " on " + new Date(this.originalPost.time).toLocaleString();
    await this.loadComments();
  }

  async loadComments() {
    this.table.innerHTML = "";
    this.originalPost = await apiRequest("GET", "/post?postId=" + this.postId);
    for (let element of this.originalPost.comments) {
      this.displayComment(element);
    }
  }

  displayComment(comment) {
    const newRow = document.createElement("tr");
    const td = document.createElement("td");
    newRow.append(td);
    const commentText = document.createElement("div");
    commentText.classList.add("commentText");
    commentText.textContent = comment.text;
    const commentData = document.createElement("div");
    commentData.classList.add("commentData");
    commentData.textContent = "submitted by: " + comment.userId + " on " + new Date(comment.time).toLocaleString();
    td.append(commentText, commentData);
    this.table.append(newRow);
  }

  async postComment(event) {
    event.preventDefault();
    let text = document.querySelector("#newComment").value;
    if (text === "") {
      alert("please enter a comment");
      return;
    }
    let userId = this.user.userId;
    await apiRequest("POST", "/comment", { text: text, userId: userId, postId: this.postId });

    await this.loadComments();
  }
}

const main = () => {
  new commentsApp();
};
main();
