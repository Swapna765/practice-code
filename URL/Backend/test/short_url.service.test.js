import test from "node:test"
import assert from "node:assert/strict"
import { createShortUrl } from "../services/short_url.service.js"

test("requires a URL", async () => {
  await assert.rejects(
    createShortUrl("", undefined, undefined),
    { message: "A URL is required." },
  )
})

test("rejects malformed URLs", async () => {
  await assert.rejects(
    createShortUrl("not a URL", undefined, undefined),
    { message: "Enter a valid URL." },
  )
})

test("only accepts HTTP and HTTPS links", async () => {
  await assert.rejects(
    createShortUrl("javascript:alert(1)", undefined, undefined),
    { message: "Only HTTP and HTTPS links are supported." },
  )
})

test("validates custom link endings", async () => {
  await assert.rejects(
    createShortUrl("https://example.com", "has spaces", "user-id"),
    { message: "Custom endings must be 3–30 letters, numbers, or hyphens." },
  )
})

test("requires sign-in for a custom ending", async () => {
  await assert.rejects(
    createShortUrl("https://example.com", "my-link"),
    (error) => error.message === "Sign in to choose a custom ending." && error.statusCode === 401,
  )
})
