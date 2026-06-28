import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxLWz1Rdtdk2Poq4fS4FNPzAbwyeEQwPc",
  authDomain: "tawy-store.firebaseapp.com",
  projectId: "tawy-store",
  storageBucket: "tawy-store.firebasestorage.app",
  messagingSenderId: "838582098387",
  appId: "1:838582098387:web:486ec4a2b75e8ee58a7726",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "تيشيرت قطن أساسي",
    category: "ملابس",
    price: 250,
    image: "https://placehold.co/400x400?text=Tee",
  },
  {
    id: "2",
    name: "حقيبة ظهر جلد",
    category: "إكسسوارات",
    price: 480,
    image: "https://placehold.co/400x400?text=Bag",
  },
  {
    id: "3",
    name: "ساعة يد كلاسيك",
    category: "إكسسوارات",
    price: 620,
    image: "https://placehold.co/400x400?text=Watch",
  },
  {
    id: "4",
    name: "سماعات لاسلكية",
    category: "إلكترونيات",
    price: 350,
    image: "https://placehold.co/400x400?text=Headphones",
  },
  {
    id: "5",
    name: "بنطلون جينز",
    category: "ملابس",
    price: 300,
    image: "https://placehold.co/400x400?text=Jeans",
  },
  {
    id: "6",
    name: "نظارة شمسية",
    category: "إكسسوارات",
    price: 180,
    image: "https://placehold.co/400x400?text=Sunglasses",
  },
];

async function seed() {
  for (const product of MOCK_PRODUCTS) {
    await setDoc(doc(collection(db, "products"), product.id), product);
    console.log(`Added: ${product.name}`);
  }
  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});