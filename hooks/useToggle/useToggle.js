import React, { useState } from 'react';
import { useCallback } from 'react';

export const useToggle = () => {
  const [state, setState] = useState(false);
  const handlers = {
    on: useCallback(() => setState(true),[]),
    off: useCallback(() => setState(false),[]),
    toggle: useCallback(() => setState(!state),[state]),
  }

  return [state, handlers];
};

export default useToggle;