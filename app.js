const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const adminRouter = require('./routes/admin');
const { incrementGlobalViews, incrementDestinationViews } = require('./utils/analytics');

const app = express();

// Définir EJS comme moteur de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Utiliser express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Parsing des formulaires
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Gestion de session
app.use(session({
    secret: 'woud-voyages-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // à mettre à true en production avec HTTPS
}));

// Middleware de tracking des vues
app.use(async (req, res, next) => {
    // Incrémenter les vues globales pour toutes les pages
    await incrementGlobalViews();
    next();
});

// Routes d'administration
app.use('/admin', adminRouter);

// Route principale
app.get('/', (req, res) => {
    res.render('index', { title: 'Accueil' });
});

// Routes pour les hôtels avec tracking
app.get('/hotels/:hotel', async (req, res) => {
    const hotel = req.params.hotel;
    
    // Incrémenter les vues pour cette destination
    await incrementDestinationViews(hotel);
    
    res.sendFile(path.join(__dirname, 'hotels', `${hotel}.html`));
});

// 404
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page non trouvée' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
}); 