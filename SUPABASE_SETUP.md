# Setting up accounts, Google sign-in, and save/load

The app now has the code to let people sign in with Google and save/load their army
lists — but it needs a small free backend service (Supabase) wired up before that
works. Until this is done, the app works exactly as before; the "Account" panel
simply doesn't appear.

This is entirely account setup on your end (I can't create accounts or OAuth
credentials on your behalf) — but it's a one-time checklist. Take it at your own
pace; nothing else about the app depends on it.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up (you can use your Google
   account to sign up, which is convenient).
2. Create a new project. Give it a name like `lasalle-army-builder`, set a database
   password (save it somewhere — a password manager is fine, you likely won't need
   it again), pick a region near you, and use the free tier.
3. Wait a minute or two while it provisions.

## 2. Get your Project URL and anon key

1. In the Supabase dashboard for your new project, go to **Project Settings**
   (the gear icon) → **API Keys**.
2. Copy the **Project URL** (looks like `https://xxxxxxxx.supabase.co`) — on
   newer projects this is on the **API Keys** page itself, or under **Data API**
   if it's a separate tab.
3. Copy the client-side key. Supabase renamed these in 2026, so depending on
   when your project was created you'll see one of two labels — either is
   fine, they do the same job:
   - Newer projects: the **Publishable key** (starts with `sb_publishable_...`),
     under the **"Publishable and secret API keys"** tab.
   - Older projects: the **anon public** key, under "Project API keys."
   Either way, **do NOT copy the Secret key / `service_role` key** (starts
   with `sb_secret_...` or is labeled `service_role`) — that one must stay
   private and is never used in this app.
4. **Send me the Project URL and the publishable/anon key in chat** and I'll
   wire them into the app for you. Never paste the Secret key anywhere.

The publishable/anon key is *meant* to be public/embedded in the app — it's safe
to share with me and safe to ship in the built site. Access control is enforced
separately, by the Row Level Security policies set up in the next section.

## 3. Run the database setup script

1. In the Supabase dashboard, go to **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from the app's source folder (included in this
   round's source zip), copy its entire contents, and paste them into the query
   editor.
3. Click **Run**.

This creates one table, `army_lists`, with Row Level Security policies that make
sure each signed-in user can only ever see, save, or delete their *own* lists —
enforced by Supabase's servers, not just by the app's code.

## 4. Enable Google sign-in

This step needs a Google OAuth client, which is set up in Google Cloud Console,
separate from Supabase:

1. In the Supabase dashboard: **Authentication** → **Providers** → find **Google**
   and open it (don't toggle it on yet — you'll do that after step 4c).
2. It will show you a **Callback URL** (something like
   `https://xxxxxxxx.supabase.co/auth/v1/callback`) — keep this tab open, you'll
   need to copy that URL in a moment.
3. In a new tab, go to [console.cloud.google.com](https://console.cloud.google.com):
   - Create a new project (top-left project picker → New Project), e.g. named
     "Lasalle Army Maker".
   - Go to **APIs & Services** → **OAuth consent screen**. Choose **External**,
     fill in the app name ("Lasalle Army Maker"), your email as support contact,
     and save. You can leave it in **Testing** status — that's fine for personal
     use; it just means only email addresses you explicitly add as test users can
     sign in (add your own Gmail address as a test user). If you want other
     people to be able to sign in too, add their emails as test users, or publish
     the app later (publishing doesn't require Google's verification process
     unless you request more than basic profile/email access, which this doesn't).
   - Go to **APIs & Services** → **Credentials** → **Create Credentials** →
     **OAuth client ID** → Application type: **Web application**.
   - Under **Authorized redirect URIs**, paste the Supabase callback URL you
     copied in step 4b.
   - Click **Create**. Google will show you a **Client ID** and **Client Secret**.
4. Back in the Supabase tab, paste that Client ID and Client Secret into the
   Google provider's fields, then toggle the provider **on** and save.

## 5. Point Supabase at your live site

1. In Supabase: **Authentication** → **URL Configuration**.
2. Set **Site URL** to your live Netlify URL (`https://lasalle-army-builder.netlify.app`).
3. Add the same URL under **Redirect URLs** if there's a separate allow-list field.

This is what makes Google send people back to the right place after they sign in.

## 6. Add the same two values to Netlify

Once you've sent me the Project URL and anon key (step 2) and I've confirmed the
code is updated:

1. In Netlify: **Site configuration** → **Environment variables** → **Add a
   variable**.
2. Add `VITE_SUPABASE_URL` = your Project URL.
3. Add `VITE_SUPABASE_ANON_KEY` = your anon public key.
4. Trigger a new deploy (environment variables only take effect on a fresh build —
   use "Clear cache and deploy site" to be safe, the same option from our header
   colors round).

## Testing locally first (optional but recommended)

Before touching Netlify, you can test entirely on your own machine:

1. Copy `.env.example` to a new file named `.env` in the project folder.
2. Fill in the two values from step 2.
3. Run `npm run dev` and open the local address it prints.
4. You should now see an "Account" section with a "Sign in with Google" button.
   Try signing in, saving a list, reloading the page, and loading it back.

`.env` is already in `.gitignore` — it will never get committed or pushed, so
your keys stay local to your machine (this is expected and correct: the anon key
is safe to ship in the *built* app, but there's no need to commit the raw file).

---

Once you've done steps 1-5 and sent me the Project URL + anon key, let me know
and I'll confirm everything's wired up correctly on the code side before you flip
the Netlify switch in step 6.
