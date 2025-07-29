const bcrypt = require('bcryptjs');
const { getUserByUsername } = require('../utils/database');
const { hasPermission, ROLES } = require('../utils/userManagement');

// Middleware pour vérifier si l'utilisateur est connecté
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.redirect('/admin/login');
    }
}

// Middleware pour vérifier si l'utilisateur est admin
function requireAdmin(req, res, next) {
    if (req.session && req.session.userId && req.session.role === 'admin') {
        next();
    } else {
        res.status(403).render('admin/error', { 
            title: 'Accès refusé',
            message: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.'
        });
    }
}

// Middleware pour vérifier si l'utilisateur est admin ou modérateur
function requireAdminOrModerator(req, res, next) {
    if (req.session && req.session.userId && (req.session.role === 'admin' || req.session.role === 'moderator')) {
        next();
    } else {
        res.status(403).render('admin/error', { 
            title: 'Accès refusé',
            message: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.'
        });
    }
}

// Middleware pour vérifier une permission spécifique
function requirePermission(permission) {
    return function(req, res, next) {
        if (!req.session || !req.session.userId) {
            return res.redirect('/admin/login');
        }
        
        const user = {
            role: req.session.role
        };
        
        if (hasPermission(user, permission)) {
            next();
        } else {
            res.status(403).render('admin/error', { 
                title: 'Accès refusé',
                message: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.'
            });
        }
    };
}

// Fonction d'authentification
async function authenticateUser(username, password) {
    try {
        console.log('🔍 Recherche utilisateur:', username);
        const user = await getUserByUsername(username);
        
        if (!user) {
            console.log('❌ Utilisateur non trouvé:', username);
            return null;
        }

        console.log('✅ Utilisateur trouvé:', username, 'Rôle:', user.role);
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            console.log('❌ Mot de passe incorrect pour:', username);
            return null;
        }

        console.log('✅ Authentification réussie pour:', username);
        return user;
    } catch (error) {
        console.error('❌ Erreur lors de l\'authentification:', error);
        return null;
    }
}

module.exports = {
    requireAuth,
    requireAdmin,
    requireAdminOrModerator,
    requirePermission,
    authenticateUser
}; 