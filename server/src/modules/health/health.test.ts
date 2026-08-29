import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../app.js";

describe("Get/api/v1/health", () => {
  it("Health API returns success", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      message: "API is healthy",
      status: "success",
    });
  });
});
