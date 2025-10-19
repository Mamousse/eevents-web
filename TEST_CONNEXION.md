# Guide de Test - Connexion Railway

## ✅ Serveur Angular déjà en cours d'exécution

Votre application Angular est **déjà accessible** sur : **http://localhost:4200**

## 🧪 Test de Connexion - Étapes

### 1. Ouvrir l'application dans le navigateur

Ouvrez votre navigateur et allez sur :
```
http://localhost:4200/admin/login
```

### 2. Ouvrir les DevTools (Important !)

Avant de vous connecter, **ouvrez les DevTools** pour observer ce qui se passe :

- **Windows/Linux :** Appuyez sur `F12` ou `Ctrl + Shift + I`
- **Mac :** `Cmd + Option + I`

### 3. Configurer les DevTools

1. Cliquez sur l'onglet **"Network"** (Réseau)
2. Cliquez sur l'onglet **"Console"** pour voir les logs
3. (Optionnel) Cochez "Preserve log" pour garder l'historique

### 4. Se connecter

Utilisez les identifiants de test :

```
Username: Mamousse
Password: momo2025
```

### 5. Observations attendues

#### ✅ Ce qui devrait se passer (SUCCÈS) :

1. **Spinner de chargement** apparaît brièvement
2. **Le spinner DISPARAÎT** après 1-3 secondes
3. **Redirection automatique** vers `/admin/dashboard`
4. **Dans l'onglet Network :**
   - Une requête `POST` vers `https://eevents-api-production-7cb8.up.railway.app/auth/login`
   - Status : `200 OK`
   - Response contient : `{ "token": "...", "user": {...} }`
5. **Dans l'onglet Console :**
   - Aucune erreur rouge
6. **Dans le localStorage :**
   - Ouvrir l'onglet "Application" > "Local Storage" > `http://localhost:4200`
   - Vous devriez voir : `token` et `currentUser`

#### ❌ Ce qui NE devrait PLUS se passer (Bug corrigé) :

1. ~~Spinner qui tourne indéfiniment~~ ✅ **CORRIGÉ**
2. ~~Page bloquée sans redirection~~ ✅ **CORRIGÉ**

### 6. Vérifications dans le Network

Cliquez sur la requête `login` dans l'onglet Network et vérifiez :

**Headers :**
```
Request URL: https://eevents-api-production-7cb8.up.railway.app/auth/login
Request Method: POST
Status Code: 200 OK
```

**Request Payload :**
```json
{
  "username": "Mamousse",
  "password": "momo2025"
}
```

**Response :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "68f421dca1e0da5b7f5ea187",
    "username": "Mamousse",
    "email": "ggroot725@gmail.com",
    "prenom": "Mamadou Mamousse",
    "nom": "NDIAYE",
    "telephone": "767302070",
    "role": "user"
  }
}
```

## 🔍 Diagnostic en cas de problème

### Problème 1 : Erreur 404 ou Cannot GET /admin/login

**Cause :** Le routing Angular n'est pas configuré
**Solution :** Essayez d'abord d'aller sur `http://localhost:4200` puis naviguez vers la page de login

### Problème 2 : Erreur CORS

**Symptôme :** Erreur dans la console du type "Access to fetch has been blocked by CORS policy"
**Solution :**
- Vérifiez que le backend Railway est bien démarré
- CORS est déjà configuré sur Railway (`Access-Control-Allow-Origin: *`)

### Problème 3 : Network Error

**Symptôme :** La requête échoue avec "Network Error" ou "Failed to fetch"
**Solution :**
- Vérifiez votre connexion Internet
- Testez manuellement l'API Railway avec curl :
  ```bash
  curl -X POST https://eevents-api-production-7cb8.up.railway.app/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"Mamousse","password":"momo2025"}'
  ```

### Problème 4 : Erreur 401 Unauthorized

**Symptôme :** Status 401, message "Nom d'utilisateur ou mot de passe incorrect"
**Cause :** Identifiants incorrects
**Solution :** Vérifiez que vous utilisez bien `Mamousse` / `momo2025`

### Problème 5 : Spinner tourne toujours

**Symptôme :** Le spinner de chargement ne s'arrête jamais
**Cause :** Le bug a été corrigé dans `admin-login.component.ts`
**Solution :**
- Assurez-vous que les modifications ont été prises en compte
- Rechargez la page avec `Ctrl + Shift + R` (hard reload)
- Videz le cache du navigateur
- Si le serveur Angular était déjà en cours d'exécution avant les modifications, redémarrez-le :
  1. Trouvez le processus : `netstat -ano | findstr :4200`
  2. Tuez-le : `taskkill /F /PID [numéro_du_PID]`
  3. Redémarrez : `npm start`

## 📊 Résumé des Corrections

### Fichiers modifiés :

1. **`src/app/components/admin-login/admin-login.component.ts`** (lignes 60-71)
   - ✅ Ajout de `this.loading = false` dans le callback `next`
   - ✅ Ajout du callback `complete`

2. **Tous les services** utilisent maintenant `environment.apiUrl`
   - ✅ `auth.service.ts`
   - ✅ `event.service.ts`
   - ✅ `reservation.service.ts`
   - ✅ `upload.service.ts`

3. **Configuration centralisée**
   - ✅ `src/environments/environment.ts` → Railway (production)
   - ✅ `src/environments/environment.prod.ts` → Railway

## 🎯 Checklist de Test

- [ ] Ouvrir http://localhost:4200/admin/login
- [ ] Ouvrir les DevTools (F12)
- [ ] Aller dans l'onglet Network
- [ ] Se connecter avec Mamousse / momo2025
- [ ] Observer que le spinner disparaît (1-3 secondes)
- [ ] Vérifier la redirection vers /admin/dashboard
- [ ] Vérifier la requête POST dans Network (Status 200)
- [ ] Vérifier que le token est stocké dans localStorage
- [ ] Aucune erreur dans la console

## 🚀 Si tout fonctionne

Félicitations ! La connexion fonctionne correctement avec Railway. Vous pouvez maintenant :

1. **Utiliser l'application normalement**
2. **Basculer vers localhost** si besoin (voir `CONFIG_API.md`)
3. **Tester les autres fonctionnalités** (événements, réservations, etc.)

## 📞 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Vérifiez les messages dans la console du navigateur
2. Consultez le fichier `DIAGNOSTIC_CONNEXION.md`
3. Assurez-vous que le serveur Angular a bien été redémarré après les modifications
