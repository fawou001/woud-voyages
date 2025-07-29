#!/bin/bash

# 🚀 Script de déploiement LWS pour Woud Voyages
# Usage: ./deploy-lws.sh [serveur-lws] [utilisateur]

echo "🚀 Déploiement Woud Voyages sur LWS"
echo "=================================="

# Variables
SERVER=${1:-"votre-serveur-lws.com"}
USER=${2:-"votre-utilisateur"}
PROJECT_NAME="woud-voyages"
LOCAL_PATH="."

echo "📋 Configuration:"
echo "   Serveur: $SERVER"
echo "   Utilisateur: $USER"
echo "   Projet: $PROJECT_NAME"
echo ""

# Vérification des fichiers essentiels
echo "🔍 Vérification des fichiers..."
if [ ! -f "app.js" ]; then
    echo "❌ Erreur: app.js manquant"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json manquant"
    exit 1
fi

if [ ! -f "ecosystem.config.js" ]; then
    echo "❌ Erreur: ecosystem.config.js manquant"
    exit 1
fi

echo "✅ Fichiers essentiels trouvés"
echo ""

# Création du package de déploiement
echo "📦 Préparation du package de déploiement..."
DEPLOY_DIR="deploy-lws"
rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR

# Copie des fichiers nécessaires
echo "📁 Copie des fichiers..."
cp -r app.js package.json package-lock.json ecosystem.config.js $DEPLOY_DIR/
cp -r views routes middleware utils data public hotels $DEPLOY_DIR/
cp DEPLOY-LWS.md $DEPLOY_DIR/

# Suppression des fichiers de développement
echo "🧹 Nettoyage des fichiers de développement..."
rm -rf $DEPLOY_DIR/node_modules
rm -rf $DEPLOY_DIR/.git
rm -rf $DEPLOY_DIR/.vercel

echo "✅ Package de déploiement créé dans: $DEPLOY_DIR"
echo ""

# Instructions de déploiement
echo "📋 Instructions de déploiement:"
echo "================================"
echo ""
echo "1️⃣  Connectez-vous à votre serveur LWS:"
echo "   ssh $USER@$SERVER"
echo ""
echo "2️⃣  Créez le dossier du projet:"
echo "   mkdir ~/$PROJECT_NAME"
echo "   cd ~/$PROJECT_NAME"
echo ""
echo "3️⃣  Uploadez les fichiers (depuis votre machine locale):"
echo "   scp -r $DEPLOY_DIR/* $USER@$SERVER:~/"
echo "   ou"
echo "   rsync -avz $DEPLOY_DIR/ $USER@$SERVER:~/$PROJECT_NAME/"
echo ""
echo "4️⃣  Sur le serveur LWS, installez et démarrez:"
echo "   cd ~/$PROJECT_NAME"
echo "   npm install --production"
echo "   npm install -g pm2"
echo "   pm2 start ecosystem.config.js"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "5️⃣  Configurez votre domaine dans le panneau LWS"
echo ""
echo "📁 Fichiers à uploader:"
echo "======================="
ls -la $DEPLOY_DIR/
echo ""
echo "🎉 Déploiement terminé !"
echo "Votre site sera accessible sur votre domaine configuré." 