import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://hhsc.kangnasi.xyz/anime',
    // baseURL: 'http://localhost:9630',
    timeout: 900000
})

// instance.defaults.withCredentials = true


export default instance