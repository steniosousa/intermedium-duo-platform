import axios from 'axios';

const Api = axios.create({
  baseURL: 'https://intermedium-connect-api-dev-dbcq.4.us-1.fl0.io'

});
export default Api;
