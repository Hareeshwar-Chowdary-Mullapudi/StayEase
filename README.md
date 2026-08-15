# StayEase

StayEase is a simple Airbnb-style app for stays in India. Built to be easy to demo in an interview.

Guests search and book. Hosts list places (admin must approve). Guests pay with Stripe Checkout. After a completed stay, the guest can leave a review.

## Roles

| Role | What they see |
|------|----------------|
| **Guest** | Search, listing detail, book, My trips, pay, profile. Top right: **Become host**. |
| **Host** | Host dashboard, host bookings, create/edit listing, profile. Top right: **Become guest**. |
| **Admin** | Guest + host pages, plus listing requests and admins. Cannot switch role. |

Register as Guest or Host. The email in `ADMIN_EMAIL` becomes admin on login.

New listings are **pending** until an admin **approves** or **declines**. Guests only see **approved** stays.

Admins add other admins **by email** (that person must already have an account). They can also remove an admin.

## What you get on Home

- Search by location, guests, min/max price
- Famous places in India (slider). Click a city to search it. **See all** opens every city, not the homes.
- Available stays grouped **by city** in medium cards you can slide
- Seed data: several stays per city (Goa, Manali, Jaipur, and others), with different cover photos

When booking, pick dates and **Guests** (minimum 1, up to the listing max).

## Tech stack

| Part | Tool |
|------|------|
| Frontend | React + Vite (`my-react-app/`) |
| Backend | Express (`backend/`) |
| Database | MongoDB + Mongoose |
| Auth | JWT |
| Payments | Stripe Checkout (test mode) |
| Photos | Upload to `backend/uploads`, plus image URLs |

## Project structure

```text
Airbnb/
├── backend/          API (port 5000)
├── my-react-app/     UI (port 5173)
└── README.md
```

## Setup

### 1. Backend env

Copy `backend/.env.example` to `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/airbnb
JWT_SECRET=change_this_to_a_long_random_string
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=
STRIPE_CURRENCY=inr
ADMIN_EMAIL=you@example.com
```

Use Atlas if you want: put `/airbnb` in the URI before `?`. Never commit `.env`. Never use `sk_live_`.

### 2. Frontend env

Copy `my-react-app/.env.example` to `my-react-app/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

On **Vercel**, set `VITE_API_URL` to your Render API **including `/api`**, then redeploy.

### 3. Run

```bash
cd backend
npm install
npm run dev
```

Windows SSL install issues:

```powershell
$env:NODE_OPTIONS='--use-system-ca'
npm install
npm run dev
```

You should see MongoDB connected, any new seed listings, and `Server running on port 5000`.

```bash
cd my-react-app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Restart the API after you change `.env`.

## Demo flow

1. Register / login.
2. Search a city, or click a famous place, then open a listing.
3. Dates + guests → **Request to book**.
4. **My trips** → **Confirm to proceed** → Stripe test card `4242 4242 4242 4242`.
5. **Become host** → create a listing (pending). Admin **Listing requests** approve/decline.
6. Host dashboard to edit; host bookings to decline or **Mark completed**.
7. Guest reviews 1–5 on My trips after **completed**.

Menu (top right): profile, trips or host pages, admin pages if admin, logout.

## API overview

| Area | Examples |
|------|----------|
| Health | `GET /api/health` |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Users | `PUT /api/users/profile`, `PATCH /api/users/role`, `POST /api/users/admin` |
| Listings | `GET /api/listings` (approved), `GET /mine`, `GET /pending`, `PATCH /:id/review` |
| Bookings | `POST /api/bookings`, `GET /api/bookings/my`, `GET /api/bookings/host` |
| Payments | `POST /api/payments/create-checkout`, `POST /api/payments/confirm` |
| Reviews | `POST /api/reviews`, `GET /api/reviews/listing/:id` |
| Upload | `POST /api/upload` |

## GitHub / deploy

- `.env` is gitignored. Share only `.env.example`.
- If Stripe rejects INR, set `STRIPE_CURRENCY=usd`.
- Webhooks are optional. Local confirm uses `/payments/confirm` after Stripe redirect.
- Frontend: Vercel. Backend: Render. Same MongoDB for both if `MONGO_URI` matches.
