import { useState } from 'react';
import { useForm, type ControllerRenderProps } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { apiClient } from '../../../lib/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { CourseImageUpload } from './CourseImageUpload';

type Category = {
    id: number;
    name: string;
};

type CourseFormValues = {
    title: string;
    description: string;
    price: string;
    categoryId: string;
    imageUrl: string | null;
};

async function fetchCategories(): Promise<Category[]> {
    const { data } = await apiClient.get<Category[]>('/categories');
    return data;
}

export function CourseCreateForm() {
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);

    const form = useForm<CourseFormValues>({
        defaultValues: {
            title: '',
            description: '',
            price: '',
            categoryId: '',
            imageUrl: null,
        },
    });

    const categoriesQuery = useQuery({
        queryKey: ['course-categories'],
        queryFn: fetchCategories,
    });

    const createCourseMutation = useMutation<unknown, unknown, CourseFormValues>({
        mutationFn: async (values) => {
            const payload = {
                title: values.title,
                description: values.description,
                price: Number(values.price),
                categoryId: Number(values.categoryId),
                imageUrl: values.imageUrl,
            };

            const { data } = await apiClient.post('/courses', payload);
            return data;
        },
        onSuccess: () => {
            setFormError(null);
            setFormSuccess('Tạo khoá học thành công!');
            form.reset({
                title: '',
                description: '',
                price: '',
                categoryId: '',
                imageUrl: null,
            });
        },
        onError: (error) => {
            let message = 'Không thể tạo khoá học. Vui lòng thử lại.';

            if (error instanceof AxiosError) {
                const responseData = error.response?.data as { message?: string; error?: string } | undefined;
                message = responseData?.message ?? responseData?.error ?? error.message ?? message;
            } else if (error instanceof Error) {
                message = error.message;
            }

            setFormSuccess(null);
            setFormError(message);
        },
    });

    const onSubmit = form.handleSubmit((values: CourseFormValues) => {
        setFormSuccess(null);
        createCourseMutation.mutate(values);
    });

    return (
        <section className="space-y-6">
            <header className="space-y-1">
                <h2 className="text-2xl font-semibold text-zinc-900">Tạo khoá học mới</h2>
                <p className="text-sm text-zinc-500">
                    Điền thông tin bên dưới để xuất bản khoá học dành cho học viên.
                </p>
            </header>

            {formError && (
                <div className="rounded-md border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-600">
                    {formError}
                </div>
            )}

            {formSuccess && (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {formSuccess}
                </div>
            )}

            <Form {...form}>
                <form className="grid gap-5" onSubmit={onSubmit}>
                    <FormField
                        control={form.control}
                        name="title"
                        rules={{ required: 'Vui lòng nhập tiêu đề khoá học' }}
                        render={({ field }: { field: ControllerRenderProps<CourseFormValues, 'title'> }) => (
                            <FormItem>
                                <FormLabel>Tiêu đề khoá học</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nhập tiêu đề"
                                        disabled={createCourseMutation.isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        rules={{ required: 'Vui lòng nhập mô tả khoá học' }}
                        render={({ field }: { field: ControllerRenderProps<CourseFormValues, 'description'> }) => (
                            <FormItem>
                                <FormLabel>Mô tả</FormLabel>
                                <FormControl>
                                    <textarea
                                        className="min-h-[120px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                                        placeholder="Giới thiệu tổng quan về khoá học"
                                        disabled={createCourseMutation.isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        rules={{
                            required: 'Vui lòng nhập học phí',
                            validate: (value) => (Number(value) >= 0 ? true : 'Học phí phải lớn hơn hoặc bằng 0'),
                        }}
                        render={({ field }: { field: ControllerRenderProps<CourseFormValues, 'price'> }) => (
                            <FormItem>
                                <FormLabel>Học phí (USD)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Ví dụ: 49.99"
                                        disabled={createCourseMutation.isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="categoryId"
                        rules={{ required: 'Vui lòng chọn danh mục' }}
                        render={({ field }: { field: ControllerRenderProps<CourseFormValues, 'categoryId'> }) => (
                            <FormItem>
                                <FormLabel>Danh mục</FormLabel>
                                <FormControl>
                                    <select
                                        className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                                        disabled={createCourseMutation.isPending || categoriesQuery.isLoading}
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                    >
                                        <option value="" disabled>
                                            {categoriesQuery.isLoading ? 'Đang tải danh mục...' : 'Chọn danh mục'}
                                        </option>
                                        {categoriesQuery.data?.map((category) => (
                                            <option key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                {categoriesQuery.isError && (
                                    <p className="text-xs text-violet-500">
                                        Không thể tải danh mục. Hãy thử làm mới trang.
                                    </p>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }: { field: ControllerRenderProps<CourseFormValues, 'imageUrl'> }) => (
                            <FormItem>
                                <FormLabel>Ảnh khoá học</FormLabel>
                                <FormControl>
                                    <CourseImageUpload
                                        value={field.value}
                                        onChange={(url) => {
                                            field.onChange(url);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full sm:w-auto"
                        disabled={createCourseMutation.isPending}
                    >
                        {createCourseMutation.isPending ? 'Đang tạo khoá học...' : 'Tạo khoá học'}
                    </Button>
                </form>
            </Form>
        </section>
    );
}
