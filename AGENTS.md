<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Guppy site: content/data lives in src/data/*, section components in src/components/aquarium/*; the selected variety re-tints the page by setting --live/--glow on the index wrapper — keeps varieties data-driven and theming in one place.

- Interactive aquarium controls use the shared Button aquarium variant and touch size to maintain accessible touch targets without overriding specimen styling.

- Keep RealityMAX eager, visible during its own startup, and preconnect its viewer and CORS asset CDN in the owning leaf route; this avoids a hidden loading phase and warms asset connections without duplicate model downloads.
