import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { apiClient } from '../lib/api';
import { CourseCard, type Course } from '../components/CourseCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

type Category = {
    id: number;
    categoryId?: number; // fallback
    name: string;
};

export default function Courses() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        searchParams.get('category') ? parseInt(searchParams.get('category')!) : null
    );
    const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (selectedCategory !== null && selectedCategory !== undefined) {
            params.set('category', String(selectedCategory));
        }
        setSearchParams(params, { replace: true });
    }, [searchQuery, selectedCategory, setSearchParams]);

    // Fetch courses
    const {
        data: courses = [],
        isLoading: coursesLoading,
    } = useQuery<Course[]>({
        queryKey: ['courses'],
        queryFn: async () => {
            const { data } = await apiClient.get('/courses');
            return data;
        },
    });

    // Fetch categories
    const { data: categories = [] } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await apiClient.get('/categories');
            return data;
        },
    });

    // Filter courses
    const filteredCourses = courses.filter((course) => {
        // Search filter
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());

        // Category filter
        const courseCatId = course.category?.id || course.category?.categoryId;
        const matchesCategory = selectedCategory === null || courseCatId === selectedCategory;

        // Price filter
        const matchesPrice = priceFilter === 'all' ||
            (priceFilter === 'free' && course.price === 0) ||
            (priceFilter === 'paid' && course.price > 0);

        return matchesSearch && matchesCategory && matchesPrice;
    });

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory(null);
        setPriceFilter('all');
        setSearchParams({}, { replace: true });
    };

    const hasActiveFilters = searchQuery || selectedCategory !== null || priceFilter !== 'all';

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
            {/* Header */}
            <div className="bg-violet-600 dark:bg-violet-900 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Khám phá khóa học
                        </h1>
                        <p className="text-violet-100 text-lg mb-8">
                            Tìm kiếm và đăng ký khóa học phù hợp với bạn
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                            <Input
                                type="text"
                                placeholder="Tìm kiếm khóa học..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-4 h-14 text-base bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <Card className="p-6 sticky top-4 border-zinc-200 dark:border-zinc-800 rounded-lg">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                    <h3 className="font-semibold text-zinc-900 dark:text-white">
                                        Bộ lọc
                                    </h3>
                                </div>
                                {hasActiveFilters && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="h-8 text-xs"
                                    >
                                        <X className="h-4 w-4 mr-1" />
                                        Xóa
                                    </Button>
                                )}
                            </div>

                            {/* Price Filter */}
                            <div className="mb-6">
                                <h4 className="font-medium text-sm text-zinc-700 dark:text-zinc-300 mb-3">
                                    Giá
                                </h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price"
                                            checked={priceFilter === 'all'}
                                            onChange={() => setPriceFilter('all')}
                                            className="text-violet-600 focus:ring-violet-500"
                                        />
                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                            Tất cả
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price"
                                            checked={priceFilter === 'free'}
                                            onChange={() => setPriceFilter('free')}
                                            className="text-violet-600 focus:ring-violet-500"
                                        />
                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                            Miễn phí
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price"
                                            checked={priceFilter === 'paid'}
                                            onChange={() => setPriceFilter('paid')}
                                            className="text-violet-600 focus:ring-violet-500"
                                        />
                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                            Có phí
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <h4 className="font-medium text-sm text-zinc-700 dark:text-zinc-300 mb-3">
                                    Danh mục
                                </h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === null
                                                ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-medium'
                                                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                            }`}
                                    >
                                        Tất cả danh mục
                                    </button>
                                    {categories.map((category) => {
                                        const catId = category.id || category.categoryId;
                                        return (
                                            <button
                                                key={catId}
                                                onClick={() => setSelectedCategory(catId!)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === catId
                                                        ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-medium'
                                                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                                    }`}
                                            >
                                                {category.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </Card>
                    </aside>

                    {/* Course Grid */}
                    <main className="flex-1">
                        {/* Results Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                {hasActiveFilters ? 'Kết quả tìm kiếm' : 'Tất cả khóa học'}
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                Tìm thấy {filteredCourses.length} khóa học
                            </p>
                        </div>

                        {/* Course Grid */}
                        {coursesLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="bg-zinc-200 dark:bg-zinc-800 aspect-video rounded-t-lg"></div>
                                        <div className="bg-white dark:bg-zinc-900 p-5 rounded-b-lg space-y-3">
                                            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                                            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredCourses.length === 0 ? (
                            <Card className="p-12 text-center border-zinc-200 dark:border-zinc-800 rounded-lg">
                                <div className="max-w-md mx-auto">
                                    <div className="mb-4">
                                        <Search className="h-16 w-16 text-zinc-300 dark:text-zinc-700 mx-auto" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                                        Không tìm thấy khóa học
                                    </h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                                        Không có khóa học nào phù hợp với tiêu chí tìm kiếm của bạn
                                    </p>
                                    {hasActiveFilters && (
                                        <Button
                                            onClick={clearFilters}
                                            variant="outline"
                                            className="border-violet-600 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30"
                                        >
                                            Xóa bộ lọc
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredCourses.map((course) => (
                                    <CourseCard
                                        key={course.courseId || course.id}
                                        course={course}
                                    />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

