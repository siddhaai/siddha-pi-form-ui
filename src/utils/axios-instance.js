import axios from 'axios';


const prod = false;

export const ApiUrl = prod
  ? 'https://api.siddhaai.com/cadmin'
  : 'https://api.chozharoodagam.com/cadmin';

// export const ApiUrl = `http://localhost:3000`;
// export let ApiUrl = `http://192.168.1.2:3000`; // room airtel
// export const ApiUrl = `http://192.168.1.24:3000`; // office airtel

//  const ApiUrl : `http://${window.location.hostname}`;

export const axBackendInstance = axios.create({
  baseURL: `${ApiUrl}`,
  //   baseURL: `http://${window.location.hostname}:${window.location.port}`,
  headers: {
    'Content-Type': 'application/json'
  }
});
