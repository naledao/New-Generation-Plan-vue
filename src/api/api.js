import axios from './apiConfig.js'
const pass='gcb3u7835628sgd267hyuw64856cs7'


export const getAnimePicAndDec=(name)=>{
    return axios.get('/vodsearch/-------------/?wd='+name)
}

export const getDec=(url)=>{
    return axios.get(url)
}





export const getAllHistory=(url)=>{
    return axios.get(`/api/anime/renewHistory?password=${pass}&url=`+url)
}

export const getMonthlyAnime=(url)=>{
    return axios.post( '/api/anime/getMonthlyAnime',{url:url})
}

export const getdouban=(name)=>{
    return axios.get(`/api/anime/getdouban?name=${name}`)
}

export const updateMsg=(obj,cur,total,name)=>{
    return axios.post(`/api/anime/renew?cur=${cur}&total=${total}&password=${pass}&name=${name}`,obj)
}

export const getdoubandec=(id)=>{
    return axios.get(`/api/anime/subject?id=${id}&password=${pass}`)
}

export const getAllTimes=(unEncrypted,encrypted)=>{
    return axios.get(`/api/anime/getAllTimes?unEncrypted=${unEncrypted}&encrypted=${encrypted}`)
}

export const getAnimeByQuarterAndWeek=(quarter,week,unEncrypted,encrypted)=>{
    return axios.get(`/api/anime/getAnimeMsg?quarter=${quarter}&week=${week}&unEncrypted=${unEncrypted}&encrypted=${encrypted}`)
}

export const search=(name)=>{
    return axios.get(`/api/anime/search?searchValue=${name}&password=${pass}`)
}

export const edit=(obj)=>{
    return axios.post('/api/anime/edit',obj)
}
