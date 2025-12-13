# Quick Start: Deploy to Vercel

Follow these steps to deploy your frontend to Vercel in minutes!

## Step 1: Prepare Your Backend URL

First, make sure you know your backend URL. If you've already deployed to Render, it should be something like:
- `https://freelancehub-backend.onrender.com`

Your API base URL will be: `https://freelancehub-backend.onrender.com/api`

## Step 2: Sign Up / Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** (or **"Log In"** if you have an account)
3. Sign up with **GitHub** (recommended) - this makes deployments automatic

## Step 3: Create New Project

1. After logging in, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **`freelancehub`** and click **"Import"**

## Step 4: Configure Project Settings

Vercel will auto-detect Vite, but you need to configure:

### Root Directory
- Click **"Edit"** next to "Root Directory"
- Change from `/` to **`frontend`**
- This tells Vercel where your frontend code is

### Build Settings (should auto-detect, but verify):
- **Framework Preset**: Vite (auto-detected)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Environment Variables
**This is important!** Click **"Environment Variables"** and add:

- **Key**: `VITE_API_URL`
- **Value**: `https://your-backend-url.onrender.com/api`
  - Replace `your-backend-url` with your actual Render backend URL
  - Example: `https://freelancehub-backend.onrender.com/api`

Click **"Add"** and then **"Save"**

## Step 5: Deploy!

1. Click **"Deploy"** button at the bottom
2. Wait 1-2 minutes for the build to complete
3. 🎉 Your app will be live!

## Step 6: Get Your Frontend URL

After deployment, Vercel will give you a URL like:
- `https://freelancehub-xyz123.vercel.app`

**Save this URL!** You'll need it for CORS configuration.

## Step 7: Update Backend CORS (Important!)

Your backend needs to allow requests from your Vercel frontend URL.

### Option A: If using Render.com for backend

1. Go to your Render dashboard
2. Find your backend service
3. Go to **Environment** tab
4. Add environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-vercel-url.vercel.app`
5. Update your Laravel CORS config (if needed)

### Option B: Update Laravel CORS manually

In your backend, update `config/cors.php`:

```php
'allowed_origins' => [
    'https://your-vercel-url.vercel.app',
    // Add your Vercel URL here
],
```

Or set it to allow all origins in development:
```php
'allowed_origins' => ['*'], // For development only
```

## Step 8: Test Your Deployment

1. Visit your Vercel URL
2. Open browser DevTools (F12) → Console tab
3. Try logging in or browsing jobs
4. Check for any CORS errors or API connection issues

## Automatic Deployments

Once set up, Vercel will automatically deploy:
- ✅ Every push to your main branch
- ✅ Every pull request (creates preview deployments)

## Troubleshooting

### Build fails?
- Check the build logs in Vercel dashboard
- Make sure `VITE_API_URL` is set correctly
- Verify all dependencies are in `package.json`

### API calls fail?
- Check browser console for errors
- Verify `VITE_API_URL` environment variable is set
- Make sure backend CORS allows your Vercel domain
- Check that backend is running and accessible

### 404 errors on routes?
- The `vercel.json` file should handle this automatically
- If not, verify the rewrites configuration

### Environment variable not working?
- Make sure variable name starts with `VITE_`
- Redeploy after adding environment variables
- Check that you're using `import.meta.env.VITE_API_URL` in code

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Check build logs in Vercel dashboard
- Check browser console for runtime errors

---

**That's it!** Your frontend should now be live on Vercel! 🚀

