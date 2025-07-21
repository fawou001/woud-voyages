const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const USERS_FILE = path.join(__dirname, '../data/users.json');

// Rôles disponibles et leurs permissions
const ROLES = {
    admin: {
        name: 'Administrateur',
        permissions: ['all'],
        description: 'Accès complet à toutes les fonctionnalités'
    },
    moderator: {
        name: 'Modérateur',
        permissions: ['read', 'update', 'create'],
        description: 'Peut lire, créer et modifier le contenu'
    },
    editor: {
        name: 'Éditeur',
        permissions: ['read', 'update'],
        description: 'Peut lire et modifier le contenu existant'
    },
    viewer: {
        name: 'Lecteur',
        permissions: ['read'],
        description: 'Peut seulement consulter les données'
    }
};

// Lire tous les utilisateurs
async function getAllUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lors de la lecture des utilisateurs:', error);
        return { users: [] };
    }
}

// Créer un nouvel utilisateur
async function createUser(userData) {
    try {
        const data = await getAllUsers();
        
        // Vérifier si l'utilisateur existe déjà
        const existingUser = data.users.find(u => u.username === userData.username || u.email === userData.email);
        if (existingUser) {
            throw new Error('Un utilisateur avec ce nom ou cet email existe déjà');
        }
        
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        const newUser = {
            id: data.users.length + 1,
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            role: userData.role || 'viewer',
            createdAt: new Date().toISOString(),
            lastLogin: null,
            isActive: true
        };
        
        data.users.push(newUser);
        await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));
        
        // Retourner l'utilisateur sans le mot de passe
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw error;
    }
}

// Mettre à jour un utilisateur
async function updateUser(userId, updateData) {
    try {
        const data = await getAllUsers();
        const userIndex = data.users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            throw new Error('Utilisateur non trouvé');
        }
        
        // Mettre à jour les champs autorisés
        if (updateData.username) data.users[userIndex].username = updateData.username;
        if (updateData.email) data.users[userIndex].email = updateData.email;
        if (updateData.role) data.users[userIndex].role = updateData.role;
        if (updateData.isActive !== undefined) data.users[userIndex].isActive = updateData.isActive;
        
        // Si un nouveau mot de passe est fourni, le hasher
        if (updateData.password) {
            data.users[userIndex].password = await bcrypt.hash(updateData.password, 10);
        }
        
        await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));
        
        const { password, ...userWithoutPassword } = data.users[userIndex];
        return userWithoutPassword;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        throw error;
    }
}

// Supprimer un utilisateur
async function deleteUser(userId) {
    try {
        const data = await getAllUsers();
        const userIndex = data.users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            throw new Error('Utilisateur non trouvé');
        }
        
        // Empêcher la suppression de l'admin principal
        if (data.users[userIndex].username === 'admin') {
            throw new Error('Impossible de supprimer l\'administrateur principal');
        }
        
        data.users.splice(userIndex, 1);
        await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));
        
        return { success: true, message: 'Utilisateur supprimé avec succès' };
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        throw error;
    }
}

// Obtenir les statistiques des utilisateurs
async function getUserStats() {
    try {
        const data = await getAllUsers();
        const stats = {
            total: data.users.length,
            byRole: {},
            active: data.users.filter(u => u.isActive).length,
            inactive: data.users.filter(u => !u.isActive).length
        };
        
        data.users.forEach(user => {
            stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
        });
        
        return stats;
    } catch (error) {
        console.error('Erreur lors du calcul des statistiques utilisateurs:', error);
        return { total: 0, byRole: {}, active: 0, inactive: 0 };
    }
}

// Vérifier les permissions d'un utilisateur
function hasPermission(user, permission) {
    if (!user || !user.role) return false;
    
    const role = ROLES[user.role];
    if (!role) return false;
    
    return role.permissions.includes('all') || role.permissions.includes(permission);
}

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserStats,
    hasPermission,
    ROLES
}; 