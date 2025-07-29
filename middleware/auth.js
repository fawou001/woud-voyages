const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByUsername } = require('../utils/database');
const { hasPermission, ROLES } = require('../utils/userManagement');

const JWT_SECRET = process.env.JWT_SECRET || 'woud-voyages-jwt-secret';

// Middleware pour vérifier si l'utilisateur est connecté (session ou JWT)
function requireAuth(req, res, next) {
    // Vérifier d'abord la session
    if (req.session && req.session.userId) {
        return next();
    }
    
    // Vérifier le token JWT dans les cookies
    const token = req.cookies?.authToken || req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            return next();
        } catch (error) {
            console.log('❌ Token JWT invalide:', error.message);
        }
    }
    
    res.redirect('/admin/login');
}

// Middleware pour vérifier si l'utilisateur est admin (session ou JWT)
function requireAdmin(req, res, next) {
    const userRole = req.session?.role || req.user?.role;
    
    if (userRole === 'admin') {
        next();
    } else {
        res.status(403).render('admin/error', { 
            title: 'Accès refusé',
            message: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.'
        });
    }
}

// Middleware pour vérifier si l'utilisateur est admin ou modérateur (session ou JWT)
function requireAdminOrModerator(req, res, next) {
    const userRole = req.session?.role || req.user?.role;
    
    if (userRole === 'admin' || userRole === 'moderator') {
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
        const userRole = req.session?.role || req.user?.role;
        
        if (!userRole) {
            return res.redirect('/admin/login');
        }
        
        const user = { role: userRole };
        
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

// Fonction pour créer un token JWT
function createJWTToken(user) {
    return jwt.sign(
        { 
            id: user.id, 
            username: user.username, 
            role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}

module.exports = {
    requireAuth,
    requireAdmin,
    requireAdminOrModerator,
    requirePermission,
    authenticateUser,
    createJWTToken
}; 