import CustomNavbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import "../styles/Home.css"
import "../styles/main.css"

function Home() {
  return (
    <>
      <CustomNavbar />

      <main className="home-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 text-white">
              <span className="badge bg-primary mb-3">Finanzas seguras</span>
              <h1 className="display-4 fw-bold">
                Tu camino financiero comienza con confianza.
              </h1>
              <p className="lead text-white-75 mb-4">
                FinSmart te ofrece un panel claro, seguridad bancaria y control total
                sobre tus gastos e inversiones con un diseño moderno y profesional.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3">
                <a href="/dashboard" className="btn btn-primary btn-lg">
                  Iniciar sesión
                </a>
                <a href="/contact" className="btn btn-outline-light btn-lg">
                  Contáctanos
                </a>
              </div>
            </div>

            <div className="col-lg-5 mt-5 mt-lg-0">
              <div className="home-card p-4 shadow-lg rounded-4">
                <h2 className="h5 text-uppercase text-primary mb-3">Lo que obtienes</h2>
                <ul className="list-unstyled mb-0">
                  <li className="mb-3">
                    <strong>Seguridad de datos:</strong> cifrado y acceso confiable.
                  </li>
                  <li className="mb-3">
                    <strong>Visión completa:</strong> presupuesto, ahorros y metas.
                  </li>
                  <li>
                    <strong>Alertas inteligentes:</strong> información en tiempo real.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="container py-5">
        <div className="row gy-4">
          <div className="col-lg-4">
            <div className="card feature-card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h3 className="h5 styled-text">Protección avanzada</h3>
                <p className="text-muted mb-0">
                  Tus transacciones y datos están protegidos con protocolos modernos y monitoreo continuo.
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card feature-card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h3 className="h5 styled-text">Informe claro</h3>
                <p className="text-muted mb-0">
                  Visualiza tus ingresos, gastos y ahorros de forma simple para tomar decisiones seguras.
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card feature-card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h3 className="h5 styled-text">Soporte confiable</h3>
                <p className="text-muted mb-0">
                  Estamos disponibles para ayudarte a entender tu panorama financiero y a optimizar tus resultados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container security-section py-5 mb-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="security-box p-4 rounded-4 shadow-sm">
              <h2 className="h4 mb-3">Diseñado para tu tranquilidad</h2>
              <p className="text-muted">
                FinSmart combina la experiencia financiera con un enfoque en seguridad y transparencia, para que manejes tu dinero con plena confianza.
              </p>
              <ul className="list-unstyled mt-4">
                <li className="mb-2">• Autenticación segura y cifrado de extremo a extremo.</li>
                <li className="mb-2">• Monitoreo continuo de actividad y control de accesos.</li>
                <li>• Informes claros y decisiones respaldadas por datos.</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="security-image rounded-4"></div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="text-center mb-4">Importancia y tips para gestionar tu dinero</h2>

        <div className="row gy-4">
          <div className="col-lg-6">
            <div className="ratio ratio-16x9">
              <iframe
                src="https://www.youtube.com/embed/4j2emMn7UaI"
                title="Cómo gestionar tus gastos personales"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="ratio ratio-16x9">
              <iframe
                src="https://www.youtube.com/embed/HQzoZfc3GwQ"
                title="Cómo administrar tu dinero inteligentemente"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Home