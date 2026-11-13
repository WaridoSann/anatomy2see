# Ressources anatomiques

## Modèle livré

`public/models/anatomy.glb` est une conversion et une simplification de véritables maillages **BodyParts3D, version 4.0**, publiés par le **Database Center for Life Science (DBCLS), Research Organization of Information and Systems, Japon**. Les structures proviennent du jeu scientifique, et non de primitives créées pour l'interface.

Attribution requise par l'éditeur :

> BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.

- Présentation scientifique : https://dbarchive.biosciencedbc.jp/en/bodyparts3d/desc.html
- Téléchargements officiels : https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html
- Archive des maillages OBJ : https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_BP3D_4.0_obj_99.zip
- Classification des structures : https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_element_parts.txt
- Nomenclature et composition des structures : https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/partof_element_parts.txt
- Conditions officielles : https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html
- README officiel du jeu : https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/README_e.html
- Licence : https://creativecommons.org/licenses/by/4.0/
- Publication : Mitsuhashi N. et al., *BodyParts3D: 3D structure database for anatomical concepts*, Nucleic Acids Research (2009), https://pubmed.ncbi.nlm.nih.gov/18835852/

### Vérification de la licence

La page officielle des conditions, consultée le 13 novembre 2026, annonce **Creative Commons Attribution 4.0 International**, autorisant explicitement la redistribution et les adaptations avec attribution. La mise à jour de licence du **27 février 2025** est indiquée dans l'historique du README officiel. Les commentaires historiques à l'intérieur des OBJ de 2013 mentionnent encore CC BY-SA 2.1 Japan ; ils précèdent cette mise à jour explicite. L'attribution ci-dessus et les liens vers les conditions actuelles sont donc conservés avec la conversion distribuée.

Les maillages GLB adaptés sont distribués sous **CC BY 4.0**, indépendamment de la licence du code de l'application. Ils peuvent être réutilisés avec attribution et indication des modifications.

## Modifications effectuées

- Sélection de 811 fichiers élémentaires de BodyParts3D selon ses tables officielles de composition et de classification (les 203 descendants de « bone organ » complètent les os des membres, absents du regroupement axial « skeletal system »).
- Regroupement des éléments en 13 maillages nommés : squelette hors crâne/colonne, crâne, colonne, cœur, poumon gauche, poumon droit, cerveau, foie, estomac, rein gauche, rein droit, intestins et peau.
- Simplification géométrique par décimation dans Blender, pour le chargement dans un navigateur ; aucun organe fictif ajouté.
- Recalcul des normales lissées et application de matériaux de présentation. Les couleurs de l'application sont pédagogiques et artistiques ; ce ne sont pas des textures histologiques.
- Changement de repère : hauteur du squelette de 1,8 unité, centre à l'origine, axe vertical +Y et face antérieure +Z. Les proportions relatives et les positions des organes sont conservées.
- Export en glTF binaire (GLB), sans texture ni dépendance externe.

`public/models/manifest.json` donne le nombre de triangles réellement exportés et les noms de maillages. `public/models/source-parts.json` conserve la correspondance exhaustive avec les identifiants OBJ originaux.

## Limites scientifiques

BodyParts3D est une représentation de référence issue d'un sujet adulte masculin. Il ne représente pas la variabilité individuelle. La simplification réduit certains petits détails. Les éléments constitutifs d'un même organe sont réunis pour la sélection ; l'application ne propose pas l'identification de chaque vaisseau ou sous-structure. Aucun modèle musculaire n'est livré dans cette version. Le système nerveux n'est représenté que par le cerveau ; le système cardiovasculaire par le cœur. Les animations pédagogiques schématiques de l'interface ne constituent pas une simulation clinique.

Aucun modèle Sketchfab, Z-Anatomy ou ressource à licence non commerciale n'est intégré.

## Reproduire la conversion

Décompresser l'archive OBJ officielle, puis exécuter depuis la racine du dépôt avec **Blender 4.3.2** :

```sh
blender -b -t 4 --python tools/convert-bodyparts.py -- /chemin/isa_BP3D_4.0_obj_99 public/models
```

Le script utilise `source-parts.json` pour retrouver les structures d'origine et régénère le GLB ainsi que son manifeste. Le téléchargement de l'archive d'origine est d'environ 143 Mo ; seuls les maillages sélectionnés et convertis sont livrés au navigateur (environ 7,6 Mo au total).
