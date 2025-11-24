import { Ollama } from 'ollama';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Simple Chatbot Service (without embeddings/RAG)
 * Just loads all course data and uses LLM with full context
 */
class SimpleChatbotService {
    private ollama: Ollama;
    private model: string;
    private courseContext: string = '';
    private isInitialized: boolean = false;

    constructor() {
        this.ollama = new Ollama({ host: 'http://127.0.0.1:11434' });
        this.model = 'gemma3:4b';
    }

    /**
     * Load all course data into context
     */
    async initialize(): Promise<void> {
        console.log('🔄 Loading course data for chatbot...');

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

        console.log(`📚 Found ${courses.length} courses`);

        // Build context string with all course information
        const contextParts: string[] = [];

        for (const course of courses) {
            const teacherName = `${course.teacher.firstName || ''} ${course.teacher.lastName || ''}`.trim() || course.teacher.username;
            
            let courseInfo = `
=== KHÓA HỌC: ${course.title} ===
- ID: ${course.id}
- Giảng viên: ${teacherName}
- Danh mục: ${course.category.name}
- Mô tả: ${course.description}
- Giá: ${course.price === 0 ? 'Miễn phí' : `${course.price} VND`}
- Số chương: ${course.modules.length}
`;

            // Add module information
            if (course.modules.length > 0) {
                courseInfo += '\nCác chương học:\n';
                for (const module of course.modules) {
                    courseInfo += `  ${module.order}. ${module.title} (${module.contents.length} bài học)\n`;
                    
                    // Add content titles
                    for (const content of module.contents) {
                        courseInfo += `     - ${content.title} (${content.contentType})\n`;
                    }
                }
            }

            contextParts.push(courseInfo);
        }

        this.courseContext = contextParts.join('\n');
        this.isInitialized = true;
        
        console.log('✅ Chatbot initialized successfully!');
    }

    /**
     * Generate answer using LLM with full course context
     */
    async generateAnswer(question: string): Promise<string> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const prompt = `Bạn là trợ lý AI thân thiện cho E-Learning Platform. 

DỮ LIỆU KHÓA HỌC HIỆN CÓ:
${this.courseContext}

QUY TẮC:
1. Với lời chào/câu hỏi chung → Trả lời tự nhiên, thân thiện, giới thiệu bạn có thể giúp gì
2. Với câu hỏi về khóa học → CHỈ dựa vào DỮ LIỆU TRÊN, không bịa thêm
3. KHÔNG tạo link giả (example.com)
4. Nếu khóa học không tồn tại → Nói thẳng "chưa có"
5. Trả lời ngắn gọn, chính xác, tiếng Việt

CÂU HỎI: ${question}

TRẢ LỜI:`;

        try {
            const response = await this.ollama.generate({
                model: this.model,
                prompt: prompt,
                stream: false,
            });

            return response.response;
        } catch (error) {
            console.error('Error generating answer:', error);
            throw new Error('Không thể tạo câu trả lời. Vui lòng thử lại sau.');
        }
    }

    /**
     * Stream answer using LLM
     */
    async *streamAnswer(question: string): AsyncGenerator<string, void, unknown> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const prompt = `Bạn là trợ lý AI thân thiện cho E-Learning Platform. 

DỮ LIỆU KHÓA HỌC HIỆN CÓ:
${this.courseContext}

QUY TẮC:
1. Với lời chào/câu hỏi chung → Trả lời tự nhiên, thân thiện, giới thiệu bạn có thể giúp gì
2. Với câu hỏi về khóa học → CHỈ dựa vào DỮ LIỆU TRÊN, không bịa thêm
3. KHÔNG tạo link giả (example.com)
4. Nếu khóa học không tồn tại → Nói thẳng "chưa có"
5. Trả lời ngắn gọn, chính xác, tiếng Việt

CÂU HỎI: ${question}

TRẢ LỜI:`;

        try {
            const stream = await this.ollama.generate({
                model: this.model,
                prompt: prompt,
                stream: true,
            });

            for await (const chunk of stream) {
                yield chunk.response;
            }
        } catch (error) {
            console.error('Error streaming answer:', error);
            throw new Error('Không thể tạo câu trả lời. Vui lòng thử lại sau.');
        }
    }

    /**
     * Check if initialized
     */
    isReady(): boolean {
        return this.isInitialized;
    }

    /**
     * Get stats
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            contextLength: this.courseContext.length,
        };
    }
}

export const simpleChatbotService = new SimpleChatbotService();

