import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebaseConfig'; // Đã xóa storage
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, updateProfile } from 'firebase/auth'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    photoURL: '' 
  });

  const [imageFile, setImageFile] = useState(null); 
  const [imagePreview, setImagePreview] = useState('https://cdn-icons-png.flaticon.com/512/149/149071.png');
  const [originalData, setOriginalData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser);
      } else {
        setLoading(false);
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (currentUser) => {
    try {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      let data = {
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: '',
        address: '',
        photoURL: currentUser.photoURL || ''
      };

      if (docSnap.exists()) {
        const firestoreData = docSnap.data();
        data = { ...data, ...firestoreData };
      }

      setFormData(data);
      setOriginalData(data);
      
      if (data.photoURL) {
        setImagePreview(data.photoURL);
      }
    } catch (error) {
      console.error("Lỗi lấy hồ sơ:", error);
      toast.error("Không thể tải thông tin hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.warning("Vui lòng chỉ chọn file hình ảnh!");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!formData.name || !formData.phone || !formData.address) {
      toast.warning("Vui lòng điền đầy đủ Họ tên, SĐT và Địa chỉ!");
      return;
    }

    setIsSaving(true);
    try {
      let finalPhotoURL = formData.photoURL;

      // NẾU CÓ ẢNH MỚI, GỌI API LÊN IMGBB THAY VÌ FIREBASE STORAGE
      if (imageFile) {
        toast.info("Đang tải ảnh lên hệ thống...", { autoClose: 2000 });
        
        // Dán API Key của ImgBB vào đây 👇
        const IMGBB_API_KEY = "ĐIỀN_API_KEY_CỦA_BẠN_VÀO_ĐÂY"; 
        
        const uploadData = new FormData();
        uploadData.append('image', imageFile);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: 'POST',
          body: uploadData
        });

        const imgbbResult = await response.json();

        if (imgbbResult.success) {
          // Lấy link ảnh từ ImgBB trả về
          finalPhotoURL = imgbbResult.data.display_url;
          // Cập nhật lại Avatar cho tài khoản Auth
          await updateProfile(user, { photoURL: finalPhotoURL });
        } else {
          toast.error("Lỗi khi tải ảnh lên, vui lòng thử lại!");
          setIsSaving(false);
          return;
        }
      }

      // SAU KHI CÓ LINK ẢNH, LƯU VÀO FIRESTORE NHƯ BÌNH THƯỜNG
      const docRef = doc(db, "users", user.uid);
      const newData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
        photoURL: finalPhotoURL,
        updatedAt: new Date()
      };

      await setDoc(docRef, newData, { merge: true });

      setFormData(prev => ({ ...prev, photoURL: finalPhotoURL }));
      setOriginalData(newData);
      setImageFile(null); 
      setIsEditing(false);
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error("Có lỗi xảy ra khi cập nhật hồ sơ!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setImagePreview(originalData.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png');
    setImageFile(null);
    setIsEditing(false);
  };

  if (loading) return <div className="text-center mt-5">Đang tải hồ sơ...</div>;
  if (!user) return <div className="text-center mt-5">Vui lòng đăng nhập để xem hồ sơ.</div>;

  return (
    <div className="container mt-4 mb-5" style={{ minHeight: '60vh' }}>
      <ToastContainer />
      <div className="card shadow-sm" style={{ maxWidth: '800px', margin: '0 auto', borderRadius: '15px', overflow: 'hidden' }}>
        
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center" style={{ borderBottom: '2px solid #f0f2f5' }}>
          <h4 className="mb-0" style={{ color: '#00b894' }}>
            <i className="fas fa-user-circle me-2"></i> Hồ sơ cá nhân
          </h4>
          <div>
            {!isEditing ? (
              <button className="btn btn-outline-primary btn-sm" onClick={() => setIsEditing(true)} style={{ borderRadius: '20px', padding: '5px 15px' }}>
                <i className="fas fa-pencil-alt me-1"></i> Chỉnh sửa
              </button>
            ) : (
              <button className="btn btn-outline-secondary btn-sm" onClick={handleCancel} disabled={isSaving} style={{ borderRadius: '20px', padding: '5px 15px' }}>
                <i className="fas fa-times me-1"></i> Hủy bỏ
              </button>
            )}
          </div>
        </div>

        <div className="card-body p-4">
          <div className="text-center mb-4 position-relative">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img 
                src={imagePreview} 
                alt="Avatar" 
                style={{ width: '120px', height: '120px', objectFit: 'cover', border: '3px solid #00b894' }}
                className="rounded-circle shadow-sm"
              />
              {isEditing && (
                <label 
                  htmlFor="avatar-upload" 
                  className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex justify-content-center align-items-center" 
                  style={{ width: '35px', height: '35px', cursor: 'pointer', border: '2px solid white' }}
                  title="Thay đổi ảnh đại diện"
                >
                  <i className="fas fa-camera"></i>
                </label>
              )}
            </div>
            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ display: 'none' }} 
              disabled={!isEditing}
            />
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Họ và tên <span className="text-danger">*</span></label>
              <input type="text" className={`form-control ${!isEditing ? 'bg-light border-0' : ''}`} name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} placeholder="Nhập họ và tên" style={{ padding: '10px' }} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Email</label>
              <input type="email" className="form-control bg-light border-0" value={formData.email} disabled style={{ padding: '10px' }} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Số điện thoại <span className="text-danger">*</span></label>
              <input type="text" className={`form-control ${!isEditing ? 'bg-light border-0' : ''}`} name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} placeholder="Nhập số điện thoại" style={{ padding: '10px' }} />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold">Địa chỉ nhận hàng <span className="text-danger">*</span></label>
              <textarea className={`form-control ${!isEditing ? 'bg-light border-0' : ''}`} name="address" rows="3" value={formData.address} onChange={handleChange} disabled={!isEditing} placeholder="Nhập địa chỉ chi tiết (Số nhà, đường, phường/xã...)" style={{ padding: '10px' }}></textarea>
            </div>

            {isEditing && (
              <div className="col-12 mt-4 text-end">
                <button className="btn btn-secondary me-2" onClick={handleCancel} disabled={isSaving} style={{ borderRadius: '8px', padding: '10px 20px' }}>Hủy bỏ</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={isSaving} style={{ borderRadius: '8px', padding: '10px 20px', background: '#00b894', border: 'none' }}>
                  <i className="fas fa-save me-1"></i> {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;