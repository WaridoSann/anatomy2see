# anatomy2see

Atlas anatomique interactif en français : exploration d'un modèle humain 3D, sélection d'organes, cadrage automatique, isolation, couches anatomiques et fiches scientifiques sourcées.

## Version hébergée

La version Sites est publiée à l'adresse https://anatomy2see.but2amiliad.chatgpt.site avec un accès privé lié au compte propriétaire. Cette publication est distincte de GitHub Pages. Le code source complet peut être téléchargé à https://anatomy2see.but2amiliad.chatgpt.site/anatomy2see-source.zip.

## Installation et commandes

Utiliser Node.js 22 et npm.

```bash
npm ci
npm run dev
```

Ouvrir l'adresse locale affichée par Vite. Le projet ne nécessite ni backend ni secret côté client.

| Commande | Usage |
| --- | --- |
| `npm run dev` | Serveur de développement Vite |
| `npm run typecheck` | Vérification TypeScript |
| `npm test` | Tests unitaires Vitest |
| `npm run build` | Compilation de production dans `dist/` |
| `npm run preview` | Consultation du résultat compilé |
| `npm run test:e2e` | Scénarios Playwright dans un environnement disposant d'un navigateur compatible |

## Utilisation

- Glisser sur le modèle pour le faire tourner ; utiliser la molette ou les commandes de zoom pour se rapprocher.
- Sélectionner une structure dans la scène ou dans la liste pour lire sa fiche et lancer son cadrage.
- Isoler la sélection, la masquer ou atténuer les autres structures.
- Activer ou désactiver les systèmes disponibles, afficher les étiquettes et revenir au corps entier.
- Sur mobile, utiliser les commandes d'ouverture des panneaux pour conserver de la place pour la scène.

Le cadrage utilise les limites réelles des maillages. Un geste sur les contrôles orbitaux interrompt la transition caméra. La préférence de réduction des animations est respectée pour ces déplacements.

## Modèles et sources scientifiques

Le modèle GLB provient de **BodyParts3D v4.0**, Database Center for Life Science, sous **CC BY 4.0**. Il contient 13 maillages de présentation issus de la composition scientifique officielle, regroupés et simplifiés. Le manifeste conserve les nombres réellement exportés. La peau est incluse dans l'asset mais n'est pas affichée dans la scène actuelle. Les fichiers sont locaux au dépôt ; aucun modèle externe n'est nécessaire à l'exécution.

> BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.

Voir [ASSETS.md](ASSETS.md) pour les liens officiels, la vérification de licence, les modifications et les limites scientifiques. Les correspondances de meshes se trouvent dans `public/models/manifest.json` et les éléments d'origine dans `public/models/source-parts.json`.

Les fiches sont des résumés originaux en français fondés sur **OpenStax Anatomy and Physiology 2e**. Chaque fiche contient une référence accessible. Voir [SOURCES.md](SOURCES.md). Les couleurs facilitent la lecture ; elles ne représentent pas l'apparence histologique des tissus.

## Déploiement GitHub Pages

Le workflow `.github/workflows/deploy.yml` vérifie TypeScript, exécute les tests unitaires, compile et publie `dist/` à chaque push sur `main`. Les pull requests exécutent les vérifications et la compilation sans publication.

1. Héberger le code dans le dépôt `WaridoSann/anatomy2see`.
2. Dans **Settings → Pages**, choisir **GitHub Actions** comme source de publication.
3. Pousser sur `main` ou lancer manuellement le workflow.
4. Attendre le succès du job de publication avant d'annoncer l'adresse comme active.

L'adresse attendue après un déploiement réussi est `https://waridosann.github.io/anatomy2see/`. Elle n'est pas une preuve de publication. Le workflow définit `GITHUB_ACTIONS`, ce qui sélectionne automatiquement le chemin Vite `/anatomy2see/`. En hébergement à la racine, le build local utilise `/`. Les chemins des modèles s'appuient sur `import.meta.env.BASE_URL` et la navigation ne dépend pas de routes serveur.

Le fichier `.openai/hosting.json` concerne l'hébergement Sites distinct de GitHub Pages. Une URL Sites publiée n'atteste pas la création d'un dépôt GitHub ni la publication de GitHub Pages.

## Architecture

Voir [ARCHITECTURE.md](ARCHITECTURE.md). Le registre scientifique, la correspondance des maillages, l'état de l'explorateur, la caméra et l'interface sont séparés afin d'ajouter de futurs systèmes sans réécrire la scène.

## Vérification et limites

Les tests unitaires contrôlent la navigation, les changements rapides de sélection, le retour général, les couches, les erreurs de chargement, les correspondances bilatérales et le cadrage à partir de géométries Three.js. Les scénarios Playwright sont fournis séparément ; leur présence n'atteste pas leur exécution. Le résultat effectif des vérifications est indiqué dans la livraison.

- Aucun système musculaire n'est disponible dans cette version ; sa commande reste inactive.
- Le système nerveux représente l'encéphale, et le cardiovasculaire le cœur. Les réseaux nerveux et vasculaires complets ne sont pas inclus.
- Les animations de rythme cardiaque et de respiration de l'interface sont schématiques ; elles ne déforment pas le modèle et ne sont pas des simulations physiologiques.
- Les profils graphiques ajustent notamment le ratio de pixels ; le bloom est réservé au profil Ultra.
- Le modèle représente une anatomie adulte masculine de référence, sans couvrir la variabilité individuelle. La simplification géométrique retire certains détails.
- Le fallback WebGL permet de consulter les fiches si la 3D est indisponible. Une perte de contexte est signalée et nécessite de recharger la page.
- Aucune mesure FPS ou promesse de 60 FPS en 4K n'est annoncée. Les performances doivent être mesurées sur le matériel cible.

Cet atlas est un outil d'apprentissage général, pas un dispositif de diagnostic ni un outil de planification clinique.
