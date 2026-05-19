// Importación del archivo CSS con los estilos de la página de archivos
import "../styles/files.css"
// Importación del componente para subir archivos
import FileUpload from "../components/ui/FileUpload"
// Importación del componente para listar archivos disponibles
import FileList from "../components/ui/FileList"
// Importación de la barra de navegación personalizada
import NavBarCustom from "../components/layout/Navbar"

// Componente principal de la página de gestión de archivos
function Files() {
  return (
    /* Contenedor principal con estilos de fondo oscuro y gradientes */
    <div className="files-page">
      {/* Efectos decorativos de brillo (glow) en las esquinas */}
      <div className="files-glow files-glow-left"></div>
      <div className="files-glow files-glow-right"></div>
      
      {/* Barra de navegación del sitio */}
      <NavBarCustom/>
      
      {/* Contenedor principal con padding superior */}
      <div className="container files-hero">
        {/* Header de la página con título y descripción */}
        <div className="text-center mb-5">
          {/* Badge/etiqueta decorativa */}
          <span className="files-badge mb-3 d-inline-block">Gestión de archivos</span>
          {/* Título principal de la página */}
          <h1 className="files-title">Tus archivos seguros</h1>
          {/* Subtítulo descriptivo */}
          <p className="files-subtitle mx-auto">
            Sube y gestiona tus documentos financieros de forma segura. 
            Accede a ellos cuando los necesites.
          </p>
        </div>

        {/* Contenedor central para las tarjetas de funcionalidad */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Tarjeta que contiene el componente de subir archivos */}
            <div className="files-card p-4 p-lg-5 mb-5">
              <FileUpload />
            </div>

            {/* Tarjeta que contiene el componente de listar archivos */}
            <div className="files-card p-4 p-lg-5">
              <FileList />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Files