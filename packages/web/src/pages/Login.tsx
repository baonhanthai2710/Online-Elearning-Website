import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm, type ControllerRenderProps } from 'react-hook-form';
import { AxiosError } from 'axios';

import { apiClient } from '../lib/api';
import { useAuthStore, type User } from '../stores/useAuthStore';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

type LoginFormValues = {
    email: string;
    password: string;
};

type LoginResponse = {
    message: string;
    user: User;
};

export default function Login() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm<LoginFormValues>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const loginMutation = useMutation<User, unknown, LoginFormValues>({
        mutationFn: async (values) => {
            const { data } = await apiClient.post<LoginResponse>('/auth/login', values);
            return data.user;
        },
        onSuccess: (user) => {
            setFormError(null);
            setUser(user);

            const isTeacher = user.role === 'TEACHER';
            navigate(isTeacher ? '/dashboard' : '/');
        },
        onError: (error) => {
            let message = 'Đăng nhập thất bại. Vui lòng thử lại.';

            if (error instanceof AxiosError) {
                const responseMessage = (error.response?.data as { message?: string })?.message;
                message = responseMessage ?? error.message ?? message;
            } else if (error instanceof Error) {
                message = error.message;
            }

            setFormError(message);
        },
    });

    const onSubmit = form.handleSubmit((values: LoginFormValues) => {
        loginMutation.mutate(values);
    });

    return (
        <section className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-10">
            <div className="w-full max-w-md space-y-6 rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
                <header className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold text-slate-900">Đăng nhập</h1>
                    <p className="text-sm text-slate-500">
                        Sử dụng email và mật khẩu để truy cập bảng điều khiển giảng viên.
                    </p>
                </header>

                {formError && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                        {formError}
                    </div>
                )}

                <Form {...form}>
                    <form className="space-y-5" onSubmit={onSubmit}>
                        <FormField
                            control={form.control}
                            name="email"
                            rules={{ required: 'Vui lòng nhập email' }}
                            render={({ field }: { field: ControllerRenderProps<LoginFormValues, 'email'> }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            disabled={loginMutation.isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            rules={{ required: 'Vui lòng nhập mật khẩu' }}
                            render={({ field }: { field: ControllerRenderProps<LoginFormValues, 'password'> }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            disabled={loginMutation.isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                            {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </Button>
                    </form>
                </Form>
            </div>
        </section>
    );
}
