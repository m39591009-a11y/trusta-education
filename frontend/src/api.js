const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

const BASE_URL = isLocalhost 
  ? 'http://127.0.0.1:8000' 
  : 'http://172.20.10.2:8000';

export const API = BASE_URL + '/api';
export const TOKEN_URL = BASE_URL + '/api/token/';

export default BASE_URL;