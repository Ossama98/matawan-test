# Signalements App

Test Angular - Matawan Services

Application Angular développée dans le cadre d'un test technique pour Matawan Services.
Elle permet de créer, consulter des **signalements**, chacun rattaché à un auteur et à une ou plusieurs observations.

## 🧩 Stack technique

- **Angular 22** (composants standalone, chargement des routes en lazy loading)
- **json-server** en guise d'API mockée pour le développement
- **Angular Material** pour l'interface

## 📁 Structure du projet

- `src/app/core` : modèles (`Signalement`, `Author`, `Observation`), services HTTP, validateurs de formulaire et intercepteur d'erreurs
- `src/app/features/signalements` : les écrans métiers
  - `signalement-list` : liste des signalements
  - `signalement-form` : formulaire de création / édition
- `mock-api/db.json` : données factices servies par json-server

## 🔎 Fonctionnalités notables
- Formulaire de signalement avec validation :
- Vérification que l'auteur n'a pas dépassé un âge maximum (maxAgeValidator)
- Vérification asynchrone de l'unicité de l'email de l'auteur, en interrogeant l'API (uniqueEmailValidator), avec un debounce pour limiter les appels réseau
- Intercepteur HTTP (error.interceptor.ts) pour la gestion centralisée des erreurs d'API
- Routing en lazy loading : chaque page (liste, création, édition) est chargée à la demande

## 🚀 Lancer le projet

Il faut lancer **deux processus en parallèle**, dans deux terminaux différents :
- npm start
- npm run mock-api

## 🔧 Améliorations possibles

- **Responsive** : passer d'un tableau à une vue "cartes" sur mobile plutôt qu'un scroll horizontal. belle UI sur tous les écrans
- **State management** : centraliser l'état (signalements, observations, loading/error) via un store NgRx plutôt que de recharger les données dans chaque composant
- **Performance** : optimiser la vérification d'unicité de l'email (appel `getAll()` à chaque frappe) via un endpoint API dédié
- **Robustesse** : ajouter un guard `CanDeactivate` pour éviter la perte de saisie sur le formulaire, typer strictement les erreurs HTTP
- **Tests** : tests unitaires
- linter et prettier pour uniformiser le code
- composant: un container pour la logique métier et un composant presenter pour l'affichage, afin de séparer les responsabilités
