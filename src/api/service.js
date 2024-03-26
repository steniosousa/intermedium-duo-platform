import axios from 'axios';

const Api = axios.create({
  // baseURL:'https://intermedium-4d6b8dadff06.herokuapp.com'
  baseURL: 'https://intermedium-connect-api-production.up.railway.app'

});
export default Api;
