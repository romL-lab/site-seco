# Site SECO du BIC

Site du référent sécurité économique de Montpellier BIC : https://roml-lab.github.io/site-seco/

## Mettre le site à jour (sans rien installer)

1. Ouvrez https://roml-lab.github.io/site-seco/admin/ dans votre navigateur.
2. Cliquez sur « Sign In Using Access Token » et collez votre clé d'accès GitHub (à créer une fois sur https://github.com/settings/personal-access-tokens/new : dépôt site-seco, permission « Contents » en lecture et écriture). Le bouton « Sign In with GitHub » ne fonctionne pas ici : il passe par Netlify, que le site n'utilise pas.
3. Modifiez une actualité, un événement, une ressource ou les réglages, puis cliquez sur « Enregistrer ».
4. Le site se met à jour tout seul en 1 à 2 minutes.

Ce que vous pouvez modifier :

- **Actualités** : les 3 plus récentes s'affichent sur l'accueil.
- **Agenda** : un événement passé bascule seul dans « Ateliers passés ».
- **Ressources** : guides et fichiers (PDF, Excel), filtrables par thème et par type.
- **Pages de fond** : Comprendre la SECO, Menaces cyber, Réglementation.
- **Réglages** : texte d'accueil, coordonnées du référent, chiffres clés, outils, page « En cas d'incident », menu.

## Fonctionnement technique

- Générateur de site statique [Eleventy](https://www.11ty.dev/), contenus en Markdown et JSON dans `src/`.
- Administration : [Sveltia CMS](https://github.com/sveltia/sveltia-cms), configurée dans `src/admin/config.yml`.
- Publication : GitHub Actions (`.github/workflows/deploy.yml`) puis GitHub Pages, gratuit.
- Pour tester sur un ordinateur de développeur : `npm ci` puis `npm start`.
