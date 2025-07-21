# 🚀 Déploiement sur Vercel - Guide complet

## 📋 Prérequis

- Compte GitHub (gratuit)
- Node.js installé localement
- Vercel CLI (optionnel)

## 🎯 Méthode 1 : Déploiement via GitHub (Recommandé)

### Étape 1 : Créer un repository GitHub

1. **Aller sur [GitHub.com](https://github.com)**
2. **Créer un nouveau repository** :
   - Nom : `woud-voyages`
   - Public ou Privé (au choix)
   - Ne pas initialiser avec README

### Étape 2 : Pousser votre code sur GitHub

```bash
# Dans votre dossier projet
git init
git add .
git commit -m "Initial commit - Woud Voyages"
git branch -M main
git remote add origin https://github.com/votre-username/woud-voyages.git
git push -u origin main
```

### Étape 3 : Connecter à Vercel

1. **Aller sur [Vercel.com](https://vercel.com)**
2. **Créer un compte** (avec GitHub)
3. **Cliquer sur "New Project"**
4. **Importer votre repository GitHub**
5. **Configurer le projet** :
   - Framework Preset : `Node.js`
   - Root Directory : `./` (par défaut)
   - Build Command : `npm install` (par défaut)
   - Output Directory : `./` (par défaut)
6. **Cliquer sur "Deploy"**

### Étape 4 : Configuration automatique

Vercel détectera automatiquement :
- ✅ `package.json` avec les dépendances
- ✅ `app.js` comme point d'entrée
- ✅ `vercel.json` pour la configuration

## 🎯 Méthode 2 : Déploiement via CLI

### Étape 1 : Installer Vercel CLI

```bash
npm install -g vercel
```

### Étape 2 : Se connecter

```bash
vercel login
```

### Étape 3 : Déployer

```bash
# Dans votre dossier projet
vercel
```

### Étape 4 : Suivre les instructions

Vercel vous posera quelques questions :
- Set up and deploy? → `Y`
- Which scope? → Votre compte
- Link to existing project? → `N`
- What's your project's name? → `woud-voyages`
- In which directory is your code located? → `./`
- Want to override the settings? → `N`

## 🔧 Configuration avancée

### Variables d'environnement

Dans Vercel Dashboard :
1. **Aller dans votre projet**
2. **Settings → Environment Variables**
3. **Ajouter** :
   - `NODE_ENV` = `production`
   - `SESSION_SECRET` = `votre-secret-session`

### Domaine personnalisé

1. **Dans Vercel Dashboard**
2. **Settings → Domains**
3. **Ajouter votre domaine**
4. **Configurer les DNS** selon les instructions

## 📊 Avantages de Vercel

✅ **Gratuit** pour les projets personnels  
✅ **Déploiement automatique** depuis GitHub  
✅ **HTTPS automatique**  
✅ **CDN global** pour de meilleures performances  
✅ **Prévisualisation** des pull requests  
✅ **Rollback facile** en un clic  
✅ **Analytics intégrés**  
✅ **Support Node.js natif**  

## 🔍 Vérification du déploiement

### Après le déploiement, vérifiez :

1. **Page d'accueil** : `https://votre-app.vercel.app`
2. **Pages d'hôtels** : `https://votre-app.vercel.app/hotels/bali-resort`
3. **Formulaire de contact** : Fonctionne-t-il ?
4. **Design responsive** : Testez sur mobile
5. **Performance** : Utilisez les outils de développement

## 🛠️ Dépannage

### Problème : Erreur de build
**Solution :**
- Vérifier que `package.json` est correct
- Vérifier que toutes les dépendances sont listées
- Consulter les logs de build dans Vercel Dashboard

### Problème : Pages d'hôtels ne fonctionnent pas
**Solution :**
- Vérifier que le dossier `hotels/` est bien dans le repository
- Vérifier la configuration dans `vercel.json`

### Problème : Images ne s'affichent pas
**Solution :**
- Vérifier que le dossier `public/` est bien uploadé
- Vérifier les chemins dans le code

## 📈 Optimisations

### 1. Cache des images
Vercel met automatiquement en cache les fichiers statiques.

### 2. Compression
Vercel compresse automatiquement les fichiers.

### 3. Analytics
Activer Vercel Analytics dans le dashboard.

## 🔄 Mises à jour

### Pour mettre à jour votre site :

```bash
# Modifier votre code
git add .
git commit -m "Mise à jour du site"
git push origin main
```

Vercel déploiera automatiquement les changements !

## 📞 Support

- **Documentation Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **Support Vercel** : Via le dashboard
- **Community** : [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

## 🎉 Félicitations !

Votre site Woud Voyages est maintenant en ligne sur Vercel avec :
- ✅ Déploiement automatique
- ✅ HTTPS gratuit
- ✅ Performance optimale
- ✅ Support Node.js complet 