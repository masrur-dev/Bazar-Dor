# বাজার দর (Bazar Dor)

### বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দৈনিক বাজারদর

বাজার দর একটি ওয়েবভিত্তিক অ্যাপ্লিকেশন, যেখানে বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বর্তমান দাম এবং আগের দামের তুলনা সহজে দেখা যায়। চাল, ডাল, তেল, শাকসবজি ও অন্যান্য পণ্যের দাম এক জায়গায় দেখাই এই প্রজেক্টের মূল লক্ষ্য।

## Features

- দৈনিক বাজারদর দেখা
- বিভিন্ন পণ্যের ক্যাটাগরি অনুযায়ী দাম খোঁজা
- বর্তমান ও আগের দামের তুলনা
- পণ্যের বিস্তারিত তথ্য দেখা
- বাংলা ভাষায় সহজ ও ব্যবহারবান্ধব ইন্টারফেস
- Responsive design
- Google authentication integration (যদি কনফিগার করা থাকে)

## Technologies Used

- Next.js
- React
- JavaScript
- Tailwind CSS
- DaisyUI
- REST API
- Supabase Authentication (যদি ব্যবহৃত হয়)

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the project folder

```bash
cd bazar-dor
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

প্রজেক্টের root directory-তে `.env.local` ফাইল তৈরি করে প্রয়োজনীয় environment variables যোগ করো।

উদাহরণ:

```env
BAZARDOR_API_URL=YOUR_API_BASE_URL
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

তোমার কোডে যে environment variable-গুলো ব্যবহার করা হয়েছে, সেগুলোর নামের সঙ্গে মিলিয়ে নিও। আসল secret বা private key কখনো GitHub-এ প্রকাশ করবে না।

### 5. Start the development server

```bash
npm run dev
```

তারপর ব্রাউজারে খোলো:

```text
http://localhost:3000
```

## Project Structure

```text
bazar-dor/
├── public/
├── src/
│   ├── app/
│   │   ├── about/
│   │   ├── product/
│   │   └── page.js
│   ├── components/
│   └── lib/
│       ├── api.js
│       └── ProductMarquee.jsx
├── .env.example
├── package.json
└── README.md
```

## Live Demo

Coming soon.

## Purpose

এই প্রজেক্টের উদ্দেশ্য হলো বাংলাদেশের সাধারণ মানুষের জন্য নিত্যপ্রয়োজনীয় পণ্যের বাজারদর সহজে খুঁজে পাওয়ার একটি সুবিধাজনক ডিজিটাল প্ল্যাটফর্ম তৈরি করা।

## Developer

**Masrur**  
Frontend Developer | Learning Next.js and React

GitHub: [masrur-dev](https://github.com/masrur-dev)

---

*Made with Next.js and React.*
