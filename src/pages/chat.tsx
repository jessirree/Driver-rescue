import { useState, useEffect } from "react";
import { collection, doc, getDoc, setDoc, updateDoc, onSnapshot, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

interface User {
    userId: string;
    name: string;
    email: string;
    role: string;
  }
  interface Message {
    senderId: string;
    text: string;
    timestamp: number;
  }  

function Chat() {
  const { providerId ="" } = useParams(); // Get service provider ID from URL
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState(""); // Store authenticated user ID
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch user data from Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data() as User; //Explicitly cast data to `User`
            setUser(userData);
            setUserId(userData.userId); // Get `userId` from Firestore
          }
        }
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId || !providerId) return;

    // ✅ Ensure chat ID order is always consistent
    const chatId = userId < providerId ? `${userId}_${providerId}` : `${providerId}_${userId}`;
    const chatRef = doc(db, "chats", chatId);

    const unsubscribe = onSnapshot(chatRef, (docSnap) => {
      if (docSnap.exists()) {
        setMessages(docSnap.data().messages || []);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [userId, providerId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!userId) return;

    const chatId = userId < providerId ? `${userId}_${providerId}` : `${providerId}_${userId}`;
    const chatRef = doc(db, "chats", chatId);

    try {
      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists()) {
        //Create new chat if it doesn't exist
        await setDoc(chatRef, {
          chatId,
          users: [userId, providerId],
          messages: [],
        });
      }

      //Add a new message to Firestore
      await updateDoc(chatRef, {
        messages: arrayUnion({
          senderId: userId,
          text: newMessage,
          timestamp: new Date().getTime(),
        }),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="container">
      <h2>Chat with Service Provider</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.senderId === userId ? "message sent" : "message received"}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          className="form-control"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="btn btn-primary" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
