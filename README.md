# Rank It
### *Real* Opinions, *Real* UNSW experience, *Real* rankings.

Rank It is a website designed for UNSW students to rank and review courses, bathrooms, food, colleges, and more. By providing real-time feedback, Rank It helps students make informed choices, from selecting courses to finding the cleanest bathrooms or best food spots.

### Features
- Post your complaint
- Rate out of 5
- Include images and descriptions
- Like or dislike a post 
- Comment and reply on existing posts
  
![chrome_WGmRVHAAen-ezgif com-optimize](https://github.com/user-attachments/assets/c9fcebf5-b174-44cd-8869-3a215dfb1dc5)


![chrome_0HaQy5dVo7-ezgif com-optimize](https://github.com/user-attachments/assets/f2181de8-be63-42f2-87d5-5dd54496c61b)

![chrome_1o1L6kx5Vq](https://github.com/user-attachments/assets/e871a3a6-d3a1-491d-ac0c-4976ced82b74)

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
