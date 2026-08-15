import dns from 'node:dns'
import mongoose from 'mongoose'

dns.setDefaultResultOrder('ipv4first')
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4'])

const connectDB = async () => {
  const uri = process.env.MONGO_URI
  if (!uri) throw new Error('MONGO_URI is missing in backend/.env')

  const options = { family: 4, serverSelectionTimeoutMS: 20000 }
  let lastError
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const conn = await mongoose.connect(uri, options)
      console.log(`MongoDB connected: ${conn.connection.host}`)
      return conn
    } catch (error) {
      lastError = error
      console.error(`MongoDB connect attempt ${attempt} failed: ${error.message}`)
      await new Promise((resolve) => setTimeout(resolve, 1500 * attempt))
    }
  }
  throw lastError
}

export default connectDB
