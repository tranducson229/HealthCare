import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../firebaseConfig'; 
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { listenToNotifications, markAsRead } from '../../services/notificationService';
import './DoctorLayout.css'; 

// URL âm thanh (Ví dụ)
const ONLINE_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

const DoctorLayout = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true); // MỚI: State để quản lý quá trình tải dữ liệu
  const [isOnline, setIsOnline] = useState(true);
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  
  const lastNotificationIdRef = useRef(null);
  const audioRef = useRef(new Audio(ONLINE_SOUND_URL));

  const navigate = useNavigate();
  const location = useLocation();

  // --- MỚI: Xử lý loading và try...catch khi lấy dữ liệu bác sĩ ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setDoctor({ ...user, ...docSnap.data() });
          } else {
            setDoctor(user);
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin bác sĩ:", error);
      } finally {
        setLoading(false); // Dù thành công hay lỗi thì cũng phải tắt loading
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const unsubscribe = listenToNotifications((data) => {
      setNotifications(data);
      // Tính số lượng chưa đọc
      setUnreadCount(data.filter(n => !n.isRead).length);
      
      if (data.length > 0) {
        const newest = data[0];
        if (lastNotificationIdRef.current && newest.id !== lastNotificationIdRef.current && !newest.isRead) {
          setToast({ title: newest.title, message: newest.message, type: newest.type });
          setTimeout(() => setToast(null), 3000);

          try {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.log("Audio blocked", e));
          } catch (err) {}

          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 1000);
        }
        lastNotificationIdRef.current = newest.id;
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const toggleNotif = (e) => {
    e.stopPropagation();
    setShowNotifDropdown(!showNotifDropdown);
    setShowDropdown(false);
  };

  const handleNotificationClick = async (notif) => {
    // 1. Đánh dấu đã đọc
    if (!notif.isRead) {
      await markAsRead(notif.id);
    }

    // 2. Đóng dropdown
    setShowNotifDropdown(false);

    // 3. Chuyển sang trang Chat và mang theo ID người gửi
    navigate('/doctor/chat', { 
      state: { 
        selectedUserId: notif.senderId 
      } 
    });
  };

  const handleViewAll = () => {
    setShowNotifDropdown(false);
    navigate('/doctor/chat'); 
  };

  // --- MỚI: Hiển thị giao diện chờ khi đang lấy dữ liệu ---
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundColor: '#f4f7f6', color: '#666' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#007bff', marginBottom: '15px' }}></i>
        <h2>Đang tải dữ liệu hệ thống...</h2>
      </div>
    );
  }

  // Đảm bảo có dữ liệu bác sĩ mới hiển thị khung giao diện
  if (!doctor) return null;

  return (
    <div className="doctor-layout-wrapper">
      
      <aside className={`doctor-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">🩺</div>
          <span className="brand-text">PharmaCare</span>
        </div>
        <nav className="sidebar-menu">
          <NavLink to="/doctor" end className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
            <i className="fas fa-home"></i><span>Dashboard</span>
          </NavLink>
          <NavLink to="/doctor/schedule" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
            <i className="far fa-calendar-alt"></i><span>Lịch khám</span>
          </NavLink>
          <NavLink to="/doctor/patients" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
            <i className="fas fa-user-injured"></i><span>Bệnh nhân</span>
          </NavLink>
          <NavLink to="/doctor/exams" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
            <i className="fas fa-stethoscope"></i><span>Khám bệnh</span>
          </NavLink>
          <NavLink to="/doctor/prescriptions" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
            <i className="fas fa-file-prescription"></i><span>Đơn thuốc</span>
          </NavLink>
          <NavLink to="/doctor/chat" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
            <i className="fas fa-comments"></i><span>Tin nhắn</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Đăng xuất
          </button>
        </div>
      </aside>

      {isMobileMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}

      <div className="doctor-main-content">
        <header className="main-header">
          <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(true)}>
            <i className="fas fa-bars"></i>
          </button>

          <div className="header-search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Tìm kiếm bệnh nhân..." />
          </div>

          <div className="header-right">
            <div className="status-indicator" onClick={() => setIsOnline(!isOnline)}>
              <span className={`dot ${isOnline ? 'online' : 'offline'}`}></span>
              <span className="status-text">{isOnline ? 'Sẵn sàng' : 'Vắng mặt'}</span>
            </div>

            <div className="notif-box">
              <div 
                className={`notif-icon-wrapper ${isShaking ? 'shake-animation' : ''}`} 
                onClick={toggleNotif}
              >
                <i className="fas fa-bell"></i>
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </div>

              {showNotifDropdown && (
                <div className="notif-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="notif-header">
                    <span>Thông báo ({unreadCount})</span>
                    <span className="close-notif" onClick={() => setShowNotifDropdown(false)}>&times;</span>
                  </div>
                  
                  <div className="notif-list-scroll">
                    {notifications.length === 0 ? (
                      <div className="notif-empty">Không có thông báo mới</div>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div 
                          key={n.id} 
                          className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                          onClick={() => handleNotificationClick(n)}
                        >
                          <div className="notif-sender">{n.title || "Hệ thống"}</div>
                          <div className="notif-msg">{n.message}</div>
                          <div className="notif-date">
                            {n.createdAt?.seconds ? new Date(n.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Vừa xong'}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="notif-footer" onClick={handleViewAll}>
                      Xem tất cả
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="user-profile" onClick={() => { setShowDropdown(!showDropdown); setShowNotifDropdown(false); }}>
              <div className="user-info">
                <img src={doctor.photoURL || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} alt="Avatar" />
                <div className="user-text">
                  <strong>BS. {doctor.displayName || 'Khách'}</strong>
                  <small>{doctor.specialty || 'Chuyên khoa Nội'}</small>
                </div>
              </div>
              {showDropdown && (
                <div className="custom-dropdown-menu">
                   <div className="dropdown-item" onClick={() => navigate('/doctor/profile')}>Hồ sơ cá nhân</div>
                   <div className="dropdown-item text-danger" onClick={handleLogout}>Đăng xuất</div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="page-content">
           <Outlet />
        </div>
      </div>

      {toast && (
        <div className="toast-popup">
          <div className="toast-icon">🔔</div>
          <div>
            <strong>{toast.title}</strong>
            <p>{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorLayout;