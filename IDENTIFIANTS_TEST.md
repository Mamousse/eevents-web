# Identifiants de Test - Application E-Events

## ✅ Nouvel Utilisateur Admin Créé

### 🔐 Identifiants de connexion

**Username:** `test`
**Password:** `connect2025`
**Rôle:** Admin

### 👤 Informations complètes

- **ID:** 68f42c05a1e0da0a0b5ea188
- **Prénom:** Test
- **Nom:** Admin
- **Email:** test@admin.com
- **Téléphone:** 0000000000
- **Rôle:** admin
- **Date de création:** 2025-10-19T00:08:37.933Z

### 🧪 Test de connexion réussi

```bash
curl -X POST https://eevents-api-production-7cb8.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"connect2025"}'
```

**Résultat:** ✅ Token généré avec succès

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "68f42c05a1e0da0a0b5ea188",
    "username": "test",
    "email": "test@admin.com",
    "prenom": "Test",
    "nom": "Admin",
    "telephone": "0000000000",
    "role": "admin"
  }
}
```

## 🌐 Connexion via l'interface web

1. **Allez sur:** http://localhost:4200/admin/login
2. **Entrez les identifiants:**
   - Username: `test`
   - Password: `connect2025`
3. **Résultat attendu:**
   - ✅ Spinner disparaît après 1-3 secondes
   - ✅ Redirection vers `/admin/dashboard`
   - ✅ Accès complet aux fonctionnalités admin

## 📊 Autres utilisateurs disponibles sur Railway

| Username | Email | Rôle | Créé le |
|----------|-------|------|---------|
| **test** | test@admin.com | **admin** | 2025-10-19 |
| **Mamousse** | ggroot725@gmail.com | admin | 2025-10-18 |
| **rff** | mamousse15@gmail.com | user | 2025-10-18 |
| string | string | user | 2025-10-18 |

## 🔧 Configuration actuelle

- **Backend:** Railway (Production)
- **URL API:** https://eevents-api-production-7cb8.up.railway.app
- **Frontend:** http://localhost:4200

## ⚠️ Note importante

Si vous voulez basculer entre Railway et le backend local, modifiez le fichier :
`src/environments/environment.ts`

**Railway (actuel):**
```typescript
apiUrl: 'https://eevents-api-production-7cb8.up.railway.app'
```

**Local:**
```typescript
apiUrl: 'http://localhost:3000'
```
