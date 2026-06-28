import React from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-4">
        <CheckCircle size={56} className="text-green-600" />

        <h1 className="text-xl font-bold text-gray-900">
          تم استلام طلبك بنجاح
        </h1>

        {orderId ? (
          <p className="text-sm text-gray-600">
            رقم الطلب:{" "}
            <span className="font-medium text-gray-900">{orderId}</span>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            سيتم التواصل معك قريباً لتأكيد الطلب.
          </p>
        )}

        <p className="text-sm text-gray-500">
          طريقة الدفع: الدفع عند الاستلام
        </p>

        <Link
          to="/"
          className="mt-4 bg-gray-900 text-white text-sm px-6 py-2.5 rounded-md hover:bg-gray-700 transition-colors"
        >
          العودة للمتجر
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;