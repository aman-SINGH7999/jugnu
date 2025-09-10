// lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
if (!uri) throw new Error("Please add MONGO_URI to .env.local");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// consider dev if NODE_ENV missing (Next.js sets it for dev normally)
const isDevelopment = (process.env.NODE_ENV ?? "development") === "development";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (isDevelopment) {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Helper to mask credentials in logs (so you don't leak username:password)
function maskMongoUri(u: string) {
  // replace credentials before @ with '***'
  return u.replace(/(\/\/)(.*@)/, "$1***@");
}

clientPromise
  .then((client) => {
    try {
      const db = client.db();
      const dbName = db.databaseName || "(no default DB in URI)";
      console.log(
        `MongoClient connected — DB: ${dbName}, URI: ${maskMongoUri(uri)}`
      );
    } catch (err) {
      console.log("MongoClient connected (couldn't read db name):", err);
    }
  })
  .catch((err) => {
    console.error("MongoClient connection error:", err);
  });

export default clientPromise as Promise<MongoClient>;
