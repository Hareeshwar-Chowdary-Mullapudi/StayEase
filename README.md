# StayEase

StayEase is a simple Airbnb-style web app for finding and booking stays in India.

Guests can search listings, pick dates, request a booking, and pay with Stripe. Hosts can list a place, edit it, decline a request, and mark a stay as completed. After a completed stay, the guest can leave a 1–5 star review.

One account can both book stays and host listings.

## Tech stack

| Part | Tool |
|------|------|
| Frontend | React + Vite (`my-react-app/`) |
| Backend | Express (`backend/`) |
| Database | MongoDB + Mongoose |
| Auth | JWT |
| Payments | Stripe Checkout (test mode) |
| Photos | Local upload to `backend/uploads` |

## Project structure

```text
Airbnb/
├── backend/          API server (port 5000)
├── my-react-app/     React UI (port 5173)
└── README.md
```

## What you need

- Node.js
- MongoDB running locally (default URI: `mongodb://localhost:27017/airbnb`)
- A Stripe **test** secret key (`sk_test_...`) from [Stripe Dashboard → API keys](https://dashboard.stripe.com/test/apikeys)

## Setup

### 1. Backend env

Copy `backend/.env.example` to `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/airbnb
JWT_SECRET=change_this_to_a_long_random_string
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=
STRIPE_CURRENCY=inr
```

Never commit `.env`. Never use live keys (`sk_live_`).

### 2. Frontend env

Copy `my-react-app/.env.example` to `my-react-app/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install and run

Open two terminals.

**API**

```bash
cd backend
npm install
npm run dev
```

On Windows, if `npm install` fails with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`:

```powershell
$env:NODE_OPTIONS='--use-system-ca'
npm install
npm run dev
```

You should see MongoDB connected and `Server running on port 5000`.

**UI**

```bash
cd my-react-app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Restart the backend after you change `.env` (nodemon does not always reload env files).

## How to use the app

1. **Register** a new account, then **login**.
2. On Home, search by location, guests, or price, and open a listing.
3. Choose check-in and check-out, then **Request to book**.
4. Go to **My trips** → **Confirm to proceed**. You are sent to Stripe.
5. Pay with a test card: `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP.
6. After payment the booking becomes **confirmed**.
7. As a host, open **Host dashboard** to create or edit a listing, and **Host bookings** to decline a pending stay or **Mark completed**.
8. When a stay is **completed**, the guest can rate it 1–5 stars and write a review on My trips. Reviews show on the listing page.

The menu (three lines, top right) has Profile, My trips, Host dashboard, Create listing, and Logout.

## API overview

| Area | Examples |
|------|----------|
| Health | `GET /api/health` |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Listings | `GET /api/listings`, `GET /api/listings/:id`, `POST/PUT/DELETE` (owner) |
| Bookings | `POST /api/bookings`, `GET /api/bookings/my`, `GET /api/bookings/host` |
| Payments | `POST /api/payments/create-checkout`, `POST /api/payments/confirm` |
| Reviews | `POST /api/reviews`, `GET /api/reviews/listing/:id` |
| Upload | `POST /api/upload` |

## Notes for GitHub

- `.env` files are gitignored. Share only `.env.example`.
- If Stripe rejects INR on your account, set `STRIPE_CURRENCY=usd` in `backend/.env`.
- Stripe webhooks are optional. Local payment confirmation uses the success page (`/payments/confirm`).
