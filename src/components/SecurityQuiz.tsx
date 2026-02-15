"use client";

import { useState } from "react";
import Link from "next/link";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const questions: QuizQuestion[] = [
  {
    question: "パスワードの安全性について、最も正しいものはどれですか？",
    options: [
      "8文字あれば十分安全",
      "大文字と数字を含めば短くても安全",
      "12文字以上のランダムな文字列が推奨される",
      "定期的に変更すれば同じパスワードでもOK",
    ],
    correct: 2,
    explanation: "現在の推奨は12文字以上のランダムな文字列です。パスワードマネージャーの利用が推奨されます。",
  },
  {
    question: "フィッシングメールの特徴として、最も注意すべきものは？",
    options: [
      "送信者名が知らない人",
      "メールに画像が含まれている",
      "「至急対応が必要」と急かす内容",
      "メールが長文である",
    ],
    correct: 2,
    explanation: "「24時間以内にアカウントが停止」など急かす内容は、フィッシング詐欺の典型的な手口です。",
  },
  {
    question: "二要素認証（2FA）の方式で、最も安全性が高いのは？",
    options: [
      "SMS認証",
      "メール認証",
      "秘密の質問",
      "ハードウェアセキュリティキー",
    ],
    correct: 3,
    explanation: "ハードウェアセキュリティキー（YubiKeyなど）はフィッシング攻撃に対して最も強い防御力を持ちます。",
  },
];

export default function SecurityQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsFinished(false);
  };

  const q = questions[currentQuestion];

  return (
    <section className="py-20 sm:py-24 border-t border-dark-800/50">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 mb-4">
            <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            <span className="text-sm font-medium text-amber-300">セキュリティ力診断</span>
          </div>
          <h2 className="section-heading">あなたのセキュリティ知識をチェック</h2>
          <p className="section-subheading">3問のミニクイズで、基本的なセキュリティ知識を確認しましょう</p>
        </div>

        <div className="mx-auto max-w-2xl">
          {!isFinished ? (
            <div className="rounded-2xl border border-dark-700/30 bg-dark-900/50 p-6 sm:p-8">
              {/* Progress */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm text-dark-400">
                  {currentQuestion + 1} / {questions.length}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-dark-800">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <h3 className="text-lg font-bold text-white mb-6">
                {q.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {q.options.map((option, index) => {
                  let optionClass = "border-dark-700/30 bg-dark-800/50 hover:border-primary-500/30 hover:bg-dark-800 cursor-pointer";

                  if (showResult) {
                    if (index === q.correct) {
                      optionClass = "border-accent-500/50 bg-accent-500/10";
                    } else if (index === selectedAnswer && index !== q.correct) {
                      optionClass = "border-red-500/50 bg-red-500/10";
                    } else {
                      optionClass = "border-dark-700/30 bg-dark-800/30 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={showResult}
                      className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ${optionClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          showResult && index === q.correct
                            ? "bg-accent-500/20 text-accent-400"
                            : showResult && index === selectedAnswer
                            ? "bg-red-500/20 text-red-400"
                            : "bg-dark-700 text-dark-400"
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className={`text-sm ${
                          showResult && index === q.correct ? "text-accent-300 font-medium" : "text-dark-300"
                        }`}>
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showResult && (
                <div className="mt-6 rounded-lg bg-dark-800/50 border border-dark-700/30 p-4">
                  <div className="flex items-start gap-2">
                    <svg className="h-5 w-5 flex-shrink-0 text-primary-400 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                    <p className="text-sm text-dark-300">{q.explanation}</p>
                  </div>
                </div>
              )}

              {/* Next button */}
              {showResult && (
                <button
                  onClick={handleNext}
                  className="mt-6 btn-primary w-full"
                >
                  {currentQuestion < questions.length - 1 ? "次の問題へ" : "結果を見る"}
                </button>
              )}
            </div>
          ) : (
            /* Result */
            <div className="rounded-2xl border border-dark-700/30 bg-dark-900/50 p-8 sm:p-12 text-center">
              <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                score === 3 ? "bg-accent-500/20 text-accent-400" : score >= 2 ? "bg-primary-500/20 text-primary-400" : "bg-amber-500/20 text-amber-400"
              }`}>
                <span className="text-3xl font-bold">{score}/{questions.length}</span>
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                {score === 3 ? "素晴らしい！" : score >= 2 ? "よくできました！" : "もう少し学びましょう"}
              </h3>
              <p className="mt-2 text-dark-400">
                {score === 3
                  ? "基礎的なセキュリティ知識をしっかり理解されています。次は中級・上級コースに挑戦しましょう。"
                  : score >= 2
                  ? "基本的な知識は身についています。コースを受講して、さらにスキルアップしましょう。"
                  : "セキュリティの基礎を学ぶことで、あなたと組織を守る力が身につきます。"}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/courses" className="btn-primary">
                  コースを受講する
                </Link>
                <button onClick={handleRestart} className="btn-secondary">
                  もう一度挑戦
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
