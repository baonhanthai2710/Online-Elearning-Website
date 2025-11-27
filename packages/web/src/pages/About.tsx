import { Users, Target, Award, BookOpen, Heart, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DuongImage from '../Duong.png';
import NhanImage from '../Nhan.png';

export default function About() {
    const stats = [
        { label: 'Học viên', value: '50,000+', icon: Users },
        { label: 'Khóa học', value: '500+', icon: BookOpen },
        { label: 'Giảng viên', value: '200+', icon: Award },
        { label: 'Tỷ lệ hài lòng', value: '98%', icon: Heart },
    ];

    const values = [
        {
            icon: Target,
            title: 'Sứ mệnh',
            description: 'Mang đến cơ hội học tập chất lượng cao cho mọi người, mọi nơi, mọi lúc với chi phí hợp lý nhất.',
        },
        {
            icon: Lightbulb,
            title: 'Tầm nhìn',
            description: 'Trở thành nền tảng học trực tuyến hàng đầu Việt Nam, kết nối tri thức và đam mê.',
        },
        {
            icon: Heart,
            title: 'Giá trị cốt lõi',
            description: 'Chất lượng - Sáng tạo - Tận tâm - Đổi mới liên tục để mang đến trải nghiệm học tập tốt nhất.',
        },
    ];

    const team = [
        { name: 'Nguyễn Hải Dương', role: 'Co-Founder & Developer', image: DuongImage },
        { name: 'Thái Bảo Nhân', role: 'Co-Founder & Developer', image: NhanImage },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
            {/* Hero Section */}
            <section className="relative py-20 bg-violet-600 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Về E-Learning</h1>
                        <p className="text-xl text-violet-100 leading-relaxed">
                            Chúng tôi tin rằng giáo dục chất lượng cao nên được tiếp cận bởi tất cả mọi người.
                            E-Learning ra đời với sứ mệnh kết nối người học với những giảng viên giỏi nhất Việt Nam.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 -mt-10 relative z-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat) => (
                            <Card key={stat.label} className="p-6 text-center bg-white dark:bg-zinc-900 shadow-lg">
                                <stat.icon className="h-8 w-8 mx-auto mb-3 text-violet-600" />
                                <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8 text-center">
                            Câu chuyện của chúng tôi
                        </h2>
                        <div className="prose prose-lg dark:prose-invert mx-auto text-zinc-600 dark:text-zinc-400">
                            <p>
                                E-Learning được thành lập vào năm 2020, giữa đại dịch COVID-19 khi nhu cầu học trực tuyến
                                tăng cao. Xuất phát từ mong muốn tạo ra một nền tảng học tập chất lượng, dễ tiếp cận cho
                                người Việt Nam, chúng tôi đã không ngừng nỗ lực phát triển.
                            </p>
                            <p>
                                Sau 4 năm hoạt động, E-Learning đã trở thành ngôi nhà chung của hơn 50,000 học viên và
                                200+ giảng viên uy tín trong nhiều lĩnh vực từ công nghệ, kinh doanh, thiết kế đến
                                phát triển cá nhân.
                            </p>
                            <p>
                                Chúng tôi tự hào về chất lượng nội dung được biên soạn kỹ lưỡng, đội ngũ giảng viên
                                chuyên nghiệp và hệ thống học tập hiện đại, giúp học viên đạt được mục tiêu của mình
                                một cách hiệu quả nhất.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 bg-white dark:bg-zinc-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-12 text-center">
                        Giá trị cốt lõi
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {values.map((value) => (
                            <Card key={value.title} className="p-8 text-center border-2 border-transparent hover:border-violet-500 transition-colors">
                                <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-violet-600 flex items-center justify-center">
                                    <value.icon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">{value.title}</h3>
                                <p className="text-zinc-600 dark:text-zinc-400">{value.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-12 text-center">
                        Đội ngũ lãnh đạo
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {team.map((member) => (
                            <div key={member.name} className="text-center">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-4 border-violet-100 dark:border-violet-900/30"
                                />
                                <h3 className="font-semibold text-zinc-900 dark:text-white">{member.name}</h3>
                                <p className="text-sm text-violet-600 dark:text-violet-400">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
