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

## Architecture
- All data access goes through `src/lib/api.ts` (one function per REST endpoint, mock fallback when `VITE_API_BASE_URL` is unset) — keeps swapping in the real backend a one-line change.
- Mock data and domain types live only in `src/lib/mock-data.ts` and `src/lib/types.ts`; components never embed data.
- App shell (sidebar, header, add-subscription drawer, CSV dialog, toaster) is mounted once in `src/routes/__root.tsx`; pages open drawers via `useApp()` context.
