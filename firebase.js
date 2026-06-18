/* firebase.js */

import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  arrayUnion
} 
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = { 
   apiKey: "AIzaSyCFiUzkaW3OrFqJtArHBW1zsvfu94v3ugw", 
   authDomain: "nekoshiro-setlist.firebaseapp.com", 
   projectId: "nekoshiro-setlist", 
   storageBucket: "nekoshiro-setlist.firebasestorage.app", 
   messagingSenderId: "1084612295383", 
   appId: "1:1084612295383:web:65b3f42f5d869926e9ce92", 
   measurementId: "G-P9SF4R8YHP" 
};

// Firebase初期化 
const app = initializeApp(firebaseConfig); 

// Authentication 
const auth = getAuth(app); 
const provider = new GoogleAuthProvider();

// Firestore 
const db = getFirestore(app);

// Googleログイン 
document 
.getElementById('loginBtn') 
.addEventListener('click', async () => { 

  try { 
       await signInWithPopup(auth, provider); 
      } catch (error) { 
        console.error(error); 
      } 
});

// ログアウト 
document 
.getElementById('logoutBtn') 
.addEventListener('click', () => { 

  signOut(auth); 
});

// ログイン状態監視 
onAuthStateChanged(auth, user => { 

  const userInfo = 
    document.getElementById('userInfo'); 

  if (user) { 

     userInfo.innerHTML = ` 
       ${user.displayName}<br> 
       ${user.email} 
     `; 

  } else {userInfo.innerHTML = ` 
       未ログイン 
     `; 
  } 
});

document.addEventListener('click', async e => { 

  if (!e.target.classList.contains('favorite-btn')) return; 

  const user = auth.currentUser; 

  if (!user) { 
    alert("お気に入り機能を使うにはGoogleログインしてください"); 
    return; 
  } 

const songName = 
   e.target.parentElement 
    .querySelector('.song') 
    .textContent 
    .replace('▶', '') 
    .trim(); 

try { 

  await setDoc( 
   doc(db, "users", user.uid), 
   { 
     favorites: arrayUnion(songName) 
   }, 
   { merge: true } 
  ); 

   console.log("保存成功:", songName); 
   } catch (error) { 
     console.error(error); 
   } 
});
