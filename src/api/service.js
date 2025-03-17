import axios from 'axios';

const Api = axios.create({
  baseURL: "https://intermedium-connect-api-production.up.railway.app"
  // baseURL: "http://localhost:3333"
});
export default Api;
