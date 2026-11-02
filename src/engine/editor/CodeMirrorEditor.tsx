/**
 * CodeMirror 6 Python Editor Component
 * Section 7.1 & 8: CodeMirror 6, Python grammar, line numbers, active line,
 * theme matching, trace execution line highlight.
 */

import React, { useEffect, useRef } from 'react';
import { EditorState, Extension } from '@codemirror/state';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
} from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { bracketMatching, indentOnInput } from '@codemirror/language';
import { oneDark } from '@codemirror/theme-one-dark';
import { useSettings } from '../../store/settingsContext';
import { EDITOR_THEMES } from '../../design/tokens';

interface Props {
  value: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  highlightLine?: number; // Line number (1-indexed) currently executed in trace
  className?: string;
}

export const CodeMirrorEditor: React.FC<Props> = ({
  value,
  onChange,
  readOnly = false,
  highlightLine,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { settings } = useSettings();

  const activeTheme = EDITOR_THEMES.find((t) => t.id === settings.editorThemeId) || EDITOR_THEMES[0];

  // Dynamic theme extension based on editorThemeId and design tokens
  const customTheme = EditorView.theme(
    {
      '&': {
        height: '100%',
        backgroundColor: activeTheme.bg,
        color: activeTheme.fg,
        fontSize: `${settings.codeFontSize}px`,
        fontFamily: 'var(--font-code)',
      },
      '.cm-content': {
        caretColor: activeTheme.cursor,
        padding: '8px 0',
      },
      '.cm-cursor, .cm-dropCursor': { borderLeftColor: activeTheme.cursor },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
        backgroundColor: activeTheme.selection,
      },
      '.cm-panels': { backgroundColor: activeTheme.bg, color: activeTheme.fg },
      '.cm-panels.cm-panels-top': { borderBottom: '1px solid var(--border-subtle)' },
      '.cm-panels.cm-panels-bottom': { borderTop: '1px solid var(--border-subtle)' },
      '.cm-activeLine': {
        backgroundColor: `${activeTheme.lineHighlight}80`,
      },
      '.cm-gutters': {
        backgroundColor: activeTheme.bg,
        color: 'var(--text-dim)',
        borderRight: '1px solid var(--border-subtle)',
      },
      '.cm-activeLineGutter': {
        backgroundColor: activeTheme.lineHighlight,
        color: activeTheme.fg,
      },
      // Line highlight during step trace execution
      '.pvl-trace-highlight-line': {
        backgroundColor: 'rgba(56, 189, 248, 0.28) !important',
        borderLeft: '4px solid var(--accent-primary) !important',
      },
    },
    { dark: activeTheme.isDark }
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const extensions: Extension[] = [
      python(),
      keymap.of([...defaultKeymap, indentWithTab]),
      bracketMatching(),
      indentOnInput(),
      customTheme,
    ];

    if (settings.lineNumbers) {
      extensions.push(lineNumbers());
      extensions.push(highlightActiveLineGutter());
    }

    if (settings.activeLineHighlight) {
      extensions.push(highlightActiveLine());
    }

    if (settings.wordWrap) {
      extensions.push(EditorView.lineWrapping);
    }

    if (readOnly) {
      extensions.push(EditorState.readOnly.of(true));
    }

    // Listener for text changes
    extensions.push(
      EditorView.updateListener.of((update) => {
        if (update.docChanged && onChange) {
          onChange(update.state.doc.toString());
        }
      })
    );

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [
    settings.editorThemeId,
    settings.codeFontSize,
    settings.lineNumbers,
    settings.wordWrap,
    settings.activeLineHighlight,
    readOnly,
  ]);

  // Sync external value if changed programmatically
  useEffect(() => {
    if (viewRef.current) {
      const currentDoc = viewRef.current.state.doc.toString();
      if (value !== currentDoc) {
        viewRef.current.dispatch({
          changes: { from: 0, to: currentDoc.length, insert: value },
        });
      }
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden font-mono ${className}`}
      style={{
        fontVariantLigatures: settings.fontLigatures ? 'normal' : 'none',
      }}
    />
  );
};
