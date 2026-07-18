export const productsToUpload = [
  // --- 1. PAIN RELIEVERS (Thuốc & Dược phẩm) ---
  { name: "Paracetamol Panadol Extra 500mg", price: 65000, oldPrice: 75000, category: "Pain Relievers", brand: "Panadol", img: "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/ecommerce/20241107092036-0-P09747_1.png?versionId=0PDeM10A77.mUnIG0F_W6l2uMGm1NU.Y", stock: true, rating: 4.8, sold: 3400, description: "Giảm đau, hạ sốt nhanh chóng." },
  { name: "Thuốc giảm đau hạ sốt Hapacol 250", price: 35000, oldPrice: 40000, category: "Pain Relievers", brand: "Dược Hậu Giang", img: "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/ecommerce/P00019_3.jpg", stock: true, rating: 4.9, sold: 2100, description: "Dành cho trẻ em, hương cam dễ uống." },
  { name: "Miếng dán giảm đau Salonpas", price: 20000, oldPrice: 25000, category: "Pain Relievers", brand: "Hisamitsu", img: "https://via.placeholder.com/400?text=Salonpas", stock: true, rating: 4.7, sold: 5600, description: "Giảm đau nhức cơ bắp, mỏi vai gáy." },
  { name: "Thuốc trị ho Bảo Thanh", price: 45000, oldPrice: 50000, category: "Pain Relievers", brand: "Hoa Linh", img: "https://via.placeholder.com/400?text=Bao+Thanh", stock: true, rating: 4.6, sold: 1800, description: "Bổ phế, trừ ho, hóa đờm." },
  { name: "Siro ho Prospan Đức", price: 75000, oldPrice: 85000, category: "Pain Relievers", brand: "Engelhard", img: "https://via.placeholder.com/400?text=Prospan", stock: true, rating: 4.9, sold: 4200, description: "Chiết xuất lá thường xuân, an toàn cho trẻ." },

  // --- 2. SUPPLEMENTS (Thực phẩm chức năng) ---
  { name: "Vitamin C sủi Plusssz", price: 45000, oldPrice: 55000, category: "Supplements", brand: "Plusssz", img: "https://via.placeholder.com/400?text=Vitamin+C+Plusssz", stock: true, rating: 4.5, sold: 1500, description: "Bổ sung Vitamin C, tăng đề kháng." },
  { name: "Dầu cá Omega 3 Nature Made", price: 350000, oldPrice: 400000, category: "Supplements", brand: "Nature Made", img: "https://via.placeholder.com/400?text=Omega+3", stock: true, rating: 4.8, sold: 850, description: "Tốt cho tim mạch và thị lực." },
  { name: "Bổ xương khớp Glucosamine", price: 550000, oldPrice: 650000, category: "Supplements", brand: "Kirkland", img: "https://via.placeholder.com/400?text=Glucosamine", stock: true, rating: 4.7, sold: 900, description: "Hỗ trợ sụn khớp, giảm đau khớp." },
  { name: "Hoạt huyết dưỡng não Traphaco", price: 95000, oldPrice: 110000, category: "Supplements", brand: "Traphaco", img: "https://via.placeholder.com/400?text=Hoat+Huyet", stock: true, rating: 4.6, sold: 2200, description: "Tăng cường tuần hoàn máu não." },
  { name: "Viên uống trắng da Glutathione", price: 850000, oldPrice: 950000, category: "Supplements", brand: "Angel's Liquid", img: "https://via.placeholder.com/400?text=Glutathione", stock: true, rating: 4.4, sold: 400, description: "Sáng da, mờ thâm nám từ bên trong." },

  // --- 3. COSMETICS (Dược mỹ phẩm) ---
  { name: "Kem chống nắng La Roche-Posay", price: 420000, oldPrice: 485000, category: "Cosmetics", brand: "La Roche-Posay", img: "https://via.placeholder.com/400?text=La+Roche-Posay", stock: true, rating: 4.9, sold: 3100, description: "Bảo vệ da tối ưu, kiềm dầu tốt." },
  { name: "Sữa rửa mặt Cetaphil 500ml", price: 320000, oldPrice: 350000, category: "Cosmetics", brand: "Cetaphil", img: "https://via.placeholder.com/400?text=Cetaphil", stock: true, rating: 4.8, sold: 4500, description: "Dịu nhẹ, phù hợp cho da nhạy cảm." },
  { name: "Nước tẩy trang Bioderma", price: 380000, oldPrice: 420000, category: "Cosmetics", brand: "Bioderma", img: "https://via.placeholder.com/400?text=Bioderma", stock: true, rating: 4.9, sold: 5200, description: "Làm sạch sâu, không gây kích ứng." },
  { name: "Kem trị mụn Megaduo", price: 115000, oldPrice: 130000, category: "Cosmetics", brand: "Gamma Chemicals", img: "https://via.placeholder.com/400?text=Megaduo", stock: true, rating: 4.7, sold: 6100, description: "Giảm mụn, mờ thâm hiệu quả." },
  { name: "Serum cấp ẩm B5 GoodnDoc", price: 450000, oldPrice: 500000, category: "Cosmetics", brand: "GoodnDoc", img: "https://via.placeholder.com/400?text=B5+GoodnDoc", stock: true, rating: 4.8, sold: 1200, description: "Phục hồi da tổn thương, cấp ẩm sâu." },

  // --- 4. MEDICAL DEVICES (Thiết bị y tế) ---
  { name: "Máy đo huyết áp Omron HEM-7120", price: 850000, oldPrice: 1050000, category: "Medical Devices", brand: "Omron", img: "https://via.placeholder.com/400?text=Omron+HEM-7120", stock: true, rating: 4.9, sold: 850, description: "Đo huyết áp bắp tay chính xác." },
  { name: "Nhiệt kế hồng ngoại Microlife", price: 650000, oldPrice: 750000, category: "Medical Devices", brand: "Microlife", img: "https://via.placeholder.com/400?text=Microlife", stock: true, rating: 4.7, sold: 1100, description: "Đo nhiệt độ nhanh chóng chỉ 1 giây." },
  { name: "Máy đo đường huyết Accu-Chek", price: 1200000, oldPrice: 1400000, category: "Medical Devices", brand: "Roche", img: "https://via.placeholder.com/400?text=Accu-Chek", stock: true, rating: 4.8, sold: 400, description: "Kiểm tra đường huyết tại nhà." },
  { name: "Băng cá nhân Urgo (Hộp 100 miếng)", price: 35000, oldPrice: 45000, category: "Medical Devices", brand: "Urgo", img: "https://via.placeholder.com/400?text=Urgo", stock: true, rating: 4.9, sold: 8900, description: "Băng gạc vô trùng, độ dính cao." },
  { name: "Khẩu trang y tế N95", price: 25000, oldPrice: 35000, category: "Medical Devices", brand: "Tenamyd", img: "https://via.placeholder.com/400?text=Khau+Trang+N95", stock: true, rating: 4.8, sold: 12000, description: "Kháng khuẩn 99%." },

  // --- 5. PERSONAL CARE (Chăm sóc cá nhân) ---
  { name: "Nước súc miệng Listerine 750ml", price: 115000, oldPrice: 135000, category: "Personal Care", brand: "Listerine", img: "https://via.placeholder.com/400?text=Listerine", stock: true, rating: 4.7, sold: 2300, description: "Bảo vệ răng miệng suốt 24h." },
  { name: "Kem đánh răng Sensodyne", price: 65000, oldPrice: 75000, category: "Personal Care", brand: "Sensodyne", img: "https://via.placeholder.com/400?text=Sensodyne", stock: true, rating: 4.8, sold: 3400, description: "Giảm ê buốt răng hiệu quả." },
  { name: "Dầu gội trị gàu Selsun", price: 95000, oldPrice: 110000, category: "Personal Care", brand: "Rohto", img: "https://via.placeholder.com/400?text=Selsun", stock: true, rating: 4.6, sold: 1800, description: "Đặc trị gàu, nấm da đầu." },
  { name: "Dung dịch vệ sinh Dạ Hương", price: 35000, oldPrice: 40000, category: "Personal Care", brand: "Hoa Linh", img: "https://via.placeholder.com/400?text=Da+Huong", stock: true, rating: 4.9, sold: 5600, description: "An toàn, dịu nhẹ cho phái nữ." },
  { name: "Bọt cạo râu Gillette", price: 75000, oldPrice: 85000, category: "Personal Care", brand: "Gillette", img: "https://via.placeholder.com/400?text=Gillette", stock: true, rating: 4.7, sold: 1200, description: "Giúp cạo râu mượt mà, không rát." },

  // --- 6. BABY CARE (Sản phẩm cho bé) ---
  { name: "Sữa bột Pediasure BA", price: 620000, oldPrice: 680000, category: "Baby Care", brand: "Abbott", img: "https://via.placeholder.com/400?text=Pediasure", stock: true, rating: 4.9, sold: 1100, description: "Dinh dưỡng đầy đủ cho trẻ biếng ăn." },
  { name: "Bỉm tã dán Huggies", price: 210000, oldPrice: 250000, category: "Baby Care", brand: "Huggies", img: "https://via.placeholder.com/400?text=Huggies", stock: true, rating: 4.8, sold: 2500, description: "Thấm hút tốt, chống hăm tã." },
  { name: "Sữa tắm gội dở dang Cetaphil Baby", price: 180000, oldPrice: 200000, category: "Baby Care", brand: "Cetaphil", img: "https://via.placeholder.com/400?text=Cetaphil+Baby", stock: true, rating: 4.9, sold: 1400, description: "Dịu nhẹ cho làn da mỏng manh của bé." },
  { name: "Phấn rôm Johnson's Baby", price: 45000, oldPrice: 55000, category: "Baby Care", brand: "Johnson's", img: "https://via.placeholder.com/400?text=Johnsons+Baby", stock: true, rating: 4.7, sold: 3100, description: "Giúp da bé luôn khô thoáng." },
  { name: "Kem chống hăm Sudocrem", price: 120000, oldPrice: 140000, category: "Baby Care", brand: "Sudocrem", img: "https://via.placeholder.com/400?text=Sudocrem", stock: true, rating: 4.9, sold: 2800, description: "Trị hăm tã, xoa dịu vết muỗi đốt." }
];