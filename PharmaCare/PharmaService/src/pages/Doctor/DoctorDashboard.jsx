import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { auth, db } from '../../firebaseConfig'; // Đảm bảo đường dẫn đúng
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  
  // State quản lý trạng thái tải và dữ liệu thống kê
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { title: "Chờ khám", value: "0", icon: "⏳", color: "#e17055", desc: "Bệnh nhân đang đợi" },
    { title: "Đang tư vấn", value: "0", icon: "💬", color: "#0984e3", desc: "Cuộc hội thoại mở" },
    { title: "Đã khám xong", value: "0", icon: "✅", color: "#00b894", desc: "Hoàn tất hôm nay" },
    { title: "Tổng bệnh nhân", value: "0", icon: "👥", color: "#6c5ce7", desc: "Lịch sử tiếp nhận" },
  ]);

  // --- LOGIC LẤY DỮ LIỆU TỪ FIREBASE ---
  useEffect(() => {
    const fetchDashboardData = async (doctorId) => {
      try {
        const today = new Date().toISOString().split('T')[0]; // Định dạng YYYY-MM-DD

        // 1. Truy vấn Lịch khám (Appointments)
        const apptQuery = query(collection(db, "appointments"), where("doctorId", "==", doctorId));
        const apptSnap = await getDocs(apptQuery);
        
        let pendingCount = 0;
        let completedTodayCount = 0;
        let uniquePatients = new Set();
        
        apptSnap.forEach(doc => {
          const data = doc.data();
          // Đếm tổng bệnh nhân duy nhất
          if (data.patientId) uniquePatients.add(data.patientId);
          
          // Đếm lịch chờ khám
          if (data.status === 'pending' || data.status === 'confirmed') {
            pendingCount++;
          }
          // Đếm lịch đã hoàn tất hôm nay
          if (data.status === 'completed' && data.date === today) {
            completedTodayCount++;
          }
        });

        // 2. Truy vấn Chat/Tư vấn đang hoạt động
        // (Giả sử bạn có collection 'chats' lưu các phiên nhắn tin)
        const chatQuery = query(collection(db, "chats"), where("doctorId", "==", doctorId));
        const chatSnap = await getDocs(chatQuery);
        let activeChatsCount = chatSnap.size; // Có thể thêm where("status", "==", "active") nếu cần

        // Cập nhật lên UI
        setStats([
          { title: "Chờ khám", value: pendingCount.toString(), icon: "⏳", color: "#e17055", desc: "Bệnh nhân đang đợi" },
          { title: "Đang tư vấn", value: activeChatsCount.toString(), icon: "💬", color: "#0984e3", desc: "Cuộc hội thoại mở" },
          { title: "Đã khám xong", value: completedTodayCount.toString(), icon: "✅", color: "#00b894", desc: "Hoàn tất hôm nay" },
          { title: "Tổng bệnh nhân", value: uniquePatients.size.toString(), icon: "👥", color: "#6c5ce7", desc: "Lịch sử tiếp nhận" },
        ]);

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchDashboardData(user.uid);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // --- DỮ LIỆU BIỂU ĐỒ (Giữ nguyên mẫu để hiển thị UI đẹp mắt) ---
  const activityData = [
    { name: 'Thứ 2', kham_benh: 20, tu_van: 40 },
    { name: 'Thứ 3', kham_benh: 15, tu_van: 30 },
    { name: 'Thứ 4', kham_benh: 25, tu_van: 58 },
    { name: 'Thứ 5', kham_benh: 18, tu_van: 45 },
    { name: 'Thứ 6', kham_benh: 30, tu_van: 60 },
    { name: 'Thứ 7', kham_benh: 10, tu_van: 34 },
    { name: 'CN', kham_benh: 5, tu_van: 20 },
  ];

  const outcomeData = [
    { name: 'Kê đơn thuốc', value: 320 },
    { name: 'Tư vấn sức khỏe', value: 150 },
    { name: 'Chuyển viện', value: 15 },
  ];
  
  const COLORS = ['#00b894', '#0984e3', '#d63031'];

  // --- STYLE CHO CARD BUTTON ---
  const actionCardStyle = {
    flex: 1,
    minWidth: '280px',
    background: 'white',
    padding: '25px',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid #f1f2f6'
  };

  // --- HIỂN THỊ LOADING ---
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundColor: '#f8f9fa' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0984e3', marginBottom: '15px' }}></i>
        <h3 style={{ color: '#636e72' }}>Đang tổng hợp dữ liệu...</h3>
      </div>
    );
  }

  return (
    <div className="doctor-container" style={{ padding: '30px', background: '#f8f9fa', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* 1. HEADER & GREETING */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '10px', color: '#2d3436', fontWeight: '700' }}>👋 Xin chào, Bác sĩ!</h2>
        <p style={{ color: '#636e72' }}>Chúc bạn một ngày làm việc hiệu quả. Dưới đây là tổng quan công việc hôm nay.</p>
        
        {/* QUICK ACTIONS */}
        <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', marginTop: '30px' }}>
          
          <div 
            style={{ ...actionCardStyle, borderLeft: '6px solid #e17055' }}
            onClick={() => navigate('/doctor/appointments')}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(225, 112, 85, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)'; }}
          >
            <div style={{ background: '#ffefe6', padding: '18px', borderRadius: '50%', color: '#e17055', fontSize: '1.8rem' }}>
              <i className="fas fa-calendar-check"></i>
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#2d3436', fontWeight: 'bold' }}>Lịch khám bệnh</h4>
              <small style={{ color: '#636e72', fontSize: '0.9rem' }}>Xem danh sách bệnh nhân chờ</small>
            </div>
            <i className="fas fa-chevron-right" style={{ marginLeft: 'auto', color: '#b2bec3' }}></i>
          </div>

          <div 
            style={{ ...actionCardStyle, borderLeft: '6px solid #0984e3' }}
            onClick={() => navigate('/doctor/chat')}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(9, 132, 227, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)'; }}
          >
            <div style={{ background: '#e3f2fd', padding: '18px', borderRadius: '50%', color: '#0984e3', fontSize: '1.8rem' }}>
              <i className="fas fa-comments"></i>
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#2d3436', fontWeight: 'bold' }}>Tư vấn sức khỏe</h4>
              <small style={{ color: '#636e72', fontSize: '0.9rem' }}>Trả lời tin nhắn bệnh nhân</small>
            </div>
            <i className="fas fa-chevron-right" style={{ marginLeft: 'auto', color: '#b2bec3' }}></i>
          </div>

           <div 
            style={{ ...actionCardStyle, borderLeft: '6px solid #00b894' }}
            onClick={() => navigate('/doctor/exams')}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 184, 148, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)'; }}
          >
            <div style={{ background: '#e0fcf6', padding: '18px', borderRadius: '50%', color: '#00b894', fontSize: '1.8rem' }}>
              <i className="fas fa-stethoscope"></i>
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#2d3436', fontWeight: 'bold' }}>Bắt đầu khám</h4>
              <small style={{ color: '#636e72', fontSize: '0.9rem' }}>Vào phòng khám bệnh ảo</small>
            </div>
            <i className="fas fa-chevron-right" style={{ marginLeft: 'auto', color: '#b2bec3' }}></i>
          </div>

        </div>
      </div>

      {/* 2. STATS OVERVIEW */}
      <h3 style={{ marginBottom: '25px', color: '#2d3436', fontSize: '1.3rem', fontWeight: '700' }}>📊 Thống kê nhanh</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '40px' }}>
        {stats.map((item, index) => (
          <div key={index} style={{ 
            backgroundColor: 'white', 
            padding: '25px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            borderLeft: `5px solid ${item.color}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div>
              <p style={{ color: '#636e72', fontSize: '0.95rem', margin: 0, fontWeight: '600' }}>{item.title}</p>
              <h3 style={{ fontSize: '2.2rem', color: '#2d3436', margin: '5px 0', fontWeight: '800' }}>{item.value}</h3>
              <small style={{ color: '#b2bec3', fontSize: '0.85rem' }}>{item.desc}</small>
            </div>
            <div style={{ fontSize: '2.8rem', opacity: 0.15, color: item.color }}>{item.icon}</div>
          </div>
        ))}
      </div>

      {/* 3. CHARTS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        
        {/* Biểu đồ Cột */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '25px' }}>
             <h4 style={{ margin: 0, color: '#2d3436', fontWeight: 'bold' }}>📈 Hiệu suất làm việc (Tuần này)</h4>
             <small style={{ color: '#b2bec3' }}>So sánh giữa lượt khám trực tiếp và tư vấn online</small>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={activityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f2f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                cursor={{ fill: '#f8f9fa' }} 
              />
              <Legend iconType="circle" />
              <Bar dataKey="kham_benh" name="Lượt khám bệnh" fill="#00b894" radius={[6, 6, 0, 0]} barSize={25} />
              <Bar dataKey="tu_van" name="Lượt tư vấn" fill="#74b9ff" radius={[6, 6, 0, 0]} barSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ Tròn */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <h4 style={{ marginBottom: '25px', color: '#2d3436', fontWeight: 'bold' }}>Tỷ lệ đầu ra</h4>
          <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outcomeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {outcomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            {outcomeData.map((entry, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px dashed #f1f2f6' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '10px', height: '10px', backgroundColor: COLORS[index], borderRadius: '50%', marginRight: '10px' }}></div>
                    <span style={{ color: '#636e72', fontSize: '0.95rem' }}>{entry.name}</span>
                </div>
                <strong style={{ color: '#2d3436' }}>{entry.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default DoctorDashboard;