import { Ollama } from 'ollama';

/**
 * Service for generating embeddings using Ollama
 */
class EmbeddingService {
    private ollama: Ollama;
    private model: string;

    constructor() {
        // Initialize Ollama client (use IPv4 to avoid IPv6 connection issues)
        this.ollama = new Ollama({ host: 'http://127.0.0.1:11434' });
        this.model = 'gemma3:4b'; // Using gemma3:4b model
    }

    /**
     * Generate embedding for a single text
     */
    async generateEmbedding(text: string): Promise<number[]> {
        try {
            const response = await this.ollama.embeddings({
                model: this.model,
                prompt: text,
            });

            return response.embedding;
        } catch (error) {
            console.error('Error generating embedding:', error);
            throw new Error('Failed to generate embedding');
        }
    }

    /**
     * Generate embeddings for multiple texts
     */
    async generateEmbeddings(texts: string[]): Promise<number[][]> {
        const embeddings: number[][] = [];

        for (const text of texts) {
            const embedding = await this.generateEmbedding(text);
            embeddings.push(embedding);
        }

        return embeddings;
    }

    /**
     * Calculate cosine similarity between two vectors
     */
    cosineSimilarity(a: number[], b: number[]): number {
        if (a.length !== b.length) {
            throw new Error('Vectors must have the same length');
        }

        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}

export const embeddingService = new EmbeddingService();

