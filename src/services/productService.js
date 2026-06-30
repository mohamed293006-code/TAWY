import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

const productsRef = collection(db, "products");

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export async function getAllProducts() {
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function getProductById(productId) {
  const ref_ = doc(db, "products", productId);
  const snapshot = await getDoc(ref_);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function getProductsByCategory(category) {
  const q = query(productsRef, where("category", "==", category));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function createProduct(productData) {
  const docRef = await addDoc(productsRef, {
    ...productData,
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(productId, productData) {
  const ref_ = doc(db, "products", productId);
  await updateDoc(ref_, {
    ...productData,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(productId) {
  const ref_ = doc(db, "products", productId);
  await deleteDoc(ref_);
}

export async function setProductWithId(productId, productData) {
  const ref_ = doc(db, "products", productId);
  await setDoc(ref_, {
    ...productData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "tawy/products");

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error?.message || "فشل رفع الصورة إلى Cloudinary."
    );
  }

  const data = await response.json();
  return data.secure_url;
}

export async function addProductWithImages({ title, description, price, category }, imageFiles) {
  if (!title || price == null) {
    throw new Error("اسم المنتج والسعر مطلوبان.");
  }

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("إعدادات Cloudinary غير مكتملة في ملف .env");
  }

  const files = Array.isArray(imageFiles) ? imageFiles : [];

  const imageUrls = await Promise.all(
    files.map((file) => uploadImageToCloudinary(file))
  );

  const mainImage = imageUrls[0] || "";

  const docRef = await addDoc(productsRef, {
    name: title,
    description: description || "",
    price: Number(price),
    category: category || "",
    mainImage,
    images: imageUrls,
    image: mainImage,
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updateProductWithImages(
  productId,
  { title, description, price, category },
  newImageFiles = []
) {
  if (!title || price == null) {
    throw new Error("اسم المنتج والسعر مطلوبان.");
  }

  const updatePayload = {
    name: title,
    description: description || "",
    price: Number(price),
    category: category || "",
    updatedAt: serverTimestamp(),
  };

  if (newImageFiles.length > 0) {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error("إعدادات Cloudinary غير مكتملة في ملف .env");
    }

    const imageUrls = await Promise.all(
      newImageFiles.map((file) => uploadImageToCloudinary(file))
    );

    updatePayload.mainImage = imageUrls[0];
    updatePayload.images = imageUrls;
    updatePayload.image = imageUrls[0];
  }

  const ref_ = doc(db, "products", productId);
  await updateDoc(ref_, updatePayload);
}