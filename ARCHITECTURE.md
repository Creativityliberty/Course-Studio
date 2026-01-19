# Architecture Mindfulness Studio v2 (High-End)

## 1. Design System : Le Moteur de "Moods"
L'interface utilise des variables CSS injectées dans `:root` via `index.html`.
- **Moods disponibles** : `dawn` (blanc pur), `dusk` (sépia/chaleureux), `midnight` (charbon/nuit).
- **Modification** : Pour changer l'identité visuelle, l'agent doit modifier les valeurs de `--primary`, `--surface`, et `--text-main`.

## 2. Audio Engine (Mindfulness)
- **Modèle utilisé** : `gemini-2.5-flash-preview-tts`.
- **Fonctionnement** : Chaque bloc de type `TEXT` peut générer un `audioUrl`. L'agent doit s'assurer que le bouton de génération audio est visible si `block.content` est riche.

## 3. Typographie Éditoriale
- Les titres utilisent la classe `.editorial-title`. 
- **Règle d'or** : Ne jamais utiliser d'astérisques. Le texte doit être "nu" et mis en forme par le composant `CoursePlayer`.

## 4. Guide pour l'Agent de Maintenance
- **Changer le Spacing** : Modifier `--editorial-gutter` (Défaut: 3rem).
- **Changer les Arrondis** : Modifier `--radius-premium`.
