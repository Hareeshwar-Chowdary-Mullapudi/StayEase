import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import listingRoutes from './routes/listings.js'
import bookingRoutes from './routes/bookings.js'
import paymentRoutes from './routes/payments.js'
import reviewRoutes from './routes/reviews.js'
import uploadRoutes from './routes/upload.js'
import userRoutes from './routes/users.js'
import { stripeWebhook } from './controllers/paymentController.js'
import { ensureAdminUser } from './controllers/authController.js'
import { seedListingsIfEmpty } from './utils/seedListings.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)

const app = express()
const PORT = process.env.PORT || 5000
app.set('trust proxy', 1)

await connectDB()
await ensureAdminUser()
await seedListingsIfEmpty()

app.use(cors())
app.use(morgan('dev'))
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), stripeWebhook)
app.use(express.json())
app.use('/uploads', express.static(uploadsDir))

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/users', userRoutes)
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
