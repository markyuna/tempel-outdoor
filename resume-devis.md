# Tempel Outdoor — Résumé technique et fonctionnel du projet

*Document de base pour l'établissement d'un devis client. Analyse réalisée à partir de l'état actuel du dépôt de code (branche `master`).*

---

## 1. Pages et sections du site

### Site public (`/fr/...`, `/en/...`)

| Page / section | Fonction |
|---|---|
| **Accueil** (`/`) | Vitrine principale : hero, sections "univers" (fitness, bien-être, loisirs), produits phares, avis Google, réassurance (livraison, garantie, etc.) |
| **Univers Fitness** (`/fitness`, `+ cardio, cross-training, home-gym, musculation`) | Pages de catégories dédiées à l'équipement fitness, avec sous-catégories |
| **Univers Bien-être** (`/bien-etre`, `+ sauna, spa, spa-de-nage`) | Pages de catégories dédiées au spa/sauna |
| **Univers Loisirs** (`/loisirs`, `+ baby-foot, billard`) | Pages de catégories dédiées aux jeux/loisirs |
| **Page catégorie générique** (`/[category]`) | Route dynamique listant les produits d'une catégorie/univers avec filtres |
| **Fiche produit** (`/products/[slug]`) | Détail produit : galerie média, variantes/options, spécifications techniques, ajout au panier/favoris |
| **Panier** (`/cart`) | Récapitulatif des articles, quantités, gestion des options choisies |
| **Tunnel de commande** (`/checkout`) | Formulaire client (facturation/livraison), récapitulatif, envoi de la demande de commande/devis |
| **Espace client** (`/mon-compte`, `+ informations, commandes, commandes/[id]`) | Tableau de bord utilisateur : profil, historique de commandes, détail commande, téléchargement de devis PDF |
| **Authentification** (`/auth/login, register, forgot-password, reset-password, update-password`) | Connexion, inscription, récupération et réinitialisation de mot de passe |
| **Réalisations** (`/realisations`) | Portfolio de projets/installations réalisés (galerie) |
| **Contact** (`/contact`) | Formulaire de contact |
| **À propos** (`/a-propos`) | Présentation de l'entreprise |
| **Blog** (`/blog`, `/blog/[slug]`) | Route créée mais **vide** — voir section 3 |
| **Pages légales** (`/cgv`, `/mentions-legales`, `/politique-confidentialite`, `/livraison-retours`) | Contenu légal/réglementaire (CGV, mentions légales, confidentialité, livraison-retours) |

### Back-office admin (`/admin/...`, sans préfixe de langue)

| Page | Fonction |
|---|---|
| **Dashboard** (`/admin`) | Vue d'ensemble administrateur |
| **Produits** (`/admin/products`, `create`, `[id]`, `[id]/edit`) | CRUD produits complet : infos générales, médias (upload), variantes, options, sections de spécifications techniques, réordonnancement drag-and-drop |
| **Commandes** (`/admin/orders`, `[id]`) | Liste et détail des commandes, changement de statut, génération et suppression de devis PDF |
| **Clients** (`/admin/customers`, `[id]`) | Liste et fiche client |
| **Réalisations** (`/admin/realisations`, `create`, `[id]`, `[id]/edit`) | CRUD du portfolio (projets + médias) |

### API interne (`/api/...`)

| Endpoint | Fonction |
|---|---|
| `POST /api/orders` | Création d'une commande/demande de devis, envoi de notification email |
| `/api/orders/[id]`, `/api/orders/[id]/status` | Détail et mise à jour de statut de commande |
| `/api/orders/[id]/generate-devis` | Génération d'un PDF de devis (pdf-lib) et stockage Supabase |
| `/api/orders/[id]/download-devis` | Téléchargement sécurisé du PDF via URL signée |
| `/api/favorites` | Ajout/suppression de favoris (authentifié) |
| `/api/contact-request` | Traitement du formulaire de contact |
| `/api/chat` | Backend du chatbot (réponses par mots-clés) |
| `/api/chat-history` | Persistance de l'historique de conversation du chatbot |

---

## 2. Fonctionnalités implémentées

- **Catalogue produits** : produits avec variantes, options configurables, sections de spécifications techniques, médias multiples (images/vidéos), mise en avant, gestion du statut (actif/brouillon/archivé), stock, délai de livraison, garantie.
- **Recherche produits** : recherche insensible aux accents côté base de données (fonction SQL dédiée `search_products_unaccent`).
- **Panier d'achat** : gestion côté client (persistant), ajout/suppression, options par article.
- **Tunnel de commande / demande de devis** : formulaire complet facturation + livraison, validation, création de commande en base, notification email automatique à l'administrateur.
- **Génération de devis PDF** : génération dynamique d'un PDF (pdf-lib) avec numérotation dédiée, stockage sécurisé sur Supabase Storage, téléchargement via URL signée à durée limitée.
- **Espace client authentifié** : inscription/connexion par email-mot de passe, réinitialisation de mot de passe, consultation des commandes passées, téléchargement des devis, gestion du profil.
- **Favoris/wishlist** : ajout/suppression de produits favoris pour les utilisateurs connectés.
- **Portfolio "Réalisations"** : galerie de projets réalisés, gérée intégralement depuis l'admin (CRUD + médias).
- **Back-office admin complet** : gestion produits (avec éditeurs drag-and-drop pour variantes/spécifications), commandes (statuts, devis), clients, réalisations.
- **Chatbot d'assistance** : widget de chat basé sur une base de connaissances par mots-clés (livraison, paiement, devis, mise en contact), sans IA/LLM — logique de correspondance simple, historique de conversation persisté par session.
- **Formulaire de contact** : envoi avec notification email à l'administrateur.
- **Emailing transactionnel** : notifications de commande et de demande de contact via Resend (templates HTML soignés, aux couleurs de la marque).
- **Internationalisation (structure)** : routage multilingue FR/EN opérationnel (préfixes `/fr`, `/en`), middleware de redirection dédié.
- **Authentification et sécurité des routes** : middleware protégeant l'espace client, redirection des utilisateurs connectés hors des pages de connexion/inscription, séparation stricte des accès admin (RLS/service role côté serveur).
- **Design système** : identité visuelle cohérente ("dark premium glass"), composants UI réutilisables (shadcn/ui), animations (Framer Motion), thème sombre avec accents dorés.

---

## 3. Fonctionnalités incomplètes ou en attente

- **Paiement en ligne** : la librairie Stripe est installée en dépendance mais **n'est intégrée nulle part dans le code** (aucune clé, aucun appel API, aucun composant de paiement). Le tunnel actuel aboutit à une **demande de devis/commande envoyée par email**, sans encaissement réel. Le chatbot mentionne également un paiement en plusieurs fois via "Alma", qui n'est pas non plus intégré techniquement — de la simple information textuelle.
- **Blog** : la structure de routage existe (`/blog`, `/blog/[slug]`) mais **aucune page n'est implémentée** (dossiers vides). Aucune interface de rédaction/CMS n'existe côté admin.
- **Traductions multilingues** : l'infrastructure next-intl est en place (routing, middleware, fichiers de messages) mais les fichiers `src/messages/fr.json` et `en.json` sont **vides**. Les textes de l'interface sont actuellement rédigés en dur en français dans les composants — la version anglaise du site n'affiche donc pas de contenu traduit à ce stade.
- **Newsletter** : un composant `NewsletterForm` existe mais est **vide (fichier stub non implémenté)** et n'est utilisé nulle part dans le site. Aucune fonctionnalité d'inscription à une newsletter n'est active.
- **Routes en doublon non finalisées** : les dossiers `/panier` et `/compte` existent dans l'arborescence mais sont vides (aucune page) — probablement d'anciens brouillons remplacés par `/cart` et `/mon-compte`, à nettoyer.
- **Type `order.ts`** : fichier de types vide, à compléter ou supprimer (dette technique mineure, sans impact visible).
- **Emails en mode bac à sable** : l'expéditeur Resend utilise actuellement l'adresse de test `onboarding@resend.dev` — le domaine `tempel-outdoor.fr` n'est pas encore vérifié auprès de Resend, ce qui limite l'envoi aux adresses validées manuellement.
- **Pas de suite de tests automatisés** configurée sur le projet.
- **Hébergement** : aucune configuration d'hébergement (Vercel, etc.) n'est présente dans le dépôt ; le déploiement reste à mettre en place formellement (probable, la stack Next.js s'y prête nativement).

---

## 4. Technologies utilisées

| Catégorie | Technologie |
|---|---|
| **Framework** | Next.js 16 (App Router) + React 19 + TypeScript 5 |
| **Style / UI** | TailwindCSS 4, shadcn/ui, Framer Motion (animations), Embla Carousel |
| **Base de données** | Supabase (PostgreSQL) |
| **Authentification** | Supabase Auth (email/mot de passe) |
| **Stockage fichiers** | Supabase Storage (médias produits, réalisations, PDF de devis) |
| **Internationalisation** | next-intl (structure en place, contenu FR uniquement à ce jour) |
| **Formulaires / validation** | React Hook Form + Zod |
| **Génération de PDF** | pdf-lib (devis) |
| **Emailing** | Resend |
| **Paiement (prévu, non branché)** | Stripe (dépendance présente, non intégrée) |
| **Drag & drop** | @dnd-kit (réordonnancement des variantes/specs en admin) |
| **Hébergement** | Non explicitement configuré dans le dépôt ; dépôt Git hébergé sur GitHub (`markyuna/tempel-outdoor`) |

---

## 5. Intégrations externes

| Intégration | Statut | Usage |
|---|---|---|
| **Supabase** | ✅ Active | Base de données, authentification, stockage de fichiers (images, vidéos, PDF) |
| **Resend** | ✅ Active (mode test) | Envoi d'emails transactionnels (notifications de commande, de contact) — domaine expéditeur à vérifier en production |
| **Stripe** | ⚠️ Non intégré | Dépendance présente mais aucun code de paiement — à développer entièrement si le paiement en ligne est requis |
| **Alma (paiement fractionné)** | ⚠️ Non intégré | Mentionné uniquement dans les réponses du chatbot, aucune intégration technique |
| **Chatbot** | ✅ Actif (sans IA) | Moteur interne par mots-clés, pas d'appel à un service LLM externe |
| **Avis Google** | ⚠️ À vérifier | Une section "avis Google" existe en page d'accueil — à confirmer si les avis sont connectés dynamiquement à l'API Google ou codés en dur |
| **Cartographie** | ❌ Aucune | Aucune intégration de carte (Google Maps, Mapbox…) détectée dans le code |

---

## 6. Estimation de complexité par partie

*Échelle : Faible / Moyenne / Élevée — évaluée sur la base du volume de code, des dépendances entre modules et du travail de finition estimé.*

| Partie | Complexité | Commentaire |
|---|---|---|
| Pages vitrines (accueil, univers, à propos, pages légales) | **Faible** | Pages de contenu, déjà largement construites |
| Catalogue produits & fiche produit (variantes, options, specs, galerie) | **Élevée** | Modèle de données riche, configurateur, gestion de médias multiples |
| Panier & tunnel de commande | **Moyenne** | Fonctionnel mais sans paiement réel ; logique de formulaire conséquente (714 lignes) |
| **Intégration paiement Stripe** (à faire) | **Élevée** | Aucune base existante ; implique flux de paiement, webhooks, sécurité, gestion des statuts de commande |
| Espace client (compte, commandes, devis) | **Moyenne** | CRUD + téléchargement sécurisé de PDF, déjà en place |
| Génération de devis PDF | **Moyenne à élevée** | Génération dynamique avec pdf-lib (490 lignes), numérotation, stockage sécurisé |
| Back-office admin (produits, commandes, clients, réalisations) | **Élevée** | CRUD complets multi-entités, éditeurs drag-and-drop, upload de médias |
| Authentification & sécurité des routes | **Moyenne** | Déjà fonctionnelle (Supabase Auth + middleware) |
| Favoris | **Faible** | Fonctionnalité simple et déjà en place |
| Chatbot (base de connaissances) | **Moyenne** | Logique de correspondance par mots-clés, persistance d'historique — pas d'IA |
| Portfolio "Réalisations" | **Moyenne** | CRUD + galerie déjà en place |
| **Blog** (à développer) | **Moyenne à élevée** | Tout reste à faire : modèle de données, interface de rédaction admin, pages publiques, SEO |
| **Traductions FR/EN** (à compléter) | **Moyenne** | Infrastructure prête, mais tout le contenu textuel doit être extrait et traduit |
| **Newsletter** (à développer) | **Faible à moyenne** | Formulaire à construire + intégration à un service d'envoi (Resend ou autre) + gestion des abonnés |
| Emailing transactionnel | **Faible** | Déjà en place, nécessite juste la vérification du domaine en production |
| Nettoyage technique (routes en doublon, fichiers stubs) | **Faible** | Dette technique mineure |

---

*Ce document reflète l'état du code à la date de rédaction et sert de base d'analyse pour l'élaboration d'un devis. Il ne remplace pas un audit fonctionnel avec le client ni un accès direct à l'environnement Supabase de production (tables, RLS, données réelles).*
