import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/store/Home.jsx";
import ProductDetails from "../pages/store/ProductDetails.jsx";
import Login from "../pages/auth/Login.jsx";
import Checkout from "../pages/store/Checkout.jsx";
import OrderSuccess from "../pages/store/OrderSuccess.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AddProductPage from "../pages/admin/AddProductPage.jsx";
import ProductsManager from "../pages/admin/ProductsManager.jsx";
import ShippingRatesManager from "../pages/admin/ShippingRatesManager.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route path="/order-success" element={<OrderSuccess />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-product"
        element={
          <ProtectedRoute adminOnly>
            <AddProductPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute adminOnly>
            <ProductsManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/shipping"
        element={
          <ProtectedRoute adminOnly>
            <ShippingRatesManager />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;