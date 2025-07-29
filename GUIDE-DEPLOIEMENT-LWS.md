# 🚀 Guide de déploiement LWS - Woud Voyages

## 📋 Prérequis
- ✅ Compte LWS avec support Node.js
- ✅ Accès SSH à votre serveur LWS
- ✅ Votre projet préparé (déjà fait !)

## 🔧 Étapes de déploiement

### **Étape 1 : Préparation locale** ✅
Votre projet est déjà préparé avec :
- `ecosystem.config.js` - Configuration PM2
- `app.js` - Application principale
- Tous les dossiers nécessaires

### **Étape 2 : Connexion à LWS**

#### Option A : Via SSH (Recommandé)
```bash
# Remplacez par vos vraies informations LWS
ssh votre-utilisateur@votre-serveur-lws.com
```

#### Option B : Via panneau de contrôle LWS
1. Connectez-vous à votre panneau LWS
2. Ouvrez le terminal web ou gestionnaire de fichiers

### **Étape 3 : Création du dossier projet**
```bash
# Sur votre serveur LWS
mkdir ~/woud-voyages
cd ~/woud-voyages
```

### **Étape 4 : Upload des fichiers**

#### Méthode 1 : SCP (depuis votre machine locale)
```bash
# Depuis votre machine locale (pas sur LWS)
scp -r deploy-lws/* votre-utilisateur@votre-serveur-lws.com:~/woud-voyages/
```

#### Méthode 2 : RSYNC (plus rapide)
```bash
# Depuis votre machine locale
rsync -avz deploy-lws/ votre-utilisateur@votre-serveur-lws.com:~/woud-voyages/
```

#### Méthode 3 : Gestionnaire de fichiers LWS
1. Ouvrez le gestionnaire de fichiers dans votre panneau LWS
2. Naviguez vers `~/woud-voyages`
3. Uploadez manuellement tous les fichiers du dossier `deploy-lws`

### **Étape 5 : Installation sur LWS**

```bash
# Sur votre serveur LWS
cd ~/woud-voyages

# Vérifiez que les fichiers sont présents
ls -la

# Installez les dépendances
npm install --production

# Installez PM2 globalement
npm install -g pm2

# Démarrez l'application
pm2 start ecosystem.config.js

# Sauvegardez la configuration PM2
pm2 save

# Configurez PM2 pour démarrer au boot
pm2 startup
```

### **Étape 6 : Vérification**

```bash
# Vérifiez le statut
pm2 status

# Vérifiez les logs
pm2 logs woud-voyages

# Testez l'application
curl http://localhost:3000
```

### **Étape 7 : Configuration du domaine**

#### Dans votre panneau LWS :
1. Allez dans "Domaines" ou "Sites web"
2. Ajoutez votre domaine (ex: `www.site-woud.be`)
3. Pointez vers le dossier `~/woud-voyages`
4. Configurez le proxy si nécessaire

#### Configuration proxy (si nécessaire)
Créez un fichier `.htaccess` dans la racine de votre domaine :
```apache
RewriteEngine On
RewriteRule ^$ http://localhost:3000/ [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

## 🔍 Commandes utiles

### **Sur LWS :**
```bash
# Voir le statut de l'application
pm2 status

# Voir les logs en temps réel
pm2 logs woud-voyages --lines 50

# Redémarrer l'application
pm2 restart woud-voyages

# Arrêter l'application
pm2 stop woud-voyages

# Surveiller les performances
pm2 monit
```

### **Mise à jour de l'application :**
```bash
# Sur votre machine locale
./deploy-lws.sh

# Sur LWS
cd ~/woud-voyages
pm2 reload woud-voyages
```

## ⚠️ Points importants

1. **Port** : Assurez-vous que le port 3000 est disponible sur LWS
2. **Variables d'environnement** : `NODE_ENV=production` est configuré automatiquement
3. **Sécurité** : Les cookies sont sécurisés en production
4. **Sauvegarde** : Sauvegardez régulièrement vos données

## 🆘 Dépannage

### **Problème : Application ne démarre pas**
```bash
# Vérifiez les logs
pm2 logs woud-voyages

# Vérifiez les dépendances
npm list

# Redémarrez PM2
pm2 kill
pm2 start ecosystem.config.js
```

### **Problème : Port déjà utilisé**
```bash
# Trouvez le processus
lsof -i :3000

# Ou changez le port dans ecosystem.config.js
```

### **Problème : Permissions**
```bash
# Vérifiez les permissions
ls -la

# Corrigez si nécessaire
chmod 755 ~/woud-voyages
```

## 📞 Support

- **LWS** : Contactez le support technique LWS
- **Application** : Vérifiez les logs avec `pm2 logs woud-voyages`

## 🎉 Félicitations !

Une fois toutes ces étapes terminées, votre site Woud Voyages sera accessible sur votre domaine configuré ! 