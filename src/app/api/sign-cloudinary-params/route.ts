/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


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
