import React, { useState } from 'react'
import { cn } from '../../../utils/cn'
import { PriceTag } from '../../molecules/PriceTag'
import { Rating } from '../../atoms/Rating'
import { Tag } from '../../atoms/Tag'
import { Button } from '../../atoms/Button'

export interface ProductCardProps {
  image: string
  title: string
  description?: string
  price: number
  originalPrice?: number
  rating?: number
  reviewCount?: number
  tags?: string[]
  inStock?: boolean
  onAddToCart?: () => void
  onFavorite?: () => void
  onQuickView?: () => void
  layout?: 'grid' | 'list'
  className?: string
}

function HeartOutline() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function HeartFilled() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

export function ProductCard({
  image,
  title,
  description,
  price,
  originalPrice,
  rating = 0,
  reviewCount,
  tags = [],
  inStock = true,
  onAddToCart,
  onFavorite,
  onQuickView,
  layout = 'grid',
  className,
}: ProductCardProps) {
  const [favorited, setFavorited] = useState(false)
  const [hovered, setHovered] = useState(false)

  function handleFavorite(e: React.MouseEvent) {
    e.stopPropagation()
    setFavorited((f) => !f)
    onFavorite?.()
  }

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation()
    onAddToCart?.()
  }

  // List layout
  if (layout === 'list') {
    return (
      <div
        className={cn('ds-product-card relative flex flex-row overflow-hidden', className)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onQuickView}
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-base)',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out)',
          fontFamily: 'var(--font-base)',
          border: '1px solid rgba(255,255,255,0.05)',
          cursor: onQuickView ? 'pointer' : 'default',
        }}
      >
        {/* Image — fixed width in list mode */}
        <div className="relative overflow-hidden shrink-0" style={{ width: 140, minHeight: 110 }}>
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover block"
            style={{
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform var(--duration-slow) var(--ease-out)',
            }}
          />
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.55)' }}>
              <span className="text-white font-bold text-[0.7rem] px-2 py-[0.2rem] uppercase tracking-[0.05em]" style={{ background: 'var(--gradient-danger)', borderRadius: 'var(--radius-full)' }}>
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-5 py-4 min-w-0">
          <div className="flex gap-[0.4rem] flex-wrap items-center mb-1.5">
            {tags.map((tag) => <Tag key={tag} label={tag} size="sm" variant="primary" />)}
          </div>
          <p className="m-0 mb-1.5 text-[0.9rem] font-bold leading-[1.3] truncate" style={{ color: 'var(--color-gray-100)' }}>
            {title}
          </p>
          {description && (
            <p className="m-0 mb-2 text-[0.78rem] leading-[1.4] line-clamp-2" style={{ color: 'var(--color-gray-500)' }}>
              {description}
            </p>
          )}
          <div className="flex items-center gap-[0.4rem] mb-2">
            {rating > 0 && (
              <>
                <Rating value={rating} readonly size="sm" />
                {reviewCount !== undefined && (
                  <span className="text-[0.72rem]" style={{ color: 'var(--color-gray-600)' }}>({reviewCount})</span>
                )}
              </>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 mt-auto">
            <PriceTag price={price} originalPrice={originalPrice} size="md" />
            <Button variant="primary" size="sm" disabled={!inStock} onClick={handleAddToCart}>
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>

        {/* Favorite button */}
        <button
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          onClick={handleFavorite}
          className="absolute top-2 right-2 z-10 w-[30px] h-[30px] flex items-center justify-center rounded-full cursor-pointer"
          style={{
            background: 'rgba(0,0,0,0.45)',
            border: 'none',
            color: favorited ? '#ff5252' : '#fff',
            transition: 'background var(--duration-fast)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {favorited ? <HeartFilled /> : <HeartOutline />}
        </button>
      </div>
    )
  }

  // Grid layout (default)
  return (
    <div
      className={cn('ds-product-card relative flex flex-col overflow-hidden', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onQuickView}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-base)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out)',
        fontFamily: 'var(--font-base)',
        border: '1px solid rgba(255,255,255,0.05)',
        cursor: onQuickView ? 'pointer' : 'default',
      }}
    >
      {/* Favorite button */}
      <button
        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        onClick={handleFavorite}
        className="absolute top-3 right-3 z-10 w-[34px] h-[34px] flex items-center justify-center rounded-full cursor-pointer"
        style={{
          background: 'rgba(0,0,0,0.45)',
          border: 'none',
          color: favorited ? '#ff5252' : '#fff',
          transform: favorited ? 'scale(1.15)' : 'scale(1)',
          transition: 'background var(--duration-fast), transform var(--duration-fast)',
          backdropFilter: 'blur(4px)',
        }}
      >
        {favorited ? <HeartFilled /> : <HeartOutline />}
      </button>

      {/* Image — 3:2 ratio for more visual impact */}
      <div className="relative overflow-hidden shrink-0" style={{ paddingBottom: '66.67%' }}>
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover block"
          style={{
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform var(--duration-slow) var(--ease-out)',
          }}
        />

        {/* Quick view overlay on hover */}
        {onQuickView && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: 'rgba(0,0,0,0.45)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity var(--duration-fast)',
            }}
          >
            <span
              className="text-white text-[0.8rem] font-semibold uppercase tracking-[0.05em] px-[1.1rem] py-[0.45rem] rounded-full"
              style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              Quick View
            </span>
          </div>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.55)' }}>
            <span
              className="text-white font-bold text-[0.85rem] px-4 py-[0.35rem] uppercase tracking-[0.05em]"
              style={{
                background: 'var(--gradient-danger)',
                borderRadius: 'var(--radius-full)',
              }}
            >
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '1.1rem 1.25rem 1.25rem',
        }}
      >
        {/* Tags — always reserves space so layout doesn't shift */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', minHeight: '1.6rem', alignItems: 'center', marginBottom: '0.6rem' }}>
          {tags.map((tag) => (
            <Tag key={tag} label={tag} size="sm" variant="primary" />
          ))}
        </div>

        {/* Title */}
        <p
          style={{
            margin: '0 0 0.5rem',
            fontSize: '0.92rem',
            fontWeight: 700,
            lineHeight: 1.3,
            color: 'var(--color-gray-100)',
          }}
        >
          {title}
        </p>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem', minHeight: '1.4rem' }}>
          {rating > 0 ? (
            <>
              <Rating value={rating} readonly size="sm" />
              {reviewCount !== undefined && (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-600)' }}>
                  ({reviewCount})
                </span>
              )}
            </>
          ) : null}
        </div>

        {/* Price */}
        <PriceTag price={price} originalPrice={originalPrice} size="md" />

        {/* Add to cart — pushed to bottom */}
        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            disabled={!inStock}
            onClick={handleAddToCart}
          >
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </div>
  )
}
