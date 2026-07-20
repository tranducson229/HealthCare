import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebaseConfig'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// --- BƯỚC 1: IMPORT HEADER VÀ FOOTER ---
// (Lưu ý: Bạn hãy kiểm tra lại đường dẫn '../../components/...' xem đã khớp với cấu trúc thư mục của bạn chưa nhé)
import Header from '../../components/Header'; 
import Footer from '../../components/Footer'; 

import './UserLayout.css';

const UserLayout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Lấy thông tin user để hiện lên Sidebar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({ ...currentUser, ...docSnap.data() });
        } else {
          setUser(currentUser);
        }
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="user-layout-wrapper" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      
      {/* --- BƯỚC 2: GỌI HEADER RA ĐÂY --- */}
      <Header />
      
      <div className="user-container" style={{ flex: 1 }}>
        <div className="user-grid">
          
          {/* --- SIDEBAR TRÁI --- */}
          <aside className="user-sidebar">
            {/* User Info Tóm tắt */}
            <div className="sidebar-user-info">
              <img 
                src={user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                alt="Avatar" 
                className="sidebar-avatar"
                onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              />
              <div className="info-text">
                <span className="welcome-text">Xin chào,</span>
                <strong className="user-name">{user.displayName || user.email?.split('@')[0]}</strong>
              </div>
            </div>

            {/* Menu Links */}
            <nav className="sidebar-nav">
              <NavLink to="/profile" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <i className="fas fa-user-circle"></i> Hồ sơ cá nhân
              </NavLink>

              <NavLink to="/MyHealth" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <i className="fas fa-file-medical-alt"></i> Hồ sơ sức khỏe
              </NavLink>
              
              <NavLink to="/orders" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <i className="fas fa-box-open"></i> Đơn mua
              </NavLink>
              
              <NavLink to="/upload-prescription" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <i className="fas fa-file-medical"></i> Gửi đơn thuốc
              </NavLink>
              
              <NavLink to="/chat" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <i className="fas fa-comments"></i> Tư vấn bác sĩ
              </NavLink>

              <div className="sidebar-divider"></div>

              <button onClick={handleLogout} className="sidebar-logout-btn">
                <i className="fas fa-sign-out-alt"></i> Đăng xuất
              </button>
            </nav>
          </aside>

          {/* --- MAIN CONTENT PHẢI --- */}
          <main className="user-content">
            <Outlet />
          </main>
          
        </div>
      </div>

      {/* --- BƯỚC 3: GỌI FOOTER RA ĐÂY --- */}
      <Footer />
      
    </div>
  );
};

export default UserLayout;