import axios from 'axios';

const Api = axios.create({
  baseURL:"https://intermedium-connect-api-production.up.railway.app"
});
export default Api;
