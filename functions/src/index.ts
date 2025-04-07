/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => { 
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
admin.initializeApp();

export const deleteAuthUser = functions.onDocumentDeleted("users/{userId}", async (event) => {
    const userId = event.params.userId; // Extract user ID
  
    if (!userId) {
      console.error("User ID is undefined, skipping deletion.");
      return;
    }
  
    try {
      await admin.auth().deleteUser(userId);
      console.log(`Successfully deleted user ${userId} from Firebase Auth.`);
    } catch (error) {
      console.error(`Error deleting user ${userId} from Auth:`, error);
    }
  });