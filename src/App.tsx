import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "@/components/layout/Layout"
import Home from "@/pages/Home"
import ProductsList from "@/pages/ProductsList"
import ProductDetail from "@/pages/ProductDetail"
import Applications from "@/pages/Applications"
import ApplicationDetail from "@/pages/ApplicationDetail"
import Projects from "@/pages/Projects"
import ProjectDetail from "@/pages/ProjectDetail"
import Resources from "@/pages/Resources"
import About from "@/pages/About"
import Contact from "@/pages/Contact"
import Enquire from "@/pages/Enquire"
import NotFound from "@/pages/NotFound"
import { PrivacyPolicy, TermsAndConditions } from "@/pages/Legal"

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/:slug" element={<ApplicationDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/enquire" element={<Enquire />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
