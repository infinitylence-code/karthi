import { useEffect, useRef, useState } from 'react'

/**
 * Custom hook for lazy loading images
 * @param {string} src - Image source URL
 * @param {string} placeholder - Placeholder image (optional)
 * @returns {object} - { imageSrc, isLoaded }
 */
export const useLazyImage = (src, placeholder = '') => {
    const [imageSrc, setImageSrc] = useState(placeholder)
    const [isLoaded, setIsLoaded] = useState(false)
    const imgRef = useRef(null)

    useEffect(() => {
        let observer

        if (imgRef.current && 'IntersectionObserver' in window) {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setImageSrc(src)
                            setIsLoaded(true)
                            if (imgRef.current) {
                                observer.unobserve(imgRef.current)
                            }
                        }
                    })
                },
                {
                    rootMargin: '50px', // Start loading 50px before image enters viewport
                }
            )

            observer.observe(imgRef.current)
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            setImageSrc(src)
            setIsLoaded(true)
        }

        return () => {
            if (observer && imgRef.current) {
                observer.unobserve(imgRef.current)
            }
        }
    }, [src, placeholder])

    return { imageSrc, isLoaded, imgRef }
}

/**
 * LazyImage component with loading state
 */
export const LazyImage = ({ src, alt, className, style, placeholder }) => {
    const { imageSrc, isLoaded, imgRef } = useLazyImage(src, placeholder)

    return (
        <div ref={imgRef} style={{ position: 'relative', ...style }}>
            <img
                src={imageSrc}
                alt={alt}
                className={className}
                loading="lazy"
                style={{
                    opacity: isLoaded ? 1 : 0.5,
                    transition: 'opacity 0.3s ease-in-out',
                    ...style,
                }}
            />
            {!isLoaded && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                    }}
                />
            )}
            <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
        </div>
    )
}

export default LazyImage
