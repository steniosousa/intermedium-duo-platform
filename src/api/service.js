import axios from 'axios';

const Api = axios.create({
  // baseURL:'https://intermedium-4d6b8dadff06.herokuapp.com'
  baseURL: 'http://localhost:8080'

});
export default Api;
