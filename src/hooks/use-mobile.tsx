
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with undefined to prevent hydration mismatch
  const [isMobile, setIsMobile] = React.useState(false)
  
  React.useEffect(() => {
    // Function to check if viewport is mobile width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check on initial render
    checkMobile()
    
    // Set up event listener for window resize
    window.addEventListener('resize', checkMobile)
    
    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}
