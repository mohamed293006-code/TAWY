import React, { useState } from "react";
import { doc, getDoc, getDocFromServer } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig.js";
import { auth } from "../../firebase/firebaseConfig.js";
import { useAuth } from "../../context/AuthContext.jsx";

function DebugAdmin() {
  const { user, profile, isAdmin, refreshProfile } = useAuth();
  const [log, setLog] = useState([]);

  function addLog(label, value) {
    setLog((prev) => [
      ...prev,
      { label, value: JSON.stringify(value, null, 2) },
    ]);
  }

  async function runDiagnosis() {
    setLog([]);

    const liveUid = auth.currentUser?.uid || null;
    addLog("1. auth.currentUser.uid (مباشرة من Firebase Auth، لا من الـ Context)", liveUid);
    addLog("2. user.uid (من الـ AuthContext)", user?.uid || null);
    addLog("3. profile الحالي في الـ Context الآن", profile);
    addLog("4. isAdmin الحالي في الـ Context الآن", isAdmin);

    if (!liveUid) {
      addLog("توقف", "لا يوجد مستخدم مسجل دخول فعلياً في Firebase Auth.");
      return;
    }

    try {
      const serverSnap = await getDocFromServer(doc(db, "users", liveUid));
      addLog(
        "5. قراءة مباشرة من السيرفر (getDocFromServer) لمستند users/" + liveUid,
        serverSnap.exists() ? serverSnap.data() : "المستند غير موجود في السيرفر!"
      );
    } catch (err) {
      addLog("5. getDocFromServer فشلت", `${err.code} - ${err.message}`);
    }

    try {
      const cachedSnap = await getDoc(doc(db, "users", liveUid));
      addLog(
        "6. قراءة عادية (getDoc، قد تُرجع Cache محلي)",
        cachedSnap.exists() ? cachedSnap.data() : "المستند غير موجود!"
      );
    } catch (err) {
      addLog("6. getDoc فشلت", `${err.code} - ${err.message}`);
    }

    const refreshed = await refreshProfile();
    addLog("7. نتيجة refreshProfile() المُعادة مباشرة", refreshed);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-2">تشخيص صلاحية الأدمن (قراءة فقط)</h1>
      <p className="text-sm text-gray-600 mb-6">
        لا يوجد أي كتابة في هذا الملف الآن — قراءة فقط.
      </p>

      <button
        onClick={runDiagnosis}
        className="bg-gray-900 text-white text-sm px-4 py-2 rounded-md mb-6"
      >
        تشغيل التشخيص
      </button>

      <div className="flex flex-col gap-3">
        {log.map((entry, i) => (
          <div key={i} className="border border-gray-200 rounded-md p-3">
            <p className="text-xs font-semibold text-gray-500 mb-1">{entry.label}</p>
            <pre className="text-xs text-gray-900 whitespace-pre-wrap break-all">
              {entry.value}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DebugAdmin;