import './styles/main.css';
import './styles/components.css';
import { initRouter } from './router.js';
import Header from './components/Header.js';
import Footer from './components/Footer.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    // Layout structure
    app.innerHTML = `
    ${Header()}
    <main id="router-view"></main>
    ${Footer()}
  `;

    initRouter();
});
