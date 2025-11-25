"use client"
import React, { useEffect, useState } from 'react'

const Client = ({children}) => {
      const [isClient, setIsClient] = useState(false);

  // Run only after hydration → ensures fully client-only rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Optional: return loading screen or null (nothing)
    return <div />;
  }
  return (
    <>{children}</>
  )
}

export default Client