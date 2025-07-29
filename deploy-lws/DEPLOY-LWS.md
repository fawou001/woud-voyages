# 🚀 Déploiement Node.js sur LWS

## 📋 Prérequis
- Compte LWS avec support Node.js
- Accès SSH (recommandé) ou gestionnaire de fichiers
- PM2 installé globalement

## 🔧 Étapes de déploiement

### 1. Préparation des fichiers
Votre projet est déjà configuré avec :
- ✅ `ecosystem.config.js` - Configuration PM2
- ✅ `app.js` - Application principale
- ✅ `package.json` - Dépendances
- ✅ Tous les dossiers nécessaires

### 2. Upload vers LWS

#### Option A : Via SSH (Recommandé)
```bash
# Connectez-vous à votre serveur LWS
ssh utilisateur@votre-serveur-lws.com

# Créez le dossier du projet
mkdir ~/woud-voyages
cd ~/woud-voyages

# Uploadez vos fichiers (depuis votre machine locale)
scp -r ./* utilisateur@votre-serveur-lws.com:~/woud-voyages/
```

#### Option B : Via gestionnaire de fichiers LWS
1. Connectez-vous à votre panneau LWS
2. Ouvrez le gestionnaire de fichiers
3. Créez un dossier `woud-voyages`
4. Uploadez tous les fichiers du projet

### 3. Installation et configuration

```bash
# Accédez au dossier du projet
cd ~/woud-voyages

# Installez les dépendances
npm install --production

# Installez PM2 globalement (si pas déjà fait)
npm install -g pm2

# Démarrez l'application avec PM2
pm2 start ecosystem.config.js

# Sauvegardez la configuration PM2
pm2 save

# Configurez PM2 pour démarrer au boot
pm2 startup
```

### 4. Configuration du domaine

#### Si vous avez un domaine personnalisé :
1. Dans votre panneau LWS, configurez le domaine
2. Pointez vers le dossier de votre application
3. Configurez le proxy si nécessaire

#### Si vous utilisez un sous-domaine LWS :
- Votre site sera accessible sur : `votre-app.lws.com`

### 5. Configuration du proxy (si nécessaire)

Si LWS nécessite un proxy, créez un fichier `.htaccess` :

```apache
RewriteEngine On
RewriteRule ^$ http://localhost:3000/ [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

### 6. Vérification

```bash
# Vérifiez le statut de l'application
pm2 status

# Vérifiez les logs
pm2 logs woud-voyages

# Testez l'application
curl http://localhost:3000
```

## 🔍 Commandes PM2 utiles

```bash
# Démarrer l'application
pm2 start ecosystem.config.js

# Arrêter l'application
pm2 stop woud-voyages

# Redémarrer l'application
pm2 restart woud-voyages

# Voir les logs en temps réel
pm2 logs woud-voyages --lines 100

# Surveiller les performances
pm2 monit

# Mettre à jour l'application
pm2 reload woud-voyages
```

## ⚠️ Points importants

1. **Port** : Assurez-vous que le port 3000 est disponible sur LWS
2. **Variables d'environnement** : Configurez `NODE_ENV=production`
3. **Sécurité** : Les cookies sont automatiquement sécurisés en production
4. **Sauvegarde** : Sauvegardez régulièrement vos données

## 🆘 Dépannage

### Problème : Application ne démarre pas
```bash
# Vérifiez les logs
pm2 logs woud-voyages

# Vérifiez les dépendances
npm list

# Redémarrez PM2
pm2 kill
pm2 start ecosystem.config.js
```

### Problème : Port déjà utilisé
```bash
# Changez le port dans ecosystem.config.js
# ou
# Trouvez le processus qui utilise le port
lsof -i :3000
```

## 📞 Support
En cas de problème avec LWS, contactez leur support technique. 