const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();

// Import des utilitaires
const { 
    getAllDestinations, 
    getDestinationById, 
    addDestination, 
    updateDestination, 
    deleteDestination,
    getUserByUsername 
} = require('../utils/database');

const { getRecentChanges, getChangeStats, addChange } = require('../utils/changelog');
const { getAllUsers, getUserStats, createUser, updateUser, deleteUser } = require('../utils/userManagement');

const { requireAuth, requireAdmin, requireAdminOrModerator, requirePermission, authenticateUser } = require('../middleware/auth');
const { getStatsWithDestinationNames, resetStats } = require('../utils/analytics');

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Seules les images sont autorisées!'));
        }
    }
});

// Créer le dossier uploads s'il n'existe pas
async function ensureUploadsDir() {
    try {
        await fs.access('public/uploads');
    } catch {
        await fs.mkdir('public/uploads', { recursive: true });
    }
}
ensureUploadsDir();

// Route de debug pour Vercel
router.get('/debug', (req, res) => {
    res.json({
        session: req.session,
        headers: req.headers,
        cookies: req.cookies,
        isAuthenticated: !!(req.session && req.session.userId),
        timestamp: new Date().toISOString()
    });
});

// Route de test pour vérifier l'authentification
router.get('/test-auth', (req, res) => {
    console.log('🔍 Test d\'authentification - Session:', req.session);
    res.json({
        session: req.session,
        isAuthenticated: !!(req.session && req.session.userId),
        user: req.session ? {
            id: req.session.userId,
            username: req.session.username,
            role: req.session.role
        } : null
    });
});

// Route de connexion - GET
router.get('/login', (req, res) => {
    if (req.session && req.session.userId) {
        return res.redirect('/admin');
    }
    res.render('admin/login', { title: 'Connexion Administration', layout: 'layouts/admin', active: '' });
});

// Route de connexion - POST (version simplifiée pour Vercel)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    console.log('🔐 Tentative de connexion pour:', username);
    
    try {
        const user = await authenticateUser(username, password);
        
        if (user) {
            console.log('✅ Authentification réussie pour:', username);
            
            // Configuration de session simplifiée
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.role = user.role;
            req.session.isAuthenticated = true;
            
            // Redirection immédiate sans save callback
            console.log('✅ Redirection vers /admin');
            return res.redirect('/admin');
        } else {
            console.log('❌ Authentification échouée pour:', username);
            return res.render('admin/login', { 
                title: 'Connexion Administration',
                error: 'Identifiant ou mot de passe incorrect',
                layout: 'layouts/admin',
                active: ''
            });
        }
    } catch (error) {
        console.error('❌ Erreur de connexion:', error);
        return res.render('admin/login', { 
            title: 'Connexion Administration',
            error: 'Une erreur est survenue lors de la connexion',
            layout: 'layouts/admin',
            active: ''
        });
    }
});

// Route de déconnexion
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion:', err);
        }
        res.redirect('/admin/login');
    });
});

// Tableau de bord - accessible aux admins et modérateurs
router.get('/', requireAuth, requireAdminOrModerator, async (req, res) => {
    try {
        const destinations = await getAllDestinations();
        const analytics = await getStatsWithDestinationNames();
        const recentChanges = await getRecentChanges(5);
        const changeStats = await getChangeStats();
        const users = await getAllUsers();
        const userStats = await getUserStats();
        
        res.render('admin/dashboard', { 
            title: 'Tableau de bord',
            user: { username: req.session.username },
            userRole: req.session.role,
            destinations,
            analytics,
            recentChanges,
            changeStats,
            users: users.users,
            userStats,
            layout: 'layouts/admin',
            active: 'dashboard'
        });
    } catch (error) {
        console.error('Erreur tableau de bord:', error);
        res.status(500).render('admin/error', { 
            title: 'Erreur',
            message: 'Une erreur est survenue lors du chargement du tableau de bord',
            layout: 'layouts/admin',
            active: ''
        });
    }
});

// Liste des destinations - accessible aux admins et modérateurs
router.get('/destinations', requireAuth, requireAdminOrModerator, async (req, res) => {
    try {
        const destinations = await getAllDestinations();
        res.render('admin/destinations', { 
            title: 'Gestion des destinations',
            user: { username: req.session.username },
            userRole: req.session.role,
            destinations,
            layout: 'layouts/admin',
            active: 'destinations'
        });
    } catch (error) {
        console.error('Erreur liste destinations:', error);
        res.status(500).render('admin/error', { 
            title: 'Erreur',
            message: 'Une erreur est survenue lors du chargement des destinations',
            layout: 'layouts/admin',
            active: ''
        });
    }
});

// Formulaire de nouvelle destination - accessible aux admins et modérateurs
router.get('/destinations/new', requireAuth, requirePermission('create'), (req, res) => {
    res.render('admin/destination-form', {
        title: 'Nouvelle destination',
        user: { username: req.session.username },
        userRole: req.session.role,
        destination: null,
        isNew: true,
        layout: 'layouts/admin',
        active: 'new'
    });
});

// Création d'une nouvelle destination - accessible aux admins et modérateurs
router.post('/destinations', requireAuth, requirePermission('create'), upload.array('images', 5), async (req, res) => {
    try {
        const { name, location, price, currency, description, category, rating, available } = req.body;
        
        // Traitement des images
        const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        const mainImage = images.length > 0 ? images[0] : '';
        
        // Traitement des features
        const features = req.body.features ? 
            (Array.isArray(req.body.features) ? req.body.features : [req.body.features]) : [];
        
        // Création de l'ID unique
        const id = name.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        
        const newDestination = {
            id,
            name,
            location,
            price: parseFloat(price),
            currency,
            description,
            features,
            images,
            mainImage,
            category,
            rating: parseFloat(rating),
            available: available === 'true'
        };
        
        const success = await addDestination(newDestination);
        
        if (success) {
            req.session.successMessage = 'Destination créée avec succès !';
            res.redirect('/admin/destinations');
        } else {
            throw new Error('Erreur lors de la création de la destination');
        }
    } catch (error) {
        console.error('Erreur création destination:', error);
        res.render('admin/destination-form', { 
            title: 'Nouvelle destination',
            user: { username: req.session.username },
            destination: req.body,
            isNew: true,
            error: 'Une erreur est survenue lors de la création de la destination',
            layout: 'layouts/admin',
            active: 'new'
        });
    }
});

// Formulaire d'édition de destination
router.get('/destinations/:id/edit', requireAuth, requirePermission('update'), async (req, res) => {
    try {
        const destination = await getDestinationById(req.params.id);
        if (!destination) {
            return res.status(404).render('admin/error', { 
                title: 'Destination non trouvée',
                message: 'La destination demandée n\'existe pas'
            });
        }
        
        res.render('admin/destination-form', { 
            title: 'Modifier la destination',
            user: { username: req.session.username },
            destination,
            isNew: false,
            layout: 'layouts/admin',
            active: 'destinations'
        });
    } catch (error) {
        console.error('Erreur édition destination:', error);
        res.status(500).render('admin/error', { 
            title: 'Erreur',
            message: 'Une erreur est survenue lors du chargement de la destination',
            layout: 'layouts/admin',
            active: ''
        });
    }
});

// Mise à jour d'une destination
router.post('/destinations/:id', requireAuth, requirePermission('update'), upload.array('images', 5), async (req, res) => {
    try {
        const { name, location, price, currency, description, category, rating, available } = req.body;
        
        // Récupérer la destination existante
        const existingDestination = await getDestinationById(req.params.id);
        if (!existingDestination) {
            return res.status(404).render('admin/error', { 
                title: 'Destination non trouvée',
                message: 'La destination demandée n\'existe pas'
            });
        }
        
        // Traitement des nouvelles images
        const newImages = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        const existingImages = existingDestination.images || [];
        const images = [...existingImages, ...newImages];
        const mainImage = images.length > 0 ? images[0] : existingDestination.mainImage;
        
        // Traitement des features
        const features = req.body.features ? 
            (Array.isArray(req.body.features) ? req.body.features : [req.body.features]) : [];
        
        const updatedDestination = {
            name,
            location,
            price: parseFloat(price),
            currency,
            description,
            features,
            images,
            mainImage,
            category,
            rating: parseFloat(rating),
            available: available === 'true'
        };
        
        const success = await updateDestination(req.params.id, updatedDestination);
        
        if (success) {
            req.session.successMessage = 'Destination mise à jour avec succès !';
            res.redirect('/admin/destinations');
        } else {
            throw new Error('Erreur lors de la mise à jour de la destination');
        }
    } catch (error) {
        console.error('Erreur mise à jour destination:', error);
        res.render('admin/destination-form', { 
            title: 'Modifier la destination',
            user: { username: req.session.username },
            destination: req.body,
            isNew: false,
            error: 'Une erreur est survenue lors de la mise à jour de la destination',
            layout: 'layouts/admin',
            active: 'destinations'
        });
    }
});

// Suppression d'une destination
router.get('/destinations/:id/delete', requireAuth, requireAdmin, async (req, res) => {
    try {
        const success = await deleteDestination(req.params.id);
        
        if (success) {
            req.session.successMessage = 'Destination supprimée avec succès !';
        } else {
            req.session.errorMessage = 'Erreur lors de la suppression de la destination';
        }
        
        res.redirect('/admin/destinations');
    } catch (error) {
        console.error('Erreur suppression destination:', error);
        req.session.errorMessage = 'Une erreur est survenue lors de la suppression';
        res.redirect('/admin/destinations');
    }
});

// Route des statistiques
router.get('/statistics', requireAuth, requireAdminOrModerator, async (req, res) => {
    try {
        const stats = await getStatsWithDestinationNames();
        res.render('admin/statistics', { 
            title: 'Statistiques',
            user: { username: req.session.username },
            userRole: req.session.role,
            stats,
            layout: 'layouts/admin',
            active: 'statistics'
        });
    } catch (error) {
        console.error('Erreur statistiques:', error);
        res.status(500).render('admin/error', { 
            title: 'Erreur',
            message: 'Une erreur est survenue lors du chargement des statistiques',
            layout: 'layouts/admin',
            active: ''
        });
    }
});

// Route pour réinitialiser les statistiques
router.post('/statistics/reset', requireAuth, requireAdmin, async (req, res) => {
    try {
        const success = await resetStats();
        if (success) {
            res.json({ success: true, message: 'Statistiques réinitialisées avec succès' });
        } else {
            res.status(500).json({ success: false, message: 'Erreur lors de la réinitialisation' });
        }
    } catch (error) {
        console.error('Erreur réinitialisation stats:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// Routes pour la gestion des utilisateurs
router.get('/users', requireAuth, requireAdmin, async (req, res) => {
    try {
        const users = await getAllUsers();
        const userStats = await getUserStats();
        
        res.render('admin/users', { 
            title: 'Gestion des utilisateurs',
            user: { username: req.session.username },
            users: users.users,
            userStats,
            layout: 'layouts/admin',
            active: 'users'
        });
    } catch (error) {
        console.error('Erreur gestion utilisateurs:', error);
        res.status(500).render('admin/error', { 
            title: 'Erreur',
            message: 'Une erreur est survenue lors du chargement des utilisateurs',
            layout: 'layouts/admin',
            active: ''
        });
    }
});

// Créer un nouvel utilisateur
router.post('/users', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        const newUser = await createUser({
            username,
            email,
            password,
            role
        });
        
        // Ajouter un log de changement
        await addChange({
            type: 'user',
            action: 'created',
            description: `Nouvel utilisateur '${username}' créé`,
            user: req.session.username,
            details: {
                username,
                role,
                email
            }
        });
        
        res.json({ success: true, message: 'Utilisateur créé avec succès', user: newUser });
    } catch (error) {
        console.error('Erreur création utilisateur:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// Mettre à jour un utilisateur
router.put('/users/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const updateData = req.body;
        
        const updatedUser = await updateUser(userId, updateData);
        
        // Ajouter un log de changement
        await addChange({
            type: 'user',
            action: 'updated',
            description: `Utilisateur '${updatedUser.username}' mis à jour`,
            user: req.session.username,
            details: {
                username: updatedUser.username,
                role: updatedUser.role,
                changes: Object.keys(updateData)
            }
        });
        
        res.json({ success: true, message: 'Utilisateur mis à jour avec succès', user: updatedUser });
    } catch (error) {
        console.error('Erreur mise à jour utilisateur:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// Supprimer un utilisateur
router.delete('/users/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        
        const result = await deleteUser(userId);
        
        // Ajouter un log de changement
        await addChange({
            type: 'user',
            action: 'deleted',
            description: `Utilisateur supprimé (ID: ${userId})`,
            user: req.session.username,
            details: {
                userId
            }
        });
        
        res.json(result);
    } catch (error) {
        console.error('Erreur suppression utilisateur:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router; 