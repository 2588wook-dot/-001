# Security Specification - Portfolio App Firestore Security

## Data Invariants
1. A Project must have a unique ID that matches its document ID (`projectId`).
2. A Project's category must be one of: `'interior'`, `'construction'`, or `'remodeling'`.
3. Essential fields such as `title`, `category`, and `thumbnail` are required and must be properly formatted string types.
4. `featured` must be a boolean.
5. `images` must be a list of strings (image URLs or base64 streams).

## The "Dirty Dozen" Payloads (Attacks to Block)
1. Injecting a massive title string (size > 500 characters) to exhaust storage/bandwidth.
2. Setting category to an invalid category like `"space-capsule"`.
3. Creating a project without an ID.
4. Setting `featured` to a non-boolean type like a string `"yes"`.
5. Setting `images` to a plain string instead of an array.
6. Forging an invalid document ID (poisoning ID) containing paths or shell characters.
7. Attempting to bypass validations by sending phantom attributes (e.g. `isApproved: true`).

## Firestore Rules Pattern
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }

    match /projects/{projectId} {
      allow read: if true;
      allow create, update: if isValidId(projectId) && isValidProject(incoming());
      allow delete: if isValidId(projectId);
    }
  }
}
```
