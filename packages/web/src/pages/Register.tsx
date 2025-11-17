import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm, type ControllerRenderProps } from 'react-hook-form';
import { AxiosError } from 'axios';

import { apiClient } from '../lib/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

type RegisterFormValues = {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

export default function Register() {
    const navigate = useNavigate();
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);

    const form = useForm<RegisterFormValues>({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
        },
    });

    const registerMutation = useMutation<void, unknown, RegisterFormValues>({
        mutationFn: async (values) => {
            await apiClient.post('/auth/register', values);
        },
        onSuccess: () => {
            setFormError(null);
            setFormSuccess('Đăng ký thành công! Hãy đăng nhập để tiếp tục.');
            navigate('/login');
        },
        onError: (error) => {
            let message = 'Đăng ký thất bại. Vui lòng thử lại.';

            if (error instanceof AxiosError) {
                const responseMessage = (error.response?.data as { message?: string })?.message;
                message = responseMessage ?? error.message ?? message;
            } else if (error instanceof Error) {
                message = error.message;
            }

            setFormSuccess(null);
            setFormError(message);
        },
    });

    const onSubmit = form.handleSubmit((values: RegisterFormValues) => {
        registerMutation.mutate(values);
    });

    return (
        <section className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-10">
            <div className="w-full max-w-xl space-y-6 rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
                <header className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold text-slate-900">Tạo tài khoản</h1>
                    <p className="text-sm text-slate-500">Điền thông tin bên dưới để bắt đầu hành trình học tập của bạn.</p>
                </header>

                {formError && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
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
                            name="username"
                            rules={{ required: 'Vui lòng nhập tên đăng nhập' }}
                            render={({ field }: { field: ControllerRenderProps<RegisterFormValues, 'username'> }) => (
                                <FormItem>
                                    <FormLabel>Tên đăng nhập</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="teacher01"
                                            autoComplete="username"
                                            disabled={registerMutation.isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            rules={{ required: 'Vui lòng nhập email' }}
                            render={({ field }: { field: ControllerRenderProps<RegisterFormValues, 'email'> }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            disabled={registerMutation.isPending}
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
                            rules={{ required: 'Vui lòng nhập mật khẩu', minLength: { value: 6, message: 'Mật khẩu tối thiểu 6 ký tự' } }}
                            render={({ field }: { field: ControllerRenderProps<RegisterFormValues, 'password'> }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            autoComplete="new-password"
                                            disabled={registerMutation.isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid gap-5 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="firstName"
                                rules={{ required: 'Vui lòng nhập tên' }}
                                render={({ field }: { field: ControllerRenderProps<RegisterFormValues, 'firstName'> }) => (
                                    <FormItem>
                                        <FormLabel>Tên</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Duy"
                                                autoComplete="given-name"
                                                disabled={registerMutation.isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lastName"
                                rules={{ required: 'Vui lòng nhập họ' }}
                                render={({ field }: { field: ControllerRenderProps<RegisterFormValues, 'lastName'> }) => (
                                    <FormItem>
                                        <FormLabel>Họ</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nguyễn"
                                                autoComplete="family-name"
                                                disabled={registerMutation.isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                            {registerMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký'}
                        </Button>
                    </form>
                </Form>
            </div>
        </section>
    );
}
