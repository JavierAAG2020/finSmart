import { useState } from 'react'
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { FaGithub, FaEnvelope, FaInstagram, FaArrowLeft } from 'react-icons/fa'
import sotoFoto from "../assets/integrantes/soto.png"
import javierFoto from "../assets/integrantes/javier.png"
import davidFoto from  "../assets/integrantes/david.png"
import winyiFoto from "../assets/integrantes/winyi.png"
import Footer from '../components/layout/Footer'

const TEXTO_FLIP = "Haz clic para ver información personal"
const TEXTO_BACK = "Haz clic para volver"
const integrantes = [
  {
    nombre: 'Javier Alberto Alean Gonzalez',
    rol: 'Líder',
    github: 'https://github.com/JavierAAG2020',
    githubUser: 'JavierAAG2020',
    instagram: 'https://instagram.com/j_aleang',
    instagramUser: 'javieralean',
    correo: 'javieralean2006@gmail.com',
    infoPersonal: 'Estudiante de ingeniería de sistemas de la Universidad Industrial de Santander (UIS).',
    foto: javierFoto
  },
  {
    nombre: 'Winyi Kevin Galindo Rodríguez',
    rol: 'Desarrollador',
    github: 'https://github.com/WinyiGalindo',
    githubUser: 'WinyiGalindo',
    instagram: 'https://instagram.com/winyigalindo',
    instagramUser: 'winyigalindo',
    correo: 'dr8147239@gmail.com',
    infoPersonal: 'Estudiante de ingeniería de sistemas de la Universidad Industrial de Santander (UIS).',
    foto: winyiFoto
  },
  {
    nombre: 'David Santiago Martínez Soto',
    rol: 'Desarrollador',
    github: 'https://github.com/Santiag27',
    githubUser: 'Santiag27',
    instagram: 'https://instagram.com/david_soto_0123',
    instagramUser: 'david_soto_0123',
    correo: 'sotodavid405@gmail.com',
    infoPersonal: 'Estudiante de ingeniería de sistemas de la Universidad Industrial de Santander (UIS).',
    foto: sotoFoto
  },
  {
    nombre: 'David Alejandro Sandoval Rojas',
    rol: 'Desarrollador',
    github: 'https://github.com/CypherMain44',
    githubUser: 'CypherMain44',
    instagram: 'https://instagram.com/dabhid_4',
    instagramUser: 'dabhid_4',
    correo: 'dalejo0827@gmail.com',
    infoPersonal: 'Estudiante de ingeniería de sistemas de la Universidad Industrial de Santander (UIS).',
    foto: davidFoto
  }
]
function Contact() {
  const [flippedIndex, setFlippedIndex] = useState(null)
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #07122c 0%, #101f45 48%, #0b1631 100%)',
      paddingTop: '6rem',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <style>{`
        @keyframes slideInFromBottom {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .contact-card {
          animation: slideInFromBottom 0.6s ease-out forwards;
          opacity: 0;
        }
        .contact-card:hover {
          box-shadow: 0 0 35px rgba(32,128,255,0.35), 0 15px 50px rgba(0,0,0,0.4) !important;
          transform: translateY(-6px) scale(1.01);
        }
        .back-button:hover .back-arrow {
          transform: translateX(-5px);
        }
        .pointer-title {
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .pointer-title:hover {
          color: #667eea;
        }
        .icon-link {
          transition: transform 0.2s, filter 0.2s;
        }
        .icon-link:hover {
          transform: scale(1.2);
          filter: brightness(1.3);
        }
      `}</style>
      {/* Glow/Blur decorativo */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '-5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(32, 128, 255, 0.15) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '-5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.12) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '30%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(68, 146, 255, 0.1) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }}></div>
      <Link 
        to="/" 
        className="back-button"
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.9rem',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease',
          zIndex: 10,
          padding: '8px 16px',
          borderRadius: '25px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#f8fbff';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        }}
      >
        <FaArrowLeft size={18} className="back-arrow" style={{ transition: 'transform 0.3s ease' }} />
        <span>Volver</span>
      </Link>
      <div className="contact-content" style={{ flexGrow: 1 }}>
        <Container className="py-5">
          <h1 className="text-center mb-4" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            fontSize: '2.5rem',
            letterSpacing: '-0.02em'
          }}>Equipo de Desarrollo</h1>
          <Row xs={1} className="g-4 justify-content-center">
            {integrantes.map((integrante, index) => (
              <Col key={index} xs={12} md={8}>
                <div
                  style={{ perspective: '1000px', height: '300px', cursor: 'pointer' }}
                  onClick={() => setFlippedIndex(flippedIndex === index ? null : index)}
                >
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transition: 'transform 0.6s',
                    transformStyle: 'preserve-3d',
                    transform: flippedIndex === index ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    willChange: 'transform'
                  }}>
                    <Card style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      borderRadius: '16px',
                      backdropFilter: 'blur(16px)',
                      color: 'white',
                      backfaceVisibility: 'hidden',
                      boxShadow: '0 0 20px rgba(32, 128, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.2)',
                      willChange: 'transform'
                    }}
                      className="contact-card"
                    >
                      <Card.Body className="d-flex flex-column text-center justify-content-start" style={{ paddingTop: '40px' }}>
                        <Card.Title className="fw-bold mb-3 pointer-title">
                          {integrante.nombre}
                        </Card.Title>
                        <Card.Subtitle style={{ color: 'rgba(248, 251, 255, 0.7)', marginBottom: '5px' }}>
                          {integrante.rol}
                        </Card.Subtitle>
                        <div className="mt-auto d-flex flex-column align-items-center gap-2">
                          <div className="d-flex align-items-center gap-2">
                            <a
                              href={integrante.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`GitHub de ${integrante.nombre}`}
                              className="icon-link"
                            >
                              <FaGithub size={24} color="#f8fbff" />
                            </a>
                            <a
                              href={integrante.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`GitHub de ${integrante.nombre}`}
                              style={{ color: 'rgba(248, 251, 255, 0.7)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                              onMouseEnter={e => { e.target.style.color = '#f8fbff' }}
                              onMouseLeave={e => { e.target.style.color = 'rgba(248, 251, 255, 0.7)' }}
                            >{integrante.githubUser}</a>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <a
                              href={integrante.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Instagram de ${integrante.nombre}`}
                              className="icon-link"
                            >
                              <FaInstagram size={24} color="#f8fbff" />
                            </a>
                            <a
                              href={integrante.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Instagram de ${integrante.nombre}`}
                              style={{ color: 'rgba(248, 251, 255, 0.7)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                              onMouseEnter={e => { e.target.style.color = '#f8fbff' }}
                              onMouseLeave={e => { e.target.style.color = 'rgba(248, 251, 255, 0.7)' }}
                            >{integrante.instagramUser}</a>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <FaEnvelope size={24} color="#f8fbff" />
                            <span style={{ color: 'rgba(248, 251, 255, 0.7)' }}>{integrante.correo}</span>
                          </div>
                        </div>
                        <p className="mt-3" style={{ color: 'rgba(248, 251, 255, 0.15)', fontSize: '0.85rem' }}>{TEXTO_FLIP}</p>
                      </Card.Body>
                    </Card>
                    <Card style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '16px',
                      backdropFilter: 'blur(16px)',
                      color: 'white',
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      boxShadow: '0 0 20px rgba(32, 128, 255, 0.15), 0 8px 32px rgba(0, 0, 0, 0.2)',
                      willChange: 'transform'
                    }}>
                      <Card.Body className="d-flex flex-column text-center justify-content-center align-items-center p-4">
                        <img
                          src={integrante.foto}
                          alt={integrante.nombre}
                          style={{
                            width: '140px',
                            height: '140px',
                            borderRadius: '15px',
                            objectFit: 'cover',
                            border: '3px solid rgba(255, 255, 255, 0.3)',
                            marginBottom: '20px'
                          }}
                        />
                        <p className="mb-0" style={{ color: 'rgba(248, 251, 255, 0.9)', fontSize: '1rem' }}>{integrante.infoPersonal}</p>
                        <p className="mt-3" style={{ color: 'rgba(248, 251, 255, 0.15)', fontSize: '0.85rem' }}>{TEXTO_BACK}</p>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
        <Footer />
      </div>
    </div>
  )
}
export default Contact
