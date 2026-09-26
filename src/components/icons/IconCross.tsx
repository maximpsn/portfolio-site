type IconProps = {
  className?: string
  ariaHidden?: boolean
}

function IconCross({ className, ariaHidden = true }: IconProps) {
  return (
    <svg
      aria-hidden={ariaHidden}
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        d="M17.7198 5.21997C18.0127 4.92709 18.4875 4.92708 18.7804 5.21997C19.073 5.51288 19.0732 5.98772 18.7804 6.28052L13.0597 12.0002L18.7794 17.72C19.072 18.0129 19.0722 18.4877 18.7794 18.7805C18.4866 19.0732 18.0118 19.0731 17.7189 18.7805L11.9991 13.0608L6.28137 18.7795C5.98858 19.0723 5.51374 19.0721 5.22083 18.7795C4.92794 18.4866 4.92794 18.0119 5.22083 17.719L10.9386 12.0002L5.21985 6.28149C4.92697 5.98862 4.92701 5.51385 5.21985 5.22095C5.51274 4.92806 5.98751 4.92806 6.2804 5.22095L11.9991 10.9397L17.7198 5.21997Z"
      />
    </svg>
  )
}

export default IconCross