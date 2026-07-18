import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { db } from '../../../firebaseConfig'; // Đảm bảo đường dẫn tới file config
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { useCart } from '../../../context/CartContext'; // Gọi context Giỏ hàng
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetail = () => {
  const { id } = useParams(); // Lấy ID dài của Firebase từ URL
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // --- STATE LƯU DỮ LIỆU TỪ FIREBASE ---
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  // --- LOGIC LẤY SẢN PHẨM TỪ FIREBASE THEO ID ---
  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        // 1. Lấy thông tin sản phẩm chính
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() };
          // Chuẩn hóa giá tiền và tồn kho
          productData.price = typeof productData.price === 'string' ? parseInt(productData.price.replace(/\D/g, '')) : productData.price;
          productData.stock = productData.stock > 0 || productData.stock === true;
          setProduct(productData);

          // 2. Lấy sản phẩm liên quan (Cùng danh mục, bỏ qua sản phẩm hiện tại)
          if (productData.category) {
            const q = query(
              collection(db, "products"),
              where("category", "==", productData.category),
              limit(5) // Lấy 5 cái để loại trừ đi 1 cái trùng ID (nếu có)
            );
            const relatedSnap = await getDocs(q);
            const related = [];
            relatedSnap.forEach(d => {
              if (d.id !== docSnap.id) {
                const rData = d.data();
                related.push({
                  id: d.id,
                  ...rData,
                  price: typeof rData.price === 'string' ? parseInt(rData.price.replace(/\D/g, '')) : rData.price,
                  stock: rData.stock > 0 || rData.stock === true
                });
              }
            });
            setRelatedProducts(related.slice(0, 4)); // Giữ lại đúng 4 cái
          }
        } else {
          setProduct(null); // Không tìm thấy
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setQuantity(1); // Reset số lượng khi đổi sản phẩm
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !product.stock) return;
    
    // Thêm vào giỏ với số lượng tùy chọn
    const productToAdd = { ...product, quantity: quantity };
    
    // Gọi hàm addToCart (Lưu ý: Bạn có thể cần điều chỉnh logic context nếu context của bạn không hỗ trợ quantity)
    for (let i = 0; i < quantity; i++) {
        addToCart(product); 
    }
    
    toast.success(`Đã thêm ${quantity} "${product.name}" vào giỏ!`, { position: "top-right", autoClose: 2000 });
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px', fontSize: '1.2rem', color: '#666' }}>Đang tải thông tin sản phẩm...</div>;
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Sản phẩm không tồn tại hoặc đã bị xóa.</h2>
        <Link to="/products" style={{ color: '#007bff', fontWeight: 'bold' }}>Quay lại cửa hàng</Link>
      </div>
    );
  }

  // Fallback (dữ liệu dự phòng) cho những trường Firebase của bạn có thể chưa có
  const displayOldPrice = product.oldPrice || (product.price * 1.2);
  const displayDiscount = product.discount || "-15%";
  const displayRating = product.rating || 5.0;
  const displaySold = product.sold || Math.floor(Math.random() * 500) + 50;
  const displayBrand = product.brand || "Đang cập nhật";

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '40px 5%' }}>
      <ToastContainer />
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#666', display: 'flex', alignItems: 'center', marginBottom: '20px', fontWeight: '500', fontSize: '1rem', gap: '5px', cursor: 'pointer', padding: 0 }}>
          <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>‹</span> Quay lại
        </button>

        {/* --- Phần 1: Thông tin chính sản phẩm --- */}
        <div style={{ display: 'flex', gap: '40px', background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 400px', width: '100%' }}>
            <div style={{ position: 'relative', textAlign: 'center', background: 'white', border: '1px solid #eee', borderRadius: '15px', padding: '20px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={product.img || product.image || "https://via.placeholder.com/400"} alt={product.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
              <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#d32f2f', color: 'white', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                {displayDiscount}
              </div>
            </div>
          </div>

          <div style={{ flex: '1 1 450px' }}>
            <div style={{ marginBottom: '10px' }}>
               <span style={{ background: '#e3f2fd', color: '#0d47a1', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', marginRight: '10px' }}>
                 {(product.category || "SẢN PHẨM KHÁC").toUpperCase()}
               </span>
               <span style={{ color: '#007bff', fontWeight: 'bold', fontSize: '0.9rem' }}>{displayBrand}</span>
            </div>
            
            <h1 style={{ margin: '10px 0', fontSize: '1.8rem', color: '#2c3e50', lineHeight: '1.3' }}>{product.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', fontSize: '0.9rem' }}>
              <div style={{ color: '#ffc107' }}>★★★★★ <span style={{ color: '#888' }}>({displayRating})</span></div>
              <div style={{ width: '1px', height: '15px', background: '#ddd' }}></div>
              <div style={{ color: '#666' }}>Đã bán: <strong>{displaySold.toLocaleString('vi-VN')}</strong></div>
            </div>

            <div style={{ background: '#fafafa', padding: '20px', borderRadius: '12px', marginBottom: '25px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px' }}>
                <span style={{ fontSize: '2rem', color: '#d32f2f', fontWeight: 'bold', lineHeight: 1 }}>{product.price.toLocaleString('vi-VN')}đ</span>
                <span style={{ fontSize: '1.1rem', color: '#999', textDecoration: 'line-through' }}>{displayOldPrice.toLocaleString('vi-VN')}đ</span>
              </div>
              <p style={{ margin: '10px 0 0', color: product.stock ? '#2e7d32' : '#d32f2f', fontWeight: 'bold' }}>
                {product.stock ? "✓ Còn hàng" : "✕ Tạm hết hàng"}
              </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>Số lượng:</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} style={{ padding: '10px 15px', border: 'none', background: 'white', cursor: 'pointer', borderRadius: '8px 0 0 8px' }}>-</button>
                <input type="text" value={quantity} readOnly style={{ width: '50px', textAlign: 'center', border: 'none', fontWeight: 'bold', outline: 'none' }} />
                <button onClick={() => setQuantity(q => q+1)} style={{ padding: '10px 15px', border: 'none', background: 'white', cursor: 'pointer', borderRadius: '0 8px 8px 0' }}>+</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <button 
                onClick={handleAddToCart}
                disabled={!product.stock} 
                style={{ flex: 1, minWidth: '180px', padding: '15px', background: 'white', color: '#d32f2f', border: '2px solid #d32f2f', borderRadius: '10px', fontWeight: 'bold', cursor: product.stock ? 'pointer' : 'not-allowed', opacity: product.stock ? 1 : 0.6 }}
              >
                THÊM VÀO GIỎ
              </button>
              <button 
                onClick={() => {
                  handleAddToCart();
                  setTimeout(() => navigate('/cart'), 500); // Chuyển sang giỏ hàng sau khi thêm
                }}
                disabled={!product.stock} 
                style={{ flex: 1, minWidth: '180px', padding: '15px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: product.stock ? 'pointer' : 'not-allowed', opacity: product.stock ? 1 : 0.6 }}
              >
                MUA NGAY
              </button>
            </div>
          </div>
        </div>

        {/* --- Phần 2: Tab chi tiết --- */}
        <div style={{ marginTop: '30px', background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
            {['description', 'ingredients', 'usage'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: '18px', border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer', color: activeTab === t ? '#007bff' : '#888', borderBottom: activeTab === t ? '3px solid #007bff' : '3px solid transparent' }}>
                {t === 'description' ? 'MÔ TẢ' : t === 'ingredients' ? 'THÀNH PHẦN' : 'HƯỚNG DẪN'}
              </button>
            ))}
          </div>
          <div style={{ padding: '30px', lineHeight: '1.8' }}>
            {activeTab === 'description' && (
              <p>{product.description || `${product.name} là sản phẩm chất lượng cao thuộc nhóm ${product.category}, được tin dùng bởi hàng triệu khách hàng tại hệ thống PharmaStore toàn quốc.`}</p>
            )}
            {activeTab === 'ingredients' && <p>Thành phần chi tiết của {product.name} bao gồm các hoạt chất đạt chuẩn y tế, an toàn tuyệt đối cho người sử dụng.</p>}
            {activeTab === 'usage' && <p>Sử dụng theo chỉ định của bác sĩ hoặc hướng dẫn trên bao bì. Bảo quản nơi thoáng mát, tránh ánh nắng trực tiếp.</p>}
          </div>
        </div>

        {/* --- Phần 3: Sản phẩm liên quan (Truy xuất từ Firebase) --- */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '50px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '25px', borderLeft: '5px solid #007bff', paddingLeft: '15px' }}>Sản phẩm cùng danh mục</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {relatedProducts.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => navigate(`/products/${p.id}`)} 
                  style={{ background: 'white', border: '1px solid #eee', borderRadius: '15px', padding: '20px', cursor: 'pointer', transition: '0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <span style={{ position: 'absolute', fontSize: '0.7rem', background: p.stock ? '#e8f5e9' : '#ffebee', color: p.stock ? '#2e7d32' : '#d32f2f', padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                    {p.stock ? "Còn hàng" : "Hết hàng"}
                  </span>
                  <img src={p.img || p.image || "https://via.placeholder.com/200"} alt={p.name} style={{ width: '100%', height: '160px', objectFit: 'contain', marginBottom: '15px', marginTop: '20px' }} />
                  <p style={{ margin: 0, color: '#888', fontSize: '0.8rem' }}>{p.brand || "Đang cập nhật"}</p>
                  <h4 style={{ fontSize: '1rem', height: '40px', overflow: 'hidden', margin: '5px 0' }}>{p.name}</h4>
                  <p style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '1.1rem' }}>{p.price.toLocaleString('vi-VN')}đ</p>
                  <button style={{ width: '100%', padding: '10px', border: '1px solid #007bff', color: '#007bff', background: 'white', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>
                    Xem chi tiết
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;