import axios from 'axios';

const Api = axios.create({
  // baseURL:"http://localhost:3333"
  baseURL: 'https://intermedium-connect-api-production.up.railway.app'

});
export default Api;
