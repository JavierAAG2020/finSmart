# finsmart server

Inicia el backend Express conectado a MySQL.

Pasos:

1. Copia `.env.example` a `.env` y ajusta las credenciales.

2. Ajustar las credenciales en `.env`
DB_USER=un_usr
DB_PASS=una_clave
DB_NAME=finsmart
GOOGLE_AI_API_KEY="KEY_ESTA_EN_EL_DOCUMENTO_PDF"

4. Ajustar que las credenciales coincidan en XAMPP
    1. Abrir XAMPP
    2. Ejecutar MySQL y Apache (verificar que están en verde)
    3. Acceder a http://localhost/phpmyadmin/
    4. Dirigirse a cuenta de usuarios
    5. Seleccionar agregar cuenta de usuario
    6. Rellenar los datos con los datos correspondientes
        Nombre de usuario: un_usr
        Contraseña: una_clave
    7. Marcar los privilegios globales 
    8. Darle en continuar

5. Instala dependencias:

```bash
cd backend
npm install

npm install multer
```

5. Inicializa la base de datos (ejecuta el SQL en `sql_finsmart.txt` y crea un admin):

```bash
npm run init-db
```

6. (Opcional) Ver la base de datos accediendo a http://localhost/phpmyadmin/ y seleccionar la base de datos finsmart


7. Inicia el servidor:


```bash
npx nodemon index.js
```

```bash
npm run dev
```

Endpoints principales:
- `POST /api/auth/login` { user, pass } -> { token }
- `GET /api/dashboard` (Authorization: Bearer <token>)
- `POST /api/registros` { tipo_movimiento, monto, descripcion, fecha_movimiento, id_categoria }
