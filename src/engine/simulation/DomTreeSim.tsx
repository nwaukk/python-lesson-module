/**
 * HTML DOM Tree & Element Anatomy Simulator
 * Section 14 (Day 22 Signature Simulation):
 * Visualizes HTML parent/child DOM nodes, tag names, attributes (attrs),
 * and clean text extraction (.get_text(strip=True)).
 */

import React, { useState } from 'react';
import { Code2 } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface DomNodeSpec {
  id: 'article' | 'h2' | 'link' | 'price';
  label: string;
  htmlSnippet: string;
  tagName: string;
  attrs: string;
  textContent: string;
  note: string;
}

const NODES: DomNodeSpec[] = [
  {
    id: 'article',
    label: '<article class="card">',
    htmlSnippet: '<article class="card" data-id="101"> ... </article>',
    tagName: 'article',
    attrs: "{'class': ['card'], 'data-id': '101'}",
    textContent: '"Python Mastery Book ₦12,500"',
    note: 'In BeautifulSoup, `class` is always returned as a list of class names because an HTML element can have multiple classes.',
  },
  {
    id: 'h2',
    label: '<h2 class="title">',
    htmlSnippet: '<h2 class="title">  Python Mastery Book \n</h2>',
    tagName: 'h2',
    attrs: "{'class': ['title']}",
    textContent: 'get_text(strip=True) -> "Python Mastery Book"',
    note: 'Raw HTML often contains indentation and newlines. Always pass `strip=True` to `.get_text(strip=True)` to clean whitespace.',
  },
  {
    id: 'link',
    label: '<a href="/books/101">',
    htmlSnippet: '<a href="/books/101" rel="noopener">View</a>',
    tagName: 'a',
    attrs: "{'href': '/books/101', 'rel': ['noopener']}",
    textContent: 'tag["href"] -> "/books/101"',
    note: 'Relative links like "/books/101" must be resolved against the base URL using `urllib.parse.urljoin(base_url, href)`.',
  },
  {
    id: 'price',
    label: '<span class="price">',
    htmlSnippet: '<span class="price">₦12,500</span>',
    tagName: 'span',
    attrs: "{'class': ['price']}",
    textContent: 'get_text(strip=True) -> "₦12,500"',
    note: 'Use `tag.get("data-currency")` instead of `tag["data-currency"]` when an attribute might be missing so KeyError is avoided.',
  },
];

export const DomTreeSim: React.FC = () => {
  const [nodeId, setNodeId] = useState<DomNodeSpec['id']>('article');
  const active = NODES.find((n) => n.id === nodeId) || NODES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="HTML DOM Tree & Element Anatomy Inspector" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">DOM NODE</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="DOM Node Selector">
            {NODES.map((n) => (
              <button
                key={n.id}
                type="button"
                aria-pressed={nodeId === n.id}
                onClick={() => setNodeId(n.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                  nodeId === n.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        <pre className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--accent-primary)] overflow-x-auto">
          {active.htmlSnippet}
        </pre>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
            <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">TAG.NAME</div>
            <div className="font-mono text-xs font-bold text-[var(--accent-primary)]">{active.tagName}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
            <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">TAG.ATTRS</div>
            <div className="font-mono text-xs text-[var(--text-main)] break-words">{active.attrs}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
            <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">EXTRACTED VALUE</div>
            <div className="font-mono text-xs text-[var(--text-main)] break-words">{active.textContent}</div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <Code2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <span>{active.note}</span>
        </div>
      </div>
    </div>
  );
};
