const fs = require('fs').promises;
const path = require('path');

const CHANGELOG_FILE = path.join(__dirname, '../data/changelog.json');

// Lire tous les changements
async function getAllChanges() {
    try {
        const data = await fs.readFile(CHANGELOG_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lors de la lecture du changelog:', error);
        return { changes: [], lastUpdated: new Date().toISOString() };
    }
}

// Obtenir les derniers changements (limite optionnelle)
async function getRecentChanges(limit = 10) {
    try {
        const data = await getAllChanges();
        return data.changes.slice(0, limit);
    } catch (error) {
        console.error('Erreur lors de la récupération des changements récents:', error);
        return [];
    }
}

// Ajouter un nouveau changement
async function addChange(change) {
    try {
        const data = await getAllChanges();
        const newChange = {
            id: data.changes.length + 1,
            timestamp: new Date().toISOString(),
            ...change
        };
        
        data.changes.unshift(newChange); // Ajouter au début
        data.lastUpdated = new Date().toISOString();
        
        await fs.writeFile(CHANGELOG_FILE, JSON.stringify(data, null, 2));
        return newChange;
    } catch (error) {
        console.error('Erreur lors de l\'ajout du changement:', error);
        throw error;
    }
}

// Obtenir les statistiques des changements
async function getChangeStats() {
    try {
        const data = await getAllChanges();
        const stats = {
            total: data.changes.length,
            byType: {},
            byAction: {},
            recent: data.changes.slice(0, 7).length // Derniers 7 jours
        };
        
        data.changes.forEach(change => {
            // Compter par type
            stats.byType[change.type] = (stats.byType[change.type] || 0) + 1;
            // Compter par action
            stats.byAction[change.action] = (stats.byAction[change.action] || 0) + 1;
        });
        
        return stats;
    } catch (error) {
        console.error('Erreur lors du calcul des statistiques:', error);
        return { total: 0, byType: {}, byAction: {}, recent: 0 };
    }
}

module.exports = {
    getAllChanges,
    getRecentChanges,
    addChange,
    getChangeStats
}; 