# PocketBase for leads and tours: production setup

The site's functions (`api/`) read tours from PocketBase and write enquiries to its `leads` collection. They need an **https** address and, for writes, a key. There is no default address and no http fallback: without the settings below, lead and suggestion forms answer 503, the tour list answers 503 and the sitemap falls back to its static pages.

**Set all of this up before merging or deploying this change.**

## 1. HTTPS in front of PocketBase

PocketBase must be reachable only over https, through a reverse proxy with a certificate (example: Caddy, which obtains and renews certificates itself). Use a host name such as `pb.example-domain.eu`.

```
pb.example-domain.eu {
    reverse_proxy 127.0.0.1:8090
}
```

- Run PocketBase on the loopback address only: `pocketbase serve --http=127.0.0.1:8090`.
- Firewall: allow 80 and 443 to the proxy; close 8090 and every other way to PocketBase from outside, including the old `http://<ip>/pb` address.
- Restrict the PocketBase admin UI (`/_/`) at the proxy, by IP address or behind an extra login, and use a long unique admin password.

## 2. Vercel environment (Production and Preview)

| Name | Value |
|---|---|
| `PB_URL` | `https://pb.example-domain.eu` (https, no trailing slash) |
| `PB_API_KEY` | a long random secret, for example the output of `openssl rand -hex 32` |
| `ALLOWED_ORIGINS` | optional: other addresses the forms are served from, besides `kiurtours.eu`, `www.kiurtours.eu` and the deployment's own host |

Set them in the Vercel project settings. Never put the key in the repository, a chat or a report.

## 3. Access rules (PocketBase admin, Collections, API rules)

`leads`:

| Rule | Value |
|---|---|
| List/Search | locked (empty, administrators only) |
| View | locked |
| **Create** | `@request.headers.x_leads_key = "<the PB_API_KEY value>" && (@request.body.status:isset = false \|\| @request.body.status = "new")` |
| Update | locked |
| Delete | locked |

Paste the key into the rule in the PocketBase admin only; it is stored there, not in code. Header `X-Leads-Key` is seen by PocketBase as `x_leads_key`. Also set field limits in the collection schema: `name` required, up to 120 characters; `email` up to 254; `message` and `notes` up to 5000.

`tours` (read by the public pages): List and View `published = true`; Create, Update, Delete locked.

Every other collection: check that List, View, Create, Update and Delete are locked unless a public page really needs them.

If the `leads` list or view rule was ever open, treat the stored enquiries (names, emails, phones) as exposed and tell the people concerned as the law requires.

## 4. Check it (run from any machine; the values come from your environment, nothing is printed)

```bash
# without the key a create must be refused (expect 400 or 403)
curl -s -o /dev/null -w "%{http_code}\n" -X POST "$PB_URL/api/collections/leads/records" -H "Content-Type: application/json" -d '{"name":"check","email":"check@example.com"}'

# listing without an administrator must be refused (expect 403 or 404)
curl -s -o /dev/null -w "%{http_code}\n" "$PB_URL/api/collections/leads/records"

# the old plain-http address must not answer (expect 000 or a connection error)
curl -s -m 5 -o /dev/null -w "%{http_code}\n" "http://OLD-ADDRESS/pb/api/health"

# with the key a create works (expect 200; delete the test row in the admin afterwards)
curl -s -o /dev/null -w "%{http_code}\n" -X POST "$PB_URL/api/collections/leads/records" -H "Content-Type: application/json" -H "X-Leads-Key: $PB_API_KEY" -d '{"name":"check","email":"check@example.com","status":"new"}'
```

Then open the Vercel preview of this change and send a test enquiry from the contact form, the tour booking form and the route suggestion box; confirm they arrive in PocketBase and that the tour list loads.

## Order of work

1. HTTPS and firewall (section 1). 2. Key and rules (section 3). 3. Vercel variables for Preview (section 2); test the preview. 4. Variables for Production. 5. Merge. 6. Close the old address and remove it from anywhere it is still used.
