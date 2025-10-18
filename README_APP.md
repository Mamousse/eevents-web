# Système de Gestion d'Événements

Application Angular complète pour la gestion d'événements avec système de réservation en ligne.

## Fonctionnalités

### Partie Utilisateur
- Formulaire de réservation accessible par QR Code ou lien direct
- Renseignement des informations personnelles (nom, prénom, WhatsApp, email optionnel)
- Sélection du nombre de places
- Choix de la modalité d'entrée (VIP, Standard, etc.)
- Choix du mode de paiement
- Calcul automatique du montant total

### Partie Admin
- Dashboard avec liste des événements
- Création et édition d'événements complets :
  - Nom, date, emplacement
  - Nombre de places disponibles
  - Description
  - Modalités d'entrée multiples avec prix
  - Modalités de paiement multiples
- Statistiques détaillées par événement :
  - Total des réservations et places réservées
  - Nombre de paiements validés/non validés
  - Revenus totaux et reçus
- Liste des réservations avec fonctionnalités :
  - Validation des réservations
  - Marquage du statut de paiement
  - Recherche de réservations
  - Suppression de réservations
- Génération automatique de QR Code pour chaque événement
- Partage du lien de réservation via WhatsApp
- Authentification sécurisée

## Structure du Projet

```
src/
├── app/
│   ├── components/
│   │   ├── admin-dashboard/        # Dashboard administrateur
│   │   ├── admin-login/            # Page de connexion admin
│   │   ├── event-details/          # Détails et stats d'événement
│   │   ├── event-form/             # Formulaire création/édition événement
│   │   └── reservation-form/       # Formulaire de réservation utilisateur
│   ├── guards/
│   │   └── auth.guard.ts           # Protection des routes admin
│   ├── models/
│   │   ├── event.model.ts          # Modèle Événement
│   │   ├── reservation.model.ts    # Modèle Réservation
│   │   └── user.model.ts           # Modèle Utilisateur
│   └── services/
│       ├── auth.service.ts         # Service d'authentification
│       ├── event.service.ts        # Service de gestion des événements
│       └── reservation.service.ts  # Service de gestion des réservations
```

## Installation

1. Cloner le projet
```bash
git clone <url-du-repo>
cd e-events-prod
```

2. Installer les dépendances
```bash
npm install
```

3. Lancer l'application en mode développement
```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`

## Utilisation

### Connexion Admin
- URL: `http://localhost:4200/admin/login`
- Identifiants par défaut :
  - Username: `admin`
  - Password: `admin123`

### Accès Utilisateur (Réservation)
Les utilisateurs accèdent au formulaire via :
- Scan du QR Code généré pour l'événement
- Lien direct : `http://localhost:4200/reservation/{event-id}`

## Routes

- `/` - Redirection vers login admin
- `/admin/login` - Page de connexion administrateur
- `/admin/dashboard` - Dashboard admin (protégé)
- `/admin/events/new` - Création d'événement (protégé)
- `/admin/events/edit/:id` - Édition d'événement (protégé)
- `/admin/events/:id` - Détails et statistiques (protégé)
- `/reservation/:id` - Formulaire de réservation utilisateur

## Technologies Utilisées

- **Angular 15** - Framework principal
- **TypeScript** - Langage de programmation
- **RxJS** - Programmation réactive
- **SCSS** - Styles
- **angularx-qrcode** - Génération de QR Codes
- **HttpClient** - Communication avec l'API
- **Reactive Forms** - Gestion des formulaires
- **Router Guards** - Protection des routes

## Stockage des Données

Actuellement, l'application utilise le `localStorage` du navigateur pour stocker :
- Les événements
- Les réservations
- Les informations d'authentification

Pour une utilisation en production, remplacez les services par des appels API réels :
- Décommentez les lignes avec `http.get/post/put/delete`
- Commentez les lignes utilisant le localStorage
- Configurez votre URL d'API dans chaque service

## Personnalisation

### Changer les identifiants admin
Modifiez le fichier `src/app/services/auth.service.ts` :
```typescript
if (credentials.username === 'admin' && credentials.password === 'admin123') {
  // Changer ici
}
```

### Ajouter des champs personnalisés
1. Modifiez les interfaces dans `src/app/models/`
2. Mettez à jour les formulaires dans les composants
3. Ajustez les services si nécessaire

## Build Production

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`

## Fonctionnalités à Venir
- Intégration avec un backend réel (Node.js/Express, Laravel, etc.)
- Envoi d'emails de confirmation
- Notifications WhatsApp automatiques
- Export des données en Excel/PDF
- Multi-langue (FR/EN)
- Dashboard avec graphiques avancés
- Gestion des tickets électroniques

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur le repository.
