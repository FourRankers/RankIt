# Rank It
### *Real* Opinions, *Real* UNSW experience, *Real* rankings.

Rank It is a website designed for UNSW students to rank and review courses, bathrooms, food, colleges, and more. By providing real-time feedback, Rank It helps students make informed choices, from selecting courses to finding the cleanest bathrooms or best food spots.

### Features
- Post your complaint
- Rate out of 5
- Include images and descriptions
- Like or dislike a post 
- Comment and reply on existing posts
  
![ezgif-481c843b554ca6](https://github.com/user-attachments/assets/0e7a8b9c-6ef9-443d-9d73-5a3a28a4029d)

![ezgif-43ea8838d13952](https://github.com/user-attachments/assets/db856ac4-655f-4e9e-844a-df5b6c8fabbb)

![ezgif-43149e6812c66f](https://github.com/user-attachments/assets/5e993701-5aa4-4410-9aae-fa3c71b74cb7)

## Getting Started

### Frontend

First enter the frontend directory, install all the dependencies:
```bash
cd frontend
npm install
```

Second, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Backend

Enter the backend directory, and install all the dependencies:

```bash
cd backend
npm install
```
Second, run the server:

```bash
npm run serve
```

env file:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email@example.com
PORT=8080
SUPABASE_URL=https://your-supabase-url.supabase.co/
SUPABASE_ANON_KEY=your-supabase-anon-key
```
