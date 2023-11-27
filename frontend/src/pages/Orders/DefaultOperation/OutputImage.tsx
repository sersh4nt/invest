export default function OutputImage(
  props: React.ComponentPropsWithoutRef<"svg">
) {
  return (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="currentColor"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.9806 17.9913C15.5774 17.9913 15.2626 17.9913 15.0044 17.9997C15.0154 17.6758 15.0401 17.4414 15.0954 17.2322C15.3714 16.1899 16.1855 15.3758 17.2278 15.0999C17.6052 15 18.0648 15 18.9841 15H29.0247C29.944 15 30.4036 15 30.781 15.0999C31.8233 15.3758 32.6374 16.1899 32.9134 17.2322C32.9687 17.4414 32.9934 17.6758 33.0044 17.9998C32.746 17.9913 32.4309 17.9913 32.0272 17.9913L15.9806 17.9913ZM36 28.8C36 29.9167 36 30.4751 35.8532 30.927C35.5564 31.8403 34.8404 32.5564 33.9271 32.8531C33.4752 33 32.9168 33 31.8 33L16.2 33C15.0832 33 14.5248 33 14.0729 32.8531C13.1596 32.5564 12.4436 31.8403 12.1468 30.927C12 30.4751 12 29.9167 12 28.8L12 23.2C12 22.0832 12 21.5248 12.1468 21.0729C12.4436 20.1596 13.1596 19.4436 14.0729 19.1468C14.5248 19 15.0832 19 16.2 19H31.8C32.9168 19 33.4752 19 33.9271 19.1468C34.8404 19.4436 35.5564 20.1596 35.8532 21.0729C36 21.5248 36 22.0832 36 23.2L36 28.8ZM28 26C28 28.2091 26.2091 30 24 30C21.7909 30 20 28.2091 20 26C20 23.7908 21.7909 22 24 22C26.2091 22 28 23.7908 28 26ZM15 23C15 22.4477 15.4477 22 16 22C16.5523 22 17 22.4477 17 23V29C17 29.5523 16.5523 30 16 30C15.4477 30 15 29.5523 15 29V23ZM32 22C31.4477 22 31 22.4477 31 23V29C31 29.5523 31.4477 30 32 30C32.5523 30 33 29.5523 33 29V23C33 22.4477 32.5523 22 32 22Z"
      ></path>
    </svg>
  );
}
