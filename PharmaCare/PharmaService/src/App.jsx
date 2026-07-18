import { Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

import ImportData from './ImportData';

// --- 1. Import Header & Footer ---
import Header from "./components/Header";
import Footer from "./components/Footer";
import UserChatWidget from "./components/UserChatWidget";

// Layouts
import UserLayout from "./pages/User/UserLayout";
import DoctorLayout from "./pages/Doctor/DoctorLayout"; 

// Home 
import Home from "./pages/Home";

// Auth
import Login from "./pages/User/Auth/LoginPage"; 
import Register from "./pages/User/Auth/Register";
import ForgotPassword from "./pages/User/Auth/ForgotPassword";
import PharmacistRegister from "./pages/User/Auth/PharmacistRegister";

// Products
import ProductList from "./pages/User/Products/ProductList";
import ProductDetail from "./pages/User/Products/ProductDetail";

// Cart
import Cart from "./pages/User/Cart/Cart";
import { CartProvider } from "./context/CartContext";
import Checkout from "./pages/User/Cart/Checkout";

// Orders
import MyOrders from "./pages/User/Orders/MyOrders";
import OrderDetail from "./pages/User/Orders/OrderDetail";

// Profile
import Profile from "./pages/User/Profile/Profile";
import UploadPrescription from "./pages/User/UploadPrescription";
import MyHealth from "./pages/User/Profile/MyHealth";
import PrescriptionDetail from "./pages/User/PrescriptionDetail";
import Viewprofiledoctor from "./pages/User/Profile/Viewprofiledoctor";
import DoctorList from "./pages/User/DoctorList"

// Chat User
import UserChat from "./pages/User/Chat/UserChat";

// Doctor Pages
import DoctorChat from "./pages/Doctor/Chat"; 
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorProfile from "./pages/Doctor/Profile";
import DoctorSchedule from "./pages/Doctor/DoctorSchedule";
import DoctorExam from "./pages/Doctor/Exam/DoctorExam";
import DoctorExamList from "./pages/Doctor/Exam/DoctorExamList";
import DoctorPatients from "./pages/Doctor/Patients/DoctorPatients";
import PatientDetail from "./pages/Doctor/Patients/PatientDetail";
import DoctorPrescriptionList from "./pages/Doctor/Prescriptions/DoctorPrescriptions";// Appointment
import Appointment from "./pages/User/Appointment";

// Pharmacist
import PharmacistDashboard from "./pages/Pharmacist/PharmacistDashBoard";
import CreatePrescription from "./pages/Pharmacist/CreatePrescription";
import PharmacistInventory from "./pages/Pharmacist/PharmacistInventory";
import PharmacistOrders from "./pages/Pharmacist/PharmacistOrders";
import PharmacistPrescriptionHistory from './pages/Pharmacist/PharmacistPrescriptionHistory';

// --- Layout Chính cho khách vãng lai ---
const MainLayout = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
      <UserChatWidget />
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <Routes>

        {/* --- NHÓM 1: AUTH --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/pharmacist/register" element={<PharmacistRegister />} />
        <Route path="/import-secret-data" element={<ImportData />} />

        {/* --- NHÓM 2: KHÁCH HÀNG (Dùng Header/Footer chung) --- */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="doctors" element={<DoctorList />} />
          <Route path="myhealth" element={<MyHealth />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="/user/prescription/:id" element={<PrescriptionDetail />} />
          <Route path="doctor/:id" element={<Viewprofiledoctor />} />
        </Route>

        {/* --- NHÓM 3: NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP --- */}
        <Route element={<UserLayout />}>
          <Route path="orders" element={<MyOrders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="upload-prescription" element={<UploadPrescription />} />
          <Route path="chat" element={<UserChat />} />
        </Route>

        {/* --- NHÓM 4: BÁC SĨ --- */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route index element={<DoctorDashboard />} />
          <Route path="chat" element={<DoctorChat />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="schedule" element={<DoctorSchedule />} />
          <Route path="exams" element={<DoctorExamList />} />
          <Route path="exam/:appointmentId" element={<DoctorExam />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="patient/:patientId" element={<PatientDetail />} />
          <Route path="prescriptions" element={<DoctorPrescriptionList />} />
        </Route>

        {/* --- NHÓM 5: DƯỢC SĨ (PHARMACIST) --- */}
        <Route path="/pharmacist">
          {/* Bạn có thể tạo PharmacistLayout tương tự DoctorLayout nếu muốn có Sidebar riêng */}
          <Route path="dashboard" element={<PharmacistDashboard />} />
          <Route path="inventory" element={<PharmacistInventory />} />
          <Route path="orders" element={<PharmacistOrders />} />
          <Route path="prescription/:recordId" element={<CreatePrescription />} />
          <Route path="history" element={<PharmacistPrescriptionHistory />} />
        </Route>

      </Routes>
    </CartProvider>
  );
}

export default App;