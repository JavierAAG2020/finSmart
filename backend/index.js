const path = require('path');
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const txRoutes = require('./routes/transactions')
const aiRoutes = require('./routes/ai')
const filesRoutes = require('./routes/files')
const registrosRouter  = require('./routes/registros')
const metasRouter  = require('./routes/metas')
const inversionesRouter = require('./routes/inversiones')
const perfilRouter = require('./routes/perfil')
require('dotenv').config()
require('./db') // pool

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/files', filesRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))
app.use('/api', txRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/registros',   registrosRouter)
app.use('/api/metas',       metasRouter)
app.use('/api/inversiones', inversionesRouter)
app.use('/api/perfil', perfilRouter)
app.use('/uploads', express.static('public/uploadspfp'))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API server listening on http://localhost:${PORT}`))


app.use('/public', express.static(path.join(__dirname, 'public')));
