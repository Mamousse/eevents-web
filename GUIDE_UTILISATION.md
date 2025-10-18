# Guide d'Utilisation - Système de Gestion d'Événements

## Démarrage Rapide

### 1. Lancer l'application
```bash
npm start
```
Accédez à : `http://localhost:4200`

### 2. Connexion Administrateur
- Allez sur : `http://localhost:4200/admin/login`
- **Username:** `admin`
- **Password:** `admin123`

## Guide Administrateur

### Créer un Événement

1. **Accéder au Dashboard**
   - Connectez-vous avec vos identifiants
   - Cliquez sur "Créer un événement"

2. **Remplir les informations**
   - **Nom:** Ex: "Dîner de Gala 2024"
   - **Date et heure:** Sélectionnez la date de l'événement
   - **Emplacement:** Ex: "Hôtel Hilton, Yaoundé"
   - **Nombre de places:** Ex: 200
   - **Description:** (Optionnel) Décrivez votre événement

3. **Ajouter les modalités d'entrée**
   - Cliquez sur "+ Ajouter" pour ajouter plusieurs types
   - Exemples :
     - Type: "VIP" | Prix: 15000 FCFA | Description: "Accès prioritaire + cocktail"
     - Type: "Standard" | Prix: 8000 FCFA | Description: "Accès normal"
     - Type: "Gratuit" | Prix: 0 FCFA

4. **Ajouter les modes de paiement**
   - Exemples :
     - Type: "Mobile Money" | Détails: "MTN, Orange, Moov"
     - Type: "Espèces" | Détails: "À l'entrée"
     - Type: "Virement bancaire"

5. **Enregistrer**
   - Cliquez sur "Créer l'événement"

### Gérer les Réservations

1. **Voir les détails d'un événement**
   - Dans le dashboard, cliquez sur "Voir détails" sur une carte d'événement

2. **Consulter les statistiques**
   - Nombre total de réservations
   - Places réservées
   - Paiements validés/non validés
   - Revenus totaux et reçus

3. **Gérer les réservations**
   - **Valider une réservation:** Cliquez sur le badge "En attente"
   - **Marquer comme payé:** Cliquez sur le badge "Non payé"
   - **Rechercher:** Utilisez la barre de recherche (nom, prénom, téléphone)
   - **Supprimer:** Cliquez sur l'icône de suppression (🗑️)

### Partager le Lien de Réservation

#### Méthode 1: QR Code
1. Allez dans les détails de l'événement
2. Le QR Code est affiché automatiquement
3. Options :
   - Cliquez sur "Partager sur WhatsApp" pour envoyer via WhatsApp
   - Prenez une capture d'écran du QR Code
   - Imprimez le QR Code pour vos affiches

#### Méthode 2: Lien Direct
1. Dans les détails de l'événement, cliquez sur "Copier le lien"
2. Partagez le lien copié via :
   - WhatsApp
   - Email
   - SMS
   - Réseaux sociaux

#### Méthode 3: Depuis le Dashboard
1. Sur chaque carte d'événement, cliquez sur "Copier lien"

## Guide Utilisateur (Participants)

### Faire une Réservation

1. **Accéder au formulaire**
   - Scannez le QR Code de l'événement, OU
   - Cliquez sur le lien reçu

2. **Remplir vos informations**
   - **Nom:** Votre nom de famille
   - **Prénom:** Votre prénom
   - **Numéro WhatsApp:** Format: 237670123456 (8-15 chiffres)
   - **Email:** (Optionnel) Pour recevoir des confirmations
   - **Nombre de places:** Combien de places vous souhaitez réserver

3. **Choisir vos options**
   - **Modalité d'entrée:** VIP, Standard, etc.
   - **Mode de paiement:** Comment vous allez payer
   - Le **montant total** s'affiche automatiquement

4. **Confirmer**
   - Cliquez sur "Confirmer la réservation"
   - Un message de succès apparaît
   - Vous serez contacté prochainement

## Fonctionnalités Avancées

### Recherche d'Événements (Admin)
- Utilisez la barre de recherche dans le dashboard
- Recherchez par : nom, lieu, description

### Recherche de Réservations
- Dans les détails d'un événement
- Recherchez par : nom, prénom, téléphone, email

### Éditer un Événement
1. Dans le dashboard, cliquez sur l'icône ✏️
2. Modifiez les informations
3. Cliquez sur "Mettre à jour"

### Supprimer un Événement
1. Dans le dashboard, cliquez sur l'icône 🗑️
2. Confirmez la suppression
3. ⚠️ Attention : Cette action est irréversible

## Conseils et Bonnes Pratiques

### Pour les Administrateurs

1. **Créez vos événements à l'avance**
   - Donnez du temps aux participants pour s'inscrire

2. **Vérifiez régulièrement les réservations**
   - Validez les réservations quotidiennement
   - Marquez les paiements reçus immédiatement

3. **Communiquez largement**
   - Partagez le QR Code sur vos affiches
   - Envoyez le lien sur WhatsApp
   - Postez sur les réseaux sociaux

4. **Suivez vos statistiques**
   - Consultez régulièrement le dashboard
   - Ajustez votre stratégie en fonction des réservations

### Pour les Participants

1. **Réservez tôt**
   - Les places sont limitées

2. **Vérifiez vos informations**
   - Assurez-vous que votre numéro WhatsApp est correct
   - Vérifiez le nombre de places

3. **Conservez la confirmation**
   - Gardez le message de confirmation
   - Notez votre numéro de réservation si fourni

## Dépannage

### Problème : "Événement introuvable"
- Vérifiez que le lien est complet
- Assurez-vous que l'événement n'a pas été supprimé
- Contactez l'organisateur

### Problème : "Plus de places disponibles"
- L'événement est complet
- Contactez l'organisateur pour être sur liste d'attente

### Problème : Impossible de se connecter (Admin)
- Vérifiez vos identifiants
- Utilisez : admin / admin123
- Videz le cache de votre navigateur

### Problème : Les données disparaissent
- Les données sont stockées dans le navigateur
- Ne videz pas le cache/cookies
- Pour une utilisation permanente, connectez à un backend

## Support

Pour toute assistance :
1. Consultez ce guide
2. Vérifiez le fichier README_APP.md
3. Contactez l'équipe de développement
