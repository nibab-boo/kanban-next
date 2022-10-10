import React, { useState } from 'react';
import { useCallback } from 'react';

interface HandlersType {
  on: () => void;
  off: () => void;
  toggle: () => void;
}
type UseToggleType = () => [boolean, HandlersType];

export const useToggle: UseToggleType = () => {
  const [state, setState] = useState<boolean>(false);
  const handlers: HandlersType = {
    on: useCallback(() => setState(true),[]),
    off: useCallback(() => setState(false),[]),
    toggle: useCallback(() => setState((state) => !state),[]),
  }

  return [state, handlers];
};

export default useToggle;