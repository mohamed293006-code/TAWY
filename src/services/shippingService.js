import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

const shippingRatesRef = collection(db, "shippingRates");

export async function getAvailableShippingRates() {
  const snapshot = await getDocs(shippingRatesRef);

  const rates = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));

  return rates.filter((rate) => rate.available !== false);
}

export async function getAllShippingRates() {
  const snapshot = await getDocs(shippingRatesRef);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function addShippingRate({ governorate, price, available = true }) {
  const docRef = await addDoc(shippingRatesRef, {
    governorate,
    price: Number(price),
    available,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateShippingRate(rateId, { governorate, price, available }) {
  const rateRef = doc(db, "shippingRates", rateId);
  await updateDoc(rateRef, {
    governorate,
    price: Number(price),
    available,
    updatedAt: serverTimestamp(),
  });
}

export async function toggleShippingRateAvailability(rateId, available) {
  const rateRef = doc(db, "shippingRates", rateId);
  await updateDoc(rateRef, {
    available,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteShippingRate(rateId) {
  const rateRef = doc(db, "shippingRates", rateId);
  await deleteDoc(rateRef);
}