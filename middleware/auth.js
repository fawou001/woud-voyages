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

// Fonction d'authentification avec fallback hardcodé
async function authenticateUser(username, password) {
    try {
        console.log('🔍 Recherche utilisateur:', username);
        
        // Essayer d'abord la base de données
        const user = await getUserByUsername(username);
        
        if (user) {
            console.log('✅ Utilisateur trouvé dans la base:', username, 'Rôle:', user.role);
            const isValidPassword = await bcrypt.compare(password, user.password);
            
            if (!isValidPassword) {
                console.log('❌ Mot de passe incorrect pour:', username);
                return null;
            }

            console.log('✅ Authentification réussie pour:', username);
            return user;
        }
        
        // Fallback : utilisateurs hardcodés pour Vercel
        console.log('🔧 Utilisation des utilisateurs hardcodés pour Vercel');
        const hardcodedUsers = [
            {
                id: 1,
                username: 'admin',
                password: '$2b$10$Sc3aR6HIwT3S7PumZ435c.YDMRBTBwUMJUqMGbaHl1GuQSecWhg0i', // admin123
                email: 'admin@woud-voyages.com',
                role: 'admin'
            },
            {
                id: 2,
                username: 'moderateur',
                password: '$2b$10$7zZLW6zRmuWPnmAMnXMwqudwaJsR9RZOiA6Dp4RVfMC0l4yvIveFm', // moderateur123
                email: 'moderateur@woud-voyages.com',
                role: 'moderator'
            },
            {
                id: 3,
                username: 'test',
                password: '$2b$10$coJMh5O4WYEWlVzrr.Hmnu8hpBbi4yyxCiJNJifWAZk.mF/2dTC4K', // test123
                email: 'test@gmail.com',
                role: 'editor'
            },
            {
                id: 4,
                username: 'Administrateur',
                password: '$2b$10$xlYLKsCH3dGQo01E89awcel0NPUvYf7UzsiZhER9tQvBx/ZaPt9tm', // Administrateur123
                email: 'administrateur@woud-voyages.com',
                role: 'admin'
            }
        ];
        
        const hardcodedUser = hardcodedUsers.find(u => u.username === username);
        
        if (hardcodedUser) {
            console.log('✅ Utilisateur trouvé (hardcodé):', username, 'Rôle:', hardcodedUser.role);
            const isValidPassword = await bcrypt.compare(password, hardcodedUser.password);
            
            if (!isValidPassword) {
                console.log('❌ Mot de passe incorrect pour:', username);
                return null;
            }

            console.log('✅ Authentification réussie (hardcodé) pour:', username);
            return hardcodedUser;
        }
        
        console.log('❌ Utilisateur non trouvé:', username);
        return null;
        
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