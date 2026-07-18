export default function DoctorList({ doctors }) {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const totalStars = 5;
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "3px" }}>
        {[...Array(totalStars)].map((_, index) => (
          <span
            key={index}
            style={{
              color: index < fullStars ? "#ffc107" : "#e4e5e9",
              fontSize: "16px"
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (!doctors || doctors.length === 0) return null;

  const featuredDoctor = doctors[0];
  const otherDoctors = doctors.slice(1);

  return (
    <div>
      {/* Featured Doctor - Ngang dài */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '50px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        alignItems: 'center',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)'
      }}>
        {/* Left: Avatar & Basic Info */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={featuredDoctor.img}
              alt={featuredDoctor.name}
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                border: '5px solid white',
                objectFit: 'cover',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
              }}
            />
            <span style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              background: '#28c76f',
              color: 'white',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              border: '4px solid white'
            }}>
              ✓
            </span>
          </div>
        </div>

        {/* Right: Info & CTA */}
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px', fontWeight: '700' }}>
            {featuredDoctor.name}
          </h2>
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '15px',
            opacity: '0.9',
            fontWeight: '500'
          }}>
            {featuredDoctor.specialty}
          </p>
          <div style={{ marginBottom: '15px' }}>
            {renderStars(featuredDoctor.rating)}
            <div style={{ fontSize: '0.95rem', marginTop: '8px', opacity: '0.95' }}>
              <strong>{featuredDoctor.rating}</strong> ({featuredDoctor.reviews} đánh giá)
            </div>
          </div>
          <p style={{
            fontSize: '1rem',
            marginBottom: '25px',
            opacity: '0.9'
          }}>
            <i className="fas fa-briefcase" style={{ marginRight: '8px' }}></i>
            {featuredDoctor.experience}
          </p>
          <button style={{
            padding: '15px 35px',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
          }}
          >
            📅 Đặt lịch với BS {featuredDoctor.name.split('. ')[1]}
          </button>
        </div>
      </div>

      {/* Other Doctors - Danh sách dọc */}
      {otherDoctors.length > 0 && (
        <div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '30px',
            color: '#2c3e50',
            paddingBottom: '15px',
            borderBottom: '2px solid #007bff'
          }}>
            Các bác sĩ khác
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {otherDoctors.map(doctor => (
              <div key={doctor.id}
                style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '15px',
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr',
                  gap: '25px',
                  alignItems: 'center',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #e9ecef',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Avatar */}
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={doctor.img}
                    alt={doctor.name}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #f1f1f1'
                    }}
                  />
                  <span style={{
                    display: 'inline-block',
                    marginTop: '8px',
                    background: '#28c76f',
                    color: 'white',
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontWeight: '500'
                  }}>
                    Online
                  </span>
                </div>

                {/* Info */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px'
                }}>
                  <div>
                    <h4 style={{
                      marginBottom: '6px',
                      fontWeight: '600',
                      fontSize: '1rem',
                      color: '#2c3e50'
                    }}>
                      {doctor.name}
                    </h4>
                    <p style={{
                      color: '#007bff',
                      fontWeight: '500',
                      marginBottom: '6px',
                      fontSize: '0.9rem'
                    }}>
                      {doctor.specialty}
                    </p>
                    <p style={{
                      fontSize: '0.85rem',
                      color: '#777'
                    }}>
                      {doctor.experience}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    gap: '8px'
                  }}>
                    <div>
                      {renderStars(doctor.rating)}
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#666',
                        marginTop: '4px',
                        textAlign: 'right'
                      }}>
                        {doctor.rating} ({doctor.reviews})
                      </div>
                    </div>
                    <button style={{
                      padding: '8px 20px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s',
                      marginTop: '4px'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#0056b3';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#007bff';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    >
                      Đặt lịch
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}