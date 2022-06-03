import React from 'react'
import './Loader.css'
function Loader({ color, size }) {
  const defaultColor = '#e62466'
  return (
    <div
      className="loader"
      style={{
        color: color === 'default' ? defaultColor : color,
        fontSize: size === 'large' ? '80px' : '40px',
        height: size === 'large' ? '80px' : '40px',
        width: size === 'large' ? '80px' : '40px',
      }}
    >
      {/* <i class="ri-loader-4-line"></i> */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size === 'large' ? '80' : '30'}
        height={size === 'large' ? '80' : '30'}
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path
          d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z"
          fill={color === 'default' ? defaultColor : color}
        />
      </svg>
    </div>
  )
}

export default Loader
