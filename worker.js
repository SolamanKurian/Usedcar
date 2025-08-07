// Cloudflare Worker for direct R2 uploads and image serving
export default {
  async fetch(request, env) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Handle GET requests for serving images
    if (request.method === 'GET') {
      try {
        const url = new URL(request.url);
        const path = url.pathname;
        
        // Extract the key from the URL path
        // URLs like: https://worker-domain.com/products/1234567890-image.jpg
        // or: https://worker-domain.com/posters/1234567890-image.jpg
        const key = path.substring(1); // Remove leading slash
        
        if (!key) {
          return new Response('No key provided', { status: 400 });
        }

        // Get the object from R2
        const object = await env.MY_BUCKET.get(key);
        
        if (!object) {
          return new Response('Image not found', { status: 404 });
        }

        // Return the image with appropriate headers
        return new Response(object.body, {
          headers: {
            'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        console.error('Error serving image:', error);
        return new Response('Internal server error', { status: 500 });
      }
    }

    if (request.method === 'POST') {
      try {
        const formData = await request.formData();
        const file = formData.get('file');
        const type = formData.get('type'); // Get the type parameter
        
        if (!file) {
          return new Response(JSON.stringify({ error: 'No file provided' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name}`;
        
        // Determine the folder based on type parameter
        let folder = 'products/'; // Default folder
        if (type === 'poster') {
          folder = 'posters/';
        }
        
        const key = `${folder}${fileName}`;

        // Upload to R2
        await env.MY_BUCKET.put(key, file.stream(), {
          httpMetadata: {
            contentType: file.type,
          },
        });

        // Return the worker URL for serving the image
        const baseUrl = new URL(request.url);
        const fileUrl = `${baseUrl.protocol}//${baseUrl.host}/${key}`;
        
        // Debug: Log the values to see what's happening
        console.log('Debug values:', {
          bucketName: env.CLOUDFLARE_R2_BUCKET_NAME,
          accountId: env.CLOUDFLARE_ACCOUNT_ID,
          type: type,
          folder: folder,
          key: key,
          fileUrl: fileUrl,
          originalUrl: request.url
        });
        
        return new Response(JSON.stringify({ fileUrl }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    return new Response('Method not allowed', { status: 405 });
  },
}; 