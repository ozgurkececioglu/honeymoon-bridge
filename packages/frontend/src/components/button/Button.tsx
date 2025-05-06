import { ReactNode } from 'react';
import cx from 'utils/classNames';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  className?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const Button = ({ children, className, startIcon, endIcon, variant = 'primary', ...rest }: Props) => {
  return (
    <button
      className={cx(
        'border px-2 py-1 rounded cursor-pointer flex items-center gap-2',
        {
          'border-gray-300 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800': variant === 'primary',
          'border-blue-500 bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white': variant === 'secondary',
        },
        className,
      )}
      {...rest}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
};
