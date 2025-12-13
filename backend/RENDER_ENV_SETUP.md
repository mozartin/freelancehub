# How to Update Environment Variables in Render

## Method 1: Via Render Dashboard (Easiest)

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Sign in to your account

2. **Find Your Backend Service**
   - Click on your backend service (e.g., `freelancehub-backend`)
   - It should be listed under "Services"

3. **Navigate to Environment Tab**
   - In your service page, click on the **"Environment"** tab
   - This is usually in the top navigation or sidebar

4. **Add/Edit Environment Variable**
   - Scroll down to see existing environment variables
   - Look for `FRONTEND_URL` (if it exists, click "Edit")
   - If it doesn't exist, click **"Add Environment Variable"**
   - Enter:
     - **Key**: `FRONTEND_URL`
     - **Value**: `https://freelancehub-tau.vercel.app`
       - ⚠️ Replace with your actual Vercel URL if different!
   - Click **"Save Changes"**

5. **Redeploy**
   - Render will automatically trigger a redeploy
   - Wait for the deployment to complete (usually 1-2 minutes)
   - Check the "Events" or "Logs" tab to see deployment progress

## Method 2: Via render.yaml File (Recommended for Version Control)

1. **Edit the file**: `backend/render.yaml`

2. **Update the FRONTEND_URL value**:
   ```yaml
   envVars:
     - key: FRONTEND_URL
       value: https://your-actual-vercel-url.vercel.app
   ```

3. **Commit and push to your repository**:
   ```bash
   git add backend/render.yaml
   git commit -m "Update FRONTEND_URL for CORS"
   git push
   ```

4. **Render will automatically detect the change and redeploy**

## How to Find Your Vercel URL

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Click on your project (`freelancehub` or similar)
3. Your production URL will be shown at the top
4. It should look like: `https://freelancehub-tau.vercel.app` or `https://your-project-name.vercel.app`

## Verify It's Working

After updating and redeploying:

1. **Check CORS is working**:
   - Open your Vercel frontend
   - Open browser DevTools (F12) → Console tab
   - Try to register/login
   - You should NOT see CORS errors anymore

2. **Check the environment variable is set**:
   - In Render dashboard → Your service → Environment tab
   - Verify `FRONTEND_URL` is listed with the correct value

## Troubleshooting

### Environment variable not showing up?
- Make sure you saved the changes
- Check that the service redeployed successfully
- Look at the "Events" tab for any errors

### Still getting CORS errors?
- Double-check the Vercel URL is correct (no trailing slash)
- Make sure the backend has been redeployed after adding the variable
- Check browser console for the exact error message
- Verify `backend/config/cors.php` includes your Vercel domain

### Need to allow multiple frontend URLs?
You can add multiple URLs in the CORS config file:
```php
// backend/config/cors.php
'allowed_origins' => [
    'http://localhost:5173',
    'https://freelancehub-tau.vercel.app',
    'https://another-domain.com',
],
```


