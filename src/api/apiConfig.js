import axios from 'axios'

const instance = axios.create({
    // baseURL: 'https://hhsc.kangnasi.xyz:9630',
    baseURL: 'http://localhost:9630',
    timeout: 900000
})

// instance.defaults.withCredentials = true


export default instance