import { collection, getDocs } from "firebase/firestore";
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