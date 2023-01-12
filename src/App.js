import React, { useRef, useState, useContext } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";

import "./firebase";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { AiOutlineSend } from "react-icons/ai";
import { GoSignOut } from "react-icons/go";

import { AuthContext } from "./contexts/AuthContext";

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {
  const [online] = useAuthState(auth);

  return (
    <div className="App">
      <div>{/* <SignOut /> */}</div>

      <div>{online ? <ChatRoom /> : <SignIn />}</div>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  const signInWithFacebook = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <div className="log_in">
        <button className="sign_in" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
        <button className="sign_in" onClick={signInWithFacebook}>
          Sign in with Facebook
        </button>
      </div>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign_out" onClick={() => auth.signOut()}>
        <GoSignOut />
      </button>
    )
  );
}

function FriendsList() {
  const { uid, photoURL, displayName } = auth.currentUser;
  return (
    <>
      <div className="friendlist">
        <div className="friend">
          <p>{displayName}</p>
        </div>
        <div className="friend">
          <p>{displayName}</p>
        </div>
        <div className="friend">
          <p>{displayName}</p>
        </div>
        <div className="friend">
          <p>{displayName}</p>
        </div>
        <div className="friend">
          <p>{displayName}</p>
        </div>
        <div className="friend">
          <p>{displayName}</p>
        </div>
        <div className="friend">
          <p>{displayName}</p>
        </div>
        <div className="friend">
          <p>{displayName}</p>
        </div>
        <div className="friend">
          <p>{displayName}</p>
        </div>
        <div className="friend">
          <p>{displayName}</p>
        </div>
        <div className="friend">
          <p>{displayName}</p>
        </div>
        <div className="friend">
          <p>{displayName}</p>
        </div>
        <div className="friend">
          <p>{displayName}</p>
        </div>
        <div className="friend">
          <p>{displayName}</p>
        </div>
        <div className="friend">
          <p>{displayName}</p>
        </div>
      </div>
    </>
  );
}

function ChatRoom() {
  const newchat = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  let user = firebase.auth().currentUser;

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL, displayName } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      displayName,
    });

    setFormValue("");
    newchat.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="test">
      <FriendsList />
      <div className="chatroom">
        <div className="chatTitle">
          <p>{user.displayName}</p>
          <SignOut />
        </div>
        <div className="container_chat">
          <main>
            {messages &&
              messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

            <span ref={newchat}></span>
          </main>
          <form onSubmit={sendMessage}>
            <input
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="Send message"
            />

            <button type="submit" disabled={!formValue}>
              <AiOutlineSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL, displayName } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <p>{displayName}</p>
        <img
          src={
            photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
        />
        <p>{text}</p>
      </div>
    </>
  );
}

export default App;
