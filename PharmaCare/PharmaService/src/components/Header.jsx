import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig'; 
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot, orderBy, writeBatch } from 'firebase/firestore';
import { useCart } from '../context/CartContext';

const Header = () => { 
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("Khách hàng");
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotify, setShowNotify] = useState(false);
  
  const navigate = useNavigate();
  const { totalItems } = useCart(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().displayName) {
            setDisplayName(docSnap.data().displayName);
          } else {
            setDisplayName(currentUser.displayName || currentUser.email.split('@')[0]);
          }
        } catch (error) { console.error("Lỗi lấy tên:", error); }

        const q = query(
          collection(db, "notifications"),
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );
        const unsubscribeNotify = onSnapshot(q, (snapshot) => {
          setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribeNotify();
      } else {
        setUser(null);
        setDisplayName("Khách hàng");
        setNotifications([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const unreadNotifyCount = notifications.filter(n => !n.isRead).length;

  const handleToggleNotify = async () => {
    setShowNotify(!showNotify);
    setShowDropdown(false);
    if (!showNotify && unreadNotifyCount > 0) {
      const batch = writeBatch(db);
      notifications.filter(n => !n.isRead).forEach(n => batch.update(doc(db, "notifications", n.id), { isRead: true }));
      await batch.commit();
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setShowDropdown(false);
    navigate('/login');
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        
        {/* LOGO */}
        <div onClick={() => navigate('/')} style={{ ...logoStyle, cursor: 'pointer' }}>
          <div style={{ fontSize: '2rem', color: '#00b894' }}><i className="fas fa-clinic-medical"></i></div>
          <span className="brand-name" style={brandNameStyle}>PharmaStore</span>
        </div>

        {/* SEARCH */}
        <div style={searchBoxStyle}>
          <input type="text" placeholder="Tìm thuốc, TPCN..." style={inputStyle} />
          <button style={searchBtnStyle}><i className="fas fa-search"></i></button>
        </div>

        {/* ACTION */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexShrink: 0 }}>
          
          <div onClick={() => navigate('/upload-prescription')} style={{ ...uploadLinkStyle, cursor: 'pointer' }}>
            <i className="fas fa-file-upload"></i> <span className="hide-on-mobile">Gửi đơn</span>
          </div>

          {/* CHUÔNG THÔNG BÁO */}
          {user && (
            <div 
              style={{ position: 'relative' }}
              // --- MỚI: Thêm sự kiện hover cho chuông ---
              onMouseEnter={() => { setShowNotify(true); setShowDropdown(false); }}
              onMouseLeave={() => setShowNotify(false)}
            >
              <div 
                onClick={handleToggleNotify} // Vẫn giữ onClick để đánh dấu đã đọc
                style={{ 
                  fontSize: '1.3rem', 
                  color: '#2d3436', 
                  cursor: 'pointer', 
                  padding: '5px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <i className="fas fa-bell"></i>
                {unreadNotifyCount > 0 && (
                  <span style={badgeStyle}>{unreadNotifyCount}</span>
                )}
              </div>

              {/* Dropdown Thông báo */}
              {showNotify && (
                <div style={{...notifyDropdownStyle, top: '40px'}}>
                  <div style={{ padding: '12px 15px', borderBottom: '1px solid #eee', fontWeight: 'bold', fontSize: '0.9rem' }}>Thông báo</div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>Không có thông báo nào</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{ ...notifyItemStyle, backgroundColor: n.isRead ? 'white' : '#f0faff' }}>
                          <div style={{ fontSize: '0.85rem', color: '#333' }}>{n.message}</div>
                          <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '5px' }}>
                             {n.createdAt?.toDate().toLocaleString('vi-VN')}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TÀI KHOẢN */}
          {user ? (
            <div 
              style={{ position: 'relative', cursor: 'pointer', padding: '15px 0' }} 
              onMouseEnter={() => { setShowDropdown(true); setShowNotify(false); }}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div style={userBoxStyle}>
                <img src={user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="Avatar" style={avatarStyle} />
                <span className="hide-on-mobile" style={userNameStyle}>{displayName}</span>
                <i className="fas fa-caret-down" style={{ fontSize: '0.8rem', color: '#999' }}></i>
              </div>
              {showDropdown && (
                <div style={{...userDropdownStyle, top: '55px'}}>
                  <div onClick={() => navigate('/profile')} className="hover-menu-item"><i className="fas fa-user-circle"></i> Hồ sơ</div>
                  <div onClick={() => navigate('/orders')} className="hover-menu-item"><i className="fas fa-box"></i> Đơn mua</div>
                  <div style={{ borderTop: '1px solid #eee', margin: '5px 0' }}></div>
                  <div onClick={handleLogout} className="hover-menu-item logout-item"><i className="fas fa-sign-out-alt"></i> Đăng xuất</div>
                </div>
              )}
            </div>
          ) : (
             <div onClick={() => navigate('/login')} style={{ ...loginBtnStyle, cursor: 'pointer' }}>Đăng nhập</div>
          )}

          {/* GIỎ HÀNG */}
          <div onClick={() => navigate('/cart')} style={{ position: 'relative', cursor: 'pointer', display: 'flex' }}>
            <div style={{ fontSize: '1.3rem', color: '#2d3436' }}><i className="fas fa-shopping-cart"></i></div>
            {totalItems > 0 && <span style={badgeStyle}>{totalItems}</span>}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .brand-name, .hide-on-mobile { display: none; } }
        .hover-menu-item { padding: 10px 15px; color: #333; font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease; }
        .hover-menu-item:hover { background-color: #f1f9f7; color: #00b894; padding-left: 20px; }
        .logout-item { color: #d63031; }
        .logout-item:hover { background-color: #fff0f0; color: #d63031; }
      `}</style>
    </header>
  );
};

// --- STYLES GIỮ NGUYÊN ---
const headerStyle = { backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 1000, height: '70px', display: 'flex', alignItems: 'center' };
const containerStyle = { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px' };
const logoStyle = { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 };
const brandNameStyle = { fontSize: '1.3rem', fontWeight: 'bold', color: '#00b894' };
const searchBoxStyle = { flex: 1, maxWidth: '400px', display: 'flex', alignItems: 'center', backgroundColor: '#f1f2f6', borderRadius: '30px', border: '1px solid #e1e1e1', height: '40px', overflow: 'hidden' };
const inputStyle = { flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: '0 15px', fontSize: '0.9rem' };
const searchBtnStyle = { background: '#00b894', border: 'none', width: '50px', height: '100%', color: 'white', cursor: 'pointer' };
const badgeStyle = { position: 'absolute', top: '-5px', right: '-8px', background: '#ff4757', color: 'white', fontSize: '0.65rem', padding: '2px 5px', borderRadius: '10px', fontWeight: 'bold', border: '2px solid white' };
const uploadLinkStyle = { color: '#555', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500', fontSize: '0.85rem' };
const userBoxStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '5px' };
const avatarStyle = { width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' };
const userNameStyle = { fontWeight: 'bold', fontSize: '0.85rem', color: '#333', maxWidth: '80px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const notifyDropdownStyle = { position: 'absolute', top: '45px', right: '-50px', width: '280px', background: 'white', boxShadow: '0 5px 25px rgba(0,0,0,0.15)', borderRadius: '12px', zIndex: 3000, border: '1px solid #eee' };
const notifyItemStyle = { padding: '12px 15px', borderBottom: '1px solid #f8f9fa', cursor: 'default' };
const userDropdownStyle = { position: 'absolute', right: 0, width: '160px', background: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '8px 0', border: '1px solid #eee', zIndex: 3000, overflow: 'hidden' };
const loginBtnStyle = { fontWeight: '600', color: '#00b894', padding: '6px 12px', border: '1px solid #00b894', borderRadius: '20px', fontSize: '0.85rem' };

export default Header;