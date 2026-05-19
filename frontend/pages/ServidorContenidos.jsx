import Accordion from 'react-bootstrap/Accordion';
import '../styles/ServidorContenidos.css'
import { Link } from 'react-router-dom';

// Página que muestra lugares turísticos usando un acordeón
function ServidorContenidos() {
return (
    <div className="contenidos-page">

        {/* Botón para regresar al Home */}
        <div className="contenedor-boton">
        <Link to="/" className="boton-volver">
            Volver
        </Link>
        </div>

    <div className="overlay">
        <div className="accordion-container">

        {/* Título principal */}
        <h1 className="titulo-servidor">Lugares Turisticos Bucaramanga</h1>

        {/* Acordeón con información turística */}
        <Accordion defaultActiveKey="0">

            <Accordion.Item eventKey="0">
            <Accordion.Header>
                Parque García Rovira
            </Accordion.Header>

            <Accordion.Body>

                {/* Imagen obtenida desde el servidor de contenidos */}
                <img
                src="http://localhost:4000/public/images/garcia-rovira.jpg"
                alt="Parque García Rovira"
                className="imagen-turistica"
                />

                <p>
                El Parque García Rovira es uno de los lugares más históricos
                y representativos de Bucaramanga. Está rodeado de edificios
                emblemáticos y es un punto importante de encuentro cultural.
                </p>

            </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
            <Accordion.Header>
                Centro Comercial Cacique
            </Accordion.Header>

            <Accordion.Body>

                <img
                src="http://localhost:4000/public/images/cacique.jpg"
                alt="Centro Comercial Cacique"
                className="imagen-turistica"
                />

                <p>
                El Centro Comercial Cacique es uno de los centros comerciales
                más modernos y visitados de Bucaramanga. Cuenta con tiendas,
                restaurantes y una gran vista de la ciudad.
                </p>

            </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
            <Accordion.Header>
                Cerro El Santísimo
            </Accordion.Header>

            <Accordion.Body>

                <img
                src="http://localhost:4000/public/images/santisimo.jpg"
                alt="Cerro El Santísimo"
                className="imagen-turistica"
                />

                <p>
                El Cerro del Santísimo es uno de los principales atractivos
                turísticos del área metropolitana. Ofrece una vista panorámica
                espectacular y una gran estatua monumental.
                </p>

            </Accordion.Body>
            </Accordion.Item>

        </Accordion>
        </div>
    </div>
    </div>
);
}

export default ServidorContenidos;