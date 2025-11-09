import type { RequestHandler } from 'express';

declare module 'multer' {
    type StorageEngine = unknown;

    interface MulterLimits {
        fileSize?: number;
    }

    interface MulterOptions {
        storage?: StorageEngine;
        limits?: MulterLimits;
    }

    interface MulterInstance {
        single(fieldName: string): RequestHandler;
    }

    function multer(options?: MulterOptions): MulterInstance;

    namespace multer {
        function memoryStorage(): StorageEngine;
    }

    export = multer;
}
