# Architecture d’anatomy2see

## Parcours et interface

`src/App.tsx` orchestre les pages accueil, voyage, chapitres, explorateur, fiches et projet. `src/utils/navigation.ts` encode les pages dans le fragment de l’URL, pour permettre les liens directs et les retours du navigateur sur GitHub Pages. L’introduction est déclenchée par une action explicite et débouche sur le chapitre du squelette. Les autres chapitres restent accessibles par quatre onglets.

`AtlasUI.tsx` contient l’interface progressive. La liste des structures et les réglages sont repliés. Une sélection ouvre une fiche, avec illustration, source, fonction, localisation et isolation. La 3D occupe l’espace restant ; sur mobile, la fiche devient un panneau inférieur. Les entrées de recherche conservent leur identité React à chaque frappe pour maintenir le focus. Les régions, la nomenclature originale et les synonymes courants participent à la recherche.

Manrope est auto-hébergée. Le décor de la salle et le geste de boire sont des SVG originaux, indépendants de la scène anatomique. Le voyage d’introduction charge son propre module WebGL à la demande ; il utilise des cellules instanciées et une géométrie de vaisseau. La préférence de réduction des animations choisit une présentation statique courte. Le bouton Passer et la touche Échap permettent de poursuivre directement.

## Données

- `src/types/atlas.ts` définit les types des pages, couches, régions, structures et illustrations.
- `src/data/anatomy.ts` conserve les fiches sourcées des organes.
- `public/models/*-manifest.json` fournit les concepts anatomiques, noms de maillages, identifiants des sources et nombres de triangles.
- `src/data/catalog.ts` adapte ces catalogues en fiches, conserve la nomenclature originale, relie les images régionales et attribue les références OpenStax.
- `public/illustrations.json` contient les auteurs, sources, licences et légendes des planches. Les fichiers sont locaux, sans hotlink vers Wikimedia à l’exécution.

Les éléments de nomenclature n’équivalent pas tous à un muscle ou à un os entier. Les catégories sont explicites dans les noms et les limites du projet. La bibliothèque répertorie uniquement les structures présentes dans les manifestes.

## État

Le store Zustand `src/state/explorer.ts` gère une couche active, la sélection, l’isolation, la transparence, la qualité, la recherche et les requêtes caméra. Une sélection depuis la bibliothèque choisit sa couche. Changer de chapitre réinitialise la sélection. Les retours tardifs d’un modèle quitté sont ignorés en comparant leur couche avec la couche active.

## Scène et caméra

`Scene.tsx` compose l’éclairage clair, le décor 2D, les contrôles et le modèle. Les modèles et les modules Three.js sont chargés à la demande ; le squelette est préchargé pendant le voyage. Les profils graphiques limitent le ratio de pixels, avec une valeur initiale plus modérée sur mobile. Aucun modèle n’est déformé pour simuler une fonction physiologique.

`AnatomyModel.tsx` clone les scènes chargées et attribue un identifiant de structure à chaque mesh. Les repères osseux discrets donnent le contexte du corps dans les vues musculaire, viscérale et nerveuse. Ils n’interceptent pas les clics. Le survol affiche un nom près du point touché ; la sélection atténue les autres structures et l’isolation masque le contexte. Les ressources matérielles créées par le composant sont libérées au démontage.

`CameraRig.tsx` s’appuie sur les boîtes englobantes réelles, y compris les transformations de quantification des GLB. Le cadrage tient compte du format de la scène et de la vue choisie. Un geste sur OrbitControls interrompt la transition GSAP. Les changements rapides remplacent la transition précédente. Les limites de zoom restent adaptées à une sélection. Un changement de point de vue conserve le centre de la structure sélectionnée.

## Ressources et erreurs

Les quatre GLB sont compressés avec EXT_meshopt_compression, décodé par le chargeur Drei. Les coordonnées partagent le même repère : vertical +Y, avant +Z et squelette de référence de 1,8 unité. `tools/build-segmented-models.py` reconstruit les trois modèles segmentés à partir des OBJ source et des manifestes suivis dans Git. La compression Meshopt est appliquée après l’export Blender.

Une limite d’erreur protège le Canvas. Sans WebGL ou en cas d’échec du modèle, la bibliothèque et les fiches illustrées restent accessibles. Une perte de contexte est signalée avec une possibilité de rechargement.

## Validation

Vitest vérifie l’état, les pages, le décodage de chaque vrai GLB, les correspondances uniques entre catalogues et maillages, les bornes et le cadrage, ainsi que le parcours de l’interface dans jsdom. Playwright fournit des scénarios pour la navigation, le voyage, la recherche, l’isolation et les erreurs, à exécuter dans un environnement navigateur autorisé. Les tests DOM et les builds ne remplacent pas une inspection visuelle WebGL.
