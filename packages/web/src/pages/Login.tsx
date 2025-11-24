import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm, type ControllerRenderProps } from 'react-hook-form';
import { AxiosError } from 'axios';
import { Eye, EyeOff, LogIn, Mail, Lock, GraduationCap } from 'lucide-react';

import { apiClient } from '../lib/api';
import { useAuthStore, type User } from '../stores/useAuthStore';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ThemeToggle } from '../components/ThemeToggle';
import { showErrorAlert, showSuccessAlert } from '../lib/sweetalert';

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
    const [showPassword, setShowPassword] = useState(false);

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
        onSuccess: async (user) => {
            setUser(user);
            
            await showSuccessAlert(
                'Đăng nhập thành công!',
                `Chào mừng trở lại, ${user.firstName || user.username}!`
            );

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

            showErrorAlert('Lỗi đăng nhập', message);
        },
    });

    const onSubmit = form.handleSubmit((values: LoginFormValues) => {
        loginMutation.mutate(values);
    });

    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl animate-pulse dark:bg-blue-600/20"></div>
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl animate-pulse delay-1000 dark:bg-purple-600/20"></div>
                <div className="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-400/10 blur-3xl animate-pulse delay-500 dark:bg-pink-600/10"></div>
            </div>

            {/* Theme Toggle */}
            <div className="absolute top-6 right-6 z-10">
                <ThemeToggle />
            </div>

            <div className="relative z-10 container mx-auto flex min-h-screen items-center justify-center px-4 py-10">
                <div className="w-full max-w-md">
                    {/* Logo/Brand Section */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                            <GraduationCap className="h-9 w-9 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                            E-Learning Platform
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Nơi tri thức không giới hạn
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 space-y-6">
                        <header className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Đăng nhập</h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Chào mừng bạn quay trở lại! Hãy đăng nhập để tiếp tục.
                            </p>
                        </header>

                        <Form {...form}>
                            <form className="space-y-5" onSubmit={onSubmit}>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    rules={{ 
                                        required: 'Vui lòng nhập email',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Email không hợp lệ'
                                        }
                                    }}
                                    render={({ field }: { field: ControllerRenderProps<LoginFormValues, 'email'> }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 dark:text-slate-300">Email</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                                                    <Input
                                                        type="email"
                                                        placeholder="example@email.com"
                                                        autoComplete="email"
                                                        disabled={loginMutation.isPending}
                                                        className="pl-11 h-12 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    rules={{ 
                                        required: 'Vui lòng nhập mật khẩu',
                                        minLength: {
                                            value: 6,
                                            message: 'Mật khẩu phải có ít nhất 6 ký tự'
                                        }
                                    }}
                                    render={({ field }: { field: ControllerRenderProps<LoginFormValues, 'password'> }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 dark:text-slate-300">Mật khẩu</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="••••••••"
                                                        autoComplete="current-password"
                                                        disabled={loginMutation.isPending}
                                                        className="pl-11 pr-11 h-12 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-5 w-5" />
                                                        ) : (
                                                            <Eye className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button 
                                    type="submit" 
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]" 
                                    disabled={loginMutation.isPending}
                                >
                                    {loginMutation.isPending ? (
                                        <>
                                            <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                            Đang đăng nhập...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="mr-2 h-5 w-5" />
                                            Đăng nhập
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        {/* Footer Links */}
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400">
                                        Chưa có tài khoản?
                                    </span>
                                </div>
                            </div>

                            <Link to="/register">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="w-full h-12 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold rounded-xl transition-all duration-200"
                                >
                                    Đăng ký ngay
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                        Bằng cách đăng nhập, bạn đồng ý với{' '}
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                            Điều khoản dịch vụ
                        </a>{' '}
                        và{' '}
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                            Chính sách bảo mật
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
