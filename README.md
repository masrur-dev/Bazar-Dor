# বাজার দর

বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর দেখার Next.js অ্যাপ। এতে পণ্য ও ক্যাটাগরি ব্রাউজ, সার্চ, দামের ওঠানামা, পণ্যের বিস্তারিত, Supabase email/Google/GitHub auth, পাসওয়ার্ড রিসেট, এবং প্রোফাইল পেজ রয়েছে।

## চালু করা

1. Node.js 20.19+ ইনস্টল করুন।
2. `.env.example` কপি করে `.env.local` বানান।
3. Supabase project URL ও publishable key বসান।
4. Supabase Authentication-এর URL configuration-এ `http://localhost:3000/**` এবং production-এর callback URL যোগ করুন।
5. Supabase Auth URL Configuration-এর redirect allowlist-এ `http://localhost:3000/**` যোগ করুন। Auth Providers-এ Google ও GitHub চালু করুন। Google Cloud Console এবং GitHub OAuth app-এ Supabase-এর callback URL (`https://<project-ref>.supabase.co/auth/v1/callback`) দিন; OAuth Client ID/Secret Supabase provider settings-এ বসান.
6. `npm install` এবং `npm run dev` চালান। অ্যাপটি `http://localhost:3000`-এ খুলবে।

`BAZARDOR_API_URL` বাজারদরের API base URL বদলাতে ব্যবহার করা যায়। `NEXT_PUBLIC_SITE_URL` production-এর পূর্ণ origin দিয়ে সেট করুন, যেমন `https://example.com`।

## Commands

- `npm run dev` — development server
- `npm run lint` — ESLint
- `npm run build` — production build
- `npm start` — production server চালানো
