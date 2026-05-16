# finsmart server

Inicia el backend Express conectado a MySQL.

Pasos:

1. Copia `.env.example` a `.env` y ajusta las credenciales.
2. Instala dependencias:

```bash
cd server
npm install
```

3. Inicializa la base de datos (ejecuta el SQL en `sql_finsmart.txt` y crea un admin):

```bash
npm run init-db
```

4. Inicia el servidor:

```bash
npm run dev
```

Endpoints principales:
- `POST /api/auth/login` { user, pass } -> { token }
- `GET /api/dashboard` (Authorization: Bearer <token>)
- `POST /api/registros` { tipo_movimiento, monto, descripcion, fecha_movimiento, id_categoria }
