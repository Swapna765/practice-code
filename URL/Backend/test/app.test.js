import test from "node:test"
import assert from "node:assert/strict"
import app from "../app.js"

test("API health and unknown routes return the expected status", async (t) => {
  const server = app.listen(0)
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve())
  }))

  const baseUrl = `http://127.0.0.1:${server.address().port}`
  const healthResponse = await fetch(`${baseUrl}/api/health`)
  assert.equal(healthResponse.status, 200)
  assert.deepEqual(await healthResponse.json(), { status: "ok" })

  const missingResponse = await fetch(`${baseUrl}/api/not-found`)
  assert.equal(missingResponse.status, 404)
  assert.equal((await missingResponse.json()).message, "Route not found.")

  const historyResponse = await fetch(`${baseUrl}/api/user/history`)
  assert.equal(historyResponse.status, 401)
})
