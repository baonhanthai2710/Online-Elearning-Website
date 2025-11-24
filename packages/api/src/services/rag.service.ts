import { Ollama } from 'ollama';
import { vectorStoreService } from './vectorStore.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * RAG (Retrieval-Augmented Generation) Service
 * Combines vector search with LLM generation
 */
class RAGService {
    private ollama: Ollama;
    private model: string;

    constructor() {
        // Use IPv4 to avoid IPv6 connection issues
        this.ollama = new Ollama({ host: 'http://127.0.0.1:11434' });
        this.model = 'gemma3:4b'; // Using gemma3:4b model
    }

    /**
     * Initialize vector store with course data
     */
    async initializeVectorStore(): Promise<void> {
        console.log('🔄 Initializing vector store with course data...');

        // Clear existing documents
        vectorStoreService.clear();

        // Fetch all courses with related data
        const courses = await prisma.course.findMany({
            include: {
                teacher: {
                    select: {
                        firstName: true,
                        lastName: true,
                        username: true,
                    },
                },
                category: true,
                modules: {
                    include: {
                        contents: true,
                    },
                },
            },
        });

        console.log(`📚 Found ${courses.length} courses to index`);

        // Create documents for each course
        for (const course of courses) {
            // 1. Course overview document
            const courseContent = `
Khóa học: ${course.title}
Giảng viên: ${course.teacher.firstName} ${course.teacher.lastName} (${course.teacher.username})
Danh mục: ${course.category.name}
Mô tả: ${course.description}
Giá: ${course.price === 0 ? 'Miễn phí' : `${course.price} VND`}
            `.trim();

            await vectorStoreService.addDocument(courseContent, {
                courseId: course.id,
                courseTitle: course.title,
                type: 'course',
                teacherName: `${course.teacher.firstName} ${course.teacher.lastName}`,
                category: course.category.name,
                price: course.price,
            });

            // 2. Module documents
            for (const module of course.modules) {
                const moduleContent = `
Khóa học: ${course.title}
Chương: ${module.title}
Thứ tự: ${module.order}
                `.trim();

                await vectorStoreService.addDocument(moduleContent, {
                    courseId: course.id,
                    courseTitle: course.title,
                    type: 'module',
                    moduleTitle: module.title,
                    moduleOrder: module.order,
                });

                // 3. Content documents
                for (const content of module.contents) {
                    const contentText = `
Khóa học: ${course.title}
Chương: ${module.title}
Bài học: ${content.title}
Loại: ${content.contentType}
Thứ tự: ${content.order}
                    `.trim();

                    await vectorStoreService.addDocument(contentText, {
                        courseId: course.id,
                        courseTitle: course.title,
                        type: 'content',
                        moduleTitle: module.title,
                        contentTitle: content.title,
                        contentType: content.contentType,
                    });
                }
            }
        }

        vectorStoreService.setInitialized(true);
        console.log(`✅ Vector store initialized with ${vectorStoreService.getDocumentCount()} documents`);
    }

    /**
     * Generate answer using RAG pipeline
     */
    async generateAnswer(
        question: string,
        courseId?: number
    ): Promise<{
        answer: string;
        sources: Array<{
            courseTitle: string;
            content: string;
            score: number;
        }>;
    }> {
        // Check if vector store is initialized
        if (!vectorStoreService.getIsInitialized()) {
            await this.initializeVectorStore();
        }

        // 1. Retrieve relevant documents
        const searchResults = await vectorStoreService.search(
            question,
            5,
            courseId ? { courseId } : undefined
        );

        // 2. Prepare context from retrieved documents
        const context = searchResults
            .map((result, idx) => `[Tài liệu ${idx + 1}]\n${result.document.content}`)
            .join('\n\n');

        // 3. Create prompt for LLM
        const prompt = `Bạn là một trợ lý AI thông minh cho nền tảng học trực tuyến E-Learning. Nhiệm vụ của bạn là trả lời câu hỏi của người dùng dựa trên thông tin về các khóa học.

Thông tin khóa học:
${context}

Câu hỏi: ${question}

Hãy trả lời câu hỏi một cách chính xác, hữu ích và thân thiện. Nếu thông tin không có trong tài liệu, hãy nói rõ và đề xuất người dùng tìm hiểu thêm. Trả lời bằng tiếng Việt.

Trả lời:`;

        // 4. Generate answer using LLM
        const response = await this.ollama.generate({
            model: this.model,
            prompt: prompt,
            stream: false,
        });

        // 5. Prepare sources
        const sources = searchResults.map((result) => ({
            courseTitle: result.document.metadata.courseTitle,
            content: result.document.content,
            score: result.score,
        }));

        return {
            answer: response.response,
            sources,
        };
    }

    /**
     * Stream answer using RAG pipeline
     */
    async *streamAnswer(
        question: string,
        courseId?: number
    ): AsyncGenerator<string, void, unknown> {
        // Check if vector store is initialized
        if (!vectorStoreService.getIsInitialized()) {
            await this.initializeVectorStore();
        }

        // 1. Retrieve relevant documents
        const searchResults = await vectorStoreService.search(
            question,
            5,
            courseId ? { courseId } : undefined
        );

        // 2. Prepare context
        const context = searchResults
            .map((result, idx) => `[Tài liệu ${idx + 1}]\n${result.document.content}`)
            .join('\n\n');

        // 3. Create prompt
        const prompt = `Bạn là một trợ lý AI thông minh cho nền tảng học trực tuyến E-Learning. Nhiệm vụ của bạn là trả lời câu hỏi của người dùng dựa trên thông tin về các khóa học.

Thông tin khóa học:
${context}

Câu hỏi: ${question}

Hãy trả lời câu hỏi một cách chính xác, hữu ích và thân thiện. Nếu thông tin không có trong tài liệu, hãy nói rõ và đề xuất người dùng tìm hiểu thêm. Trả lời bằng tiếng Việt.

Trả lời:`;

        // 4. Stream response
        const stream = await this.ollama.generate({
            model: this.model,
            prompt: prompt,
            stream: true,
        });

        for await (const chunk of stream) {
            yield chunk.response;
        }
    }
}

export const ragService = new RAGService();

