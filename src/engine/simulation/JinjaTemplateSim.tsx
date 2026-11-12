import React, { useState } from 'react';
import { Code2, ShieldCheck, AlertOctagon } from 'lucide-react';

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const JinjaTemplateSim: React.FC = () => {
  const [userName, setUserName] = useState<string>('Ada');
  const [role, setRole] = useState<'member' | 'admin'>('admin');
  const [autoEscape, setAutoEscape] = useState<boolean>(true);
  const [items] = useState<string[]>(['Routes', 'Jinja2', 'Blueprints']);

  const renderedName = autoEscape ? escapeHtml(userName) : userName;
  const hasScriptTag = userName.toLowerCase().includes('<script');

  const renderedHtml = `{% extends "base.html" %}
{% block content %}
  <h2>Hello, ${renderedName}</h2>
  ${role === 'admin' ? '<p class="badge">Admin Access</p>' : '<p>Standard Member</p>'}
  <ul>
${items.map((item) => `    <li>${item}</li>`).join('\n')}
  </ul>
{% endblock %}`;

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-panel)] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-violet-400" />
          <h4 className="text-sm font-bold text-[var(--text-main)]">
            Jinja2 Template &amp; Auto-Escaping Lab
          </h4>
        </div>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Jinja2 context controls">
          <button
            type="button"
            onClick={() => setUserName('Ada')}
            aria-pressed={userName === 'Ada'}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
              userName === 'Ada'
                ? 'bg-violet-500/20 text-violet-300 border-violet-500/50'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)]'
            }`}
          >
            user="Ada"
          </button>
          <button
            type="button"
            onClick={() => setUserName('<script>alert("XSS")</script>')}
            aria-pressed={hasScriptTag}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
              hasScriptTag
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)]'
            }`}
          >
            Test XSS Input
          </button>
          <button
            type="button"
            onClick={() => setRole(role === 'admin' ? 'member' : 'admin')}
            aria-pressed={role === 'admin'}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg border bg-[var(--bg-card)] text-[var(--text-main)] border-[var(--border-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            role: {role}
          </button>
          <button
            type="button"
            onClick={() => setAutoEscape(!autoEscape)}
            aria-pressed={autoEscape}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
              autoEscape
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/50'
            }`}
          >
            Autoescape: {autoEscape ? 'ON' : 'OFF (|safe)'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-violet-400">
            Template Source (home.html)
          </div>
          <pre className="font-mono text-xs text-[var(--text-main)] whitespace-pre-wrap overflow-x-auto bg-[var(--bg-app)] p-2.5 rounded-md border border-[var(--border-subtle)]">
{`{% extends "base.html" %}
{% block content %}
  <h2>Hello, {{ user_name${autoEscape ? '' : ' | safe'} }}</h2>
  {% if role == "admin" %}
    <p class="badge">Admin Access</p>
  {% else %}
    <p>Standard Member</p>
  {% endif %}
  <ul>
  {% for topic in items %}
    <li>{{ topic }}</li>
  {% endfor %}
  </ul>
{% endblock %}`}
          </pre>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Rendered HTML Output
            </span>
            {hasScriptTag && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                  autoEscape
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {autoEscape ? <ShieldCheck className="w-3 h-3" /> : <AlertOctagon className="w-3 h-3" />}
                {autoEscape ? 'XSS Neutralized' : 'Unsafe Script Injected!'}
              </span>
            )}
          </div>
          <pre className="font-mono text-xs text-[var(--text-main)] whitespace-pre-wrap overflow-x-auto bg-[var(--bg-app)] p-2.5 rounded-md border border-[var(--border-subtle)]">
            {renderedHtml}
          </pre>
        </div>
      </div>
    </div>
  );
};
