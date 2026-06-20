"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PawIcon } from "./PawIcon";

const slides = [
  {
    image: "/images/hero-first-meet.png",
    message: "はじめて抱っこした日を、覚えていますか",
    kenBurns: "origin-center scale-110",
  },
  {
    image: "/images/hero-morning-walk.png",
    message: "毎朝のお散歩が、いつの間にか宝物になった",
    kenBurns: "origin-left scale-110",
  },
  {
    image: "/images/hero-gaze.png",
    message: "あなたが笑うと、しっぽが揺れる",
    kenBurns: "origin-right scale-110",
  },
  {
    image: "/images/hero-cozy.png",
    message: "この時間が、ずっと続きますように",
    kenBurns: "origin-center scale-105",
  },
];

const SLIDE_DURATION = 5500;

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  const advance = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setTimeout(advance, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [current, advance]);

  const slide = slides[current];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#2D2D2D]">
      {/* 写真スライド */}
      <AnimatePresence>
        <motion.div
          key={`photo-${current}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        >
          <div
            className={`absolute inset-0 transition-transform duration-[5500ms] ease-linear ${slide.kenBurns}`}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              className="object-cover"
              priority={current === 0}
              sizes="100vw"
            />
          </div>

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 30%, transparent 60%)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* テキスト: 下部にミニマルに配置 */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-8 md:px-16 pb-24 md:pb-20">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="flex items-end gap-6"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="hidden md:block flex-shrink-0"
                style={{ width: "2px", backgroundColor: "#F6A54B" }}
                variants={{
                  hidden: { height: 0, opacity: 0 },
                  visible: { height: 48, opacity: 1 },
                  exit: { height: 0, opacity: 0 },
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />

              <div>
                <motion.p
                  className="text-lg md:text-xl text-white/50 font-body mb-2 tracking-widest"
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 },
                    exit: { opacity: 0 },
                  }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                </motion.p>
                <motion.p
                  className="text-xl md:text-2xl lg:text-3xl font-medium font-heading text-white leading-relaxed tracking-wide"
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
                  }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                >
                  {slide.message}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* スライドインジケーター */}
      <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="transition-all duration-500"
            style={{
              width: "2px",
              height: i === current ? "36px" : "14px",
              borderRadius: "1px",
              backgroundColor: i === current ? "#F6A54B" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>

      {/* スクロール誘導 */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">
            Scroll
          </span>
          <div className="w-px h-5" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
        </div>
      </motion.div>
    </section>
  );
}
