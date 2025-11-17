import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

type ContentSummary = {
    id: number;
    title: string;
    order: number;
    contentType: 'VIDEO' | 'DOCUMENT' | 'QUIZ' | string;
    durationInSeconds?: number | null;
    timeLimitInMinutes?: number | null;
};

type ModuleSummary = {
    id: number;
    title: string;
    order: number;
    contents: ContentSummary[];
};

type CourseDetailData = {
    id: number;
    title: string;
    description: string;
    price: number;
    category?: {
        id: number;
        name: string;
    } | null;
    teacher?: {
        id: number;
        username: string;
        firstName: string | null;
        lastName: string | null;
    } | null;
    modules: ModuleSummary[];
};

async function fetchCourseDetail(courseId: number): Promise<CourseDetailData> {
    const response = await apiClient.get<CourseDetailData>(`/courses/${courseId}`);
    return response.data;
}

export default function CourseDetail() {
    const { id } = useParams<{ id: string }>();
    const courseId = Number(id);

    const {
        data: course,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['course-detail', courseId],
        queryFn: () => fetchCourseDetail(courseId),
        enabled: Number.isFinite(courseId),
    });

    if (!id || !Number.isFinite(courseId)) {
        return (
            <section className="container mx-auto px-4 py-10">
                <p className="text-red-500">Khoá học không hợp lệ.</p>
            </section>
        );
    }

    if (isLoading) {
        return (
            <section className="container mx-auto px-4 py-10">
                <p className="text-slate-500">Đang tải thông tin khoá học...</p>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="container mx-auto px-4 py-10">
                <p className="text-red-500">Không thể tải thông tin khoá học: {(error as Error).message}</p>
            </section>
        );
    }

    if (!course) {
        return (
            <section className="container mx-auto px-4 py-10">
                <p className="text-red-500">Không tìm thấy khoá học.</p>
            </section>
        );
    }

    const teacherName = [course.teacher?.firstName, course.teacher?.lastName].filter(Boolean).join(' ') || course.teacher?.username;

    return (
        <section className="container mx-auto px-4 py-10 space-y-8">
            <header className="space-y-3">
                <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
                <p className="text-slate-600 leading-relaxed">{course.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    {teacherName && <span>Giảng viên: {teacherName}</span>}
                    {course.category && <span>Danh mục: {course.category.name}</span>}
                    <span className="font-semibold text-emerald-600">{course.price.toLocaleString()} USD</span>
                </div>
            </header>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-slate-900">Nội dung khoá học</h2>
                {course.modules.length === 0 && (
                    <p className="text-slate-500">Nội dung khoá học sẽ được cập nhật sớm.</p>
                )}
                <div className="space-y-6">
                    {course.modules.map((module) => (
                        <article key={module.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="text-xl font-semibold text-slate-900">{module.order}. {module.title}</h3>
                            {module.contents.length === 0 ? (
                                <p className="mt-2 text-sm text-slate-500">Chưa có nội dung nào trong chương này.</p>
                            ) : (
                                <ol className="mt-3 space-y-2 text-sm text-slate-600">
                                    {module.contents.map((content) => (
                                        <li key={content.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
                                            <div>
                                                <span className="font-medium text-slate-800">{content.order}. {content.title}</span>
                                                <span className="ml-2 uppercase text-xs text-slate-400">{content.contentType}</span>
                                            </div>
                                            <div className="text-xs text-slate-400 space-x-3">
                                                {typeof content.durationInSeconds === 'number' && (
                                                    <span>Video: {Math.round(content.durationInSeconds / 60)} phút</span>
                                                )}
                                                {typeof content.timeLimitInMinutes === 'number' && (
                                                    <span>Giới hạn: {content.timeLimitInMinutes} phút</span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </article>
                    ))}
                </div>
            </section>
        </section>
    );
}
