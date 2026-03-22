type IconProps = {
  className?: string
  ariaHidden?: boolean
}

function IconDownload({ className, ariaHidden = true }: IconProps) {
  return (
    <svg
      aria-hidden={ariaHidden}
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 15.7885L7.73075 11.5192L8.78475 10.4348L11.25 12.9V4.5H12.75V12.9L15.2153 10.4348L16.2693 11.5192L12 15.7885ZM4.5 19.5V14.9808H6V18H18V14.9808H19.5V19.5H4.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default IconDownload
