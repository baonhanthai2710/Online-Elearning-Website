import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { apiClient } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';

const QUIZ_TYPE = 'QUIZ';

type EnrollmentStatusResponse = {
    enrolled: boolean;
    progress?: number;
};

type ContentSummary = {
    id: number;
    title: string;
    order: number;
    contentType: string;
};

type ModuleSummary = {
    id: number;
    title: string;
    order: number;
    contents: ContentSummary[];
};

type CourseDetailData = {
    id: number;
    title: string;
    description: string;
    modules: ModuleSummary[];
};

type QuizQuestion = {
    id: number;
    questionText: string;
    options: Array<{
        id: number;
        optionText: string;
    }>;
};

type QuizResponse = {
    contentId: number;
    title: string;
    timeLimitInMinutes: number | null;
    questions: QuizQuestion[];
};

type QuizSubmissionResult = {
    attemptId: number;
    score: number;
    correctCount: number;
    totalQuestions: number;
};

type CommentNode = {
    id: number;
    text: string;
    parentId: number | null;
    createdAt: string;
    author: {
        id: number;
        username: string;
        firstName: string | null;
        lastName: string | null;
    };
    replies: CommentNode[];
};

type CommentPayload = {
    text: string;
    parentId?: number | null;
};

async function fetchEnrollmentStatus(courseId: number): Promise<EnrollmentStatusResponse> {
    const { data } = await apiClient.get<EnrollmentStatusResponse>(`/enroll/status/${courseId}`);
    return data;
}

async function fetchCourseDetail(courseId: number): Promise<CourseDetailData> {
    const { data } = await apiClient.get<CourseDetailData>(`/courses/${courseId}`);
    return data;
}

async function fetchQuiz(contentId: number): Promise<QuizResponse> {
    const { data } = await apiClient.get<QuizResponse>(`/quiz/${contentId}`);
    return data;
}

async function submitQuiz(contentId: number, answers: Array<{ questionId: number; answerOptionId: number }>) {
    const { data } = await apiClient.post<QuizSubmissionResult>(`/quiz/submit/${contentId}`, { answers });
    return data;
}

async function fetchComments(contentId: number): Promise<CommentNode[]> {
    const { data } = await apiClient.get<CommentNode[]>(`/comments/${contentId}`);
    return data;
}

async function postComment(contentId: number, payload: CommentPayload) {
    const { data } = await apiClient.post<CommentNode>(`/comments/${contentId}`, payload);
    return data;
}

function getCommentAuthorName(comment: CommentNode): string {
    const parts = [comment.author.firstName, comment.author.lastName].filter(Boolean);
    if (parts.length > 0) {
        return parts.join(' ');
    }
    return comment.author.username;
}

function formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleString();
}

function QuizView({ contentId }: { contentId: number }) {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [submissionResult, setSubmissionResult] = useState<QuizSubmissionResult | null>(null);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    const quizQuery = useQuery({
        queryKey: ['quiz', contentId],
        queryFn: () => fetchQuiz(contentId),
        enabled: Number.isFinite(contentId),
    });

    useEffect(() => {
        setSelectedAnswers({});
        setSubmissionResult(null);
        setSubmissionError(null);
    }, [contentId]);

    const submitMutation = useMutation<QuizSubmissionResult, unknown, Array<{ questionId: number; answerOptionId: number }>>({
        mutationFn: (answers) => submitQuiz(contentId, answers),
        onSuccess: (result) => {
            setSubmissionResult(result);
            setSubmissionError(null);
        },
        onError: (error) => {
            let message = 'Không thể nộp bài. Vui lòng thử lại.';

            if (error instanceof AxiosError) {
                const responseData = error.response?.data as { message?: string; error?: string } | undefined;
                message = responseData?.message ?? responseData?.error ?? error.message ?? message;
            } else if (error instanceof Error) {
                message = error.message;
            }

            setSubmissionResult(null);
            setSubmissionError(message);
        },
    });

    const quiz = quizQuery.data;

    const handleChange = (questionId: number, answerOptionId: number) => {
        setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerOptionId }));
    };

    const handleSubmit = () => {
        if (!quiz) {
            return;
        }

        const answers = quiz.questions
            .map((question) => {
                const answerOptionId = selectedAnswers[question.id];
                if (!answerOptionId) {
                    return null;
                }
                return { questionId: question.id, answerOptionId };
            })
            .filter((entry): entry is { questionId: number; answerOptionId: number } => entry !== null);

        if (answers.length === 0) {
            setSubmissionError('Vui lòng chọn câu trả lời trước khi nộp bài.');
            return;
        }

        submitMutation.mutate(answers);
    };

    if (quizQuery.isLoading) {
        return <p className="text-sm text-slate-500">Đang tải bài kiểm tra...</p>;
    }

    if (quizQuery.isError) {
        return (
            <p className="text-sm text-red-500">
                Không thể tải bài kiểm tra: {(quizQuery.error as Error).message}
            </p>
        );
    }

    if (!quiz) {
        return <p className="text-sm text-slate-500">Bài kiểm tra không khả dụng.</p>;
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h3 className="text-xl font-semibold text-slate-900">{quiz.title}</h3>
                {typeof quiz.timeLimitInMinutes === 'number' && (
                    <p className="text-sm text-slate-500">Thời gian giới hạn: {quiz.timeLimitInMinutes} phút</p>
                )}
            </div>

            <div className="space-y-6">
                {quiz.questions.map((question, index) => (
                    <div key={question.id} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="font-medium text-slate-900">
                            Câu {index + 1}: {question.questionText}
                        </div>
                        <div className="space-y-2">
                            {question.options.map((option) => (
                                <label key={option.id} className="flex items-center gap-3 text-sm text-slate-700">
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value={option.id}
                                        checked={selectedAnswers[question.id] === option.id}
                                        onChange={() => handleChange(question.id, option.id)}
                                        disabled={submitMutation.isPending}
                                        className="h-4 w-4"
                                    />
                                    <span>{option.optionText}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                {submissionError && <p className="text-sm text-red-500">{submissionError}</p>}
                {submissionResult && (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                        Bạn đã trả lời đúng {submissionResult.correctCount}/{submissionResult.totalQuestions} câu hỏi. Điểm số: {submissionResult.score}%
                    </div>
                )}

                <Button type="button" onClick={handleSubmit} disabled={submitMutation.isPending}>
                    {submitMutation.isPending ? 'Đang nộp bài...' : 'Nộp bài kiểm tra'}
                </Button>
            </div>
        </div>
    );
}

function CommentItem({ comment, onReply }: { comment: CommentNode; onReply: (commentId: number) => void }) {
    return (
        <div className="space-y-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <div className="space-y-1">
                <div className="text-sm font-medium text-slate-900">{getCommentAuthorName(comment)}</div>
                <div className="text-xs text-slate-500">Đăng lúc {formatDate(comment.createdAt)}</div>
            </div>
            <p className="text-sm text-slate-700">{comment.text}</p>
            <Button type="button" variant="ghost" size="sm" onClick={() => onReply(comment.id)}>
                Trả lời
            </Button>

            {comment.replies.length > 0 && (
                <div className="space-y-3 border-l border-slate-200 pl-4">
                    {comment.replies.map((reply) => (
                        <CommentItem key={reply.id} comment={reply} onReply={onReply} />
                    ))}
                </div>
            )}
        </div>
    );
}

function CommentsView({ contentId }: { contentId: number }) {
    const queryClient = useQueryClient();
    const [commentText, setCommentText] = useState('');
    const [activeParentId, setActiveParentId] = useState<number | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const commentsQuery = useQuery({
        queryKey: ['comments', contentId],
        queryFn: () => fetchComments(contentId),
        enabled: Number.isFinite(contentId),
    });

    useEffect(() => {
        setCommentText('');
        setActiveParentId(null);
        setSubmitError(null);
    }, [contentId]);

    const postMutation = useMutation<CommentNode, unknown, CommentPayload>({
        mutationFn: (payload) => postComment(contentId, payload),
        onSuccess: () => {
            setCommentText('');
            setActiveParentId(null);
            setSubmitError(null);
            queryClient.invalidateQueries({ queryKey: ['comments', contentId] });
        },
        onError: (error) => {
            let message = 'Không thể gửi bình luận. Vui lòng thử lại.';

            if (error instanceof AxiosError) {
                const responseData = error.response?.data as { message?: string; error?: string } | undefined;
                message = responseData?.message ?? responseData?.error ?? error.message ?? message;
            } else if (error instanceof Error) {
                message = error.message;
            }

            setSubmitError(message);
        },
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!commentText.trim()) {
            setSubmitError('Vui lòng nhập nội dung bình luận.');
            return;
        }

        postMutation.mutate({
            text: commentText.trim(),
            parentId: activeParentId ?? undefined,
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-900">Thảo luận</h3>
                <p className="text-sm text-slate-500">Trao đổi cùng giảng viên và học viên khác về nội dung bài học.</p>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
                {submitError && <p className="text-sm text-red-500">{submitError}</p>}

                {activeParentId && (
                    <div className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                        <span>Đang trả lời một bình luận</span>
                        <button type="button" className="text-amber-600 underline" onClick={() => setActiveParentId(null)}>
                            Huỷ
                        </button>
                    </div>
                )}

                <textarea
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder="Chia sẻ suy nghĩ hoặc đặt câu hỏi của bạn..."
                    className="min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    disabled={postMutation.isPending}
                />

                <Button type="submit" disabled={postMutation.isPending}>
                    {postMutation.isPending ? 'Đang gửi...' : 'Gửi bình luận'}
                </Button>
            </form>

            <div className="space-y-4">
                {commentsQuery.isLoading && <p className="text-sm text-slate-500">Đang tải bình luận...</p>}

                {commentsQuery.isError && (
                    <p className="text-sm text-red-500">
                        Không thể tải bình luận: {(commentsQuery.error as Error).message}
                    </p>
                )}

                {commentsQuery.data?.length === 0 && !commentsQuery.isLoading && (
                    <p className="text-sm text-slate-500">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                )}

                {commentsQuery.data && commentsQuery.data.length > 0 && (
                    <div className="space-y-4">
                        {commentsQuery.data.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} onReply={setActiveParentId} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CoursePlayer() {
    const navigate = useNavigate();
    const { courseId: courseIdParam } = useParams<{ courseId: string }>();
    const courseId = Number(courseIdParam);

    const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
    const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
    const [nonEnrollmentMessage, setNonEnrollmentMessage] = useState<string | null>(null);

    const enrollmentQuery = useQuery({
        queryKey: ['enrollment-status', courseId],
        queryFn: () => fetchEnrollmentStatus(courseId),
        enabled: Number.isFinite(courseId),
        onError: (error) => {
            let message = 'Không thể kiểm tra trạng thái ghi danh.';

            if (error instanceof AxiosError) {
                const responseData = error.response?.data as { message?: string; error?: string } | undefined;
                message = responseData?.message ?? responseData?.error ?? error.message ?? message;
            } else if (error instanceof Error) {
                message = error.message;
            }

            setNonEnrollmentMessage(message);
        },
    });

    const isEnrolled = enrollmentQuery.data?.enrolled ?? false;

    const courseQuery = useQuery({
        queryKey: ['learning-course', courseId],
        queryFn: () => fetchCourseDetail(courseId),
        enabled: Number.isFinite(courseId) && isEnrolled,
    });

    useEffect(() => {
        if (courseQuery.data) {
            const sortedInitialModules = [...courseQuery.data.modules].sort((a, b) => a.order - b.order);
            const initialModule = sortedInitialModules[0];
            const initialContent = initialModule
                ? [...initialModule.contents].sort((a, b) => a.order - b.order)[0]
                : undefined;

            setSelectedModuleId(initialModule?.id ?? null);
            setSelectedContentId(initialContent?.id ?? null);
        }
    }, [courseQuery.data]);

    const selectedModule = useMemo(() => {
        if (!courseQuery.data || selectedModuleId === null) {
            return null;
        }
        return courseQuery.data.modules.find((module) => module.id === selectedModuleId) ?? null;
    }, [courseQuery.data, selectedModuleId]);

    const selectedContent = useMemo(() => {
        if (!selectedModule || selectedContentId === null) {
            return null;
        }
        return selectedModule.contents.find((content) => content.id === selectedContentId) ?? null;
    }, [selectedModule, selectedContentId]);

    if (!courseIdParam || Number.isNaN(courseId)) {
        return (
            <section className="container mx-auto px-4 py-10">
                <p className="text-red-500">Khoá học không hợp lệ.</p>
            </section>
        );
    }

    if (enrollmentQuery.isLoading) {
        return (
            <section className="container mx-auto px-4 py-10">
                <p className="text-slate-500">Đang kiểm tra trạng thái ghi danh...</p>
            </section>
        );
    }

    if (!isEnrolled) {
        return (
            <section className="container mx-auto px-4 py-10 space-y-6">
                <h1 className="text-2xl font-semibold text-slate-900">Bạn chưa ghi danh khoá học này</h1>
                <p className="text-sm text-slate-600">
                    {nonEnrollmentMessage ??
                        'Vui lòng đăng ký khoá học trước khi truy cập nội dung học tập. Nếu bạn vừa thanh toán, hãy thử tải lại trang sau ít phút.'}
                </p>
                <div className="flex gap-3">
                    <Button type="button" onClick={() => navigate(`/courses/${courseId}`)}>
                        Quay lại trang khoá học
                    </Button>
                </div>
            </section>
        );
    }

    if (courseQuery.isLoading) {
        return (
            <section className="container mx-auto px-4 py-10">
                <p className="text-slate-500">Đang tải nội dung khoá học...</p>
            </section>
        );
    }

    if (courseQuery.isError || !courseQuery.data) {
        return (
            <section className="container mx-auto px-4 py-10">
                <p className="text-red-500">
                    Không thể tải khoá học: {(courseQuery.error as Error | undefined)?.message ?? 'Không xác định'}
                </p>
            </section>
        );
    }

    const sortedModules = [...courseQuery.data.modules].sort((a, b) => a.order - b.order);

    return (
        <section className="container mx-auto px-4 py-10 space-y-6">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">{courseQuery.data.title}</h1>
                <p className="text-slate-600">{courseQuery.data.description}</p>
            </header>

            <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
                <aside className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Nội dung khoá học</h2>
                    <div className="space-y-4">
                        {sortedModules.map((module) => {
                            const sortedContents = [...module.contents].sort((a, b) => a.order - b.order);
                            const isActiveModule = selectedModuleId === module.id;

                            return (
                                <div key={module.id} className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedModuleId(module.id);
                                            const firstContentInModule = sortedContents[0];
                                            setSelectedContentId(firstContentInModule?.id ?? null);
                                        }}
                                        className={cn(
                                            'flex w-full items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50',
                                            isActiveModule && 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                        )}
                                    >
                                        <span>
                                            Chương {module.order}. {module.title}
                                        </span>
                                    </button>
                                    {isActiveModule && (
                                        <div className="space-y-2 pl-3">
                                            {sortedContents.map((content) => {
                                                const isActiveContent = selectedContentId === content.id;
                                                return (
                                                    <button
                                                        key={content.id}
                                                        type="button"
                                                        onClick={() => setSelectedContentId(content.id)}
                                                        className={cn(
                                                            'w-full rounded-md px-2 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-100',
                                                            isActiveContent && 'bg-emerald-100 text-emerald-700'
                                                        )}
                                                    >
                                                        {content.order}. {content.title}
                                                        <span className="ml-2 text-xs uppercase text-slate-400">{content.contentType}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </aside>

                <div className="space-y-8">
                    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                        {selectedContent ? (
                            <>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-semibold text-slate-900">{selectedContent.title}</h2>
                                    <p className="text-xs uppercase tracking-wide text-slate-400">Loại nội dung: {selectedContent.contentType}</p>
                                </div>

                                {selectedContent.contentType === QUIZ_TYPE ? (
                                    <QuizView contentId={selectedContent.id} />
                                ) : (
                                    <p className="text-sm text-slate-600">
                                        Nội dung chi tiết cho bài học này sẽ được cung cấp qua video hoặc tài liệu trong lớp học.
                                        Hãy theo dõi phần thảo luận bên dưới để trao đổi cùng giảng viên.
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-slate-500">Hãy chọn một nội dung để bắt đầu học.</p>
                        )}
                    </section>

                    {selectedContent && (
                        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                            <CommentsView contentId={selectedContent.id} />
                        </section>
                    )}
                </div>
            </div>
        </section>
    );
}
