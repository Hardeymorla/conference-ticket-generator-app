import axios from 'axios';

export default axios.create({
    baseURL: 'https://conference-ticket-generator-json-backend.onrender.com',
    timeout: 60000
});