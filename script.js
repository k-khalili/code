const button = document.getElementById("greet-btn");
const message = document.getElementById("message");

button.addEventListener("click", function () {
  message.textContent = "Hey there! Your JavaScript is working!";
});
