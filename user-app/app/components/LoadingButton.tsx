import { ButtonHTMLAttributes } from 'react'

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
}

export default function LoadingButton({ 
  loading = false, 
  children, 
  variant = 'primary',
  className = '',
  disabled,
  ...props 
}: LoadingButtonProps) {
  
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg',
    secondary: 'bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  )
}