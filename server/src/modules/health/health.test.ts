import { describe, expect, it } from "vitest";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app.js";

describe("Readiness", () => {
  it("reports ready when MongoDB is connected", async () => {
    const response = await request(app).get("/api/v1/ready").expect(200);
    expect(response.body).toEqual({ message: "API is ready", status: "success" });
    expect(response.headers["cache-control"]).toBe("no-store");
  });

  it("reports unavailable without affecting liveness when MongoDB is disconnected", async () => {
    const connection = mongoose.connection;
    const uri = `mongodb://${connection.host}:${connection.port}/${connection.name}`;
    await mongoose.disconnect();
    try {
      const response = await request(app).get("/api/v1/ready").expect(503);
      expect(response.body).toEqual({ message: "API is not ready", status: "error" });
      expect(response.headers["cache-control"]).toBe("no-store");
      await request(app).get("/api/v1/health").expect(200);
    } finally {
      await mongoose.connect(uri);
    }
  });
});

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
