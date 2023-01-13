import React, { useRef, useState, useContext, useEffect } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";

import "./firebase";

import errorimage from "./assets/image.png";

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
      <div className="sidebar">
        <div className="profile">
          <img
            src={
              photoURL ||
              "https://api.adorable.io/avatars/23/abott@adorable.png"
            }
          />
          <h2>{displayName}</h2>
        </div>
        <div className="friendlist">
          <div className="friend">
            <img
              src={
                photoURL ||
                "https://api.adorable.io/avatars/23/abott@adorable.png"
              }
            />
            <p>ddddddddddddddddddddddddddddddddddddddddddddddddddd</p>
          </div>
          <div className="friend">
            <img
              src={
                photoURL ||
                "https://api.adorable.io/avatars/23/abott@adorable.png"
              }
            />
            <p>{displayName}</p>
          </div>
        </div>
        <div className="searchbar">
          <form id="search">
            <input placeholder="search for a friend"></input>
          </form>
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
    <div className="chat">
      <FriendsList />
      <div className="chatroom">
        <div className="container_chat">
          <div className="chatTitle">
            <h2>{user.displayName}</h2>
            <SignOut />
          </div>
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
        <div className="profilepic">
          <img
            src={
              photoURL ||
              "https://api.adorable.io/avatars/23/abott@adorable.png"
            }
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = { errorimage };
            }}
          />
        </div>

        <div className="displayName">
          <h1>{displayName}</h1>
          <p>{text}</p>
        </div>
      </div>
    </>
  );
}

export default App;
