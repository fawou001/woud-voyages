# 📁 Upload manuel LWS - Guide étape par étape

## 🚀 Méthode recommandée (SSH ne fonctionne pas)

### **Étape 1 : Accédez à votre panneau LWS**
1. Connectez-vous à votre compte LWS
2. Ouvrez votre panneau de contrôle

### **Étape 2 : Ouvrez le gestionnaire de fichiers**
1. Cherchez "Gestionnaire de fichiers" ou "File Manager"
2. Cliquez pour l'ouvrir

### **Étape 3 : Naviguez vers votre dossier web**
1. Allez dans le dossier `public_html` ou `www`
2. C'est le dossier racine de votre site web

### **Étape 4 : Uploadez les fichiers**

#### **Fichiers principaux à uploader :**
- `app.js` - Application principale
- `package.json` - Dépendances
- `package-lock.json` - Verrouillage des versions
- `ecosystem.config.js` - Configuration PM2

#### **Dossiers complets à uploader :**
- `views/` - Templates EJS
- `routes/` - Routes Express
- `middleware/` - Middlewares
- `utils/` - Utilitaires
- `data/` - Données
- `public/` - Fichiers statiques (CSS, JS, images)
- `hotels/` - Pages d'hôtels

### **Étape 5 : Installation via terminal web LWS**

Si LWS propose un terminal web :
```bash
# Naviguez vers le dossier
cd public_html

# Installez les dépendances
npm install --production

# Installez PM2
npm install -g pm2

# Démarrez l'application
pm2 start ecosystem.config.js

# Sauvegardez la configuration
pm2 save

# Configurez le démarrage automatique
pm2 startup
```

### **Étape 6 : Configuration du domaine**

Dans votre panneau LWS :
1. Allez dans "Domaines" ou "Sites web"
2. Configurez votre domaine (ex: `www.site-woud.be`)
3. Pointez vers le dossier où vous avez uploadé les fichiers

## 📋 Liste complète des fichiers

### **Fichiers dans deploy-lws/ :**
```
deploy-lws/
├── app.js                    # Application principale
├── package.json              # Dépendances
├── package-lock.json         # Verrouillage des versions
├── ecosystem.config.js       # Configuration PM2
├── DEPLOY-LWS.md            # Guide de déploiement
├── views/                    # Templates EJS
│   ├── layouts/
│   ├── partials/
│   └── *.ejs
├── routes/                   # Routes Express
│   └── admin.js
├── middleware/               # Middlewares
├── utils/                    # Utilitaires
│   └── analytics.js
├── data/                     # Données
├── public/                   # Fichiers statiques
│   ├── fonts/
│   ├── uploads/
│   └── images/
└── hotels/                   # Pages d'hôtels
    ├── bali-resort.html
    ├── coral-paradise.html
    └── ...
```

## ⚠️ Points importants

1. **Uploadez TOUS les fichiers** du dossier `deploy-lws/`
2. **Conservez la structure des dossiers**
3. **Vérifiez les permissions** (755 pour les dossiers, 644 pour les fichiers)
4. **Assurez-vous que Node.js est activé** sur votre hébergement LWS

## 🔍 Vérification après upload

1. **Vérifiez que tous les fichiers sont présents**
2. **Testez l'installation** : `npm install --production`
3. **Démarrez l'application** : `pm2 start ecosystem.config.js`
4. **Vérifiez le statut** : `pm2 status`
5. **Testez votre site** sur votre domaine

## 🆘 En cas de problème

- **Fichiers manquants** : Vérifiez que tous les fichiers sont uploadés
- **Erreurs npm** : Vérifiez que Node.js est activé sur LWS
- **Erreurs PM2** : Vérifiez les logs avec `pm2 logs woud-voyages`
- **Site ne s'affiche pas** : Vérifiez la configuration du domaine

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs PM2
2. Contactez le support LWS
3. Vérifiez la documentation LWS pour Node.js 