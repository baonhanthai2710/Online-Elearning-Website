import { v2 as cloudinary } from 'cloudinary';

type MulterFile = {
    buffer: Buffer;
    originalname?: string;
    mimetype?: string;
};

let isConfigured = false;

function ensureCloudinaryConfig(): void {
    if (isConfigured) {
        return;
    }

    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        throw new Error('Cloudinary environment variables are not fully defined');
    }

    cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
    });

    isConfigured = true;
}

export async function uploadFileToCloudinary(file: MulterFile): Promise<string> {
    ensureCloudinaryConfig();

    return new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error: unknown, result: { secure_url?: string } | undefined) => {
                if (error || !result) {
                    reject(error ?? new Error('Cloudinary upload failed without a response'));
                    return;
                }

                if (!result.secure_url) {
                    reject(new Error('Uploaded asset did not return a secure_url'));
                    return;
                }

                resolve(result.secure_url);
            }
        );

        upload.end(file.buffer);
    });
}
