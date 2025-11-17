import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { CourseList, type Course } from './CourseList';

async function fetchCourses(): Promise<Course[]> {
    const response = await apiClient.get<Course[]>('/courses');
    return response.data;
}

export default function Home() {
    const {
        data: courses = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['courses'],
        queryFn: fetchCourses,
    });

    return (
        <section className="container mx-auto px-4 py-10 space-y-6">
            <header className="space-y-2 text-center">
                <h1 className="text-3xl font-bold text-slate-900">Khám phá các khóa học</h1>
                <p className="text-slate-600">Chọn khóa học phù hợp và bắt đầu hành trình học tập của bạn.</p>
            </header>

            {isLoading && <p className="text-center text-slate-500">Đang tải danh sách khóa học...</p>}

            {isError && (
                <p className="text-center text-red-500">
                    Không thể tải danh sách khóa học: {(error as Error).message}
                </p>
            )}

            {!isLoading && !isError && <CourseList courses={courses} />}
        </section>
    );
}
