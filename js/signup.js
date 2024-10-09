// Signup Function
document
  .getElementById("signupForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const response = await fetch("https://library-backend-iitb-ass.onrender.com/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email,  password, role }),
    });

    console.log(response);

    const data = await response.json();
    if (data.success === true) {
      window.location.href = "login.html";
    } else {
      alert(data.message);
    }
  });