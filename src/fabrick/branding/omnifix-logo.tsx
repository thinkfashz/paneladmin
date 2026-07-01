export function OmnifixLogo({ className = "size-20", showText = false }: { className?: string; showText?: boolean }) {
  return (
    <img
      src={showText ? "/omnifix-logo-transparent.svg" : "/omnifix-mark.svg"}
      alt="Omnifix"
      className={`${className} object-contain drop-shadow-[0_18px_34px_rgba(0,82,255,.32)]`}
      loading="eager"
    />
  );
}
