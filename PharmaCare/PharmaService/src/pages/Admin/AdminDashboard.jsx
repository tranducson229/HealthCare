import { useState, useEffect } from 'react';
import { FaDollarSign, FaBox, FaUsers, FaShoppingCart } from 'react-icons/fa';
import { db } from '../../firebaseConfig'; // Đảm bảo đường dẫn này đúng
import { collection, getDocs } from 'firebase/firestore';
import './AdminDashboard.css';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0, newCustomers: 0 });
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Lấy dữ liệu từ Firestore
                const ordersSnapshot = await getDocs(collection(db, "orders"));
                const productsSnapshot = await getDocs(collection(db, "products"));
                const usersSnapshot = await getDocs(collection(db, "users"));

                // 2. Xử lý thống kê
                const orders = ordersSnapshot.docs.map(doc => doc.data());
                const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
                
                // 3. Xử lý sản phẩm tồn kho thấp (< 10)
                const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const lowStock = products.filter(p => p.stock < 10);

                setStats({
                    totalSales,
                    totalOrders: orders.length,
                    totalProducts: products.length,
                    newCustomers: usersSnapshot.size
                });
                setLowStockProducts(lowStock);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        { title: 'Tổng doanh thu', value: formatCurrency(stats.totalSales), icon: <FaDollarSign />, color: '#0984e3' },
        { title: 'Tổng đơn hàng', value: stats.totalOrders, icon: <FaShoppingCart />, color: '#00b894' },
        { title: 'Tổng sản phẩm', value: stats.totalProducts, icon: <FaBox />, color: '#6c5ce7' },
        { title: 'Khách hàng', value: stats.newCustomers, icon: <FaUsers />, color: '#fdcb6e' },
    ];

    if (loading) return <div className="dashboard-container">Đang tải dữ liệu...</div>;

   return (
    <div className="dashboard-container">
        <h2>Tổng quan hệ thống</h2>

        {/* Phần thống kê */}
        <div className="stats-grid">
            {statCards.map((stat, index) => (
                <div className="stat-card" key={index}>
                    <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                        {stat.icon}
                    </div>
                    <div className="stat-info">
                        <h3>{stat.value}</h3>
                        <p>{stat.title}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* Phần cảnh báo */}
        <div className="section">
            <h3>Cảnh báo tồn kho thấp</h3>
            <table className="simple-table">
                <thead>
                    <tr>
                        <th>SẢN PHẨM</th>
                        <th>SỐ LƯỢNG</th>
                        <th>TRẠNG THÁI</th>
                    </tr>
                </thead>
              <tbody>
    {lowStockProducts.length > 0 ? (
        lowStockProducts.map(product => {
            // Xác định trạng thái dựa trên số lượng lấy từ database
            const isOutOfStock = product.stock === 0;
            const statusLabel = isOutOfStock ? 'Hết hàng' : 'Sắp hết hàng';
            
            return (
                <tr key={product.id}>
                    {/* Tên sản phẩm lấy từ database */}
                    <td style={{ fontWeight: '500' }}>{product.name}</td>
                    
                    {/* Số lượng lấy từ database */}
                    <td style={{ color: isOutOfStock ? '#d63031' : '#e17055', fontWeight: 'bold' }}>
                        {product.stock}
                    </td>
                    
                    {/* Trạng thái hiển thị theo logic */}
                    <td>
                        <span className={`badge ${isOutOfStock ? 'critical' : 'warning'}`}>
                            {statusLabel}
                        </span>
                    </td>
                </tr>
            );
        })
    ) : (
        <tr>
            <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#636e72' }}>
                Tồn kho hiện tại đang đầy đủ.
            </td>
        </tr>
    )}
</tbody>
            </table>
        </div>
    </div>
);
};

export default AdminDashboard;