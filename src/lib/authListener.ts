import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// Runs every time Auth state changes
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const ref = doc(db, "users", user.email!);
  const snap = await getDoc(ref);

  // Create only if not already created
  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email,
      displayName: user.displayName ?? "",
      photoURL: user.photoURL ?? "",
      bio: "",
      activities: [],
      socials: {},
      createdAt: serverTimestamp(),
    });
  }
});
