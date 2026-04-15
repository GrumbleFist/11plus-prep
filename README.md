# 11+ Prep

Progressive Web App for 11+ GL Assessment exam preparation. Four subjects (Maths, English, Verbal Reasoning, Non-Verbal Reasoning), 100 levels each, child-friendly explanations, parent dashboard.

## Running locally

```
python -m http.server 8080
```

Then open http://localhost:8080/.

## Tech

Pure static site: HTML + CSS + vanilla JS. No build step. IndexedDB for progress. Service worker for offline. SVG-based non-verbal reasoning.

## Deployment

Hosted via GitHub Pages from the `main` branch root.
