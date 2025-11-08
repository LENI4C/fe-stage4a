# Supabase OAuth Redirect URL Configuration

## Important: Fixing localhost Redirects

If you're seeing redirects to `localhost:3000` after authentication, you need to update the redirect URLs in your Supabase dashboard.

## Steps to Fix:

### 1. Update Supabase Redirect URLs

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. In the **Redirect URLs** section, add:

    **For Development:**

    ```
    http://localhost:3000/auth/callback
    ```

    **For Production:**

    ```
    https://your-production-domain.com/auth/callback
    ```

5. Click **Save**

### 2. Update Google OAuth (if using Google Sign-in)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your OAuth 2.0 Client
3. Add to **Authorized redirect URIs**:
    ```
    https://your-project-ref.supabase.co/auth/v1/callback
    ```
    (This is your Supabase project URL, not your app URL)

### 3. Set Environment Variable

In your deployment platform (Vercel/Netlify), add:

```
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

**Important:** Replace `your-production-domain.com` with your actual production URL.

### 4. Common Issues

**Issue:** Redirects to `localhost:3000` in production

-   **Solution:** Make sure `NEXT_PUBLIC_SITE_URL` is set in your production environment variables
-   **Solution:** Verify the redirect URL in Supabase includes your production domain

**Issue:** Code parameter appears on home page (`/?code=...`)

-   **Solution:** The app will automatically redirect to `/auth/callback`, but you should still update Supabase redirect URLs to point directly to `/auth/callback`

**Issue:** "Invalid redirect URL" error

-   **Solution:** The redirect URL in your code must exactly match one of the URLs in Supabase's allowed list
-   **Solution:** Check for trailing slashes - they must match exactly

## Testing

After updating:

1. Clear your browser cache
2. Try logging in again
3. Verify you're redirected to your production domain, not localhost
