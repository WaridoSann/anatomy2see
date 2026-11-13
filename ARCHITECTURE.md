# Architecture d’anatomy2see

## Organisation

```text
src/
  App.tsx                  Assemblage de l’explorateur et lecture du manifeste
  main.tsx                 Point d’entrée React
  data/anatomy.ts          Types, systèmes, fiches et références scientifiques
  state/explorer.ts        État Zustand et commandes de navigation
  scene/
    Scene.tsx              Canvas, lumières, qualité et limites WebGL
    AnatomyModel.tsx       Chargement GLB, matériaux, sélection et étiquettes
    CameraRig.tsx          Contrôles orbitaux et transitions GSAP
    model.ts               Correspondances et calculs de cadrage
  components/ExplorerUI.tsx Interface française et panneaux responsives
  styles.css               Direction artistique et adaptations mobiles
  tests/                   Tests unitaires de comportement et géométrie
public/models/
  anatomy.glb              Maillages anatomiques locaux
  manifest.json            Géométrie exportée et provenance
  source-parts.json        Correspondance avec les éléments BodyParts3D
  LICENSE.txt              Attribution et licence des modèles
tests/explorer.spec.ts      Scénarios fonctionnels Playwright
```

## Données et disponibilité

`anatomy.ts` est un catalogue scientifique, indépendant du contenu réellement livré. Une fiche dans ce catalogue ne rend pas automatiquement une structure disponible en 3D. Le manifeste permet une première connaissance des assets ; les maillages chargés établissent ensuite la liste effectivement présente. Les systèmes sans structure disponible restent désactivés dans l'interface.

`structureForMesh()` associe les maillages bilatéraux à une même fiche : poumon gauche/droit vers `lungs`, rein gauche/droit vers `kidneys`. Les autres identifiants sont conservés. Les positions des organes viennent du modèle, sans coordonnées de cadrage codées par organe.

## État et interactions

Le store Zustand conserve la sélection, les systèmes visibles, les structures masquées, l'isolation, la transparence, les étiquettes et la qualité. Chaque commande caméra porte un numéro de séquence, y compris lorsqu'une même structure est sélectionnée plusieurs fois. Cela rend les intentions successives observables par le contrôleur.

Une nouvelle sélection quitte l'isolation et réaffiche la structure si elle avait été masquée. Le retour général rétablit les couches initiales, les structures et la caméra. Les commandes de caméra sont découplées des composants de fiche.

Les événements de sélection proviennent des maillages Three.js ou de la liste HTML. Une sélection ne dépend pas d'un label 3D. Les fiches scientifiques restent disponibles lorsque le navigateur ne peut afficher WebGL.

## Scène et caméra

`AnatomyModel` charge un GLB local via `useGLTF`, applique des matériaux indépendants à une copie de la scène et garde les géométries partagées. Les matériaux créés par le composant sont libérés lors de son démontage. La sélection et le survol modifient l'émission ; la transparence atténue les structures non sélectionnées.

`boundsForStructure()` construit la boîte englobante dans le repère mondial à partir des vrais meshes. La peau est exclue du cadrage général. La distance caméra est calculée selon les dimensions projetées de la boîte, le champ de vision et le ratio de l'écran. Cette méthode conserve une échelle utile pour le corps allongé sur les écrans étroits ; la vue latérale permute la largeur et la profondeur. Le rayon englobant reste disponible pour les vérifications de géométrie.

`CameraRig` centralise les déplacements de caméra. Une nouvelle requête annule la transition précédente ; un geste manuel tue aussi le tween actif. GSAP anime simultanément la position de la caméra et la cible des OrbitControls. Les préférences `prefers-reduced-motion` suppriment la durée de transition.

## Performance et rendu

Les structures d'origine sont regroupées et simplifiées avant export pour réduire les appels de rendu. Le manifeste conserve les nombres réels de triangles. Les quatre profils limitent le ratio de pixels à 1, 1,25, 1,75 ou 2. Le post-traitement bloom n'est actif qu'en Ultra. Les ombres de contact utilisent une résolution réduite en Low.

Ce sont des choix de budget graphique, pas des mesures de performance. Le projet ne contient pas de benchmark matériel certifié ni de garantie de fréquence d'image. Le GLB ne contient pas de textures haute résolution, de sorte que les couleurs et lumières restent des matériaux de présentation.

## Robustesse et validation

Une limite d'erreur React autour de la scène signale les échecs de chargement. Le Canvas fournit une interface de secours si WebGL est indisponible. Une perte de contexte graphique est interceptée et expliquée à l'utilisateur. La récupération demande un rechargement de page.

Vitest vérifie les invariants du store et la géométrie du cadrage sans dépendre d'un GPU. Playwright décrit les parcours utilisateur et les adaptations mobiles dans un environnement de test disposant d'un navigateur. Ces deux suites sont séparées : `npm test` n'exécute pas les tests fonctionnels.

## Extension

Pour ajouter une structure : intégrer un modèle avec licence vérifiée, conserver ses coordonnées anatomiques, l'ajouter au manifeste et au registre scientifique, puis compléter la correspondance mesh → fiche si nécessaire. Pour un système déjà déclaré, aucune refonte de la navigation n'est nécessaire. Une segmentation plus fine devra remplacer les regroupements actuels avant de proposer l'identification de petites sous-structures.

L'application est statique. Les chemins des assets utilisent la base Vite ; GitHub Actions sélectionne `/anatomy2see/`, l'hébergement à la racine utilise `/`. Aucun secret, compte utilisateur, service clinique ni persistance de données personnelles n'est nécessaire.
