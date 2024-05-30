import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "https://dream-lab-backend.azurewebsites.net/v1/",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MWQ3NmNkZmM2Y2RhNmQ1MGNmMDQ3MiIsIm5hbWUiOiJQQVRSSUNJTyBWSUxMQVJSRUFMIiwiZW1haWwiOiJBMDA4MzQ1MjYiLCJjYXJlZXIiOiJJVEMiLCJzZW1lc3RlciI6Niwicm9sZSI6IlN0dWRlbnQifQ.JCPU9TCV6JEpushJ1VllSlMBMzFTPJY4dNuL0Em6SgI'
    }
});

export default axiosInstance;
