import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync, realpathSync, rmSync, symlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { createTempProject, createTempProjectForBuild, cleanupTempProject } from '../src/utils/tempProject.js'
import { resolveRuntimeDependencies } from '../src/utils/runtime.js'
import { hasMarkdownFiles, isExcludedPath } from '../src/utils/docsFiles.js'

function fixture(t) {
  // Ancestor names must not cause the selected docs root to be excluded.
  const base = mkdtempSync(join(tmpdir(), 'fastdocs-test-'))
  const docs = join(base, 'node_modules', "docs with spaces and 'quotes'")
  mkdirSync(join(docs, 'guide'), { recursive: true })
  writeFileSync(join(docs, 'guide', 'page.md'), '# Hello')
  for (const dir of ['node_modules', '.git', '.vitepress', 'dist', '.cache']) {
    mkdirSync(join(docs, dir))
    writeFileSync(join(docs, dir, 'excluded.md'), '# Excluded')
  }
  t.after(() => rmSync(base, { recursive: true, force: true }))
  return docs
}

for (const [name, create] of [['serve', createTempProject], ['build', createTempProjectForBuild]]) {
  test(`${name} reuses installed runtime and cleans only its isolated project`, t => {
    const docs = fixture(t)
    const project = create(docs, {})
    t.after(() => cleanupTempProject(project))
    assert.ok(existsSync(join(project, 'index.md')))
    assert.ok(existsSync(join(project, 'guide', 'index.md')))
    assert.equal(readFileSync(join(project, 'guide', 'page.md'), 'utf8'), '# Hello')
    assert.equal(existsSync(join(docs, 'index.md')), false)
    assert.equal(existsSync(join(docs, 'guide', 'index.md')), false)
    for (const dir of ['node_modules', '.git', '.vitepress', 'dist', '.cache']) {
      assert.equal(existsSync(join(project, dir, 'excluded.md')), false)
    }
    const dependencies = resolveRuntimeDependencies()
    for (const { name, directory } of dependencies) {
      assert.equal(realpathSync(join(project, 'node_modules', name)), directory)
    }
    const require = createRequire(join(project, '.vitepress', 'theme', 'index.js'))
    for (const name of ['vue', 'mermaid', 'lucide-vue-next', 'vitepress']) {
      assert.ok(require.resolve(name))
    }
    assert.equal(existsSync(join(project, 'package-lock.json')), false)
    cleanupTempProject(project)
    for (const { directory } of dependencies) assert.ok(existsSync(join(directory, 'package.json')))
  })
}

test('concurrent projects do not share mutable project files', t => {
  const docs = fixture(t)
  const first = createTempProject(docs, {})
  const second = createTempProject(docs, {})
  t.after(() => { cleanupTempProject(first); cleanupTempProject(second) })
  assert.notEqual(first, second)
  cleanupTempProject(first)
  assert.ok(existsSync(join(second, 'node_modules', 'vitepress', 'package.json')))
  assert.ok(existsSync(join(second, 'guide', 'page.md')))
})

test('markdown discovery and exclusions are root-relative', t => {
  const docs = fixture(t)
  assert.equal(hasMarkdownFiles(docs), true)
  assert.equal(isExcludedPath(docs, docs), false)
  assert.equal(isExcludedPath(docs, join(docs, 'node_modules', 'nested', 'file.md')), true)
  rmSync(join(docs, 'guide'), { recursive: true })
  assert.equal(hasMarkdownFiles(docs), false)
})

// Windows file symlinks may require Developer Mode; directory junctions are tested above.
test('discovery accepts linked Markdown files without following directory cycles', { skip: process.platform === 'win32' }, t => {
  const docs = fixture(t)
  rmSync(join(docs, 'guide'), { recursive: true })
  writeFileSync(join(docs, 'target.txt'), '# Linked')
  symlinkSync(join(docs, 'target.txt'), join(docs, 'linked.md'))
  symlinkSync(docs, join(docs, 'cycle'), 'dir')
  assert.equal(hasMarkdownFiles(docs), true)
  rmSync(join(docs, 'target.txt'))
  assert.equal(hasMarkdownFiles(docs), false)
})

test('watcher never copies excluded files into installed runtime links', { timeout: 10000 }, async t => {
  const { watchSidebarChanges } = await import('../src/utils/sidebarWatcher.js')
  const { once } = await import('node:events')
  const { setTimeout: delay } = await import('node:timers/promises')
  const docs = fixture(t)
  const project = createTempProject(docs, {})
  writeFileSync(join(docs, 'guide', 'asset.txt'), 'Original')
  const watcher = watchSidebarChanges(docs, project, () => {})
  t.after(async () => { await watcher.close(); cleanupTempProject(project) })
  await once(watcher, 'ready')
  writeFileSync(join(docs, 'node_modules', 'must-not-sync.md'), '# Do not sync')
  writeFileSync(join(docs, 'guide', 'asset.txt'), 'Must sync')
  // Wait for an ordinary file to prove the watcher is processing events.
  for (let i = 0; i < 50 && !existsSync(join(project, 'guide', 'asset.txt')); i++) await delay(50)
  assert.ok(existsSync(join(project, 'guide', 'asset.txt')))
  assert.equal(existsSync(join(project, 'node_modules', 'must-not-sync.md')), false)
})
