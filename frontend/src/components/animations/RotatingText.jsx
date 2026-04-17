import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RotatingText({ 
  texts, 
  duration = 2.5,
  className = "",
  mainClassName = ""
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, duration * 1000);
    return () => clearInterval(interval);
  }, [texts, duration]);

  return (
    <span className={`relative inline-flex flex-col overflow-hidden ${mainClassName}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className={`whitespace-nowrap ${className}`}
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
