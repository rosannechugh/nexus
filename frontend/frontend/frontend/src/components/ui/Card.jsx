const variants = {
  flat: "bg-surface border border-line",
  raised: "bg-surface-raised border border-line shadow-[0_1px_0_0_theme(colors.line)]",
  outline: "bg-transparent border border-line-strong",
};

export default function Card({
  as: Tag = "div",
  variant = "flat",
  className = "",
  children,
  ...props
}) {
  return (
    <Tag
      className={`rounded-lg p-6 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
