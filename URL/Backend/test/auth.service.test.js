import test from "node:test"
import assert from "node:assert/strict"
import { registerUser, loginUser } from "../services/auth.service.js"

test("registration requires a valid name", async () => {
  await assert.rejects(registerUser(" ", "person@example.com", "password123"), {
    message: "Name must be at least 2 characters.",
  })
})

test("registration requires a valid email address", async () => {
  await assert.rejects(registerUser("Taylor", "not-an-email", "password123"), {
    message: "Enter a valid email address.",
  })
})

test("registration requires a long enough password", async () => {
  await assert.rejects(registerUser("Taylor", "person@example.com", "short"), {
    message: "Password must be at least 8 characters.",
  })
})

test("login requires both email and password", async () => {
  await assert.rejects(loginUser("", ""), {
    message: "Email and password are required.",
  })
})
