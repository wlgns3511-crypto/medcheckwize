import { Metadata } from 'next';
import { MedicareCostCalculator } from '@/components/MedicareCostCalculator';

export const metadata: Metadata = {
  title: 'Medicare Cost Calculator - Embeddable Widget',
  robots: 'noindex, nofollow',
  openGraph: { url: "/embed/medicare-calc/" },
};

export default function EmbedMedicareCalcPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <MedicareCostCalculator />
      <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 12 }}>
        Powered by{' '}
        <a href="https://medcheckwize.com" target="_blank" rel="noopener" style={{ color: '#0d9488', textDecoration: 'underline' }}>
          MedCheckWize
        </a>
      </p>
    </div>
  );
}
