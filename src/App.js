import React, { useRef, useState, useContext, useEffect } from "react";
import "./App.css";

import firebase from "firebase/app";

import "./firebase";

import errorimage from "./assets/image.png";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { AiOutlineSend, AiFillFileAdd } from "react-icons/ai";
import { GoSignOut } from "react-icons/go";

import { AuthContext } from "./contexts/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/app";
const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();
const storage = firebase.storage();

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
    // const { uid, photoURL, displayName } = auth.currentUser;
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  const signInWithFacebook = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider);
  };

  console.log("google");
  return (
    <>
      <div className="log_in">
        <div className="option">
          <button>sign in</button>
          <button>sign up</button>
        </div>
        <form id="login">
          <input type="text" placeholder="Email" />
          <input type="text" placeholder="password" />
        </form>
        <button id="google" className="sign_in" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
        <button id="facebook" className="sign_in" onClick={signInWithFacebook}>
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

function Search() {
  const { uid, photoURL, displayName } = auth.currentUser;
  // const users = firestore.collection("users");
  const chatroom = firestore.collection("chatroom");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const handleSearch = async () => {
    const q = query(
      collection(firestore, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    const combinedId =
      { uid } > user.uid ? { uid } + user.uid : user.uid + { uid };
    try {
      const res = await getDoc(doc(firestore, "chatroom", combinedId));

      if (!res.exists()) {
        await setDoc(doc(firestore, "chatroom", combinedId), { messages: [] });

        await updateDoc(doc(firestore, "users", { uid }), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(firestore, "users", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: { uid },
            displayName: { displayName },
            photoURL: { photoURL },
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null);
    setUsername("");
  };
  return (
    <>
      {user && (
        <div className="finduser" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
      {err && <span>User not found!</span>}
      <div className="searchbar">
        <form id="search">
          <input
            type="text"
            placeholder="Find or start conversation"
            onKeyDown={handleKey}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          ></input>
        </form>
      </div>
    </>
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
        </div>
        {/* <Search /> */}
      </div>
    </>
  );
}

function ChatRoom() {
  const newchat = useRef();
  const messagesRef = firestore.collection("messages");
  const chatroom = firestore.collection("chatroom");
  const query = messagesRef.orderBy("createdAt");

  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const [img, setImg] = useState(null);

  let user = firebase.auth().currentUser;

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL, displayName } = auth.currentUser;
    // if (img) {
    //   const storageRef = ref();
    //   const uploadTask = uploadBy;
    // } else {
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      displayName,
    });
    setFormValue("");
    newchat.current.scrollIntoView({ behavior: "smooth" });
    // }
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
          <form id="chatbox" onSubmit={sendMessage}>
            <input
              type="text"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="Send message"
            />
            <div>
              <input
                type="file"
                id="file"
                onChange={(e) => setImg(e.target.files[0])}
                placeholder=""
              />
              <label htmlFor="file" className="input_file">
                <AiFillFileAdd />
              </label>
            </div>
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
