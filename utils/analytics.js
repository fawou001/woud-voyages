const fs = require('fs').promises;
const path = require('path');

const STATS_FILE = path.join(__dirname, '../data/analytics.json');

// Initialiser les statistiques si le fichier n'existe pas
async function initializeStats() {
    try {
        await fs.access(STATS_FILE);
    } catch {
        const initialStats = {
            globalViews: 0,
            destinationViews: {},
            lastUpdated: new Date().toISOString()
        };
        await fs.writeFile(STATS_FILE, JSON.stringify(initialStats, null, 2));
    }
}

// Charger les statistiques
async function loadStats() {
    try {
        const data = await fs.readFile(STATS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
        return {
            globalViews: 0,
            destinationViews: {},
            lastUpdated: new Date().toISOString()
        };
    }
}

// Sauvegarder les statistiques
async function saveStats(stats) {
    try {
        stats.lastUpdated = new Date().toISOString();
        await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2));
        return true;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des statistiques:', error);
        return false;
    }
}

// Incrémenter les vues globales
async function incrementGlobalViews() {
    const stats = await loadStats();
    stats.globalViews++;
    return await saveStats(stats);
}

// Incrémenter les vues d'une destination
async function incrementDestinationViews(destinationId) {
    const stats = await loadStats();
    if (!stats.destinationViews[destinationId]) {
        stats.destinationViews[destinationId] = 0;
    }
    stats.destinationViews[destinationId]++;
    return await saveStats(stats);
}

// Obtenir les statistiques complètes
async function getStats() {
    return await loadStats();
}

// Obtenir les statistiques avec les noms des destinations
async function getStatsWithDestinationNames() {
    const stats = await loadStats();
    const { getAllDestinations } = require('./database');
    const destinations = await getAllDestinations();
    
    const destinationStats = destinations.map(dest => ({
        id: dest.id,
        name: dest.name,
        location: dest.location,
        views: stats.destinationViews[dest.id] || 0,
        price: dest.price,
        currency: dest.currency,
        rating: dest.rating,
        available: dest.available
    }));
    
    return {
        globalViews: stats.globalViews,
        destinationStats: destinationStats.sort((a, b) => b.views - a.views),
        lastUpdated: stats.lastUpdated,
        totalDestinations: destinations.length,
        activeDestinations: destinations.filter(d => d.available).length
    };
}

// Réinitialiser les statistiques
async function resetStats() {
    const initialStats = {
        globalViews: 0,
        destinationViews: {},
        lastUpdated: new Date().toISOString()
    };
    return await saveStats(initialStats);
}

// Initialiser les statistiques au démarrage
initializeStats();

module.exports = {
    incrementGlobalViews,
    incrementDestinationViews,
    getStats,
    getStatsWithDestinationNames,
    resetStats
}; 