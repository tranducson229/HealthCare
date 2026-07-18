import React, { useState, useEffect } from 'react';
import DoctorListGrid from "../../components/DoctorList";
import { db } from '../../firebaseConfig'; // Đảm bảo đường dẫn này trỏ đúng tới file cấu hình Firebase của bạn
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Truy vấn vào bảng users, lấy những user có role là 'doctor'
        const q = query(collection(db, "users"), where("role", "==", "doctor"));
        const querySnapshot = await getDocs(q);
        
        const doctorList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Chuẩn hóa dữ liệu Firebase để khớp với format mà DoctorListGrid cần
          doctorList.push({ 
            id: doc.id, 
            name: data.displayName ? `BS. ${data.displayName}` : (data.name || "BS. Đang cập nhật"),
            specialty: data.specialty || "Đa khoa",
            experience: data.experience || "Nhiều năm kinh nghiệm",
            rating: data.rating || 5.0,
            reviews: data.reviews || Math.floor(Math.random() * 100) + 10, // Giả lập số lượt đánh giá nếu db chưa có
            img: data.photoURL || data.image || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
            ...data // Giữ lại toàn bộ các trường gốc khác nếu có
          });
        });
        
        setDoctors(doctorList);
      } catch (error) {
        console.error("Lỗi khi tải danh sách bác sĩ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (loading) {
    return (
      <div style={{
        padding: '60px 20px',
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          {/* Thay icon đồng hồ cát bằng icon xoay vòng cho hiệu ứng mượt hơn */}
          <div style={{ fontSize: '3rem', marginBottom: '20px', color: '#007bff' }}>
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <h3 style={{ color: '#666' }}>Đang tải danh sách bác sĩ...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '40px 20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Page header */}
        <div style={{
          marginBottom: '50px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#2c3e50',
            marginBottom: '10px'
          }}>
            👨‍⚕️ Danh Sách Bác Sĩ
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '5px'
          }}>
            Đội ngũ bác sĩ chuyên môn cao, tận tâm và giàu kinh nghiệm
          </p>
          <p style={{
            fontSize: '0.95rem',
            color: '#999'
          }}>
            Sẵn sàng tư vấn và khám bệnh cho bạn
          </p>
        </div>

        {/* Stats Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '50px'
        }}>
          {[
            { label: 'Tổng số bác sĩ', value: doctors.length, icon: '👥' }, // Lấy số lượng thực tế từ Database
            { label: 'Độ hài lòng trung bình', value: '4.9/5', icon: '⭐' },
            { label: 'Kinh nghiệm trung bình', value: '8+ năm', icon: '📚' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: 'white',
              padding: '25px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              border: '1px solid #e9ecef',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{stat.icon}</div>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#007bff',
                marginBottom: '5px'
              }}>
                {stat.value}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Doctors Grid */}
        <div style={{
          background: 'white',
          padding: '40px 30px',
          borderRadius: '20px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
        }}>
          {doctors.length > 0 ? (
            <DoctorListGrid doctors={doctors} />
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#999'
            }}>
              <i className="fas fa-user-md" style={{ fontSize: '4rem', color: '#ddd', marginBottom: '15px' }}></i>
              <h3>Hệ thống hiện chưa có bác sĩ nào</h3>
              <p>Vui lòng thử lại sau</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div style={{
          marginTop: '50px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px',
          borderRadius: '15px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>
            Bạn cần tư vấn y tế ngay?
          </h3>
          <p style={{ marginBottom: '25px', fontSize: '1.05rem' }}>
            Liên hệ với chúng tôi hoặc chọn bác sĩ để đặt lịch khám
          </p>
          <button style={{
            padding: '15px 40px',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
          }}
          >
            📞 Liên hệ ngay
          </button>
        </div>
      </div>
    </div>
  );
}