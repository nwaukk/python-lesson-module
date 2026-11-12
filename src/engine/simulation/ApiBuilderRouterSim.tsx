import React, { useState } from 'react';
import { Server, Code2, CheckCircle2 } from 'lucide-react';

type RouteKey = 'list' | 'detail' | 'create' | 'update' | 'delete';

interface RouteSpec {
  label: string;
  method: string;
  path: string;
  handler: string;
  status: string;
  response: string;
  note: string;
}

const ROUTES: Record<RouteKey, RouteSpec> = {
  list: {
    label: 'GET /students',
    method: 'GET',
    path: '/api/v1/students',
    handler: `@app.get("/api/v1/students")\ndef list_students():\n    return jsonify({"count": len(STUDENTS), "items": STUDENTS}), 200`,
    status: '200 OK',
    response: '{\n  "count": 2,\n  "items": [\n    { "id": "65f1a01", "name": "Ada", "track": "Backend" },\n    { "id": "65f1a02", "name": "Tunde", "track": "Data" }\n  ]\n}',
    note: 'Collection GET returns 200 OK with an envelope containing count and items.',
  },
  detail: {
    label: 'GET /students/<id>',
    method: 'GET',
    path: '/api/v1/students/65f1a99',
    handler: `@app.get("/api/v1/students/<student_id>")\ndef get_student(student_id):\n    doc = find_by_id(student_id)\n    if not doc:\n        return jsonify({"error": "Student not found"}), 404\n    return jsonify(doc), 200`,
    status: '404 Not Found',
    response: '{\n  "error": "Student not found"\n}',
    note: 'Single-resource GET must explicitly return 404 JSON when the ID does not exist.',
  },
  create: {
    label: 'POST /students',
    method: 'POST',
    path: '/api/v1/students',
    handler: `@app.post("/api/v1/students")\ndef create_student():\n    payload = request.get_json()\n    new_id = insert_student(payload)\n    return jsonify({"id": new_id, **payload}), 201, {"Location": f"/api/v1/students/{new_id}"}`,
    status: '201 Created',
    response: 'Location: /api/v1/students/65f1a03\n\n{\n  "id": "65f1a03",\n  "name": "Nadia",\n  "track": "ML"\n}',
    note: 'POST creation returns 201 Created along with a Location header pointing to the new resource URI.',
  },
  update: {
    label: 'PATCH /students/<id>',
    method: 'PATCH',
    path: '/api/v1/students/65f1a01',
    handler: `@app.patch("/api/v1/students/<student_id>")\ndef patch_student(student_id):\n    updates = request.get_json()\n    updated = apply_partial_update(student_id, updates)\n    return jsonify(updated), 200`,
    status: '200 OK',
    response: '{\n  "id": "65f1a01",\n  "name": "Ada",\n  "track": "Systems"\n}',
    note: 'PATCH updates only the provided fields (e.g., track) while preserving existing fields.',
  },
  delete: {
    label: 'DELETE /students/<id>',
    method: 'DELETE',
    path: '/api/v1/students/65f1a02',
    handler: `@app.delete("/api/v1/students/<student_id>")\ndef delete_student(student_id):\n    removed = remove_by_id(student_id)\n    if not removed:\n        return jsonify({"error": "Student not found"}), 404\n    return "", 204`,
    status: '204 No Content',
    response: '(empty body — 204 No Content)',
    note: 'DELETE returns 204 No Content with an empty body when deletion succeeds.',
  },
};

export const ApiBuilderRouterSim: React.FC = () => {
  const [route, setRoute] = useState<RouteKey>('list');
  const spec = ROUTES[route];

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-panel)] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-sky-400" />
          <h4 className="text-sm font-bold text-[var(--text-main)]">
            RESTful API Route &amp; Handler Builder
          </h4>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="REST route selector">
          {(Object.keys(ROUTES) as RouteKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={route === key}
              onClick={() => setRoute(key)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                route === key
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
              }`}
            >
              {ROUTES[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-2">
          <div className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-sky-400" />
            Server Route Handler
          </div>
          <pre className="text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap overflow-x-auto">
            {spec.handler}
          </pre>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--text-main)] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              HTTP Response
            </span>
            <span className="font-mono font-bold text-emerald-400 tabular-nums">{spec.status}</span>
          </div>
          <pre className="text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap overflow-x-auto">
            {spec.response}
          </pre>
        </div>
      </div>

      <div className="text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-2.5">
        {spec.note}
      </div>
    </div>
  );
};
