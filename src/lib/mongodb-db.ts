
// This file contains sample MongoDB code for database connection and operations.
// In a real implementation, this would connect to a MongoDB database.

// Mock types for MongoDB since we're not actually using MongoDB in this application
interface MongoClient {
  connect: () => Promise<void>;
  db: (name: string) => any;
  close: () => Promise<void>;
}

class ObjectId {
  constructor(id: string) {
    this.id = id;
  }
  id: string;
  toString() {
    return this.id;
  }
}

// Connection URL and Database Name
const url = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGODB_DB_NAME || "taskflow";

// MongoDB client
let client: MongoClient | null = null;

// Connect to MongoDB
export async function connectToDatabase() {
  if (!client) {
    // This is just a mock implementation since we're using localStorage
    client = {
      connect: async () => {},
      db: (name: string) => ({
        collection: (collectionName: string) => ({
          find: () => ({
            sort: () => ({
              toArray: async () => []
            }),
            toArray: async () => []
          }),
          findOne: async () => null,
          insertOne: async () => ({ insertedId: new ObjectId('mock-id') }),
          updateOne: async () => ({ modifiedCount: 1 }),
          deleteOne: async () => ({ deletedCount: 1 })
        })
      }),
      close: async () => {}
    } as MongoClient;
    await client.connect();
  }
  return { client, db: client.db(dbName) };
}

// Users Collection Operations
export async function getUsers() {
  const { db } = await connectToDatabase();
  return db.collection("users").find({}).toArray();
}

export async function getUserById(id: string) {
  const { db } = await connectToDatabase();
  return db.collection("users").findOne({ _id: new ObjectId(id) });
}

export async function getUserByEmail(email: string) {
  const { db } = await connectToDatabase();
  return db.collection("users").findOne({ email });
}

export async function createUser(user: any) {
  const { db } = await connectToDatabase();
  const result = await db.collection("users").insertOne({
    ...user,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { id: result.insertedId, ...user };
}

export async function updateUser(id: string, userData: any) {
  const { db } = await connectToDatabase();
  await db.collection("users").updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...userData, updatedAt: new Date() } }
  );
  return getUserById(id);
}

export async function deleteUser(id: string) {
  const { db } = await connectToDatabase();
  const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

// Task Collection Operations
export async function getTasks() {
  const { db } = await connectToDatabase();
  return db.collection("tasks").find({}).toArray();
}

export async function getTaskById(id: string) {
  const { db } = await connectToDatabase();
  return db.collection("tasks").findOne({ _id: new ObjectId(id) });
}

export async function createTask(task: any) {
  const { db } = await connectToDatabase();
  const result = await db.collection("tasks").insertOne({
    ...task,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { id: result.insertedId, ...task };
}

export async function updateTask(id: string, taskData: any) {
  const { db } = await connectToDatabase();
  await db.collection("tasks").updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...taskData, updatedAt: new Date() } }
  );
  return getTaskById(id);
}

export async function deleteTask(id: string) {
  const { db } = await connectToDatabase();
  const result = await db.collection("tasks").deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

export async function filterTasks(filter: any) {
  const { db } = await connectToDatabase();
  const query: any = {};

  if (filter.search) {
    query.$or = [
      { title: { $regex: filter.search, $options: "i" } },
      { description: { $regex: filter.search, $options: "i" } },
    ];
  }

  if (filter.status) query.status = filter.status;
  if (filter.priority) query.priority = filter.priority;
  if (filter.assigneeId) query.assigneeId = filter.assigneeId;
  if (filter.creatorId) query.creatorId = filter.creatorId;

  if (filter.dueDate) {
    query.dueDate = { $lte: new Date(filter.dueDate) };
  }

  return db.collection("tasks").find(query).toArray();
}

// Audit Log Collection Operations
export async function getAuditLogs() {
  const { db } = await connectToDatabase();
  return db.collection("auditLogs").find({}).sort({ timestamp: -1 }).toArray();
}

export async function createAuditLog(log: any) {
  const { db } = await connectToDatabase();
  const result = await db.collection("auditLogs").insertOne({
    ...log,
    timestamp: new Date(),
  });
  return { id: result.insertedId, ...log };
}

// Notification Collection Operations
export async function getNotifications(userId: string) {
  const { db } = await connectToDatabase();
  return db.collection("notifications")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function createNotification(notification: any) {
  const { db } = await connectToDatabase();
  const result = await db.collection("notifications").insertOne({
    ...notification,
    read: false,
    createdAt: new Date(),
  });
  return { id: result.insertedId, ...notification };
}

export async function markNotificationAsRead(id: string) {
  const { db } = await connectToDatabase();
  const result = await db.collection("notifications").updateOne(
    { _id: new ObjectId(id) },
    { $set: { read: true } }
  );
  return result.modifiedCount === 1;
}

// Close the database connection
export async function closeDatabaseConnection() {
  if (client) {
    await client.close();
    client = null;
  }
}
