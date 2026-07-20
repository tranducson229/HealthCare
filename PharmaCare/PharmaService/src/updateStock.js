const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your-service-account-file.json'); // Tải từ Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateStockField() {
  const productsRef = db.collection('products');
  const snapshot = await productsRef.get();

  const batch = db.batch();
  snapshot.forEach(doc => {
    // Nếu stock đang là boolean true, đổi thành 50 (hoặc số bất kỳ bạn muốn)
    // Nếu là false, đổi thành 0
    const currentStock = doc.data().stock;
    const newStock = (currentStock === true) ? 50 : 0; 

    batch.update(doc.ref, { stock: newStock });
  });

  await batch.commit();
  console.log('Đã cập nhật xong tất cả sản phẩm!');
}

updateStockField();