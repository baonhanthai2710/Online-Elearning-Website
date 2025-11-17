import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, PlayCircle, FileText, HelpCircle, MessageCircle, Menu } from 'lucide-react';
import { apiClient } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { showErrorAlert } from '../../lib/sweetalert';

type Content = {
    contentId: number;
    title: string;
    order: number;
    contentType: 'VIDEO' | 'DOCUMENT' | 'QUIZ';
    videoUrl?: string | null;
    documentUrl?: string | null;
    durationInSeconds?: number | null;
};

type Module = {
    moduleId: number;
    title: string;
    order: number;
    contents: Content[];
};

type CourseData = {
    id?: number;
    courseId?: number;
    title: string;
    description: string;
    modules: Module[];
};

type Enrollment = {
    enrollmentId: number;
    progress: number;
    completionDate: string | null;
};

export default function CoursePlayer() {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [currentModuleId, setCurrentModuleId] = useState<number | null>(null);
    const [currentContentId, setCurrentContentId] = useState<number | null>(null);
    const [showSidebar, setShowSidebar] = useState(true);

    // Fetch course data
    const {
        data: course,
        isLoading: courseLoading,
    } = useQuery<CourseData>({
        queryKey: ['course', courseId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/courses/${courseId}`);
            return data;
        },
        enabled: !!courseId,
    });

    // Fetch enrollment status
    const {
        data: enrollment,
    } = useQuery<Enrollment>({
        queryKey: ['enrollment', courseId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/enroll/my-enrollments`);
            const enroll = data.find((e: any) => (e.course.courseId || e.course.id) === parseInt(courseId!));
            return enroll;
        },
        enabled: !!courseId,
    });

    // Set initial content
    useState(() => {
        if (course && !currentModuleId && !currentContentId) {
            const firstModule = course.modules[0];
            if (firstModule) {
                setCurrentModuleId(firstModule.moduleId);
                if (firstModule.contents[0]) {
                    setCurrentContentId(firstModule.contents[0].contentId);
                }
            }
        }
    });

    const currentModule = course?.modules.find(m => m.moduleId === currentModuleId);
    const currentContent = currentModule?.contents.find(c => c.contentId === currentContentId);

    const handleContentSelect = (moduleId: number, contentId: number) => {
        setCurrentModuleId(moduleId);
        setCurrentContentId(contentId);
    };

    const getNextContent = () => {
        if (!course || !currentModule || !currentContent) return null;

        const currentIndex = currentModule.contents.findIndex(c => c.contentId === currentContentId);
        
        // Next content in same module
        if (currentIndex < currentModule.contents.length - 1) {
            return {
                moduleId: currentModule.moduleId,
                content: currentModule.contents[currentIndex + 1]
            };
        }

        // First content of next module
        const moduleIndex = course.modules.findIndex(m => m.moduleId === currentModuleId);
        if (moduleIndex < course.modules.length - 1) {
            const nextModule = course.modules[moduleIndex + 1];
            if (nextModule.contents.length > 0) {
                return {
                    moduleId: nextModule.moduleId,
                    content: nextModule.contents[0]
                };
            }
        }

        return null;
    };

    const getPreviousContent = () => {
        if (!course || !currentModule || !currentContent) return null;

        const currentIndex = currentModule.contents.findIndex(c => c.contentId === currentContentId);
        
        // Previous content in same module
        if (currentIndex > 0) {
            return {
                moduleId: currentModule.moduleId,
                content: currentModule.contents[currentIndex - 1]
            };
        }

        // Last content of previous module
        const moduleIndex = course.modules.findIndex(m => m.moduleId === currentModuleId);
        if (moduleIndex > 0) {
            const prevModule = course.modules[moduleIndex - 1];
            if (prevModule.contents.length > 0) {
                return {
                    moduleId: prevModule.moduleId,
                    content: prevModule.contents[prevModule.contents.length - 1]
                };
            }
        }

        return null;
    };

    const handleNext = () => {
        const next = getNextContent();
        if (next) {
            handleContentSelect(next.moduleId, next.content.contentId);
        }
    };

    const handlePrevious = () => {
        const prev = getPreviousContent();
        if (prev) {
            handleContentSelect(prev.moduleId, prev.content.contentId);
        }
    };

    const getContentIcon = (contentType: Content['contentType']) => {
        switch (contentType) {
            case 'VIDEO':
                return <PlayCircle className="h-4 w-4" />;
            case 'DOCUMENT':
                return <FileText className="h-4 w-4" />;
            case 'QUIZ':
                return <HelpCircle className="h-4 w-4" />;
        }
    };

    if (courseLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Đang tải khóa học...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-600">Không tìm thấy khóa học</p>
            </div>
        );
    }

    if (!enrollment) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Bạn chưa đăng ký khóa học này</p>
                    <Button onClick={() => navigate(`/courses/${courseId}`)}>
                        Quay lại trang khóa học
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-900">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowSidebar(!showSidebar)}
                                className="text-slate-300 hover:text-white"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-lg font-semibold text-white">
                                    {course.title}
                                </h1>
                                <p className="text-sm text-slate-400">
                                    {currentModule?.title}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400">
                                Tiến độ: {enrollment.progress.toFixed(0)}%
                            </span>
                            <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                                    style={{ width: `${enrollment.progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video/Content Player */}
                <div className="flex-1 flex items-center justify-center bg-black">
                    {currentContent && (
                        <div className="w-full h-full">
                            {currentContent.contentType === 'VIDEO' && currentContent.videoUrl && (
                                <div className="w-full h-full flex items-center justify-center">
                                    <video
                                        key={currentContent.videoUrl}
                                        controls
                                        className="w-full h-full"
                                        src={currentContent.videoUrl}
                                    >
                                        Trình duyệt của bạn không hỗ trợ video.
                                    </video>
                                </div>
                            )}

                            {currentContent.contentType === 'DOCUMENT' && currentContent.documentUrl && (
                                <div className="w-full h-full flex items-center justify-center p-8">
                                    <Card className="w-full max-w-4xl p-8 bg-white dark:bg-slate-800">
                                        <h2 className="text-2xl font-bold mb-4">{currentContent.title}</h2>
                                        <div className="prose dark:prose-invert max-w-none">
                                            <p>Tài liệu: <a href={currentContent.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">Tải xuống</a></p>
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {currentContent.contentType === 'QUIZ' && (
                                <div className="w-full h-full flex items-center justify-center p-8">
                                    <Card className="w-full max-w-2xl p-8 bg-white dark:bg-slate-800">
                                        <h2 className="text-2xl font-bold mb-4">Bài kiểm tra: {currentContent.title}</h2>
                                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                                            Bài kiểm tra sẽ được hiển thị ở đây
                                        </p>
                                        <Button>Bắt đầu làm bài</Button>
                                    </Card>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Navigation Bar */}
                <div className="bg-slate-800 border-t border-slate-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={!getPreviousContent()}
                            className="gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Bài trước
                        </Button>

                        <div className="text-center">
                            <h3 className="text-white font-medium">{currentContent?.title}</h3>
                            <p className="text-sm text-slate-400">{currentContent?.contentType}</p>
                        </div>

                        <Button
                            onClick={handleNext}
                            disabled={!getNextContent()}
                            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                            Bài tiếp
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Sidebar - Course Content */}
            {showSidebar && (
                <div className="w-96 bg-slate-800 border-l border-slate-700 overflow-y-auto">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Nội dung khóa học
                        </h2>

                        <div className="space-y-2">
                            {course.modules.map((module) => (
                                <div key={module.moduleId}>
                                    <div className="px-4 py-2 bg-slate-700 rounded-lg text-white font-medium mb-2">
                                        {module.title}
                                    </div>
                                    <div className="space-y-1">
                                        {module.contents.map((content) => (
                                            <button
                                                key={content.contentId}
                                                onClick={() => handleContentSelect(module.moduleId, content.contentId)}
                                                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                                                    currentContentId === content.contentId
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-slate-300 hover:bg-slate-700'
                                                }`}
                                            >
                                                <div className="text-slate-400">
                                                    {getContentIcon(content.contentType)}
                                                </div>
                                                <span className="flex-1 text-sm">{content.title}</span>
                                                {currentContentId === content.contentId && (
                                                    <PlayCircle className="h-4 w-4" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
