import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

export default api