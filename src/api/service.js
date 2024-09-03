import axios from 'axios';

const Api = axios.create({
  // baseURL: 'https://intermedium-connect-api-production.up.railway.app'
  baseURL:'http://localhost:8080/'
});
export default Api;
