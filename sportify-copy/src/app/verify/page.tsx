import { Suspense } from 'react';
import VerifyContent from './VerifyContent';

export default function Verify() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}