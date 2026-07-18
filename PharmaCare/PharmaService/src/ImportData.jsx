import React, { useState } from 'react';
import { db } from './firebaseConfig'; // Đảm bảo đường dẫn này đúng với file cấu hình của bạn
import { collection, addDoc } from 'firebase/firestore';
import { productsToUpload } from './data'; // File chứa 100 sản phẩm bạn vừa tạo

const ImportData = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUploadBulkData = async () => {
    const confirmUpload = window.confirm(`Bạn có chắc muốn đẩy ${productsToUpload.length} sản phẩm lên Firebase không?`);
    if (!confirmUpload) return;

    setIsUploading(true);
    setProgress(0);
    
    try {
      const productsRef = collection(db, "products");
      let count = 0;

      for (const product of productsToUpload) {
        await addDoc(productsRef, {
          ...product,
          createdAt: new Date().toISOString()
        });
        count++;
        setProgress(count); // Cập nhật tiến độ
      }
      
      alert("🎉 Đã đẩy dữ liệu thành công!");
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      alert("Có lỗi xảy ra, vui lòng xem Console.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8f9fa' }}>
      <h2>Trang Công Cụ Quản Trị - Import Dữ Liệu</h2>
      <p>Số lượng trong file: <strong>{productsToUpload.length}</strong> sản phẩm</p>
      
      <button 
        onClick={handleUploadBulkData} 
        disabled={isUploading}
        style={{ 
          padding: '15px 30px', 
          background: isUploading ? '#ccc' : '#28a745', 
          color: 'white', 
          fontWeight: 'bold', 
          border: 'none', 
          borderRadius: '8px', 
          cursor: isUploading ? 'not-allowed' : 'pointer', 
          fontSize: '16px',
          marginTop: '20px'
        }}
      >
        {isUploading ? "⏳ Đang xử lý..." : "🚀 BẮT ĐẦU PUSH LÊN FIREBASE"}
      </button>

      {isUploading && (
        <p style={{ marginTop: '20px', fontSize: '1.2rem', color: '#007bff' }}>
          Tiến độ: {progress} / {productsToUpload.length}
        </p>
      )}
    </div>
  );
};

export default ImportData;