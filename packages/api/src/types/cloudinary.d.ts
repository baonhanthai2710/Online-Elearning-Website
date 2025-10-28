declare module 'cloudinary' {
    export const v2: {
        uploader: {
            upload_stream: (
                options: Record<string, unknown>,
                callback: (error: unknown, result: { secure_url?: string } | undefined) => void
            ) => NodeJS.WritableStream;
        };
        config: (options: { cloud_name: string; api_key: string; api_secret: string }) => void;
    };

    export type UploadApiErrorResponse = {
        message?: string;
    } | undefined;

    export type UploadApiResponse = {
        secure_url: string;
    };
}
