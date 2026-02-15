"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface AudioPlayerProps {
  lessonSlug: string;
  lessonTitle: string;
  text: string;
  preGeneratedUrl?: string;
}

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2];

export default function AudioPlayer({
  lessonSlug,
  lessonTitle,
  text,
  preGeneratedUrl,
}: AudioPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(
    preGeneratedUrl || null
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const speedMenuRef = useRef<HTMLDivElement>(null);

  // Close speed menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        speedMenuRef.current &&
        !speedMenuRef.current.contains(event.target as Node)
      ) {
        setShowSpeedMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl && !preGeneratedUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl, preGeneratedUrl]);

  const generateAudio = useCallback(async () => {
    if (audioUrl || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lessonSlug }),
      });

      if (response.status === 503) {
        setApiUnavailable(true);
        setError(null);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || `Generation failed (${response.status})`
        );
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      console.error("Audio generation failed:", err);
      setError(
        err instanceof Error ? err.message : "音声の生成に失敗しました"
      );
    } finally {
      setIsLoading(false);
    }
  }, [audioUrl, isLoading, text, lessonSlug]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      const progressBar = progressRef.current;
      if (!audio || !progressBar || !duration) return;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = clickX / rect.width;
      audio.currentTime = ratio * duration;
    },
    [duration]
  );

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    },
    []
  );

  const handleSpeedChange = useCallback((speed: number) => {
    setPlaybackRate(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  }, []);

  function formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mt-4">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-2 rounded-lg border border-primary-500/30 bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-300 transition-all duration-200 hover:bg-primary-500/20 hover:border-primary-400/50"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
          />
        </svg>
        <span>{isExpanded ? "音声プレイヤーを閉じる" : "音声で聴く"}</span>
        <svg
          className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {/* Expanded Player */}
      {isExpanded && (
        <div className="mt-3 rounded-xl border border-dark-700/30 bg-dark-900/80 p-4 sm:p-5 shadow-lg">
          {/* API Unavailable State */}
          {apiUnavailable && (
            <div className="flex items-center gap-3 rounded-lg bg-dark-800/50 border border-dark-700/30 p-4">
              <svg
                className="h-5 w-5 flex-shrink-0 text-dark-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                />
              </svg>
              <p className="text-sm text-dark-400">
                音声機能は準備中です
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !apiUnavailable && (
            <div className="flex items-center gap-3 rounded-lg bg-red-500/10 border border-red-500/20 p-4 mb-4">
              <svg
                className="h-5 w-5 flex-shrink-0 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Generate or Player */}
          {!apiUnavailable && (
            <>
              {!audioUrl && !isLoading && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <p className="text-sm text-dark-400">
                    {lessonTitle} の音声を生成します
                  </p>
                  <button
                    onClick={generateAudio}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-600/25"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                      />
                    </svg>
                    音声を生成する
                  </button>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center gap-3 py-6">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary-400 [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary-400 [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary-400" />
                  </div>
                  <p className="text-sm text-dark-400">音声を生成中です...</p>
                  <p className="text-xs text-dark-600">
                    日本語音声の生成には数秒かかることがあります
                  </p>
                </div>
              )}

              {/* Audio Player Controls */}
              {audioUrl && (
                <div className="space-y-3">
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleEnded}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    preload="metadata"
                  />

                  {/* Top Row: Play + Progress */}
                  <div className="flex items-center gap-3">
                    {/* Play/Pause Button */}
                    <button
                      onClick={togglePlay}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-white shadow-md transition-all duration-200 hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-600/30"
                      aria-label={isPlaying ? "一時停止" : "再生"}
                    >
                      {isPlaying ? (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>

                    {/* Progress Bar */}
                    <div className="flex-1 flex items-center gap-3">
                      <span className="w-10 text-right text-xs tabular-nums text-dark-400">
                        {formatTime(currentTime)}
                      </span>
                      <div
                        ref={progressRef}
                        onClick={handleProgressClick}
                        className="group relative flex-1 h-2 cursor-pointer rounded-full bg-dark-800"
                        role="slider"
                        aria-label="再生位置"
                        aria-valuemin={0}
                        aria-valuemax={duration}
                        aria-valuenow={currentTime}
                      >
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-600 to-primary-400 transition-[width] duration-100"
                          style={{ width: `${progress}%` }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                          style={{ left: `${progress}%` }}
                        />
                      </div>
                      <span className="w-10 text-xs tabular-nums text-dark-500">
                        {formatTime(duration)}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row: Speed + Volume */}
                  <div className="flex items-center justify-between pt-1">
                    {/* Speed Control */}
                    <div className="relative" ref={speedMenuRef}>
                      <button
                        onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        className="flex items-center gap-1 rounded-md border border-dark-700/50 bg-dark-800/50 px-2.5 py-1 text-xs font-medium text-dark-300 transition-colors hover:border-primary-500/30 hover:text-primary-300"
                      >
                        {playbackRate}x
                        <svg
                          className={`h-3 w-3 transition-transform ${showSpeedMenu ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>

                      {showSpeedMenu && (
                        <div className="absolute bottom-full left-0 mb-1 rounded-lg border border-dark-700/50 bg-dark-900 p-1 shadow-xl z-10">
                          {SPEED_OPTIONS.map((speed) => (
                            <button
                              key={speed}
                              onClick={() => handleSpeedChange(speed)}
                              className={`block w-full rounded-md px-4 py-1.5 text-left text-xs transition-colors ${
                                playbackRate === speed
                                  ? "bg-primary-600/20 text-primary-300 font-medium"
                                  : "text-dark-300 hover:bg-dark-800 hover:text-white"
                              }`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newVol = volume > 0 ? 0 : 1;
                          setVolume(newVol);
                          if (audioRef.current) audioRef.current.volume = newVol;
                        }}
                        className="text-dark-400 hover:text-primary-300 transition-colors"
                        aria-label={volume > 0 ? "ミュート" : "ミュート解除"}
                      >
                        {volume === 0 ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
                          </svg>
                        ) : volume < 0.5 ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M6.75 8.25l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                          </svg>
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-dark-700 accent-primary-500 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-400"
                        aria-label="音量"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
