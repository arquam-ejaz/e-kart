import axios from "axios";

const instance = axios.create({
    //the api url
    baseURL: "http://localhost:5001/e-kart-19d3c/asia-south1/api"
});

export default instance;