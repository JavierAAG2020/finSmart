import { useState, useRef } from "react"

function FileUpload() {
  // Estado para almacenar los archivos seleccionados por el usuario
  const [selectedFiles, setSelectedFiles] = useState([])
  // Estado para mostrar mensajes al usuario (éxito o error)
  const [message, setMessage] = useState("")
  // Referencia al elemento input file para poder manipularlo programáticamente
  const fileInputRef = useRef(null)

  // Función que se ejecuta cuando el usuario selecciona archivos del explorador
  // Convierte la lista de archivos en un array y actualiza el estado
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(files)
    setMessage("")
  }

  // Función que se ejecuta cuando el usuario hace click en "Subir archivos"
  // Envía los archivos seleccionados al backend usando fetch
  const handleSubmit = async (e) => {
    e.preventDefault() // Evita que la página se recargue al enviar el formulario
    
    // Validar que el usuario haya seleccionado al menos un archivo
    if (selectedFiles.length === 0) {
      setMessage("Por favor selecciona al menos un archivo")
      return
    }

    // Crear objeto FormData para enviar archivos (requerido para uploadsmultipart/form-data)
    const formData = new FormData()
    // Agregar cada archivo al FormData con la clave "files"
    // El backend espera este nombre de campo
    selectedFiles.forEach((file) => {
      formData.append("files", file)
    })

    try {
      // Enviar petición POST al endpoint de uploads del backend
      const res = await fetch("http://localhost:4000/api/files/upload", {
        method: "POST",
        body: formData
      })
      // Parsear la respuesta JSON del servidor
      const data = await res.json()
      // Mostrar el mensaje devuelto por el backend (éxito o error)
      setMessage(data.message)
      // Limpiar la lista de archivos seleccionados después de subir exitosamente
      setSelectedFiles("")
      // Resetear el input file para permitir seleccionar los mismos archivos de nuevo si se desea
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      // Capturar errores de red o del servidor
      setMessage("Error al subir archivos")
    }
  }

  // Función para remover un archivo específico de la lista de selección
  // Se usa cuando el usuario hace click en la X junto a un archivo
  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  return (
    <div>
      {/* Título de la sección de upload */}
      <h3 className="text-white mb-4 fw-bold">Subir archivos</h3>
      
      {/* Zona interactiva para seleccionar archivos - simula drag & drop */}
      <div 
        className="upload-zone"
        onClick={() => fileInputRef.current?.click()} // Al hacer click, abre el explorador de archivos
      >
        {/* Icono representativo de subir archivos */}
        <div className="upload-zone-icon">📤</div>
        {/* Texto instructivo para el usuario */}
        <p className="upload-text mt-3 mb-1">
          Arrastra archivos aquí o haz clic para seleccionar
        </p>
        <p className="upload-text small">Supports: PDF, Images, Documents</p>
        
        {/* Input file oculto - se activa al hacer click en la zona */}
        {/* "multiple" permite seleccionar varios archivos a la vez */}
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
          className="d-none"
        />
      </div>

      {/* Mostrar lista de archivos seleccionados cuando hay alguno */}
      {selectedFiles.length > 0 && (
        <div className="selected-files mt-4">
          <h6 className="text-white-50 mb-3">Archivos seleccionados:</h6>
          {/* Mapear cada archivo para mostrarlo como item */}
          {selectedFiles.map((file, index) => (
            <div key={index} className="selected-file-item">
              {/* Contador/número de archivo */}
              <div className="files-counter">{index + 1}</div>
              {/* Nombre del archivo */}
              <span className="text-white flex-grow-1">{file.name}</span>
              {/* Botón para remover el archivo de la selección */}
              <button
                type="button"
                className="btn btn-sm btn-outline-light"
                onClick={() => removeFile(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Mostrar mensaje de éxito o error si existe */}
      {message && (
        <div className={`upload-alert mt-4 ${message.includes("Error") ? "text-danger" : ""}`}>
          {message}
        </div>
      )}

      {/* Botón para ejecutar la subida de archivos al servidor */}
      <button 
        type="button" 
        className="btn upload-btn w-100 mt-4"
        onClick={handleSubmit}
        disabled={selectedFiles.length === 0} // Deshabilitar si no hay archivos seleccionados
      >
        Subir archivos
      </button>
    </div>
  )
}

export default FileUpload