import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

let app: admin.app.App | null = null;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
    });
  }
} catch (e) {
  console.error("Firebase init failed:", e);
  app = null;
}

export const db = app ? admin.firestore() : null;
