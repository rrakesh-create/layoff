import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8005"
});

export const predictRisk = (data) =>
  API.post("/predict", data);