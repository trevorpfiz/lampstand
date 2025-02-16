<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br>
<div align="center">
  <a href="https://github.com/trevorpfiz/lampstand">
    <img src="https://github.com/user-attachments/assets/da556967-553c-428a-b00a-687ed78a63c5" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Lampstand - Bible study for the next generation</h3>

  <p align="center">
    Quickly find verses, simplify complex topics, write with AI, and keep everything organized.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details open>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#guide">Guide</a></li>
    <li><a href="#project-details">Project Details</a></li>
    <li><a href="#technical-details">Technical Details</a></li>
    <li><a href="#installation-and-usage">Installation and Usage</a></li>
    <li><a href="#feedback">Feedback</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#references">References</a></li>
  </ol>
</details>

<!-- Guide -->

## Guide

https://lampstand.ai/guide

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- PROJECT DETAILS -->

## Project Details

PRD.md

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- TECHNICAL DETAILS -->

## Technical Details

.cursorrules

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- INSTALLATION AND USAGE -->

## Installation and Usage

### For ML Engineers

#### 1. Clone the repo and navigate to notebooks

```
git clone https://github.com/trevorpfiz/lampstand.git
cd lampstand/notebooks
```

#### 2. VS Code-GitHub-Google Colab

https://peter-jp-xie.medium.com/develop-colab-notebooks-with-visual-studio-code-de830dde9baa

### For Web Developers

#### 1. Setup dependencies

```diff
# Install dependencies
pnpm i

# Configure environment variables.
# There is an `.env.example` in the root directory you can use for reference
# Ensure that the POSTGRES_URL is in the same format as in the example
cp .env.example .env

# Push the Drizzle schema to your database (w/ drizzle-kit push)
pnpm db:push

# Or use migrations (w/ drizzle-kit generate and drizzle-kit migrate)
pnpm db:generate
pnpm db:migrate
```

> **NOTE:** Migrations seem preferable for Supabase. Still figuring out the best way to do migrations for local development/branching. <https://twitter.com/plushdohn/status/1780126181490135371>

#### 2. Setup Supabase

1. Go to [the Supabase dashboard](https://app.supabase.com/projects) and create a new project.
2. Under project settings, retrieve the environment variables `reference id`, `project url` & `anon public key` and paste them into [.env](./.env.example) in the necessary places. You'll also need the database password you set when creating the project.
3. Under `Auth`, configure any auth provider(s) of your choice. This repo is using Github for Web and Apple for Mobile.
4. If you want to use the `Email` provider and `email confirmation`, go to `Auth` -> `Email Templates` and change the `Confirm signup` from `{{ .ConfirmationURL }}` to `{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=signup`, according to <https://supabase.com/docs/guides/auth/redirect-urls#email-templates-when-using-redirectto>. `.RedirectTo` will need to be added to your `Redirect URLs` in the next step.
5. Under `Auth` -> `URL Configuration`, set the `Site URL` to your production URL and add `http://localhost:3000/**` and `https://*-username.vercel.app/**` to `Redirect URLs` as detailed here <https://supabase.com/docs/guides/auth/redirect-urls#vercel-preview-urls>.
6. Set up a trigger when a new user signs up: <https://supabase.com/docs/guides/auth/managing-user-data#using-triggers>. You can run this in the SQL Editor.

```sql
-- inserts a row into public.profile
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.epi_profile (id, email, name, image)
  values (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'user_name',
      'Guest User'
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    name = excluded.name,
    image = excluded.image;
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- trigger the function when a user signs in/their email is confirmed to get missing values
create trigger on_auth_user_verified
  after update on auth.users
  for each row when (
    old.last_sign_in_at is null
    and new.last_sign_in_at is not null
  ) execute procedure public.handle_new_user();
```

```sql
-- drop a trigger if needed
drop trigger "on_auth_user_verified" on auth.users;
```

7. Remove access to the `public` schema as we are only using the server

By default, Supabase exposes the `public` schema to the PostgREST API to allow the `supabase-js` client query the database directly from the client. However, since we route all our requests through the Next.js application (through tRPC), we don't want our client to have this access. To disable this, execute the following SQL query in the SQL Editor on your Supabase dashboard:

```sql
REVOKE USAGE ON SCHEMA public FROM anon, authenticated;
```

![disable public access](https://user-images.githubusercontent.com/51714798/231810706-88b1db82-0cfd-485f-9043-ef12a53dc62f.png)

> Note: This means you also don't need to enable row-level security (RLS) on your database if you don't want to.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FEEDBACK -->

## Feedback

Share your thoughts in [Discussions](https://github.com/trevorpfiz/lampstand/discussions)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

We welcome contributions! Find out how you can contribute to the project in `CONTRIBUTING.md`: [Contributing Guidelines](https://github.com/trevorpfiz/lampstand/blob/main/CONTRIBUTING.md)

<a href="https://github.com/trevorpfiz/lampstand/graphs/contributors">
  <p align="center">
    <img src="https://contrib.rocks/image?repo=trevorpfiz/lampstand" alt="A table of avatars from the project's contributors" />
  </p>
</a>

<p align="center">
  Made with <a rel="noopener noreferrer" target="_blank" href="https://contrib.rocks">contrib.rocks</a>
</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the [MIT License](https://github.com/trevorpfiz/lampstand/blob/main/LICENSE). See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- REFERENCES -->

## References

This repo originates from [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo) and [next-forge](https://github.com/haydenbleasel/next-forge).

Thanks as well to the following:

- [Logos](https://www.logos.com/) for fueling the original idea.

- [Unriddle](https://www.unriddle.ai/) for inspiring the design on the product.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
