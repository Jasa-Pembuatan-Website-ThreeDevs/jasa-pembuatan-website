import axios from "axios";
import { showWarning } from "../utils/swal";

// Buat instance khusus (bukan global)
const api = axios.create({
    baseURL: 'http://localhost:8000',
    // headers: {'X-Custom-Header': 'foobar'} // Bisa tambah header default disini
});

// Pasang Interceptor di instance ini
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 503) {
            // Logic maintenance sama seperti di atas...
            showWarning("Sistem sedang maintenance!"); 
            // Atau redirect ke halaman khusus maintenance di React Router
            // window.location.href = '/maintenance';
        }
        return Promise.reject(error);
    }
);

export default api;