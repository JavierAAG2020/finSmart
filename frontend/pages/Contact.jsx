import { useState } from 'react'
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
import '../styles/Contact.css'
import NavBarCustom from "../components/layout/Navbar"

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
    <>
    <NavBarCustom/>

    <div className="contact-page">
      {/* Glow/Blur decorativo */}
      <div className="contact-glow contact-glow-left"></div>
      <div className="contact-glow contact-glow-right"></div>
      <div className="contact-glow contact-glow-center"></div>
      <div className="contact-content">
        <Container className="py-5">
          <h1 className="text-center mb-4 contact-title">Equipo de Desarrollo</h1>
          <Row xs={1} className="g-4 justify-content-center">
            {integrantes.map((integrante, index) => (
              <Col key={index} xs={12} md={8}>
                <div
                  className="contact-flip-wrapper"
                  onClick={() => setFlippedIndex(flippedIndex === index ? null : index)}
                >
                  <div className={`contact-flip-inner ${flippedIndex === index ? 'is-flipped' : ''}`}>
                    <Card className="contact-card contact-card-front">
                      <Card.Body className="contact-card-body d-flex flex-column text-center justify-content-start">
                        <Card.Title className="fw-bold mb-3 pointer-title">
                          {integrante.nombre}
                        </Card.Title>
                        <Card.Subtitle className="contact-role">
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
                              className="social-text-link"
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
                              className="social-text-link"
                            >{integrante.instagramUser}</a>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <FaEnvelope size={24} color="#f8fbff" />
                            <span className="contact-mail">{integrante.correo}</span>
                          </div>
                        </div>
                        <p className="mt-3 flip-helper-text">{TEXTO_FLIP}</p>
                      </Card.Body>
                    </Card>
                    <Card className="contact-card contact-card-back">
                      <Card.Body className="d-flex flex-column text-center justify-content-center align-items-center p-4">
                        <img
                          src={integrante.foto}
                          alt={integrante.nombre}
                          className="contact-profile-image"
                        />
                        <p className="mb-0 contact-personal-info">{integrante.infoPersonal}</p>
                        <p className="mt-3 flip-helper-text">{TEXTO_BACK}</p>
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
    </>
  )
}
export default Contact