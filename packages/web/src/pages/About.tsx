import { Award, Target, Users, TrendingUp, CheckCircle, Heart, Zap, Shield } from 'lucide-react';
import { Card } from '../components/ui/card';

export default function About() {
    const stats = [
        { icon: Users, value: '50,000+', label: 'Học viên' },
        { icon: Award, value: '1,000+', label: 'Khóa học' },
        { icon: Target, value: '95%', label: 'Hài lòng' },
        { icon: TrendingUp, value: '24/7', label: 'Hỗ trợ' },
    ];

    const values = [
        {
            icon: Heart,
            title: 'Tận tâm',
            description: 'Đặt học viên làm trung tâm, chúng tôi cam kết mang đến trải nghiệm học tập tốt nhất.'
        },
        {
            icon: Zap,
            title: 'Đổi mới',
            description: 'Luôn cập nhật công nghệ và phương pháp giảng dạy hiện đại nhất.'
        },
        {
            icon: Shield,
            title: 'Uy tín',
            description: 'Đội ngũ giảng viên chuyên nghiệp, nội dung chất lượng được kiểm duyệt kỹ lưỡng.'
        },
        {
            icon: CheckCircle,
            title: 'Hiệu quả',
            description: 'Phương pháp học tập được chứng minh mang lại kết quả cao nhất.'
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-black dark:from-red-900 dark:via-black dark:to-gray-950">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAtMS4xMDUuODk1LTIgMi0yczIgLjg5NSAyIDItLjg5NSAyLTIgMi0yLS44OTUtMi0yem0wIDQwYzAtMS4xMDUuODk1LTIgMi0yczIgLjg5NSAyIDItLjg5NSAyLTIgMi0yLS44OTUtMi0yem0tMTYtMjBjMC0xLjEwNS44OTUtMiAyLTJzMiAuODk1IDIgMi0uODk1IDItMiAyLTItLjg5NS0yLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
                
                <div className="relative container mx-auto px-4 py-20 md:py-32">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20">
                            Về chúng tôi
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                            Nền tảng học trực tuyến
                            <span className="block bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
                                hàng đầu Việt Nam
                            </span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto">
                            Chúng tôi tin rằng giáo dục là chìa khóa mở ra tương lai. 
                            Sứ mệnh của chúng tôi là mang kiến thức chất lượng cao đến với mọi người, 
                            mọi lúc, mọi nơi.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-16">
                        {stats.map((stat, index) => (
                            <Card key={index} className="p-6 text-center bg-white/10 dark:bg-black/30 backdrop-blur-xl border-white/20 hover:bg-white/20 transition-all">
                                <div className="flex justify-center mb-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-red-600">
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-red-100">{stat.label}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm font-medium">
                                    <Target className="h-4 w-4" />
                                    <span>Sứ mệnh của chúng tôi</span>
                                </div>
                                
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                    Democratizing Education for Everyone
                                </h2>
                                
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Chúng tôi tin rằng mọi người đều xứng đáng có cơ hội học tập và phát triển. 
                                    E-Learning Platform được xây dựng với mục tiêu làm cho giáo dục chất lượng cao 
                                    trở nên dễ tiếp cận hơn bao giờ hết.
                                </p>
                                
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                Học mọi lúc, mọi nơi
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Truy cập khóa học trên mọi thiết bị, học theo tốc độ của bạn
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                Giảng viên chuyên nghiệp
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Học từ các chuyên gia hàng đầu trong ngành
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                Chứng chỉ được công nhận
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Nhận chứng chỉ có giá trị sau khi hoàn thành khóa học
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-black rounded-2xl blur-3xl opacity-20"></div>
                                <Card className="relative p-8 bg-gradient-to-br from-red-50 to-gray-50 dark:from-red-950/20 dark:to-gray-950 border-red-200 dark:border-red-900">
                                    <div className="aspect-video rounded-xl bg-gradient-to-br from-red-600 to-black dark:from-red-700 dark:to-black flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <Award className="h-24 w-24 mx-auto mb-4 opacity-90" />
                                            <p className="text-xl font-semibold">Excellence in Education</p>
                                            <p className="text-red-200">Since 2024</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-gray-50 dark:bg-black">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Giá trị cốt lõi
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Những giá trị định hướng mọi hoạt động của chúng tôi
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((value, index) => (
                                <Card key={index} className="p-6 text-center hover:shadow-xl hover:shadow-red-500/10 transition-all border-gray-200 dark:border-gray-800 group">
                                    <div className="flex justify-center mb-4">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white group-hover:scale-110 transition-transform shadow-lg shadow-red-500/30">
                                            <value.icon className="h-8 w-8" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {value.description}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-red-600 via-red-700 to-black dark:from-red-900 dark:via-black dark:to-gray-950">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            Sẵn sàng bắt đầu hành trình học tập?
                        </h2>
                        <p className="text-red-100 text-lg">
                            Tham gia cùng hàng nghìn học viên đang học tập và phát triển mỗi ngày
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <a href="/register">
                                <button className="px-8 py-4 bg-white text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105">
                                    Đăng ký ngay
                                </button>
                            </a>
                            <a href="/courses">
                                <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all">
                                    Xem khóa học
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

