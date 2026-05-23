"use client";

import { motion } from "framer-motion";

type FlavorChipProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
};

export function FlavorChip({ label, selected = false, onClick }: FlavorChipProps) {
  const className = selected
    ? "border-coffee-dark bg-coffee-dark text-white"
    : "border-coffee-border bg-coffee-card text-coffee-secondary";

  if (onClick) {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={onClick}
        className={`focus-ring rounded-lg border px-3 py-2 text-sm font-medium transition ${className}`}
      >
        {label}
      </motion.button>
    );
  }

  return (
    <span className={`rounded-lg border px-3 py-2 text-sm font-medium ${className}`}>
      {label}
    </span>
  );
}

