'use client';

type AdFormat = 'auto' | 'rectangle' | 'horizontal' | 'vertical';

interface AdSlotProps {
  /** Your AdSense ad slot ID — replace with actual value after AdSense approval */
  slot?: string;
  /** Ad format */
  format?: AdFormat;
  /** Full-width responsive */
  fullWidth?: boolean;
  /** CSS class for the wrapper */
  className?: string;
}

/**
 * Google AdSense ad slot component.
 * 
 * Usage:
 *   <AdSlot slot="1234567890" format="auto" fullWidth />
 * 
 * After your AdSense account is approved:
 * 1. Replace the `data-ad-client` value with your actual publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
 * 2. Pass the correct `slot` prop for each ad placement
 * 3. Remove the placeholder UI
 */
export function AdSlot({
  slot = '',
  format = 'auto',
  fullWidth = true,
  className = '',
}: AdSlotProps) {
  // Show placeholder when no slot is configured (before AdSense approval)
  if (!slot) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-xs text-gray-400 ${className}`}
        style={{ minHeight: format === 'horizontal' ? 90 : 250 }}
        aria-hidden="true"
      >
        <span>Iklan</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4348406121095343"
        data-ad-slot={slot}
        data-ad-format={format}
        {...(fullWidth && { 'data-full-width-responsive': 'true' })}
      />
    </div>
  );
}
