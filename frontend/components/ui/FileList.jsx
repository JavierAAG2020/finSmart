import { useState, useEffect } from "react"

function FileList() {
  // Estado para almacenar la lista de archivos disponibles desde el servidor
  const [files, setFiles] = useState([])
  // Estado para indicar si está cargando los archivos del servidor
  const [loading, setLoading] = useState(true)

  // useEffect se ejecuta una sola vez al montar el componente
  // Realiza la petición al backend para obtener la lista de archivos disponibles
  useEffect(() => {
    // Petición GET al endpoint que devuelve la lista de archivos subidos
    fetch("http://localhost:4000/api/files/")
      // Convertir la respuesta a formato JSON
      .then((res) => res.json())
      // Actualizar el estado con los archivos recibidos del servidor
      .then((data) => {
        setFiles(data.files || []) // data.files contiene el array de nombres de archivos
        setLoading(false) // Terminar el estado de carga
      })
      // Si hay error en la petición, salir del estado de carga igualmente
      .catch(() => setLoading(false))
  }, []) // Array vacío = solo se ejecuta una vez (al montaje del componente)

  // Función para determinar qué icono mostrar según el tipo de archivo
  // Recibe el nombre del archivo y retorna el emoji correspondiente
  const getFileIcon = (filename) => {
    // Obtener la extensión del archivo (la parte después del último punto)
    const ext = filename.split('.').pop()?.toLowerCase()
    // Retornar icono según el tipo de archivo
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return '🖼️'
    if (['pdf'].includes(ext)) return '📄'
    if (['doc', 'docx'].includes(ext)) return '📝'
    if (['xls', 'xlsx'].includes(ext)) return '📊'
    return '📁'
  }

  return (
    <div>
      {/* Header de la sección - título y contador de archivos */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h3 className="text-white mb-0 fw-bold">Archivos disponibles</h3>
        {/* Badge mostrando la cantidad de archivos */}
        <span className="files-badge">{files.length} archivos</span>
      </div>

      {/* Mostrar estado de carga mientras se obtienen los archivos del servidor */}
      {loading ? (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <p className="text-white-50 mt-3">Cargando archivos...</p>
        </div>
      ) 
      // Mostrar mensaje cuando no hay archivos disponibles en el servidor
      : files.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <p className="text-white mt-3 mb-1">No hay archivos disponibles</p>
          <p className="text-white-50">Sube tu primer archivo usando el formulario de arriba</p>
        </div>
      ) 
      // Renderizar la lista de archivos cuando hay archivos disponibles
      : (
        <div className="files-list">
          {/* Mapear cada archivo para renderizar un item de lista */}
          {files.map((filename, index) => (
            <div key={index} className="file-item">
              {/* Sección izquierda: icono y nombre del archivo */}
              <div className="d-flex align-items-center gap-3 flex-grow-1">
                {/* Icono según tipo de archivo */}
                <div className="file-icon">{getFileIcon(filename)}</div>
                {/* Nombre del archivo */}
                <span className="file-name">{filename}</span>
              </div>

              {/* Botón para descargar cada archivo */}
              {/* Link al endpoint de download del backend con el nombre del archivo como parámetro */}
              <a
                href={`http://localhost:4000/api/files/download/${filename}`}
                className="download-btn"
              >
                ⬇️ Descargar
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileList