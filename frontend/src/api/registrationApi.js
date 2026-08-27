import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const registrationApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = (registration) =>
  registrationApi.post("/users/register", registration);
