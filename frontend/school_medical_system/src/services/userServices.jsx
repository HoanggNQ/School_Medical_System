import axios from 'axios';


const loginAPI = async (userName, password) => {
    return await axios.post('http://localhost:8080/api/auth/login', { userName, password });
}

const signupAPI = async (userName, password) => {
    return await axios.post('http://localhost:8080/api/auth/signup', { userName, password });
}

export { loginAPI, signupAPI };