- Guppy site: content/data lives in src/data/_, section components in src/components/aquarium/_; the selected variety re-tints the page by setting --live/--glow on the index wrapper — keeps varieties data-driven and theming in one place.

- Interactive aquarium controls use the shared Button aquarium variant and touch size to maintain accessible touch targets without overriding specimen styling.

- Keep RealityMAX eager, visible during its own startup, and preconnect its viewer and CORS asset CDN in the owning leaf route; this avoids a hidden loading phase and warms asset connections without duplicate model downloads.
