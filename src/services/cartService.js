import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

function cartRef(userId) {
  return doc(db, "carts", userId);
}

export async function getCart(userId) {
  const snapshot = await getDoc(cartRef(userId));
  if (!snapshot.exists()) {
    return [];
  }
  return snapshot.data().items || [];
}

export async function saveCart(userId, items) {
  await setDoc(cartRef(userId), {
    items,
    updatedAt: serverTimestamp(),
  });
}

export async function addItemToCart(userId, product) {
  const items = await getCart(userId);
  const existingItem = items.find((item) => item.productId === product.id);

  let updatedItems;
  if (existingItem) {
    updatedItems = items.map((item) =>
      item.productId === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    updatedItems = [
      ...items,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      },
    ];
  }

  await saveCart(userId, updatedItems);
  return updatedItems;
}

export async function removeItemFromCart(userId, productId) {
  const items = await getCart(userId);
  const updatedItems = items.filter((item) => item.productId !== productId);
  await saveCart(userId, updatedItems);
  return updatedItems;
}

export async function updateItemQuantity(userId, productId, quantity) {
  const items = await getCart(userId);

  if (quantity <= 0) {
    return removeItemFromCart(userId, productId);
  }

  const updatedItems = items.map((item) =>
    item.productId === productId ? { ...item, quantity } : item
  );

  await saveCart(userId, updatedItems);
  return updatedItems;
}

export async function clearCart(userId) {
  await saveCart(userId, []);
}