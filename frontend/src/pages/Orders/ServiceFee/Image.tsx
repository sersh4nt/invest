export function Image(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M33.97 24.2c0 4.11-2.17 7.73-5.46 9.8a10.17 10.17 0 0 0 9.99-10.25A10.17 10.17 0 0 0 27 13.6a11.64 11.64 0 0 1 6.97 10.6zM31 24a10 10 0 1 1-20 0 10 10 0 0 1 20 0zm-15-3a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm8 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm1.22-5.85a1 1 0 0 1 .1 1.41l-7.1 8.12a1 1 0 0 1-1.51-1.32l7.1-8.11a1 1 0 0 1 1.41-.1z"
        clip-rule="evenodd"
      ></path>
    </svg>
  );
}
