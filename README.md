# Multiplayer 3D Builder - HNG Stage 4

A real-time collaborative 3D building experience inspired by Minecraft and Roblox Studio. Built with Next.js, TypeScript, React Three Fiber, and Supabase.

![Multiplayer 3D Builder](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![React Three Fiber](https://img.shields.io/badge/React%20Three%20Fiber-9.4-000000?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-2.80-3ECF8E?style=for-the-badge&logo=supabase)

## 🎮 Features

### Authentication System

-   ✅ Email + Password Signup & Signin
-   ✅ Google OAuth Signin
-   ✅ Persistent login sessions
-   ✅ User profile display in header

### Multiplayer 3D Builder

-   ✅ Shared 3D world for all authenticated users
-   ✅ Real-time object synchronization (add, move, delete)
-   ✅ Live player list with presence tracking
-   ✅ Camera controls (orbit, zoom, pan)
-   ✅ Unique visual identity per user (color-coded)

### 3D World Actions

-   ✅ **Add Object**: Create cubes or spheres at click points
-   ✅ **Move Object**: Drag and reposition objects (via selection and update)
-   ✅ **Delete Object**: Select and remove items
-   ✅ **Real-time Sync**: All interactions broadcast instantly

### Visual Enhancements

-   ✅ Beautiful skybox with gradient background
-   ✅ Dynamic lighting setup (ambient, directional, point lights)
-   ✅ Smooth animations (rotating and floating objects)
-   ✅ User indicators with name tags and colored avatars
-   ✅ Grid floor with contact shadows
-   ✅ Modern, responsive UI with glassmorphism effects

### Scene Persistence

-   ✅ Automatic save/load via Supabase database
-   ✅ Scene state persists across sessions
-   ✅ Real-time updates via Supabase Realtime

## 🛠️ Tech Stack

-   **Frontend Framework**: Next.js 16 (App Router) with TypeScript
-   **3D Library**: React Three Fiber + Three.js + Drei
-   **Realtime Engine**: Supabase Realtime
-   **Auth & Storage**: Supabase
-   **State Management**: Zustand
-   **Styling**: Tailwind CSS 4
-   **Animations**: Framer Motion

## 📋 Prerequisites

-   Node.js 18+ and npm
-   A Supabase account (free tier works)
-   Git

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd fe-stage4a
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [Supabase](https://app.supabase.com) and create a new project
2. Wait for the project to be fully provisioned
3. Go to **Settings** → **API** and copy:
    - Project URL
    - `anon` public key

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

**Example:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

**Note:** `NEXT_PUBLIC_SITE_URL` is optional but recommended for production. It ensures OAuth redirects work correctly. If not set, the app will try to detect the URL from request headers.

### 5. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the migration script from `supabase/migrations/001_initial_schema.sql`

This will create:

-   `scene_objects` table for storing 3D objects
-   Row Level Security (RLS) policies
-   Realtime subscriptions
-   Automatic timestamp updates

### 6. Enable Google OAuth (Optional but Recommended)

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Add your OAuth credentials:
    - Client ID
    - Client Secret
4. Add authorized redirect URL: `https://your-project-url.supabase.co/auth/v1/callback`

### 7. Enable Realtime

**Important:** Supabase Realtime is enabled by default for all projects. The migration script automatically adds the `scene_objects` table to the Realtime publication.

If you need to manually enable Realtime for a table:

1. In Supabase dashboard, go to **Database** → **Replication** (or **Database** → **Publications** in newer versions)
2. The `supabase_realtime` publication should already exist
3. The migration script (`001_initial_schema.sql`) automatically adds `scene_objects` to this publication
4. If the migration didn't work, you can manually run:
    ```sql
    ALTER PUBLICATION supabase_realtime ADD TABLE scene_objects;
    ```

**Note:** The "Replication" section in Supabase dashboard is for database replication (read replicas), not Realtime subscriptions. Realtime subscriptions work via PostgreSQL's logical replication and are enabled through publications, which is handled automatically by the migration script.

### 8. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

### Getting Started

1. **Sign Up/Login**:

    - Create an account with email/password, or
    - Sign in with Google

2. **Enter the 3D World**:

    - You'll be automatically redirected to the main scene
    - Your name will appear in the header

3. **Add Objects**:

    - Click anywhere on the ground plane to add a cube
    - Use the **+ Cube** or **+ Sphere** buttons in the control panel
    - Objects appear instantly for all connected users

4. **Interact with Objects**:

    - Click on any object to select it (highlighted with wireframe)
    - Click **Delete** to remove the selected object
    - All changes sync in real-time

5. **Navigate**:

    - **Orbit**: Click and drag to rotate the camera
    - **Zoom**: Scroll wheel or pinch gesture
    - **Pan**: Right-click and drag (or middle mouse button)

6. **View Other Players**:
    - See all online players in the left sidebar
    - Each player has a unique color and name tag
    - Player indicators appear in the 3D scene

### Controls

-   **Mouse/Trackpad**:

    -   Left Click: Select object / Add object (on ground)
    -   Drag: Orbit camera
    -   Scroll: Zoom in/out
    -   Right Click + Drag: Pan camera

-   **Touch (Mobile)**:
    -   Tap: Select/Add object
    -   Pinch: Zoom
    -   Drag: Orbit

## 📁 Project Structure

```
fe-stage4a/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication routes
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main 3D world page
├── components/            # React components
│   ├── Scene3D.tsx       # Main 3D scene component
│   ├── Header.tsx         # Navigation header
│   ├── PlayerList.tsx     # Online players sidebar
│   └── ControlsPanel.tsx  # Object controls
├── hooks/                 # Custom React hooks
│   ├── useRealtimeSync.ts # Real-time synchronization
│   └── useSceneActions.ts # Scene manipulation actions
├── lib/                   # Utility libraries
│   └── supabase/          # Supabase client setup
├── store/                 # Zustand state management
│   ├── useAuthStore.ts    # Authentication state
│   └── useSceneStore.ts   # Scene state
├── supabase/              # Database migrations
│   └── migrations/        # SQL migration files
└── types/                 # TypeScript type definitions
```

## 🔒 Security Notes

-   All database operations use Row Level Security (RLS)
-   Only authenticated users can access the application
-   Environment variables are never committed to version control
-   Supabase handles authentication securely with JWT tokens

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `NEXT_PUBLIC_SITE_URL` (set to your Vercel deployment URL, e.g., `https://your-app.vercel.app`)
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Import your repository in [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables (same as above)

### Important for Production

-   **Set Environment Variables:**
    - Add `NEXT_PUBLIC_SITE_URL` to your deployment platform's environment variables
    - Set it to your production domain (e.g., `https://your-app.vercel.app`)
    - This ensures OAuth redirects work correctly after login

-   **Update Supabase Redirect URLs:**
    - Go to Supabase Dashboard → Authentication → URL Configuration
    - Add your production domain to "Redirect URLs"
    - Add: `https://your-production-domain.com/auth/callback`
    - For Google OAuth, also add it in Google Cloud Console

-   **Verify Realtime:**
    - Ensure Realtime is enabled in your Supabase project
    - Test that objects sync in real-time across multiple browser tabs

-   **Test Authentication:**
    - Test email/password login
    - Test Google OAuth (if enabled)
    - Verify redirects go to production URL, not localhost

## 🐛 Troubleshooting

### Objects not syncing in real-time

-   Verify the `scene_objects` table is added to the `supabase_realtime` publication:
    ```sql
    SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
    ```
-   If the table is missing, run:
    ```sql
    ALTER PUBLICATION supabase_realtime ADD TABLE scene_objects;
    ```
-   Check browser console for WebSocket connection errors
-   Ensure your Supabase project has Realtime enabled (it's enabled by default)
-   Check that your Supabase project URL and anon key are correct in `.env.local`

### Authentication not working

-   Verify environment variables are set correctly
-   Check Supabase project URL and anon key
-   Ensure redirect URLs are configured in Supabase dashboard

### 3D scene not loading

-   Check browser console for errors
-   Ensure WebGL is enabled in your browser
-   Try a different browser (Chrome/Firefox recommended)

### Database errors

-   Verify the migration script ran successfully
-   Check RLS policies are correctly set
-   Ensure you're authenticated before accessing the scene

## 📝 Development

### Adding New Features

1. **New Object Types**: Extend the `SceneObject` type in `types/index.ts`
2. **New Actions**: Add methods to `useSceneActions.ts`
3. **UI Components**: Create new components in `components/`
4. **State**: Add new stores in `store/` if needed

### Code Style

-   TypeScript strict mode enabled
-   ESLint configured with Next.js rules
-   Prettier formatting (recommended)

## 🤝 Contributing

This is a Stage 4 project for HNG Tech. For improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is part of the HNG Tech internship program.

## 🙏 Acknowledgments

-   HNG Tech for the challenge
-   Supabase for the amazing backend platform
-   React Three Fiber community
-   Three.js contributors

---

**Built with ❤️ for HNG Stage 4**
