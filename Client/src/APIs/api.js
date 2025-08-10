import axios from 'axios'

const app = axios.create({
    baseURL: "http://localhost:8080/auth"
})

export const googleAuth = (code) => {
    app.get(`/google?code=${code}`)
}