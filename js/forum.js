import { auth, db } from './firebase-config.js'; 
import { 
    collection, addDoc, query, orderBy, onSnapshot, 
    serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove, getDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- FUNGSI LIKE ---
window.handleLike = async (postId, likes) => {
    try {
        const postRef = doc(db, "forum_petani", postId);
        const uid = auth.currentUser.uid;
        if (likes.includes(uid)) {
            await updateDoc(postRef, { likes: arrayRemove(uid) });
        } else {
            await updateDoc(postRef, { likes: arrayUnion(uid) });
        }
    } catch (err) { console.error("Like Error:", err); }
};

// --- AUTH & PROFILE SYNC ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // AMBIL DATA USER DARI FIRESTORE UNTUK BAGIAN "ANDA"
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        const nameEl = document.getElementById('user-name');
        const handleEl = document.getElementById('user-handle');
        const avatarEl = document.getElementById('user-avatar');

        if (userSnap.exists()) {
            const userData = userSnap.data();
            if (nameEl) nameEl.textContent = userData.displayName;
            if (handleEl) handleEl.textContent = `@${userData.handle}`;
            if (avatarEl) avatarEl.src = userData.photoURL;
        } else {
            // Fallback jika data di koleksi users belum ada
            const username = user.email.split('@')[0];
            if (nameEl) nameEl.textContent = username;
            if (handleEl) handleEl.textContent = `@${username}`;
            if (avatarEl) avatarEl.src = `https://ui-avatars.com/api/?name=${username}&background=0D9488&color=fff`;
        }

        initForum();
    } else {
        window.location.href = "login.html";
    }
});

function initForum() {
    const chatContainer = document.getElementById('chat-container');
    const chatInput = document.getElementById('chat-input');
    const chatForm = document.getElementById('chat-form');

    if (!chatForm) return;

    chatForm.onsubmit = async (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if(!text) return;

        try {
            await addDoc(collection(db, "forum_petani"), {
                text: text,
                uid: auth.currentUser.uid,
                author: auth.currentUser.email.split('@')[0], // Tetap simpan untuk backup
                timestamp: serverTimestamp(),
                likes: [],
                location: "Mataram"
            });
            chatInput.value = "";
        } catch (err) { console.error("Kirim Gagal:", err); }
    };

    // TAMPIL FEED DENGAN FOTO PROFIL ASLI
    const q = query(collection(db, "forum_petani"), orderBy("timestamp", "desc"));
    onSnapshot(q, async (snapshot) => {
        chatContainer.innerHTML = "";
        
        // Menggunakan for...of agar bisa await pengambilan data user
        for (const docSnap of snapshot.docs) {
            const post = docSnap.data();
            const postId = docSnap.id;
            const likes = post.likes || [];
            const hasLiked = likes.includes(auth.currentUser.uid);
            const timeInfo = post.timestamp ? "Baru saja" : "...";

            // AMBIL DATA USER PENULIS POSTINGAN DARI KOLEKSI USERS
            const authorRef = doc(db, "users", post.uid);
            const authorSnap = await getDoc(authorRef);
            let profilePic = `https://ui-avatars.com/api/?name=${post.author}&background=random`;
            let displayName = post.author;
            let handle = post.author;

            if (authorSnap.exists()) {
                const authorData = authorSnap.data();
                profilePic = authorData.photoURL;
                displayName = authorData.displayName;
                handle = authorData.handle;
            }

            const postHTML = `
                <div class="bg-white p-5 border-b border-gray-100 animate-fade-in">
                    <div class="flex gap-4">
                        <img src="${profilePic}" class="w-12 h-12 rounded-full border shadow-sm object-cover">
                        <div class="flex-grow">
                            <div class="flex items-center gap-2">
                                <span class="font-bold text-gray-900 text-[14px]">${displayName}</span>
                                <span class="text-[12px] text-gray-400">@${handle} • ${timeInfo}</span>
                            </div>
                            <p class="text-[13px] text-gray-700 mt-1 leading-relaxed">${post.text}</p>
                            
                            <div class="flex gap-10 mt-4 text-gray-400">
                                <button class="flex items-center gap-2 text-[12px]"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>0</button>
                                <button onclick="handleLike('${postId}', ${JSON.stringify(likes)})" class="flex items-center gap-2 text-[12px] ${hasLiked ? 'text-teal-600 font-bold' : ''}">
                                    <svg class="w-5 h-5" fill="${hasLiked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
                                    ${likes.length}
                                </button>
                                <button class="flex items-center gap-2 text-[12px]"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg></button>
                            </div>
                        </div>
                    </div>
                </div>`;
            chatContainer.insertAdjacentHTML('beforeend', postHTML);
        }
    });
}