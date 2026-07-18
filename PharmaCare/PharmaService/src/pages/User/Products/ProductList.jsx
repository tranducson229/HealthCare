import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { db } from '../../../firebaseConfig'; // Đảm bảo đúng đường dẫn file config
import { collection, getDocs } from 'firebase/firestore';

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State lưu dữ liệu Firebase
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- MẢNG CHUẨN HÓA CATEGORY (DB <-> UI) ---
  const categoriesWithSubcategories = [
    { dbName: "Pain Relievers", name: "Thuốc giảm đau", subcategories: ["Giảm đau", "Cảm cúm", "Tiêu hóa"] },
    { dbName: "Supplements", name: "Thực phẩm chức năng", subcategories: ["Vitamin & Khoáng chất", "Dầu cá Omega", "Hỗ trợ xương khớp"] },
    { dbName: "Cosmetics", name: "Dược mỹ phẩm", subcategories: ["Kem chống nắng", "Serum & Tinh chất", "Toner & Nước hoa hồng", "Mặt nạ"] },
    { dbName: "Medical Devices", name: "Thiết bị y tế", subcategories: ["Đo huyết áp", "Nhiệt kế", "Oxy kế", "Máy massage"] },
    { dbName: "Personal Care", name: "Chăm sóc cá nhân", subcategories: ["Kem đánh răng", "Nước súc miệng", "Chăm sóc da", "Khẩu trang"] },
    { dbName: "Baby Care", name: "Sản phẩm cho bé", subcategories: ["Sữa bột", "Sơ sinh", "Chăm sóc bé", "Luyện tập"] },
  ];

  // State của bộ lọc
  const [selectedCategories, setSelectedCategories] = useState([]); // Lưu dbName (Tiếng Anh)
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1500000);
  const [selectedBrand, setSelectedBrand] = useState("Tất cả thương hiệu");
  const [sortOrder, setSortOrder] = useState("Mới nhất");

  // 1. FETCH DỮ LIỆU TỪ FIREBASE
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map(doc => {
          const productData = doc.data();
          return {
            id: doc.id,
            ...productData,
            // Đảm bảo giá là số để lọc và sắp xếp chính xác
            price: typeof productData.price === 'string' ? parseInt(productData.price.replace(/\D/g, '')) : productData.price,
            stock: productData.stock > 0 || productData.stock === true // Đảm bảo boolean
          };
        });
        setAllProducts(data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu từ Firebase:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. BẮT URL TỪ TRANG HOME ĐỂ TỰ ĐỘNG CHỌN BỘ LỌC
  useEffect(() => {
    const categoryFromURL = searchParams.get('category');
    if (categoryFromURL) {
      setSelectedCategories([categoryFromURL]);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchParams]);

  // Lấy danh sách thương hiệu động từ Database (loại bỏ trùng lặp)
  const brands = ["Tất cả thương hiệu", ...new Set(allProducts.map(p => p.brand).filter(Boolean))];

  // Hàm tính toán danh mục con
  const getSubcategoriesForSelectedCategories = () => {
    if (selectedCategories.length === 0) return [];
    const subcats = new Set();
    selectedCategories.forEach(dbName => {
      const catData = categoriesWithSubcategories.find(c => c.dbName === dbName);
      if (catData) catData.subcategories.forEach(sub => subcats.add(sub));
    });
    return Array.from(subcats);
  };

  const handleCategoryChange = (dbName) => {
    if (selectedCategories.includes(dbName)) {
      setSelectedCategories(selectedCategories.filter(item => item !== dbName));
    } else {
      setSelectedCategories([...selectedCategories, dbName]);
    }
  };

  const handleSubcategoryChange = (subcat) => {
    if (selectedSubcategories.includes(subcat)) {
      setSelectedSubcategories(selectedSubcategories.filter(item => item !== subcat));
    } else {
      setSelectedSubcategories([...selectedSubcategories, subcat]);
    }
  };

  // 3. THỰC THI LỌC DỮ LIỆU
  const filteredProducts = allProducts
    .filter(p => selectedCategories.length === 0 || selectedCategories.includes(p.category))
    .filter(p => selectedSubcategories.length === 0 || selectedSubcategories.includes(p.subcategory))
    .filter(p => p.price <= maxPrice)
    .filter(p => selectedBrand === "Tất cả thương hiệu" || p.brand === selectedBrand)
    .sort((a, b) => {
      if (sortOrder === "Giá: Thấp đến Cao") return a.price - b.price;
      if (sortOrder === "Giá: Cao đến Thấp") return b.price - a.price;
      return 0; // "Mới nhất" mặc định giữ nguyên thứ tự Firebase
    });

  const availableSubcategories = getSubcategoriesForSelectedCategories();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px', fontSize: '1.2rem', color: '#666' }}>Đang tải danh sách sản phẩm...</div>;
  }

  return (
    <div style={{ display: 'flex', padding: '40px 5%', gap: '30px', backgroundColor: '#f4f7f6', alignItems: 'flex-start', minHeight: '100vh' }}>
      
      {/* --- SIDEBAR BỘ LỌC --- */}
      <aside style={{ width: '280px', minWidth: '280px', background: 'white', padding: '25px', borderRadius: '15px', position: 'sticky', top: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', height: 'fit-content' }}>
        <h3 style={{ marginTop: 0 }}>Bộ lọc</h3>
        <hr style={{ margin: '20px 0', border: '0.5px solid #eee' }} />
        
        <h4 style={{ fontSize: '1rem', marginBottom: '15px' }}>Danh mục</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {categoriesWithSubcategories.map((cat, index) => (
            <label key={index} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input 
                type="checkbox" 
                checked={selectedCategories.includes(cat.dbName)} 
                onChange={() => handleCategoryChange(cat.dbName)} 
                style={{ marginRight: '10px' }} 
              /> 
              {cat.name} {/* Hiển thị tiếng Việt */}
            </label>
          ))}
        </div>

        {availableSubcategories.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '15px' }}>Chức năng</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '10px', borderLeft: '2px solid #007bff' }}>
              {availableSubcategories.map((sub, i) => (
                <label key={i} style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedSubcategories.includes(sub)} 
                    onChange={() => handleSubcategoryChange(sub)} 
                    style={{ marginRight: '8px' }} 
                  /> 
                  {sub}
                </label>
              ))}
            </div>
          </div>
        )}

        <h4 style={{ marginTop: '30px', fontSize: '1rem', marginBottom: '15px' }}>Thương hiệu</h4>
        <select 
          value={selectedBrand} 
          onChange={(e) => setSelectedBrand(e.target.value)} 
          style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}
        >
          {brands.map((brand, i) => <option key={i} value={brand}>{brand}</option>)}
        </select>

        <h4 style={{ marginTop: '10px' }}>Khoảng giá</h4>
        <input 
          type="range" 
          min="0" 
          max="1500000" 
          step="50000" 
          value={maxPrice} 
          onChange={(e) => setMaxPrice(Number(e.target.value))} 
          style={{ width: '100%' }} 
        />
        <div style={{ textAlign: 'right', fontSize: '0.9rem', color: '#007bff', fontWeight: 'bold' }}>
          Dưới {maxPrice.toLocaleString('vi-VN')}đ
        </div>

        <button 
          onClick={() => { 
            setSelectedCategories([]); 
            setSelectedSubcategories([]); 
            setMaxPrice(1500000); 
            setSelectedBrand("Tất cả thương hiệu"); 
            navigate('/products'); // Xóa params trên URL
          }}
          style={{ width: '100%', marginTop: '30px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', background: '#f9f9f9', cursor: 'pointer', fontWeight: 'bold' }}
        >
          XÓA LỌC
        </button>
      </aside>

      {/* --- DANH SÁCH HIỂN THỊ --- */}
      <main style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '15px 25px', borderRadius: '12px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Kết quả: <strong style={{ color: '#007bff' }}>{filteredProducts.length}</strong> sản phẩm</h2>
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)} 
            style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
          >
            <option>Mới nhất</option>
            <option>Giá: Thấp đến Cao</option>
            <option>Giá: Cao đến Thấp</option>
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '15px' }}>
            <h4 style={{ color: '#999' }}>Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</h4>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                onClick={() => navigate(`/products/${product.id}`)} 
                style={{ 
                  background: 'white', border: '1px solid #eee', borderRadius: '15px', padding: '20px', 
                  display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: '0.3s', position: 'relative'
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <span style={{ 
                  position: 'absolute', top: '10px', right: '10px', fontSize: '0.7rem', 
                  background: product.stock ? '#e8f5e9' : '#ffebee', 
                  color: product.stock ? '#2e7d32' : '#d32f2f', 
                  padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold' 
                }}>
                  {product.stock ? "Còn hàng" : "Hết hàng"}
                </span>
                
                <img 
                  src={product.img || product.image || "https://via.placeholder.com/200"} 
                  alt={product.name} 
                  style={{ width: '100%', height: '180px', objectFit: 'contain', marginBottom: '15px' }} 
                />
                
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, color: '#888', fontSize: '0.8rem' }}>{product.brand || "Đang cập nhật"}</p>
                  <h4 style={{ margin: '5px 0', fontSize: '1rem', color: '#333' }}>{product.name}</h4>
                  <p style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {product.price.toLocaleString('vi-VN')}đ
                  </p>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    if(product.stock) navigate(`/products/${product.id}`);
                  }}
                  style={{ 
                    width: '100%', padding: '10px', 
                    border: product.stock ? '1px solid #007bff' : '1px solid #999', 
                    background: 'none', 
                    color: product.stock ? '#007bff' : '#999', 
                    borderRadius: '8px', fontWeight: 'bold', cursor: product.stock ? 'pointer' : 'not-allowed',
                    marginTop: '10px'
                  }}
                >
                  {product.stock ? "Xem chi tiết" : "Liên hệ"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductList;