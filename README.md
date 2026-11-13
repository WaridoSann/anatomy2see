# anatomy2see

Un cabinet de curiosité anatomique en français : un accueil clair, un voyage illustré dans un vaisseau sanguin, puis une salle de SVT où le corps humain se découvre une couche à la fois.

**Site public : https://waridosann.github.io/anatomy2see/**  
**Code : https://github.com/WaridoSann/anatomy2see**

## Le parcours

1. **Bienvenue** : une page d’entrée avec un seul appel à commencer.
2. **Le voyage** : une introduction WebGL d’environ dix secondes, dans un vaisseau avec des globules rouges schématiques, puis un retour au geste de boire. Elle peut être passée et respecte la réduction des animations.
3. **La salle d’anatomie** : un squelette 3D devant une salle de SVT dessinée en SVG 2D. Les tables ne sont pas des objets 3D.
4. **Quatre points de vue** : muscles, organes, squelette, structures nerveuses. Un seul système de présentation est actif à la fois.
5. **Observer** : faire tourner, zoomer, survoler pour lire un nom, cliquer pour cadrer et ouvrir une fiche illustrée. L’isolation permet d’atteindre les petites structures et les muscles profonds.
6. **Retrouver** : une liste repliée et une page de fiches proposent une recherche par nom et par région, avec accès direct au modèle.

L’interface emploie Manrope, auto-hébergée, sur une palette papier, encre et jaune. Les réglages graphiques et la transparence sont réunis dans un menu. Les fiches apparaissent au moment de la sélection ; elles gardent la 3D visible, y compris sur mobile.

## Modèles réellement disponibles

| Vue | Groupes sélectionnables | Contenu |
| --- | ---: | --- |
| Muscles | 398 | 425 éléments musculaires de BodyParts3D, certains regroupés par concept anatomique ; chefs, faisceaux et ensembles restent identifiés |
| Squelette | 238 | Os et structures de soutien, dont cartilages et disques ; ce chiffre n’est pas un nombre d’os humains |
| Structures nerveuses | 80 | Régions de l’encéphale, cavités cérébrospinales et petits nerfs crâniens/orbitaires disponibles |
| Organes | 7 | Cœur, poumons, encéphale, foie, estomac, reins, intestins |

Tous les maillages sont de vraies ressources BodyParts3D, sous CC BY 4.0, et non des primitives remplaçant les organes. Les positions relatives des structures sont conservées. Les GLB sont compressés avec Meshopt et les positions quantifiées sur 14 bits. Les tailles exactes sont consignées dans les manifestes.

**Limites de couverture** : les 398 groupes ne représentent pas tous les muscles humains. Le droit de l’abdomen, le grand dorsal, le masséter et le temporal ne figurent notamment pas dans cette source. La moelle épinière complète et les réseaux nerveux périphériques du tronc et des membres ne sont pas livrés. Les cavités du système nerveux sont nommées comme des cavités, pas comme des nerfs. Le modèle est issu d’une anatomie adulte masculine de référence ; il ne couvre pas la variabilité individuelle.

## Installation

Node.js 22 et npm sont recommandés. Aucun backend ni secret côté client n’est nécessaire.

```bash
npm ci
npm run dev
```

| Commande | Usage |
| --- | --- |
| `npm run dev` | Lancer Vite |
| `npm run typecheck` | Vérifier TypeScript |
| `npm test` | Tests unitaires, décodage des vrais GLB et interactions de l’interface dans jsdom |
| `npm run build` | Compiler dans `dist/` |
| `npm run preview` | Consulter le build |
| `npm run test:e2e` | Exécuter les scénarios Playwright dans un environnement autorisant un navigateur WebGL |

Les tests jsdom ne vérifient pas l’apparence du rendu GPU. Les scénarios Playwright ne sont pas exécutés automatiquement par la CI et leur présence ne constitue pas une validation visuelle. Aucun benchmark FPS n’est annoncé.

## Déploiement

Le workflow `.github/workflows/deploy.yml` installe les dépendances, vérifie TypeScript, exécute les tests, compile puis publie sur GitHub Pages à chaque push sur `main`.

La source Pages doit être réglée sur **GitHub Actions**. Vite utilise `/anatomy2see/` quand `GITHUB_ACTIONS` est défini, et `/` pour un hébergement à la racine. Les pages utilisent des fragments (`#/explorer/muscles`, `#/library`) afin de rester compatibles avec Pages sans réécriture serveur.

Le fichier `.openai/hosting.json` concerne la copie hébergée avec Sites et reste indépendant de GitHub Pages.

## Sources et réutilisation

> BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.

- [ASSETS.md](ASSETS.md) : licence et transformations des modèles.
- [ILLUSTRATIONS.md](ILLUSTRATIONS.md) : planches du domaine public et images OpenStax CC BY 3.0, auteurs, liens et modifications de format.
- [SOURCES.md](SOURCES.md) : références scientifiques. Les descriptions françaises sont des résumés originaux ; les fiches renvoient aux chapitres OpenStax pertinents et conservent les noms d’origine des structures.
- [ARCHITECTURE.md](ARCHITECTURE.md) : données, navigation, scène et gestion de caméra.

Les illustrations régionales sont présentées comme des planches de repérage. Elles ne prétendent pas montrer chaque muscle sélectionné isolément. Le portrait de l’accueil est un rendu des maillages réels. Le voyage, le geste de boire et le décor de classe sont des créations artistiques illustratives.
