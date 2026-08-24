import { Routes, Route } from "react-router-dom"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import AdminLayout from "@/components/AdminLayout"
import LoginPage from "@/pages/LoginPage"
import DashboardPage from "@/pages/DashboardPage"
import ComingSoonPage from "@/pages/ComingSoonPage"
import ProductsListPage from "@/pages/ProductsListPage"
import ProductFormPage from "@/pages/ProductFormPage"
import BlogsListPage from "@/pages/BlogsListPage"
import BlogFormPage from "@/pages/BlogFormPage"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsListPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id/edit" element={<ProductFormPage />} />
          <Route path="blogs" element={<BlogsListPage />} />
          <Route path="blogs/new" element={<BlogFormPage />} />
          <Route path="blogs/:id/edit" element={<BlogFormPage />} />
          <Route path="enquiries" element={<ComingSoonPage title="Enquiries" />} />
          <Route path="settings" element={<ComingSoonPage title="Settings" />} />
        </Route>
      </Route>
    </Routes>
  )
}
