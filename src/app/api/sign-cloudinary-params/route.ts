
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
    const { transformation, folder } = body;

    const paramsToSign: { timestamp: number, transformation?: string, folder?: string } = { timestamp };
    
    // Only add transformation to signature if it was requested
    if (transformation) {
      paramsToSign.transformation = transformation;
    }
    
    // Only add folder to signature if it was requested
    if (folder) {
        paramsToSign.folder = folder;
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_SECRET!
    );
    
    // Return transformation in the response if it was used
    const responseBody: { signature: string; timestamp: number; transformation?: string } = {
      signature,
      timestamp,
    };

    if (transformation) {
      responseBody.transformation = transformation;
    }

    return Response.json(responseBody);
  } catch (error) {
    console.error('Error signing Cloudinary request:', error);
    return Response.json({ error: 'Failed to sign request' }, { status: 500 });
  }
}
