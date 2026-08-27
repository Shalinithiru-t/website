import { Routes, Route } from "react-router-dom"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import AdminLayout from "@/components/AdminLayout"
import LoginPage from "@/pages/LoginPage"
import DashboardPage from "@/pages/DashboardPage"
import ProductsListPage from "@/pages/ProductsListPage"
import ProductFormPage from "@/pages/ProductFormPage"
import BlogsListPage from "@/pages/BlogsListPage"
import BlogFormPage from "@/pages/BlogFormPage"
import EnquiriesListPage from "@/pages/EnquiriesListPage"
import EnquiryDetailPage from "@/pages/EnquiryDetailPage"
import ApplicationsListPage from "@/pages/ApplicationsListPage"
import ApplicationFormPage from "@/pages/ApplicationFormPage"
import ProjectsListPage from "@/pages/ProjectsListPage"
import ProjectFormPage from "@/pages/ProjectFormPage"
import SettingsPage from "@/pages/SettingsPage"

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
          <Route path="applications" element={<ApplicationsListPage />} />
          <Route path="applications/new" element={<ApplicationFormPage />} />
          <Route path="applications/:id/edit" element={<ApplicationFormPage />} />
          <Route path="projects" element={<ProjectsListPage />} />
          <Route path="projects/new" element={<ProjectFormPage />} />
          <Route path="projects/:id/edit" element={<ProjectFormPage />} />
          <Route path="blogs" element={<BlogsListPage />} />
          <Route path="blogs/new" element={<BlogFormPage />} />
          <Route path="blogs/:id/edit" element={<BlogFormPage />} />
          <Route path="enquiries" element={<EnquiriesListPage />} />
          <Route path="enquiries/:id" element={<EnquiryDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
