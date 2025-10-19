# Configuration de l'API Backend

Ce projet utilise un système de configuration d'environnement pour basculer facilement entre le serveur local et Railway (production).

## Comment ça fonctionne

L'application utilise les fichiers d'environnement Angular pour gérer l'URL de l'API backend.

### Fichiers de configuration

1. **`src/environments/environment.ts`** - Configuration pour le développement (localhost)
2. **`src/environments/environment.prod.ts`** - Configuration pour la production (Railway)

## Basculer entre Local et Railway

### Option 1 : Modifier le fichier d'environnement (Recommandé)

**Pour utiliser le serveur LOCAL (développement) :**

Éditez `src/environments/environment.ts` :
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'  // ← Serveur local
};
```

**Pour utiliser RAILWAY (production) :**

Éditez `src/environments/environment.ts` :
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://eevents-api-production-7cb8.up.railway.app'  // ← Railway
};
```

### Option 2 : Utiliser les commandes Angular

**Mode développement (localhost) :**
```bash
ng serve
```

**Mode production (Railway) :**
```bash
ng serve --configuration=production
```

ou pour build :
```bash
ng build --configuration=production
```

## Fichiers .env (optionnel)

Des fichiers `.env` ont été créés à la racine du projet pour référence :

- `.env` - Configuration par défaut (actuellement Railway)
- `.env.local` - Configuration locale
- `.env.production` - Configuration production

**Note :** Angular n'utilise pas directement les fichiers `.env` par défaut. Ils sont là pour documentation.

## Vérifier la configuration actuelle

Ouvrez la console du navigateur et vérifiez les requêtes réseau pour voir quelle URL est utilisée.

## Résolution du problème de connexion infinie

Le problème de connexion qui tourne sans s'arrêter peut être dû à :

1. **CORS** - Vérifiez que le backend autorise les requêtes depuis votre frontend
2. **Timeout** - Les services ont un timeout de 15 secondes configuré
3. **URL incorrecte** - Vérifiez que l'URL dans `environment.ts` est correcte

### Test de connexion

Pour tester si Railway fonctionne :
```bash
curl -X POST https://eevents-api-production-7cb8.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "Mamousse", "password": "momo2025"}'
```

Si vous obtenez un token, le backend fonctionne correctement.

## Services mis à jour

Tous les services suivants ont été configurés pour utiliser `environment.apiUrl` :

- ✅ `auth.service.ts` - Service d'authentification
- ✅ `event.service.ts` - Service des événements
- ✅ `reservation.service.ts` - Service des réservations
- ✅ `upload.service.ts` - Service d'upload de fichiers

## En cas de problème

Si la connexion ne fonctionne toujours pas :

1. Ouvrez les DevTools du navigateur (F12)
2. Allez dans l'onglet "Network" (Réseau)
3. Tentez de vous connecter
4. Vérifiez la requête POST vers `/auth/login`
5. Regardez :
   - L'URL appelée (doit pointer vers Railway ou localhost)
   - Le statut de la réponse
   - Les erreurs éventuelles dans la console
