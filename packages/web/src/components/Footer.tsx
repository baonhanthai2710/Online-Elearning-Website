import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';
import logo from '../logo.png';

export function Footer() {
    return (
        <footer className="border-t border-red-900/10 dark:border-red-500/20 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                <img 
                                    src={logo} 
                                    alt="Logo" 
                                    className="relative h-12 w-12 object-contain rounded-xl"
                                />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-black dark:from-red-500 dark:to-red-300 bg-clip-text text-transparent">
                                E-Learning
                            </span>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            Nền tảng học trực tuyến hàng đầu Việt Nam. Nơi tri thức không giới hạn, học tập không ngừng nghỉ.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/30 hover:bg-red-600 dark:hover:bg-red-600 text-red-600 hover:text-white dark:text-red-400 dark:hover:text-white transition-all shadow-md hover:shadow-lg hover:shadow-red-500/30"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/30 hover:bg-red-600 dark:hover:bg-red-600 text-red-600 hover:text-white dark:text-red-400 dark:hover:text-white transition-all shadow-md hover:shadow-lg hover:shadow-red-500/30"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/30 hover:bg-red-600 dark:hover:bg-red-600 text-red-600 hover:text-white dark:text-red-400 dark:hover:text-white transition-all shadow-md hover:shadow-lg hover:shadow-red-500/30"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/30 hover:bg-red-600 dark:hover:bg-red-600 text-red-600 hover:text-white dark:text-red-400 dark:hover:text-white transition-all shadow-md hover:shadow-lg hover:shadow-red-500/30"
                            >
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <div className="h-1 w-8 bg-gradient-to-r from-red-600 to-black dark:from-red-500 dark:to-red-300 rounded-full"></div>
                            Liên kết nhanh
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-2 group"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-500 group-hover:w-4 transition-all"></span>
                                    Trang chủ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/courses"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-2 group"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-500 group-hover:w-4 transition-all"></span>
                                    Khóa học
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-2 group"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-500 group-hover:w-4 transition-all"></span>
                                    Về chúng tôi
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-2 group"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-500 group-hover:w-4 transition-all"></span>
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <div className="h-1 w-8 bg-gradient-to-r from-red-600 to-black dark:from-red-500 dark:to-red-300 rounded-full"></div>
                            Hỗ trợ
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-2 group"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-500 group-hover:w-4 transition-all"></span>
                                    Trung tâm hỗ trợ
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-2 group"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-500 group-hover:w-4 transition-all"></span>
                                    Câu hỏi thường gặp
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-2 group"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-500 group-hover:w-4 transition-all"></span>
                                    Điều khoản dịch vụ
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-2 group"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-500 group-hover:w-4 transition-all"></span>
                                    Chính sách bảo mật
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <div className="h-1 w-8 bg-gradient-to-r from-red-600 to-black dark:from-red-500 dark:to-red-300 rounded-full"></div>
                            Liên hệ
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 group">
                                <Mail className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 group-hover:scale-110 transition-transform" />
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    support@elearning.vn
                                </div>
                            </li>
                            <li className="flex items-start gap-3 group">
                                <Phone className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 group-hover:scale-110 transition-transform" />
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    1900 1234
                                </div>
                            </li>
                            <li className="flex items-start gap-3 group">
                                <MapPin className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 group-hover:scale-110 transition-transform" />
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    123 Đường ABC, Quận 1<br />
                                    TP. Hồ Chí Minh, Việt Nam
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-red-900/10 dark:border-red-500/20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left flex items-center gap-2">
                            © 2024 E-Learning Platform. Made with 
                            <Heart className="h-4 w-4 text-red-600 dark:text-red-500 fill-current animate-pulse" />
                            in Vietnam
                        </p>
                        <div className="flex items-center gap-6">
                            <a
                                href="#"
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                                Điều khoản
                            </a>
                            <span className="text-gray-300 dark:text-gray-700">|</span>
                            <a
                                href="#"
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                                Bảo mật
                            </a>
                            <span className="text-gray-300 dark:text-gray-700">|</span>
                            <a
                                href="#"
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
