import { mkdirSync, readFileSync, realpathSync, symlinkSync } from 'fs'
import { createRequire } from 'module'
import { dirname, join } from 'path'

const require = createRequire(import.meta.url)
const manifest = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'))

/** Resolve direct dependencies without relying on hoisting or package.json exports. */
export function resolveRuntimeDependencies() {
  return Object.keys(manifest.dependencies).map(name => {
    for (const searchPath of require.resolve.paths(name) || []) {
      try {
        const directory = realpathSync(join(searchPath, name))
        const installed = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8'))
        if (installed.name === name) return { name, directory }
      } catch {
        // Try the next Node module search location.
      }
    }
    throw new Error(`Fastdocs dependency "${name}" is missing. Reinstall Fastdocs before starting again.`)
  })
}

/**
 * Give each disposable project access to the already-installed runtime.
 * Link individual packages so npm hoisting and pnpm's isolated layout both work.
 * Windows junctions do not require administrator or Developer Mode privileges.
 * Never install into, or modify, the dependency targets.
 */
export function linkRuntimeDependencies(projectDir, dependencies = resolveRuntimeDependencies()) {
  for (const { name, directory } of dependencies) {
    const destination = join(projectDir, 'node_modules', name)
    mkdirSync(dirname(destination), { recursive: true })
    symlinkSync(directory, destination, process.platform === 'win32' ? 'junction' : 'dir')
  }
}
