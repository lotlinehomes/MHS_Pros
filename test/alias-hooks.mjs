import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

/** Resolve the app's `@/` imports so Node's test runner can load the TypeScript source. */
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    return { url: pathToFileURL(join(root, `${specifier.slice(2)}.ts`)).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
