# Deploying Cloudflare Worker for Image Uploads

## Prerequisites
1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

## Deployment Steps

1. **Deploy the Worker:**
```bash
wrangler deploy
```

2. **Get your Worker URL:**
After deployment, you'll get a URL like: `https://precar-upload-worker.your-subdomain.workers.dev`

3. **Update the client code:**
Replace `https://precar-upload-worker.your-subdomain.workers.dev` in `src/app/admin/products/add/page.tsx` with your actual Worker URL.

## Environment Variables
The Worker uses these environment variables (configured in wrangler.toml):
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
- `MY_BUCKET`: R2 bucket binding (configured automatically)

## Benefits of this approach:
- ✅ No CORS issues
- ✅ Handles large files
- ✅ Better for production
- ✅ No Vercel request size limits
- ✅ Direct upload to R2

## Testing
After deployment, test the upload functionality. The Worker will:
1. Accept file uploads via FormData
2. Upload directly to your R2 bucket
3. Return the public URL of the uploaded file
4. Handle CORS properly 