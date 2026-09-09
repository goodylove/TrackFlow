import mongoose from "mongoose";
import { MongoMemoryServer, MongoMemoryReplSet } from "mongodb-memory-server";
import { afterAll, afterEach, beforeAll } from "vitest";

let mongoServer: MongoMemoryServer | MongoMemoryReplSet;
let testDatabaseName: string;

beforeAll(async () => {
  // Never connect to the application's MONGODB_URI in tests.
  mongoServer =
    process.env.TEST_MONGODB_REPLICA_SET === "1"
      ? await MongoMemoryReplSet.create({ replSet: { count: 1 } })
      : await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri(), { dbName: "trackflow_isolated_test" });
  testDatabaseName = mongoose.connection.name;
});

afterEach(async () => {
  if (
    mongoose.connection.readyState !== 1 ||
    mongoose.connection.name !== testDatabaseName ||
    testDatabaseName !== "trackflow_isolated_test"
  ) {
    throw new Error("Refusing cleanup outside the isolated test database");
  }
  const collections = mongoose.connection.collections;

  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({})),
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});
