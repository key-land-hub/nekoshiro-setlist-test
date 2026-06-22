/* firebase.js */

let currentUser = null;

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

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
  arrayUnion, 
  arrayRemove 
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
onAuthStateChanged(auth, async user => { 

  const userInfo = document.getElementById('userInfo'); 

  if (user) {

    currentUser = user;

    userInfo.innerHTML = `
      🟢 ログイン中
    `;

    // ログイン中
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';

    setTimeout(loadFavorites, 0);

  } else {

    currentUser = null;

    userInfo.innerHTML = `
      未ログイン
    `;

    // ログアウト中
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';

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

const row = e.target.parentElement;

const streamDate = row.dataset.date;

const streamTitle = row.dataset.title;

const songUrl = row.dataset.url;

try { 

  if (e.target.textContent.trim() === '🤍') {

    e.target.textContent = '💜';

    await setDoc(
      doc(db, "users", user.uid),
      {
        favorites: arrayUnion({
          name: songName,
          date: streamDate,
          title: streamTitle,
          url: songUrl
        })
      },
      { merge: true }
    );

  } else {

    e.target.textContent = '🤍';

    await setDoc(
      doc(db, "users", user.uid),
      {
        favorites: arrayRemove({
          name: songName,
          date: streamDate,
          title: streamTitle,
          url: songUrl
        })
      },
      { merge: true }
    );

   }

   await loadFavorites();

   console.log("保存成功:", songName); 
   } catch (error) { 
     console.error(error); 
   } 
});

// お気に入り復元 
async function loadFavorites() {

  console.log("loadFavorites開始");

  const user = auth.currentUser;

  if (!user) {
    console.log("userなし");
    return;
  }

  const snap =
    await getDoc(
      doc(db, "users", user.uid)
    );

  if (!snap.exists()) {
    console.log("snapなし");
    return;
  }

  const favorites =
    snap.data().favorites || [];

  console.log("favorites =", favorites);

  const favoriteBox =
    document.getElementById('favoriteSongs');

  console.log("favoriteBox =", favoriteBox);

  if (favorites.length) {

    favoriteBox.innerHTML =
      favorites.map(song => {

        return `
          <div class="favorite-item">

          <div class="favorite-date">
             ${song.date}
          </div>

          <div class="favorite-title">
             ${song.title}
          </div>

          <a
             class="favorite-song"
             href="${song.url}"
             target="_blank"
          >
             💜 ${song.name}
          </a>

        </div>
      `;

  }).join('');

  } else {

    favoriteBox.innerHTML = 'お気に入りはありません';

  }

  document 
    .querySelectorAll('.song-row') 
    .forEach(row => { 

    const songName = 
      row.querySelector('.song') 
        .textContent 
        .replace('▶', '') 
        .trim(); 

    const button = 
      row.querySelector('.favorite-btn'); 

    button.textContent =
      favorites.some(
        f =>
          f.name === songName &&
          f.date === row.dataset.date &&
          f.url === row.dataset.url
      )
    ? '💜'
    : '🤍';

   }); 

} 

// app.jsから呼べるようにする 
window.loadFavorites = loadFavorites;