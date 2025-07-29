const fs = require('fs').promises;
const path = require('path');

// Chemins des fichiers de données
const DESTINATIONS_FILE = path.join(__dirname, '../data/destinations.json');
const USERS_FILE = path.join(__dirname, '../data/users.json');

// Fonctions pour les destinations
async function getAllDestinations() {
    try {
        const data = await fs.readFile(DESTINATIONS_FILE, 'utf8');
        return JSON.parse(data).destinations;
    } catch (error) {
        console.error('Erreur lors de la lecture des destinations:', error);
        return [];
    }
}

async function getDestinationById(id) {
    try {
        const destinations = await getAllDestinations();
        return destinations.find(dest => dest.id === id);
    } catch (error) {
        console.error('Erreur lors de la recherche de destination:', error);
        return null;
    }
}

async function saveDestinations(destinations) {
    try {
        await fs.writeFile(DESTINATIONS_FILE, JSON.stringify({ destinations }, null, 2));
        return true;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des destinations:', error);
        return false;
    }
}

async function addDestination(destination) {
    try {
        const destinations = await getAllDestinations();
        destinations.push(destination);
        return await saveDestinations(destinations);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de destination:', error);
        return false;
    }
}

async function updateDestination(id, updatedDestination) {
    try {
        const destinations = await getAllDestinations();
        const index = destinations.findIndex(dest => dest.id === id);
        if (index !== -1) {
            destinations[index] = { ...destinations[index], ...updatedDestination };
            return await saveDestinations(destinations);
        }
        return false;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de destination:', error);
        return false;
    }
}

async function deleteDestination(id) {
    try {
        const destinations = await getAllDestinations();
        const filteredDestinations = destinations.filter(dest => dest.id !== id);
        return await saveDestinations(filteredDestinations);
    } catch (error) {
        console.error('Erreur lors de la suppression de destination:', error);
        return false;
    }
}

// Fonctions pour les utilisateurs
async function getAllUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data).users;
    } catch (error) {
        console.error('Erreur lors de la lecture des utilisateurs:', error);
        return [];
    }
}

async function getUserByUsername(username) {
    try {
        const users = await getAllUsers();
        return users.find(user => user.username === username);
    } catch (error) {
        console.error('Erreur lors de la recherche d\'utilisateur:', error);
        return null;
    }
}

module.exports = {
    getAllDestinations,
    getDestinationById,
    saveDestinations,
    addDestination,
    updateDestination,
    deleteDestination,
    getAllUsers,
    getUserByUsername
}; 