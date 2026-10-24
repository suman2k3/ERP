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

## ERP architecture

- Keep all prototype data in the root DemoProvider and key tenant records by client ID, so workspace changes stay isolated and reset on refresh.
- Use typed tenant and admin dynamic routes with allowlisted page keys, so each sidebar entry has a shareable URL without duplicating the workspace shell.
- Keep reusable forms, tables and branding in ERP common components and visual roles in global semantic tokens, so management screens remain consistent.
- Demo sign-in is client state only, never an authentication or authorization security boundary; do not connect backend services for prototype interactions.
