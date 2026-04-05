/** Namespace so drafts never collide with other app keys or rooms. */
export const BATTLE_CODE_PREFIX = "codeArenaBattle:";

/** Max serialized payload size per room (code + language metadata). */
const MAX_PAYLOAD_BYTES = 2 * 1024 * 1024;

function storageKey(roomId) {
  return `${BATTLE_CODE_PREFIX}${roomId}`;
}

/**
 * @param {string} roomId
 * @returns {{ code: string, languageId: number }}
 */
export function loadBattleDraft(roomId) {
  if (!roomId) return { code: "", languageId: null };
  try {
    const raw = localStorage.getItem(storageKey(roomId));
    if (!raw) return { code: "", languageId: null };
    const parsed = JSON.parse(raw);
    return {
      code: typeof parsed.code === "string" ? parsed.code : "",
      languageId:
        typeof parsed.languageId === "number" ? parsed.languageId : null,
    };
  } catch {
    return { code: "", languageId: null };
  }
}

/**
 * Persist draft only if serialized size is under 2MB.
 * @returns {boolean} whether save succeeded
 */
export function saveBattleDraft(roomId, code, languageId) {
  if (!roomId) return false;
  const payload = JSON.stringify({ code, languageId });
  const size = new Blob([payload]).size;
  if (size > MAX_PAYLOAD_BYTES) return false;
  try {
    localStorage.setItem(storageKey(roomId), payload);
    return true;
  } catch (e) {
    if (e?.name === "QuotaExceededError") return false;
    throw e;
  }
}

export function getDefaultSnippet(languageId) {
  return DEFAULT_SNIPPETS[languageId] ?? DEFAULT_SNIPPETS[71];
}

const DEFAULT_SNIPPETS = {
  50: `#include <stdio.h>

int main(void) {
    
    return 0;
}
`,
  54: `#include <iostream>
using namespace std;

int main() {
    
    return 0;
}
`,
  62: `public class Main {
    public static void main(String[] args) {
        
    }
}
`,
  63: `function solve() {
    
}

solve();
`,
  71: `def solve():
    pass

`,
};
