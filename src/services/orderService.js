import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import emailjs from "@emailjs/browser";

const ordersRef = collection(db, "orders");

const EMAILJS_SERVICE_ID = "service_5lipkpb";
const EMAILJS_TEMPLATE_ID = "template_k7wynnb";
const EMAILJS_PUBLIC_KEY = "pO_QbJOyTp4h_9Dx3";

async function getNextOrderNumber() {
  const counterRef = doc(db, "counters", "orders");

  const nextNumber = await runTransaction(db, async (transaction) => {
    const counterSnap = await transaction.get(counterRef);

    let current = 1000;
    if (counterSnap.exists()) {
      current = counterSnap.data().current || 1000;
    }

    const next = current + 1;
    transaction.set(counterRef, { current: next }, { merge: true });
    return next;
  });

  return nextNumber;
}

async function sendOrderEmail({ orderNumber, customer, totalPrice }) {
  const recipientEmail = customer?.email?.trim();

  if (!recipientEmail) {
    console.warn(
      "orderService: customer email is missing, skipping EmailJS send for order",
      orderNumber
    );
    return;
  }

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        email: recipientEmail,
        order_number: orderNumber,
        customer_name: customer?.fullName || "—",
        customer_phone: customer?.phone || "—",
        total_price: totalPrice,
      },
      EMAILJS_PUBLIC_KEY
    );
  } catch (error) {
    console.error("orderService: EmailJS send failed ->", error);
  }
}

export async function createOrder({ userId, customer, items, totalPrice }) {
  const orderNumber = await getNextOrderNumber();

  const docRef = await addDoc(ordersRef, {
    orderNumber,
    userId,
    customer,
    items,
    totalPrice,
    paymentMethod: "cash_on_delivery",
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await sendOrderEmail({ orderNumber, customer, totalPrice });

  return docRef.id;
}

export async function getUserOrders(userId) {
  const q = query(
    ordersRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function getOrderById(orderId) {
  const ref = doc(db, "orders", orderId);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function getAllOrders() {
  const q = query(ordersRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function updateOrderStatus(orderId, newStatus) {
  const ref = doc(db, "orders", orderId);
  await updateDoc(ref, {
    status: newStatus,
    updatedAt: serverTimestamp(),
  });
}