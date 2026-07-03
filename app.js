// Importaciones compatibles con el navegador (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// La configuración de tu aplicación web de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCWcmGtB3rlZ3zhcY5x3pOyZVrZb-ko8D8",
  authDomain: "objectif-reussite-delf.firebaseapp.com",
  projectId: "objectif-reussite-delf",
  storageBucket: "objectif-reussite-delf.firebasestorage.app",
  messagingSenderId: "942279633770",
  appId: "1:942279633770:web:e90614774e16f5aa9c1313",
  measurementId: "G-4B48T5Y5FC"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
