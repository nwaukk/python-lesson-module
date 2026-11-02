/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SettingsProvider } from './store/settingsContext';
import { ProgressProvider } from './store/progressContext';
import { NavigationProvider } from './store/navigationContext';
import { RuntimeProvider } from './engine/runtime/runtimeContext';
import { ErrorBoundary } from './app/ErrorBoundary';
import { AppShell } from './app/AppShell';

export default function App() {
  return (
    <ErrorBoundary fallbackTitle="Application Shell Error">
      <SettingsProvider>
        <ProgressProvider>
          <NavigationProvider>
            <RuntimeProvider>
              <AppShell />
            </RuntimeProvider>
          </NavigationProvider>
        </ProgressProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
}
