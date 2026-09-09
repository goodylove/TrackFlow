import mongoose, { type ClientSession } from "mongoose";

// Detect support before writing. Never retry a failed transaction without one:
// an error must propagate, rather than silently downgrade atomicity.
export const withOptionalTransaction = async <T>(
  operation: (session: ClientSession | null) => Promise<T>,
): Promise<T> => {
  const db = mongoose.connection.db;
  if (!db) throw new Error("Database is not connected");
  const hello = await db.admin().command({ hello: 1 });
  const supportsTransactions =
    hello.logicalSessionTimeoutMinutes != null &&
    (typeof hello.setName === "string" || hello.msg === "isdbgrid");

  if (!supportsTransactions) return operation(null);

  return mongoose.connection.transaction((session) => operation(session));
};
