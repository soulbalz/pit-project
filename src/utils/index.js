import { useEffect, useRef } from 'react';

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const hasPerm = (permissions, credentials) => {
  if (permissions === null || credentials?.role === 'superadmin') return true;
  return permissions.some(perm => credentials?.role === perm);
};
