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

function getResourceType(mimetype?: string): 'video' | 'raw' | 'image' | 'auto' {
    if (!mimetype) return 'auto';
    
    // Documents should use 'raw' resource type
    if (mimetype === 'application/pdf' || 
        mimetype.includes('document') || 
        mimetype.includes('msword') ||
        mimetype.includes('spreadsheet') ||
        mimetype.includes('presentation')) {
        return 'raw';
    }
    
    // Videos
    if (mimetype.startsWith('video/')) {
        return 'video';
    }
    
    // Images
    if (mimetype.startsWith('image/')) {
        return 'image';
    }
    
    return 'auto';
}

function getFileExtension(filename?: string, mimetype?: string): string {
    // Try to get extension from filename
    if (filename) {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext && ext.length <= 5) return ext;
    }
    
    // Fallback to mimetype
    if (mimetype) {
        const mimeToExt: Record<string, string> = {
            'application/pdf': 'pdf',
            'application/msword': 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'application/vnd.ms-excel': 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
            'application/vnd.ms-powerpoint': 'ppt',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
            'video/mp4': 'mp4',
            'video/webm': 'webm',
            'video/quicktime': 'mov',
        };
        return mimeToExt[mimetype] || '';
    }
    
    return '';
}

export async function uploadFileToCloudinary(file: MulterFile): Promise<string> {
    ensureCloudinaryConfig();

    const resourceType = getResourceType(file.mimetype);
    const extension = getFileExtension(file.originalname, file.mimetype);
    
    // Generate unique public_id with extension for raw files
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    const publicId = extension ? `elearning/${timestamp}_${randomStr}.${extension}` : undefined;

    return new Promise((resolve, reject) => {
        const uploadOptions: Record<string, unknown> = { 
            resource_type: resourceType,
        };
        
        // For raw files (documents), set public_id with extension
        if (resourceType === 'raw' && publicId) {
            uploadOptions.public_id = publicId;
            uploadOptions.use_filename = false;
        }

        const upload = cloudinary.uploader.upload_stream(
            uploadOptions,
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
