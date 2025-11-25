import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm, type ControllerRenderProps } from 'react-hook-form';
import { AxiosError } from 'axios';
import { Eye, EyeOff, UserPlus, Mail, Lock, User, GraduationCap, CheckCircle, ArrowRight } from 'lucide-react';

import { apiClient } from '../lib/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ThemeToggle } from '../components/ThemeToggle';
import { showErrorAlert, showSuccessAlert } from '../lib/sweetalert';

type RegisterFormValues = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
};

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

    const form = useForm<RegisterFormValues>({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
        },
    });

    const registerMutation = useMutation<{ verificationSent: boolean }, unknown, RegisterFormValues>({
        mutationFn: async (values) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...registerData } = values;
            const { data } = await apiClient.post('/auth/register', registerData);
            return data;
        },
        onSuccess: async (data, variables) => {
            setRegisteredEmail(variables.email);
            setRegistrationSuccess(true);
            
            if (data.verificationSent) {
                await showSuccessAlert(
                    'Đăng ký thành công!',
                    'Vui lòng kiểm tra email để xác thực tài khoản.'
                );
            } else {
                await showSuccessAlert(
                    'Đăng ký thành công!',
                    'Tài khoản đã được tạo nhưng không thể gửi email xác thực. Vui lòng yêu cầu gửi lại.'
                );
            }
        },
        onError: (error) => {
            let message = 'Đăng ký thất bại. Vui lòng thử lại.';

            if (error instanceof AxiosError) {
                const responseMessage = (error.response?.data as { message?: string })?.message;
                message = responseMessage ?? error.message ?? message;
            } else if (error instanceof Error) {
                message = error.message;
            }

            showErrorAlert('Lỗi đăng ký', message);
        },
    });

    const onSubmit = form.handleSubmit((values: RegisterFormValues) => {
        if (values.password !== values.confirmPassword) {
            showErrorAlert('Lỗi', 'Mật khẩu xác nhận không khớp!');
            return;
        }
        registerMutation.mutate(values);
    });

    // Show success message after registration
    if (registrationSuccess) {
        return (
            <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-green-400/20 blur-3xl animate-pulse dark:bg-green-600/20"></div>
                    <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl animate-pulse delay-1000 dark:bg-emerald-600/20"></div>
                </div>

                <div className="relative z-10 container mx-auto flex min-h-screen items-center justify-center px-4 py-10">
                    <div className="w-full max-w-md">
                        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 text-center">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                            </div>
                            
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Đăng ký thành công! 🎉
                            </h1>
                            
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                Chúng tôi đã gửi email xác thực đến:
                            </p>
                            
                            <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-6">
                                {registeredEmail}
                            </p>
                            
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    <strong>Quan trọng:</strong> Vui lòng kiểm tra hộp thư (bao gồm cả thư rác) và click vào link xác thực để kích hoạt tài khoản.
                                </p>
                            </div>
                            
                            <div className="space-y-3">
                                <Link to="/login">
                                    <Button className="w-full gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                                        Đi đến trang đăng nhập
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                                
                                <Link to={`/resend-verification?email=${encodeURIComponent(registeredEmail)}`}>
                                    <Button variant="outline" className="w-full gap-2">
                                        <Mail className="w-4 h-4" />
                                        Gửi lại email xác thực
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl animate-pulse dark:bg-purple-600/20"></div>
                <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl animate-pulse delay-1000 dark:bg-blue-600/20"></div>
                <div className="absolute top-1/3 right-1/3 h-60 w-60 rounded-full bg-pink-400/10 blur-3xl animate-pulse delay-500 dark:bg-pink-600/10"></div>
            </div>

            {/* Theme Toggle */}
            <div className="absolute top-6 right-6 z-10">
                <ThemeToggle />
            </div>

            <div className="relative z-10 container mx-auto flex min-h-screen items-center justify-center px-4 py-10">
                <div className="w-full max-w-2xl">
                    {/* Logo/Brand Section */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg">
                            <GraduationCap className="h-9 w-9 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400">
                            E-Learning Platform
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Bắt đầu hành trình học tập của bạn ngay hôm nay
                        </p>
                    </div>

                    {/* Register Card */}
                    <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 space-y-6">
                        <header className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tạo tài khoản</h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Điền thông tin bên dưới để bắt đầu hành trình học tập
                            </p>
                        </header>

                        <Form {...form}>
                            <form className="grid gap-5" onSubmit={onSubmit}>
                                {/* Username */}
                                <FormField
                                    control={form.control}
                                    name="username"
                                    rules={{
                                        required: 'Vui lòng nhập tên đăng nhập',
                                        minLength: {
                                            value: 3,
                                            message: 'Tên đăng nhập phải có ít nhất 3 ký tự'
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z0-9_]+$/,
                                            message: 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'
                                        }
                                    }}
                                    render={({ field }: { field: ControllerRenderProps<RegisterFormValues, 'username'> }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 dark:text-slate-300">Tên đăng nhập</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                                                    <Input
                                                        placeholder="username123"
                                                        autoComplete="username"
                                                        disabled={registerMutation.isPending}
                                                        className="pl-11 h-12 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Email */}
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
                                    render={({ field }: { field: ControllerRenderProps<RegisterFormValues, 'email'> }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 dark:text-slate-300">Email</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                                                    <Input
                                                        type="email"
                                                        placeholder="example@email.com"
                                                        autoComplete="email"
                                                        disabled={registerMutation.isPending}
                                                        className="pl-11 h-12 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* First and Last Name */}
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        rules={{ required: 'Vui lòng nhập tên' }}
                                        render={({ field }: { field: ControllerRenderProps<RegisterFormValues, 'firstName'> }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 dark:text-slate-300">Tên</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Duy"
                                                        autoComplete="given-name"
                                                        disabled={registerMutation.isPending}
                                                        className="h-12 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
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
                                                <FormLabel className="text-slate-700 dark:text-slate-300">Họ</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Nguyễn"
                                                        autoComplete="family-name"
                                                        disabled={registerMutation.isPending}
                                                        className="h-12 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Password */}
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
                                    render={({ field }: { field: ControllerRenderProps<RegisterFormValues, 'password'> }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 dark:text-slate-300">Mật khẩu</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="••••••••"
                                                        autoComplete="new-password"
                                                        disabled={registerMutation.isPending}
                                                        className="pl-11 pr-11 h-12 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
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

                                {/* Confirm Password */}
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    rules={{
                                        required: 'Vui lòng xác nhận mật khẩu',
                                        validate: (value) => value === form.watch('password') || 'Mật khẩu xác nhận không khớp'
                                    }}
                                    render={({ field }: { field: ControllerRenderProps<RegisterFormValues, 'confirmPassword'> }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 dark:text-slate-300">Xác nhận mật khẩu</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                                                    <Input
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        placeholder="••••••••"
                                                        autoComplete="new-password"
                                                        disabled={registerMutation.isPending}
                                                        className="pl-11 pr-11 h-12 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                                                    >
                                                        {showConfirmPassword ? (
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
                                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                                    disabled={registerMutation.isPending}
                                >
                                    {registerMutation.isPending ? (
                                        <>
                                            <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                            Đang đăng ký...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="mr-2 h-5 w-5" />
                                            Đăng ký
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400">
                                    hoặc tiếp tục với
                                </span>
                            </div>
                        </div>

                        {/* Google Signup Button */}
                        <a href="http://localhost:3001/api/auth/google" className="block">
                            <Button 
                                type="button" 
                                variant="outline" 
                                className="w-full h-12 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Đăng ký với Google
                            </Button>
                        </a>

                        {/* Footer Links */}
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400">
                                        Đã có tài khoản?
                                    </span>
                                </div>
                            </div>

                            <Link to="/login">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-12 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold rounded-xl transition-all duration-200"
                                >
                                    Đăng nhập
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                        Bằng cách đăng ký, bạn đồng ý với{' '}
                        <a href="#" className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400">
                            Điều khoản dịch vụ
                        </a>{' '}
                        và{' '}
                        <a href="#" className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400">
                            Chính sách bảo mật
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
