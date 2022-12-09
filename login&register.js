function setFormMessage(formElement, type, message) {
  const messageElement = formElement.querySelector(".form__message")

  messageElement.textContent = message
  messageElement.classList.remove(
    "form__message--success",
    "form__message--error"
  )
  messageElement.classList.add(`form__message--${type}`)
}

function setInputError(inputElement, message) {
  inputElement.classList.add("form__input--error")
  inputElement.parentElement.querySelector(
    ".form__input-error-message"
  ).textContent = message
}

function clearInputError(inputElement) {
  inputElement.classList.remove("form__input--error")
  inputElement.parentElement.querySelector(
    ".form__input-error-message"
  ).textContent = ""
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#login")
  const createAccountForm = document.querySelector("#createAccount")
  const forgotForm = document.querySelector("#forgotPassword")
  document
    .querySelector("#linkCreateAccount")
    .addEventListener("click", (e) => {
      e.preventDefault()
      createAccountForm.classList.remove("form--hidden")
      loginForm.classList.add("form--hidden")
      forgotForm.classList.add("form--hidden")
    })

  document.querySelector("#linkLogin").addEventListener("click", (e) => {
    e.preventDefault()
    loginForm.classList.remove("form--hidden")
    createAccountForm.classList.add("form--hidden")
    forgotForm.classList.add("form--hidden")
  })

  

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    const doc = {
      email: username,
      password: password,
    }

    await fetch("https://json-server-auth-mimi-theatre.vercel.app/login", {
      method: "POST",
      body: JSON.stringify(doc),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken)
          window.location.href = "./index.html"
        } else {
          setFormMessage(loginForm, "error", data)
        }
      })
  })

  createAccountForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = document.getElementById("signUpEmail").value
    const password = document.getElementById("signUpPassword").value
    const confirmPassword = document.getElementById(
      "signUpConfirmPassword"
    ).value

    if (confirmPassword != password) {
      setFormMessage(createAccountForm, "error", "Passwords do not match")
    } else {
      const doc = {
        email: username,
        password: password,
      }

      await fetch("http:/json-server-auth-mimi-theatre.vercel.app/register", {
        method: "POST",
        body: JSON.stringify(doc),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken)
            window.location.href = "./index.html"
          } else {
            setFormMessage(loginForm, "error", data)
          }
        })
    }
  })

  document.querySelectorAll(".form__input").forEach((inputElement) => {
    inputElement.addEventListener("blur", (e) => {
      if (
        e.target.id === "signupUsername" &&
        e.target.value.length > 0 &&
        e.target.value.length < 5
      ) {
        setInputError(
          inputElement,
          "Username must be at least 5 characters in length"
        )
      }
    })

    inputElement.addEventListener("input", (e) => {
      clearInputError(inputElement)
    })
  })
})
