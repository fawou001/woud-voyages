# 🏔️ Woud Voyages - Site Vitrine

Site vitrine d'une agence de voyage spécialisée dans les destinations nordiques et exotiques.

## 📋 Description

Ce site présente une agence de voyage fictive avec des destinations comme Bali, Maldives, Groenland et Alaska. Il s'agit d'un site vitrine à des fins de démonstration uniquement.

## 🚀 Installation

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone [URL_DU_REPO]
cd projetsite
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer le serveur de développement**
```bash
npm run dev
```

4. **Accéder au site**
Ouvrez votre navigateur et allez sur `http://localhost:3000`

## 📁 Structure du projet

```
projetsite/
├── app.js                 # Point d'entrée de l'application
├── package.json           # Dépendances et scripts
├── views/                 # Templates EJS
│   ├── index.ejs         # Page d'accueil
│   ├── layouts/          # Layouts EJS
│   └── admin/            # Pages d'administration
├── hotels/               # Pages détaillées des hôtels
├── public/               # Fichiers statiques
│   ├── fonts/           # Polices personnalisées
│   └── uploads/         # Images uploadées
├── routes/              # Routes Express
├── middleware/          # Middleware personnalisé
└── data/               # Données JSON
```

## 🛠️ Scripts disponibles

- `npm start` : Lance le serveur en mode production
- `npm run dev` : Lance le serveur en mode développement avec nodemon

## 🌐 Déploiement

### Option 1 : Netlify (Recommandé pour débuter)

1. **Créer un compte sur [Netlify](https://netlify.com)**
2. **Connecter votre repository GitHub**
3. **Configurer le build :**
   - Build command : `npm install`
   - Publish directory : `public`
4. **Déployer !**

### Option 2 : Vercel

1. **Créer un compte sur [Vercel](https://vercel.com)**
2. **Installer Vercel CLI :**
```bash
npm i -g vercel
```
3. **Déployer :**
```bash
vercel
```

### Option 3 : Heroku

1. **Créer un compte sur [Heroku](https://heroku.com)**
2. **Installer Heroku CLI**
3. **Créer une application :**
```bash
heroku create votre-app-name
```
4. **Déployer :**
```bash
git push heroku main
```

### Option 4 : Serveur VPS (OVH, DigitalOcean)

1. **Acheter un serveur VPS**
2. **Installer Node.js et PM2 :**
```bash
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pm2
```
3. **Cloner et configurer le projet :**
```bash
git clone [URL_DU_REPO]
cd projetsite
npm install
pm2 start app.js --name "woud-voyages"
pm2 startup
pm2 save
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
NODE_ENV=production
PORT=3000
SESSION_SECRET=votre_secret_session
```

### Configuration du serveur web (Nginx)

Si vous utilisez un serveur VPS, configurez Nginx :

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📝 Fonctionnalités

- ✅ Page d'accueil avec présentation des destinations
- ✅ Fiches détaillées des hôtels
- ✅ Formulaire de contact
- ✅ Interface d'administration
- ✅ Design responsive
- ✅ Polices personnalisées
- ✅ Mention site vitrine

## ⚠️ Important

Ce site est un **site vitrine** avec des informations fictives. Les prix, hôtels et détails présentés sont à des fins de démonstration uniquement.

## 📞 Support

Pour toute question concernant le déploiement ou l'utilisation de ce site, n'hésitez pas à consulter la documentation de votre hébergeur choisi.

## 📄 Licence

Ce projet est à des fins éducatives et de démonstration. # woud-voyages
