/**
 * Hash-Based Navigation Context
 * Supports deep linking, responsive tab tracking, Day 0 (Welcome Tour), and subtopic navigation.
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { getDayModule } from '../engine/lesson/dayLoader';

export type AppRoute =
  | 'dashboard'
  | 'roadmap'
  | 'lesson'
  | 'notebook'
  | 'playground'
  | 'methods'
  | 'notes'
  | 'glossary'
  | 'teaching'
  | 'credits'
  | 'certificate'
  | 'selftest';

interface NavigationContextValue {
  route: AppRoute;
  activeDay: number;
  activeSubtopicIndex: number;
  mobileTab: 'concept' | 'visualise' | 'code' | 'output' | 'practise';
  setMobileTab: (tab: 'concept' | 'visualise' | 'code' | 'output' | 'practise') => void;
  navigateTo: (route: AppRoute, params?: { day?: number; subtopic?: number }) => void;
  selectDay: (dayNumber: number) => void;
  selectSubtopic: (index: number) => void;
  nextSubtopic: () => void;
  prevSubtopic: () => void;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

function parseHash(hash: string): { route: AppRoute; day: number; subtopic: number } {
  const clean = hash.replace(/^#\/?/, '').trim();
  if (!clean || clean === 'dashboard') {
    return { route: 'dashboard', day: 1, subtopic: 0 };
  }
  if (clean === 'roadmap') return { route: 'roadmap', day: 1, subtopic: 0 };
  if (clean === 'notebook') return { route: 'notebook', day: 1, subtopic: 0 };
  if (clean === 'playground') return { route: 'playground', day: 1, subtopic: 0 };
  if (clean === 'methods') return { route: 'methods', day: 1, subtopic: 0 };
  if (clean === 'notes') return { route: 'notes', day: 1, subtopic: 0 };
  if (clean === 'glossary') return { route: 'glossary', day: 1, subtopic: 0 };
  if (clean === 'teaching') return { route: 'teaching', day: 1, subtopic: 0 };
  if (clean === 'credits') return { route: 'credits', day: 1, subtopic: 0 };
  if (clean === 'certificate') return { route: 'certificate', day: 1, subtopic: 0 };
  if (clean.startsWith('dev/selftest')) return { route: 'selftest', day: 1, subtopic: 0 };

  const dayMatch = clean.match(/^day\/(\d+)(?:\/subtopic\/(\d+))?/);
  if (dayMatch) {
    const parsedDay = parseInt(dayMatch[1], 10);
    const day = Math.max(0, Math.min(30, isNaN(parsedDay) ? 1 : parsedDay));
    const subtopic = Math.max(0, parseInt(dayMatch[2], 10) || 0);
    return { route: 'lesson', day, subtopic };
  }

  return { route: 'dashboard', day: 1, subtopic: 0 };
}

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = useMemo(() => {
    return typeof window !== 'undefined'
      ? parseHash(window.location.hash)
      : { route: 'dashboard' as AppRoute, day: 1, subtopic: 0 };
  }, []);

  const [route, setRoute] = useState<AppRoute>(initial.route);
  const [activeDay, setActiveDay] = useState<number>(initial.day);
  const [activeSubtopicIndex, setActiveSubtopicIndex] = useState<number>(initial.subtopic);
  const [mobileTab, setMobileTab] = useState<'concept' | 'visualise' | 'code' | 'output' | 'practise'>('concept');

  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHash(window.location.hash);
      setRoute(parsed.route);
      setActiveDay(parsed.day);
      setActiveSubtopicIndex(parsed.subtopic);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = useCallback((newRoute: AppRoute, params?: { day?: number; subtopic?: number }) => {
    const targetDay = params?.day ?? activeDay;
    const targetSubtopic = params?.subtopic ?? (newRoute === 'lesson' ? activeSubtopicIndex : 0);

    setRoute(newRoute);
    if (params?.day !== undefined) setActiveDay(targetDay);
    if (params?.subtopic !== undefined) setActiveSubtopicIndex(targetSubtopic);

    let newHash = '';
    if (newRoute === 'dashboard') newHash = '#/';
    else if (newRoute === 'lesson') newHash = `#/day/${targetDay}/subtopic/${targetSubtopic}`;
    else if (newRoute === 'selftest') newHash = '#/dev/selftest';
    else newHash = `#/${newRoute}`;

    window.location.hash = newHash;
  }, [activeDay, activeSubtopicIndex]);

  const selectDay = useCallback((dayNumber: number) => {
    const bounded = Math.max(0, Math.min(30, dayNumber));
    setActiveDay(bounded);
    setActiveSubtopicIndex(0);
    window.location.hash = `#/day/${bounded}/subtopic/0`;
    setRoute('lesson');
  }, []);

  const selectSubtopic = useCallback((index: number) => {
    const currentModule = getDayModule(activeDay);
    const maxSubtopics = currentModule ? currentModule.subtopics.length - 1 : 9;
    const bounded = Math.max(0, Math.min(maxSubtopics, index));
    setActiveSubtopicIndex(bounded);
    window.location.hash = `#/day/${activeDay}/subtopic/${bounded}`;
  }, [activeDay]);

  const nextSubtopic = useCallback(() => {
    const currentModule = getDayModule(activeDay);
    const maxSubtopics = currentModule ? currentModule.subtopics.length - 1 : 9;
    if (activeSubtopicIndex < maxSubtopics) {
      selectSubtopic(activeSubtopicIndex + 1);
    } else if (activeDay < 30) {
      selectDay(activeDay + 1);
    }
  }, [activeDay, activeSubtopicIndex, selectSubtopic, selectDay]);

  const prevSubtopic = useCallback(() => {
    if (activeSubtopicIndex > 0) {
      selectSubtopic(activeSubtopicIndex - 1);
    } else if (activeDay > 0) {
      const prevModule = getDayModule(activeDay - 1);
      const prevMax = prevModule ? prevModule.subtopics.length - 1 : 0;
      setActiveDay(activeDay - 1);
      setActiveSubtopicIndex(prevMax);
      window.location.hash = `#/day/${activeDay - 1}/subtopic/${prevMax}`;
    }
  }, [activeDay, activeSubtopicIndex, selectSubtopic]);

  const value = useMemo(
    () => ({
      route,
      activeDay,
      activeSubtopicIndex,
      mobileTab,
      setMobileTab,
      navigateTo,
      selectDay,
      selectSubtopic,
      nextSubtopic,
      prevSubtopic,
    }),
    [
      route,
      activeDay,
      activeSubtopicIndex,
      mobileTab,
      navigateTo,
      selectDay,
      selectSubtopic,
      nextSubtopic,
      prevSubtopic,
    ]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export const useNavigation = (): NavigationContextValue => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
