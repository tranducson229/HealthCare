import React, { useState, useEffect } from 'react';
import DoctorListGrid from "../../components/DoctorList";

export default function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from Firebase/API
    const doctorData = [
      {
        id: 1,
        name: "BS. Trần Văn A",
        specialty: "Nội tổng quát",
        experience: "10 năm kinh nghiệm",
        rating: 4.8,
        reviews: 124,
        img: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
      },
      {
        id: 2,
        name: "BS. Nguyễn Thị B",
        specialty: "Da liễu",
        experience: "8 năm kinh nghiệm",
        rating: 4.6,
        reviews: 98,
        img: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
      },
      {
        id: 3,
        name: "BS. Lê Văn C",
        specialty: "Tim mạch",
        experience: "12 năm kinh nghiệm",
        rating: 4.9,
        reviews: 210,
        img: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
      },
      {
        id: 4,
        name: "BS. Phạm Thị D",
        specialty: "Nhi khoa",
        experience: "7 năm kinh nghiệm",
        rating: 4.7,
        reviews: 76,
        img: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
      },
      {
        id: 5,
        name: "BS. Hoàng Văn E",
        specialty: "Hô hấp",
        experience: "9 năm kinh nghiệm",
        rating: 4.85,
        reviews: 156,
        img: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
      },
      {
        id: 6,
        name: "BS. Vũ Thị F",
        specialty: "Mắt",
        experience: "6 năm kinh nghiệm",
        rating: 4.5,
        reviews: 82,
        img: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
      }
    ];

    // Simulate loading delay
    setTimeout(() => {
      setDoctors(doctorData);
      setLoading(false);
    }, 500);
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
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
          <h3>Đang tải danh sách bác sĩ...</h3>
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
            { label: 'Tổng số bác sĩ', value: doctors.length, icon: '👥' },
            { label: 'Độ hài lòng trung bình', value: '4.8/5', icon: '⭐' },
            { label: 'Kinh nghiệm trung bình', value: '8+ năm', icon: '📚' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: 'white',
              padding: '25px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              border: '1px solid #e9ecef'
            }}>
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
              <h3>Không có bác sĩ</h3>
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