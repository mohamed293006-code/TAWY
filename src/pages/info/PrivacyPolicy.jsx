import React from "react";

function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">سياسة الخصوصية</h1>
      <div className="flex flex-col gap-4 text-sm text-gray-600 leading-relaxed">
        <p>
          نحترم خصوصية عملائنا، ولا نقوم بمشاركة بياناتك الشخصية (الاسم، الهاتف،
          العنوان) مع أي طرف ثالث إلا في حدود إتمام عملية الشحن والتوصيل.
        </p>
        <p>
          يتم تخزين بيانات حسابك وطلباتك بشكل آمن، ولا نقوم باستخدامها في أي
          غرض تسويقي بدون إذنك المسبق.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;