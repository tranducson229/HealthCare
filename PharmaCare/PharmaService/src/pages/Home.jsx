import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { db } from '../firebaseConfig'; 
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore'; 

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [doctors, setDoctors] = useState([]);
  const [bestSellers, setBestSellers] = useState([]); // State lưu sản phẩm thật từ Database

  useEffect(() => {
    // 1. LẤY DANH SÁCH BÁC SĨ
    const qDoctors = query(
      collection(db, "users"),
      where("role", "==", "doctor"),
      orderBy("rating", "desc"),
      limit(4)
    );

    const unsubDoctors = onSnapshot(qDoctors, (snapshot) => {
      const doctorsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        img: doc.data().photoURL || doc.data().img || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
        name: doc.data().displayName || doc.data().name || "Bác sĩ",
        rating: Number(doc.data().rating) || 0,
        reviews: doc.data().reviewCount || 0,
        specialty: doc.data().specialty || "Chuyên gia y tế",
        experience: doc.data().experience || "Nhiều năm kinh nghiệm"
      }));
      setDoctors(doctorsList);
    }, (error) => {
      console.error("Lỗi lấy danh sách bác sĩ:", error);
    });

    // 2. LẤY DANH SÁCH SẢN PHẨM BÁN CHẠY
    // Lưu ý: Nếu DB của bạn chưa có trường 'soldCount', danh sách có thể trống.
    // Tạm thời bạn có thể bỏ dòng orderBy("soldCount", "desc") đi nếu test chưa ra data nhé!
    const qProducts = query(
      collection(db, "products"),
      // orderBy("soldCount", "desc"), // Mở comment dòng này khi DB bạn đã có trường soldCount
      limit(8)
    );

    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      const productsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBestSellers(productsList);
    }, (error) => {
      console.error("Lỗi lấy danh sách sản phẩm:", error);
    });

    return () => {
      unsubDoctors();
      unsubProducts();
    };
  }, []);

  const categories = [
    { id: 1, dbName: "Pain Relievers", name: "Thuốc giảm đau", icon: "💊", color: "#e3f2fd" },
    { id: 2, dbName: "Supplements", name: "Thực phẩm chức năng", icon: "🌿", color: "#e8f5e9" },
    { id: 3, dbName: "Cosmetics", name: "Dược mỹ phẩm", icon: "🧴", color: "#fff3e0" },
    { id: 4, dbName: "Medical Devices", name: "Thiết bị y tế", icon: "🌡️", color: "#fce4ec" },
    { id: 5, dbName: "Personal Care", name: "Chăm sóc cá nhân", icon: "🪥", color: "#f3e5f5" },
    { id: 6, dbName: "Baby Care", name: "Sản phẩm cho bé", icon: "🍼", color: "#fffde7" },
  ];

  const handleAddToCart = (e, product) => {
    e.preventDefault(); 
    
    // Xử lý an toàn: Đảm bảo price luôn là số kể cả khi DB đang lưu chuỗi
    let cleanPrice = product.price;
    if (typeof cleanPrice === 'string') {
      cleanPrice = parseInt(cleanPrice.replace(/\./g, '').replace('đ', '')) || 0;
    }
    
    const productToAdd = { ...product, price: cleanPrice };
    addToCart(productToAdd);
    toast.success(`Đã thêm "${product.name}" vào giỏ!`, { position: "top-right", autoClose: 2000 });
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "3px" }}>
        {[...Array(5)].map((_, index) => (
          <span key={index} style={{ color: index < fullStars ? "#ffc107" : "#e4e5e9", fontSize: "16px" }}>★</span>
        ))}
      </div>
    );
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <ToastContainer />

      {/* SECTION 1: HERO BANNER */}
      <section style={heroStyle}>
        <div style={heroOverlayStyle}></div>
        <div style={heroContentStyle}>
          <div style={{ flex: '1 1 500px', textAlign: 'left' }}>
            <span style={labelStyle}>TIÊU CHUẨN GPP QUỐC TẾ</span>
            <h1 style={titleStyle}>Chăm sóc <span style={{ color: '#007bff' }}>sức khỏe</span> <br/> toàn diện cho bạn</h1>
            <p style={descStyle}>PharmaStore đồng hành cùng gia đình bạn với đội ngũ dược sĩ chuyên môn cao và sản phẩm chính hãng 100%.</p>
            <Link to="/Appointment" style={{ textDecoration: 'none' }}>
              <button style={ctaButtonStyle}>ĐẶT LỊCH NGAY</button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: SERVICES */}
      <section style={serviceSectionStyle}>
         <div style={{ textAlign: 'center' }}><h4 style={{ color: '#007bff' }}>🚚 MIỄN PHÍ VẬN CHUYỂN</h4><p style={{ fontSize: '0.9rem', color: '#666' }}>Cho đơn hàng từ 300.000đ</p></div>
         <div style={{ textAlign: 'center' }}><h4 style={{ color: '#007bff' }}>🛡️ 100% CHÍNH HÃNG</h4><p style={{ fontSize: '0.9rem', color: '#666' }}>Kiểm tra thuốc trước khi nhận</p></div>
         <div style={{ textAlign: 'center' }}><h4 style={{ color: '#007bff' }}>👩‍⚕️ TƯ VẤN TẬN TÂM</h4><p style={{ fontSize: '0.9rem', color: '#666' }}>Đội ngũ bác sĩ giàu kinh nghiệm</p></div>
      </section>

      {/* SECTION 3: CATEGORIES */}
      <section style={{ padding: '60px 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Danh Mục Sản Phẩm</h2>
        <div style={categoryGridStyle}>
          {categories.map(cat => (
            <div 
              key={cat.id} 
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat.dbName)}&title=${encodeURIComponent(cat.name)}`)}
              style={{ 
                background: cat.color, 
                padding: '25px 15px', 
                borderRadius: '20px', 
                textAlign: 'center', 
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{cat.icon}</div>
              <h4 style={{ fontSize: '0.9rem' }}>{cat.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: BEST SELLERS */}
      <section style={{ padding: '60px 20px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ borderLeft: '5px solid #007bff', paddingLeft: '15px' }}>Sản Phẩm Nổi Bật 🔥</h2>
              <Link to="/products" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>Xem tất cả →</Link>
          </div>
          <div style={productGridStyle}>
            {bestSellers.length > 0 ? bestSellers.map(product => (
              
              /* 1. ĐÃ THAY THẺ <Link> BẰNG <div> VÀ DÙNG navigate */
              <div 
                key={product.id} 
                onClick={() => navigate(`/products/${product.id}`)}
                style={{ ...productCardStyle, transition: 'all 0.3s ease', cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
                }}
              >
                {product.discount && <span style={discountBadgeStyle}>{product.discount}</span>}
                
                <div style={productImgContainerStyle}>
                  <img 
                    src={product.image || product.img || "https://production-cdn.pharmacity.io/digital/425x425/plain/e-com/images/ecommerce/20250613080005-0-P25239.jpg"} 
                    alt={product.name} 
                    style={productImgStyle} 
                  />
                </div>
                
                <h4 style={{ ...productNameStyle, textDecoration: 'none' }}>{product.name}</h4>
                
                <div style={{ marginBottom: '15px', marginTop: 'auto' }}>
                  <span style={{ color: '#007bff', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>
                    {Number(product.price).toLocaleString('vi-VN')}đ
                  </span>
                  {product.oldPrice && (
                    <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '0.9rem', marginLeft: '10px' }}>
                       {Number(product.oldPrice).toLocaleString('vi-VN')}đ
                    </span>
                  )}
                </div>
                
                <button 
                  className="add-btn" 
                  onClick={(e) => {
                    // 2. THÊM stopPropagation ĐỂ KHI BẤM NÚT NÀY KHÔNG BỊ CHUYỂN TRANG
                    e.stopPropagation(); 
                    handleAddToCart(e, product);
                  }} 
                  style={{ ...addToCartBtnStyle, transition: '0.3s' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#007bff';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#e3f2fd';
                    e.currentTarget.style.color = '#007bff';
                  }}
                >
                  + Thêm vào giỏ
                </button>
              </div>

            )) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#999' }}>
                ⏳ Đang tải danh sách sản phẩm...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 5: ĐỘI NGŨ BÁC SĨ */}
      <section style={{ padding: '70px 20px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', flexWrap: 'wrap', gap: '15px' }}>
            <h2 style={{ borderLeft: '5px solid #007bff', paddingLeft: '15px', fontSize: '28px', fontWeight: 'bold' }}>
              Đội Ngũ Bác Sĩ 👨‍⚕️
            </h2>

            <Link to="/doctors" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>
              Xem danh sách →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '30px' }}>
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  style={{ background: '#ffffff', padding: '30px 20px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.06)', transition: '0.3s', position: 'relative', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                  onClick={() => navigate(`/doctor/${doctor.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.06)';
                  }}
                >

                  <span style={{ position: 'absolute', top: '15px', right: '15px', background: doctor.status === 'online' ? '#28c76f' : '#6c757d', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                    {doctor.status === 'online' ? 'Online' : 'Offline'}
                  </span>

                  <img
                    src={doctor.img}
                    alt={doctor.name}
                    style={{ width: '110px', height: '110px', borderRadius: '50%', margin: '0 auto 15px', objectFit: 'cover', border: '4px solid #f1f1f1' }}
                    onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"; }}
                  />

                  <h4 style={{ marginBottom: '6px', fontWeight: '700', color: '#2d3436' }}>
                    {doctor.name}
                  </h4>

                  <p style={{ color: '#007bff', fontWeight: '600', marginBottom: '8px', fontSize: '15px' }}>
                    {doctor.specialty || "Chuyên gia y tế"}
                  </p>

                  <div style={{ marginBottom: '10px' }}>
                    {renderStars(doctor.rating)}
                    <div style={{ fontSize: '13px', color: '#636e72', marginTop: '4px' }}>
                      <strong>{doctor.rating.toFixed(1)}</strong> ({doctor.reviews || 0} đánh giá)
                    </div>
                  </div>

                  <p style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '20px', height: '40px', overflow: 'hidden', lineHeight: '1.4' }}>
                    {doctor.experience || "Giàu kinh nghiệm chuyên môn"}
                  </p>

                  <div style={{ marginTop: 'auto' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate('/appointment'); }}
                      style={{ width: '100%', padding: '12px', background: 'linear-gradient(45deg, #007bff, #00b894)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', fontSize: '14px' }}
                    >
                      Đặt lịch ngay
                    </button>
                  </div>

                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#999' }}>
                ⏳ Đang tải danh sách bác sĩ hàng đầu...
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

// --- STYLES OBJECTS ---
const heroStyle = { width: '100%', backgroundImage: "url('https://suckhoedoisong.qltns.mediacdn.vn/thumb_w/640/324455921873985536/2024/1/1/truong-hop-bac-si-duoc-quyen-tu-choi-kham-benh-1704096961139471832464.png')", backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', padding: '80px 20px' };
const heroOverlayStyle = { position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.56)' };
const heroContentStyle = { position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '50px' };
const labelStyle = { background: '#007bff', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' };
const titleStyle = { fontSize: '3.5rem', fontWeight: '900', color: '#1a3a5a', margin: '20px 0', lineHeight: '1.2' };
const descStyle = { fontSize: '1.2rem', color: '#5a7184', marginBottom: '30px' };
const ctaButtonStyle = { padding: '15px 40px', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0, 123, 255, 0.2)' };
const serviceSectionStyle = { display: 'flex', justifyContent: 'center', gap: '40px', padding: '40px 5%', flexWrap: 'wrap', background: 'white', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' };
const categoryGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' };
const productGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '30px' };
const productCardStyle = { background: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', position: 'relative', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', height: '100%', display: 'flex', flexDirection: 'column', color: '#333' };
const discountBadgeStyle = { position: 'absolute', top: '10px', left: '10px', background: '#ff4757', color: 'white', padding: '2px 8px', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 'bold' };
const productImgContainerStyle = { height: '180px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const productImgStyle = { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' };
const productNameStyle = { marginBottom: '10px', height: '40px', overflow: 'hidden', fontSize: '1rem', fontWeight: 'bold' };
const addToCartBtnStyle = { width: '100%', padding: '10px', background: '#e3f2fd', color: '#007bff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

export default Home;