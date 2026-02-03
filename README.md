# Vitanova 2026 Prayer Repository

A reverent, dark-themed web application to aggregate intercessory prayers for **Vitanova 2026** - a special spiritual program organized by Jesus Youth SJCET.

> *"Where two or three gather in my name, there am I with them."* — Matthew 18:20

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)

## ✨ Features

- **🙏 9 Prayer Types** - Holy Mass, Rosary, Adoration, Word of God, Memorare, Creed, Hail Mary, Way of the Cross, Novena of St. Joseph
- **⏱️ Time-based Prayers** - +5min and +30min increments for Adoration and Word of God
- **📊 Live Statistics** - Real-time aggregate counters with beautiful visualizations
- **🔒 Spam Protection** - 5-second cooldown between submissions per device
- **🎨 Dark Aesthetic UI** - Deep purples, amber accents, glass-morphism cards
- **👤 Anonymous** - No user accounts required, focus on collective prayer
- **🛠️ Admin Panel** - View stats and manually adjust counters

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)

### 1. Clone and Install

```bash
git clone https://github.com/your-username/vitanova-prayer-corner.git
cd vitanova-prayer-corner
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
3. Go to **Project Settings > API** and copy your URL and anon key

### 3. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the prayer repository.

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page with prayer cards
│   ├── admin/page.tsx        # Admin dashboard
│   ├── layout.tsx            # Root layout with dark theme
│   └── globals.css           # Tailwind + custom animations
├── components/
│   ├── Header.tsx            # Vitanova branding header
│   ├── CountPrayerCard.tsx   # +1 button prayer card
│   ├── TimePrayerCard.tsx    # +5min/+30min prayer card
│   ├── StatsBar.tsx          # Aggregate stats display
│   └── Footer.tsx            # Footer with admin link
├── hooks/
│   ├── usePrayers.ts         # Fetch/subscribe to prayer data
│   └── useSubmitPrayer.ts    # Submit with cooldown logic
└── lib/
    ├── supabase.ts           # Supabase client
    ├── device.ts             # Device fingerprint for cooldown
    └── types.ts              # TypeScript interfaces
```

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `prayer_types` | 9 prayer types with name, unit (count/minutes), icon |
| `prayer_logs` | Individual submissions with device_hash for rate limiting |
| `prayer_aggregates` | View providing real-time totals per prayer type |

## 🚢 Deployment (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

## 🎨 Customization

### Add New Prayer Types

1. Add to `PRAYER_TYPES` array in `src/lib/types.ts`
2. Insert into Supabase `prayer_types` table
3. Use any [Lucide icon](https://lucide.dev/icons) name

### Change Theme Colors

Edit CSS variables in `src/app/globals.css`:

```css
:root {
  --primary: #7c3aed;      /* Purple */
  --accent: #f59e0b;       /* Amber/Gold */
  --background: #0a0a1a;   /* Deep navy */
}
```

## 🙏 About Vitanova

Vitanova is a special three-day program organized by Jesus Youth seniors of SJCET. It is designed to help participants experience Jesus in a fresh, real, and unforgettable way, blending deep spiritual encounters with joyful fellowship, music, activities, and community.

---

Made with ❤️ for Vitanova 2026 | Jesus Youth SJCET
