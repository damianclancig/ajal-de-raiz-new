
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary at the module level
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function POST(request: Request) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  try {
    const body = await request.json().catch(() => ({})); // Handle empty body
    const { transformation } = body;

    const paramsToSign: { timestamp: number, transformation?: string } = { timestamp };
    
    // Only add transformation to signature if it was requested
    if (transformation) {
      paramsToSign.transformation = transformation;
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_SECRET!
    );
    
    return Response.json({ signature, timestamp });
  } catch (error) {
    console.error('Error signing Cloudinary request:', error);
    return Response.json({ error: 'Failed to sign request' }, { status: 500 });
  }
}
