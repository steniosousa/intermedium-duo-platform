import axios from 'axios';

const Api = axios.create({
  // baseURL:"intermedium-connect-api-production.up.railway.app"
  baseURL: 'https://intermedium-connect-api-production.up.railway.app'

});
export default Api;
