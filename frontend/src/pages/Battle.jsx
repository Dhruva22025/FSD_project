import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import useSubmission from "@/hooks/useSubmission";
import useRoom from "@/hooks/useRoom";
import { useAuthContext } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  loadBattleDraft,
  saveBattleDraft,
  getDefaultSnippet,
} from "@/lib/battleCodeStorage";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const LANGUAGES = [
  { id: 50, name: "C", monaco: "c" },
  { id: 54, name: "C++", monaco: "cpp" },
  { id: 62, name: "Java", monaco: "java" },
  { id: 63, name: "JavaScript", monaco: "javascript" },
  { id: 71, name: "Python 3", monaco: "python" },
];

const TAB_TESTCASE = "testcase";
const TAB_RESULT = "result";

function monacoLanguageForId(id) {
  return LANGUAGES.find((l) => l.id === id)?.monaco ?? "python";
}

function tabSizeForLanguage(id) {
  if (id === 63) return 2;
  return 4;
}

function isWinnerYou(winner, authUser) {
  if (!winner || !authUser) return false;
  const u = authUser;
  return (
    winner === u._id ||
    winner === u.id ||
    winner === u.userId ||
    winner === u.username
  );
}

export default function Battle() {
  const { roomId } = useParams();
  const { getRoom } = useRoom();
  const { submitCode, loading: submitting } = useSubmission();
  const { authUser } = useAuthContext();

  const [room, setRoom] = useState(null);
  const [code, setCode] = useState("");
  const [languageId, setLanguageId] = useState(71);
  const [results, setResults] = useState([]);
  const [winner, setWinner] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [bottomTab, setBottomTab] = useState(TAB_TESTCASE);
  const [draftSaveFailed, setDraftSaveFailed] = useState(false);
  const [expandedCase, setExpandedCase] = useState(0);

  const submitRef = useRef(async () => { });

  useEffect(() => {
    const fetchRoom = async () => {
      const res = await getRoom(roomId);
      if (res.ok) setRoom(res.data.room);
      else setLoadError(res.error);
    };
    fetchRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- getRoom identity changes each render
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    setInitialized(false);
    setResults([]);
    setWinner(null);
    setSubmitError("");
    const { code: saved, languageId: savedLang } = loadBattleDraft(roomId);
    if (saved && saved.trim()) {
      setCode(saved);
      if (savedLang != null) setLanguageId(savedLang);
    } else {
      const lang = savedLang ?? 71;
      setLanguageId(lang);
      setCode(getDefaultSnippet(lang));
    }
    setInitialized(true);
  }, [roomId]);

  useEffect(() => {
    if (!roomId || !initialized) return;
    const t = setTimeout(() => {
      const ok = saveBattleDraft(roomId, code, languageId);
      setDraftSaveFailed(!ok);
    }, 450);
    return () => clearTimeout(t);
  }, [roomId, code, languageId, initialized]);

  const handleSubmit = useCallback(async () => {
    if (!code.trim()) return;
    setSubmitError("");
    const res = await submitCode({ roomId, code, language_id: languageId });
    if (!res.ok) {
      setSubmitError(res.error);
      setBottomTab(TAB_RESULT);
      return;
    }
    setResults(res.testCaseResults ?? []);
    setWinner(res.winner ?? null);
    setBottomTab(TAB_RESULT);
  }, [roomId, code, languageId, submitCode]);

  useEffect(() => {
    submitRef.current = handleSubmit;
  }, [handleSubmit]);

  const monacoLang = useMemo(
    () => monacoLanguageForId(languageId),
    [languageId]
  );

  const handleEditorMount = useCallback((editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      submitRef.current?.();
    });
    monaco.editor.defineTheme("battle-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1e1e1e",
      },
    });
    monaco.editor.setTheme("battle-dark");
  }, []);

  const compileErrors = useMemo(() => {
    const lines = [];
    (results || []).forEach((tc, i) => {
      if (tc.compileError)
        lines.push(`Case ${i + 1} — Compile\n${tc.compileError}`);
      if (tc.runtimeError)
        lines.push(`Case ${i + 1} — Runtime\n${tc.runtimeError}`);
    });
    return lines.join("\n\n");
  }, [results]);

  const passedCount = useMemo(
    () => (results || []).filter((r) => r.passed).length,
    [results]
  );

  if (!room && !loadError) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-[#1e1e1e] text-[#b3b3b3]">
        <Loader2 className="mr-2 size-5 animate-spin" />
        Loading problem…
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-[#1e1e1e] p-6 text-red-400">
        {loadError}
      </div>
    );
  }

  const problem = room.problem;
  if (!problem?.title) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-[#1e1e1e] px-6 text-center text-[#b3b3b3]">
        No problem is attached to this room yet. Wait for the host to set the
        problem or rejoin from the dashboard.
      </div>
    );
  }

  const testCases = problem.testCases ?? [];
  const activeCaseIndex =
    testCases.length === 0
      ? 0
      : Math.min(expandedCase, testCases.length - 1);

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden bg-[#262626] text-[#e8eaed]">
      {winner && (
        <div
          className={cn(
            "flex shrink-0 items-center justify-center gap-2 border-b border-[#3e3e42] px-4 py-2 text-sm",
            isWinnerYou(winner, authUser)
              ? "bg-emerald-900/40 text-emerald-200"
              : "bg-[#2d2d30] text-[#cccccc]"
          )}
        >
          <span className="font-medium">🏆</span>
          <span>
            {isWinnerYou(winner, authUser)
              ? "You won this round!"
              : `Winner: ${winner}`

            }
          </span>
        </div>
      )}

      <div className="min-h-0 flex-1">
        <Allotment>
          <Allotment.Pane minSize={260} preferredSize="44%">
            <ProblemPanel problem={problem} testCases={testCases} />
          </Allotment.Pane>
          <Allotment.Pane minSize={320}>
            <Allotment vertical>
              <Allotment.Pane minSize={160} preferredSize="56%">
                <div className="flex h-full min-h-0 flex-col border-l border-[#3e3e42] bg-[#1e1e1e]">
                  <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[#3e3e42] px-3 py-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-[#8c8c8c]">
                      Code
                    </span>
                    <Select
                      value={String(languageId)}
                      onValueChange={(v) => {
                        const next = Number(v);
                        setLanguageId(next);
                        setCode((prev) =>
                          prev.trim() ? prev : getDefaultSnippet(next)
                        );
                      }}
                    >
                      <SelectTrigger
                        size="sm"
                        className="h-8 min-w-[140px] border-[#3e3e42] bg-[#2d2d30] text-[#e8eaed] hover:bg-[#3c3c3c]"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-[#3e3e42] bg-[#252526] text-[#e8eaed]">
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.id} value={String(lang.id)}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="ml-auto flex items-center gap-2">
                      {draftSaveFailed && (
                        <span
                          className="hidden text-xs text-amber-400 sm:inline"
                          title="Draft exceeds 2MB or storage is full"
                        >
                          Local save skipped (&gt;2MB)
                        </span>
                      )}
                      <span className="text-[10px] text-[#6e6e6e]">
                        ⌘/Ctrl+Enter submit
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSubmit()}
                        disabled={submitting}
                        className="rounded-md bg-[#2cbb5d] px-4 py-1.5 text-sm font-semibold text-[#0d1f12] hover:bg-[#25a352] disabled:opacity-50"
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="size-4 animate-spin" />
                            Submitting
                          </span>
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="min-h-0 flex-1">
                    <Editor
                      height="100%"
                      language={monacoLang}
                      value={code}
                      theme="vs-dark"
                      onChange={(v) => setCode(v ?? "")}
                      onMount={handleEditorMount}
                      options={{
                        fontSize: 14,
                        fontFamily:
                          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                        minimap: { enabled: true, scale: 0.85 },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: tabSizeForLanguage(languageId),
                        insertSpaces: true,
                        detectIndentation: true,
                        formatOnType: true,
                        formatOnPaste: true,
                        wordWrap: "on",
                        padding: { top: 8, bottom: 8 },
                        renderLineHighlight: "line",
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                        bracketPairColorization: { enabled: true },
                        guides: {
                          bracketPairs: true,
                          indentation: true,
                        },
                      }}
                    />
                  </div>
                </div>
              </Allotment.Pane>
              <Allotment.Pane minSize={120} preferredSize="44%">
                <div className="flex h-full min-h-0 flex-col border-l border-t border-[#3e3e42] bg-[#181818]">
                  <div className="flex shrink-0 items-stretch border-b border-[#3e3e42]">
                    <button
                      type="button"
                      onClick={() => setBottomTab(TAB_TESTCASE)}
                      className={cn(
                        "px-4 py-2.5 text-sm font-medium transition-colors",
                        bottomTab === TAB_TESTCASE
                          ? "border-b-2 border-[#ffa116] text-[#e8eaed]"
                          : "text-[#8c8c8c] hover:text-[#cccccc]"
                      )}
                    >
                      Testcase
                    </button>
                    <button
                      type="button"
                      onClick={() => setBottomTab(TAB_RESULT)}
                      className={cn(
                        "px-4 py-2.5 text-sm font-medium transition-colors",
                        bottomTab === TAB_RESULT
                          ? "border-b-2 border-[#ffa116] text-[#e8eaed]"
                          : "text-[#8c8c8c] hover:text-[#cccccc]"
                      )}
                    >
                      Test Result
                      {results.length > 0 && (
                        <span className="ml-2 text-xs text-[#6e6e6e]">
                          ({passedCount}/{results.length})
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="min-h-0 flex-1 overflow-auto">
                    {bottomTab === TAB_TESTCASE && (
                      <div className="p-3">
                        <p className="mb-3 text-xs text-[#8c8c8c]">
                          Sample testcases for this problem (inputs shown to all
                          players).
                        </p>
                        <div className="flex flex-wrap gap-2 border-b border-[#3e3e42] pb-2">
                          {testCases.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setExpandedCase(idx)}
                              className={cn(
                                "rounded px-3 py-1 text-xs font-medium",
                                activeCaseIndex === idx
                                  ? "bg-[#3e3e42] text-white"
                                  : "bg-transparent text-[#8c8c8c] hover:bg-[#2d2d30]"
                              )}
                            >
                              Case {idx + 1}
                            </button>
                          ))}
                        </div>
                        {testCases[activeCaseIndex] != null ? (
                          <div className="mt-3 space-y-3 font-mono text-sm">
                            <div>
                              <div className="mb-1 text-xs font-sans text-[#8c8c8c]">
                                Input
                              </div>
                              <pre className="whitespace-pre-wrap rounded border border-[#3e3e42] bg-[#1e1e1e] p-3 text-[#d4d4d4]">
                                {String(testCases[activeCaseIndex].input ?? "")}
                              </pre>
                            </div>
                            {testCases[activeCaseIndex].output != null &&
                              testCases[activeCaseIndex].output !== "" && (
                                <div>
                                  <div className="mb-1 text-xs font-sans text-[#8c8c8c]">
                                    Expected (hidden from opponent during battle)
                                  </div>
                                  <pre className="whitespace-pre-wrap rounded border border-[#3e3e42] bg-[#1e1e1e] p-3 text-[#d4d4d4]">
                                    {String(
                                      testCases[activeCaseIndex].output ?? ""
                                    )}
                                  </pre>
                                </div>
                              )}
                          </div>
                        ) : (
                          <p className="mt-4 text-sm text-[#8c8c8c]">
                            No public testcases.
                          </p>
                        )}
                      </div>
                    )}

                    {bottomTab === TAB_RESULT && (
                      <div className="flex h-full min-h-0 flex-col">
                        {submitError && (
                          <div className="border-b border-[#5a1d1d] bg-[#2d1a1a] p-3">
                            <div className="text-xs font-semibold uppercase text-red-400">
                              Submission error
                            </div>
                            <pre className="mt-1 whitespace-pre-wrap font-mono text-sm text-red-200/90">
                              {submitError}
                            </pre>
                          </div>
                        )}
                        {compileErrors && (
                          <div className="border-b border-[#3e3e42] bg-[#1e1e1e] p-3">
                            <div className="text-xs font-semibold uppercase text-[#f85149]">
                              Console
                            </div>
                            <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap font-mono text-xs text-[#f85149]">
                              {compileErrors}
                            </pre>
                          </div>
                        )}
                        {results.length === 0 && !submitError ? (
                          <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-[#6e6e6e]">
                            Run Submit to see stdout, expected output, and
                            pass/fail for each case.
                          </div>
                        ) : (
                          <ul className="divide-y divide-[#3e3e42]">
                            {results.map((tc, idx) => (
                              <li key={idx} className="p-3">
                                <div className="mb-2 flex items-center gap-2">
                                  <span
                                    className={cn(
                                      "inline-flex size-6 items-center justify-center rounded-full text-xs font-bold",
                                      tc.passed
                                        ? "bg-[#294a32] text-[#4caf50]"
                                        : "bg-[#4a2929] text-[#f85149]"
                                    )}
                                  >
                                    {tc.passed ? "✓" : "✗"}
                                  </span>
                                  <span className="text-sm font-medium text-[#e8eaed]">
                                    Test case {idx + 1}
                                  </span>
                                  <span
                                    className={cn(
                                      "text-xs font-medium",
                                      tc.passed
                                        ? "text-[#4caf50]"
                                        : "text-[#f85149]"
                                    )}
                                  >
                                    {tc.passed ? "Accepted" : "Wrong answer"}
                                  </span>
                                </div>
                                <div className="grid gap-2 font-mono text-xs sm:grid-cols-2">
                                  <div>
                                    <div className="mb-0.5 text-[#8c8c8c]">
                                      Input
                                    </div>
                                    <pre className="whitespace-pre-wrap rounded bg-[#1e1e1e] p-2 text-[#d4d4d4]">
                                      {tc.input}
                                    </pre>
                                  </div>
                                  <div>
                                    <div className="mb-0.5 text-[#8c8c8c]">
                                      Expected
                                    </div>
                                    <pre className="whitespace-pre-wrap rounded bg-[#1e1e1e] p-2 text-[#d4d4d4]">
                                      {tc.expected}
                                    </pre>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <div className="mb-0.5 text-[#8c8c8c]">
                                      Output
                                    </div>
                                    <pre className="whitespace-pre-wrap rounded bg-[#1e1e1e] p-2 text-[#d4d4d4]">
                                      {tc.output ?? "(empty)"}
                                    </pre>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Allotment.Pane>
            </Allotment>
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
}

function ProblemPanel({ problem, testCases }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden border-r border-[#3e3e42] bg-[#1e1e1e]">
      <div className="shrink-0 border-b border-[#3e3e42] px-4 py-3">
        <h1 className="text-lg font-semibold text-[#e8eaed]">{problem.title}</h1>
        <p className="mt-1 text-xs text-[#8c8c8c]">
          {testCases.length} testcase{testCases.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-[#cccccc]">
          {problem.description}
        </p>
      </div>
    </div>
  );
}
