/**
 * Web Scraping Ethics, robots.txt & Rate-Limiting Pipeline Simulator
 * Section 14 (Day 22 Signature Simulation):
 * Visualizes robots.txt rules, User-Agent headers, Crawl-delay / time.sleep,
 * and HTTP 429 backoff.
 */

import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface EthicsCase {
  id: 'robots' | 'headers' | 'ratelimit' | 'pagination';
  label: string;
  rule: string;
  behavior: string;
  note: string;
}

const CASES: EthicsCase[] = [
  {
    id: 'robots',
    label: 'robots.txt Check',
    rule: 'User-agent: *\nDisallow: /admin/\nAllow: /public/\nCrawl-delay: 2',
    behavior: 'can_fetch("*", "/public/books") -> True | can_fetch("*", "/admin/users") -> False',
    note: 'Always check `/robots.txt` using `urllib.robotparser.RobotFileParser` before scraping a domain, and prefer official APIs when available.',
  },
  {
    id: 'headers',
    label: 'User-Agent & Timeout',
    rule: 'headers = {"User-Agent": "EduScraper/1.0 (+mailto:dev@example.com)"}\nresp = requests.get(url, headers=headers, timeout=10)',
    behavior: 'Identifies your bot transparently and avoids 403 blocks or infinite socket hangs.',
    note: 'Sending a clear `User-Agent` and `timeout=` is both polite and essential for reliable scrapers.',
  },
  {
    id: 'ratelimit',
    label: 'Rate Limit & 429 Backoff',
    rule: 'time.sleep(1.5)  # Pause between page requests\nif resp.status_code == 429: time.sleep(int(resp.headers.get("Retry-After", 5)))',
    behavior: 'Prevents overloading target servers and respects HTTP 429 Too Many Requests.',
    note: 'Hammering a site with tight loops can act like a DoS attack and get your IP banned.',
  },
  {
    id: 'pagination',
    label: 'urljoin & Pagination',
    rule: 'next_url = urllib.parse.urljoin("https://site.com/catalog/", "../page/2")',
    behavior: 'Resolves to "https://site.com/page/2" safely without broken string concatenation.',
    note: 'Always use `urllib.parse.urljoin()` to turn relative `href` links into absolute URLs.',
  },
];

export const ScrapingEthicsSim: React.FC = () => {
  const [caseId, setCaseId] = useState<EthicsCase['id']>('robots');
  const active = CASES.find((c) => c.id === caseId) || CASES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="robots.txt, Headers, Rate Limiting & Pagination" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">PIPELINE STEP</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Scraping Ethics Selector">
            {CASES.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={caseId === c.id}
                onClick={() => setCaseId(c.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                  caseId === c.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <pre className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--accent-primary)] overflow-x-auto">
          {active.rule}
        </pre>

        <pre className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-main)] overflow-x-auto">
          {active.behavior}
        </pre>

        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <ShieldAlert className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <span>{active.note}</span>
        </div>
      </div>
    </div>
  );
};
