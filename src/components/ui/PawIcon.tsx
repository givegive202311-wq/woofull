"use client";

type PawIconProps = {
  size?: number;
  className?: string;
  color?: string;
  double?: boolean;
};

function SinglePaw({ color }: { color: string }) {
  return (
    <g>
      {/* メインパッド（ハート寄りの形） */}
      <path d="M50 58 C50 58, 30 62, 28 72 C26 82, 34 90, 50 88 C66 90, 74 82, 72 72 C70 62, 50 58, 50 58Z" />
      {/* 左外の指パッド */}
      <ellipse cx="24" cy="44" rx="9" ry="11" transform="rotate(-10 24 44)" />
      {/* 左内の指パッド */}
      <ellipse cx="40" cy="34" rx="8" ry="10" transform="rotate(-5 40 34)" />
      {/* 右内の指パッド */}
      <ellipse cx="60" cy="34" rx="8" ry="10" transform="rotate(5 60 34)" />
      {/* 右外の指パッド */}
      <ellipse cx="76" cy="44" rx="9" ry="11" transform="rotate(10 76 44)" />
    </g>
  );
}

export function PawIcon({
  size = 24,
  className = "",
  color = "currentColor",
  double = false,
}: PawIconProps) {
  if (double) {
    return (
      <svg
        width={size * 1.6}
        height={size}
        viewBox="0 0 160 100"
        fill={color}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(0, 5) rotate(-15 50 50) scale(0.85)">
          <SinglePaw color={color} />
        </g>
        <g transform="translate(65, -5) rotate(15 50 50) scale(0.85)">
          <SinglePaw color={color} />
        </g>
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill={color}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <SinglePaw color={color} />
    </svg>
  );
}
