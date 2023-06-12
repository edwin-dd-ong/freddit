import User from "./user.js";

export default class sharedFunctions {
  constructor() {
  }
  brandClick(event) {
    location.href = "/";
  }

  login(event) {
    event.preventDefault();
    if (this.loginForm.userId.value === "") {
      alert("please enter a username");
      return;
    }
    this.user = new User(this.loginForm.userId.value);
    localStorage.setItem("username", this.user.userId);
    this.postOrCommentForm.classList.remove("hidden");
    this.postOrCommentForm.querySelector("#loginName").textContent = "Logged in as: " + this.user.userId;
  }
}
