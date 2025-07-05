# API des Règles de Validation des Livrables

Cette documentation décrit l'API des règles de validation automatique des livrables dans le système MyGES-like.

## Vue d'ensemble

Le système de validation automatique permet de définir et d'appliquer des règles sur les livrables soumis par les étudiants. Il supporte quatre types de règles principales :

1. **MAX_SIZE_FILE** - Validation de la taille maximale du fichier
2. **FILE_PRESENCE** - Validation de la présence de fichiers requis
3. **FILE_CONTENT_MATCH** - Validation du contenu de fichiers (texte, regex, correspondance exacte)
4. **FOLDER_STRUCTURE** - Validation de la structure de dossiers

## Endpoints de l'API

### Gestion des Règles de Livrable

#### `POST /deliverable-rules`
Crée une nouvelle règle de validation.

**Body:**
```json
{
  "ruleType": "MAX_SIZE_FILE",
  "ruleData": {
    "maxSize": 52428800
  }
}
```

**Réponse:**
```json
{
  "id": "rule-id",
  "ruleType": "MAX_SIZE_FILE",
  "ruleMaxSizeFile": {
    "maxSize": 52428800
  },
  "createdAt": "2025-01-15T10:00:00Z"
}
```

#### `GET /deliverable-rules`
Récupère toutes les règles de validation.

#### `GET /deliverable-rules/:id`
Récupère une règle spécifique par son ID.

#### `PATCH /deliverable-rules/:id`
Met à jour une règle existante.

#### `DELETE /deliverable-rules/:id`
Supprime une règle.

### Association avec les Projets de Promotion

#### `POST /deliverable-rules/assign`
Assigne une règle à un projet de promotion.

**Body:**
```json
{
  "deliverableRuleId": "rule-id",
  "promotionProjectId": "project-id"
}
```

#### `DELETE /deliverable-rules/unassign/:ruleId/:projectId`
Supprime l'assignation d'une règle à un projet.

#### `GET /deliverable-rules/promotion-project/:projectId/rules`
Récupère toutes les règles assignées à un projet de promotion.

### Validation

#### `POST /deliverable-rules/validate/:deliverableId`
Lance la validation d'un livrable contre ses règles assignées.

**Réponse:**
```json
{
  "isValid": true,
  "results": [
    {
      "isValid": true,
      "ruleId": "rule-id",
      "ruleType": "MAX_SIZE_FILE",
      "message": "File size 25.5 MB is within limit",
      "details": {
        "actualSize": 26738688,
        "maxSize": 52428800,
        "actualSizeFormatted": "25.5 MB",
        "maxSizeFormatted": "50 MB"
      }
    }
  ],
  "summary": {
    "totalRules": 1,
    "passedRules": 1,
    "failedRules": 0
  }
}
```

#### `GET /deliverables/:id/validation-results`
Récupère les résultats de validation stockés pour un livrable.

## Types de Règles

### 1. MAX_SIZE_FILE

Valide que la taille du fichier archive ne dépasse pas une limite maximale.

**Exemple de création:**
```json
{
  "ruleType": "MAX_SIZE_FILE",
  "ruleData": {
    "maxSize": 52428800
  }
}
```

**Paramètres:**
- `maxSize` (number): Taille maximale en octets

### 2. FILE_PRESENCE

Valide qu'un fichier spécifique est présent dans l'archive.

**Exemple de création:**
```json
{
  "ruleType": "FILE_PRESENCE",
  "ruleData": {
    "fileName": "README.md"
  }
}
```

**Paramètres:**
- `fileName` (string): Nom du fichier requis (peut inclure le chemin relatif)

### 3. FILE_CONTENT_MATCH

Valide le contenu d'un fichier selon différents modes de correspondance.

**Exemple de création:**
```json
{
  "ruleType": "FILE_CONTENT_MATCH",
  "ruleData": {
    "fileName": "package.json",
    "match": "\"name\"\\s*:\\s*\"test-project\"",
    "matchType": "REGEX"
  }
}
```

**Paramètres:**
- `fileName` (string): Nom du fichier à valider
- `match` (string): Pattern à rechercher
- `matchType` (enum): Type de correspondance
  - `CONTAINS`: Le fichier doit contenir la chaîne
  - `REGEX`: Le fichier doit correspondre à l'expression régulière
  - `EXACT`: Le fichier doit correspondre exactement (après trim)

### 4. FOLDER_STRUCTURE

Valide la structure de dossiers de l'archive.

**Exemple de création:**
```json
{
  "ruleType": "FOLDER_STRUCTURE",
  "ruleData": {
    "expectedStructure": {
      "src": {
        "index.js": "file",
        "utils": {
          "helper.js": "file"
        }
      },
      "package.json": "file",
      "README.md": "file"
    }
  }
}
```

**Paramètres:**
- `expectedStructure` (object): Structure attendue où :
  - Les clés sont les noms de fichiers/dossiers
  - La valeur `"file"` indique un fichier
  - Un objet indique un dossier avec sa structure interne

## Intégration Automatique

### Validation lors de la Soumission

Lorsqu'un étudiant attache un fichier à un livrable via `POST /deliverables/:id/attach-file`, le système :

1. **Télécharge le fichier** depuis Google Cloud Storage
2. **Applique toutes les règles** assignées au projet de promotion
3. **Sauvegarde les résultats** dans la base de données
4. **Vérifie les règles de soumission** (deadline, soumission tardive)

### Résultats de Validation

Les résultats sont automatiquement stockés dans les tables :
- `ProjectGroupResult`: Résultat global pour le groupe
- `DeliverableRuleResult`: Résultat pour chaque règle individuelle

## Exemples d'Usage

### Créer un Ensemble de Règles pour un Projet Web

```javascript
// 1. Règle de taille maximale (50MB)
const maxSizeRule = await fetch('/deliverable-rules', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ruleType: 'MAX_SIZE_FILE',
    ruleData: { maxSize: 52428800 }
  })
});

// 2. Fichier README requis
const readmeRule = await fetch('/deliverable-rules', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ruleType: 'FILE_PRESENCE',
    ruleData: { fileName: 'README.md' }
  })
});

// 3. Structure de projet Node.js
const structureRule = await fetch('/deliverable-rules', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ruleType: 'FOLDER_STRUCTURE',
    ruleData: {
      expectedStructure: {
        "src": {
          "index.js": "file",
          "routes": {},
          "models": {}
        },
        "package.json": "file",
        "README.md": "file",
        ".gitignore": "file"
      }
    }
  })
});

// 4. Contenu package.json valide
const packageRule = await fetch('/deliverable-rules', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ruleType: 'FILE_CONTENT_MATCH',
    ruleData: {
      fileName: 'package.json',
      match: '"scripts"',
      matchType: 'CONTAINS'
    }
  })
});

// Assigner toutes les règles au projet
const projectId = 'promotion-project-id';
const rules = [maxSizeRule, readmeRule, structureRule, packageRule];

for (const rule of rules) {
  await fetch('/deliverable-rules/assign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deliverableRuleId: rule.id,
      promotionProjectId: projectId
    })
  });
}
```

### Vérifier les Résultats de Validation

```javascript
// Obtenir les résultats pour un livrable
const results = await fetch(`/deliverables/${deliverableId}/validation-results`);
const validationData = await results.json();

console.log(`Règles passées: ${validationData.deliverableRuleResults.filter(r => r.isRuleRespected).length}`);
console.log(`Règles échouées: ${validationData.deliverableRuleResults.filter(r => !r.isRuleRespected).length}`);

// Détails des échecs
const failures = validationData.deliverableRuleResults
  .filter(r => !r.isRuleRespected)
  .map(r => ({
    rule: r.deliverableRule.ruleType,
    details: r.deliverableRule
  }));
```

## Considérations de Performance

### Validation Asynchrone
- La validation est effectuée de manière asynchrone lors de la soumission
- Les erreurs de validation n'empêchent pas la soumission (logged seulement)
- Les résultats sont stockés pour consultation ultérieure

### Optimisations
- Les fichiers sont téléchargés une seule fois pour toutes les validations
- Les archives sont traitées en mémoire avec JSZip
- Les résultats sont mis en cache dans la base de données

## Sécurité

### Authentification
- Tous les endpoints nécessitent une authentification JWT
- Les étudiants ne peuvent valider que leurs propres livrables

### Validation des Données
- Toutes les entrées sont validées avec class-validator
- Les expressions régulières sont vérifiées avant exécution
- Les structures JSON sont validées avant parsing

## Messages d'Erreur

### Erreurs Courantes

| Code | Message | Description |
|------|---------|-------------|
| 400 | `Invalid rule type` | Type de règle non supporté |
| 400 | `Invalid regex pattern` | Expression régulière invalide |
| 400 | `Rule is already assigned` | Règle déjà assignée au projet |
| 404 | `Deliverable rule not found` | Règle introuvable |
| 404 | `Promotion project not found` | Projet de promotion introuvable |
| 403 | `Late submission not allowed` | Soumission tardive interdite |

### Gestion des Erreurs de Validation

Les erreurs de validation ne bloquent pas la soumission mais sont loggées :

```javascript
// Exemple de log d'erreur
console.warn('Deliverable deliverable-123 has validation failures but submission is allowed', {
  failedRules: ['MAX_SIZE_FILE', 'FILE_PRESENCE']
});
```