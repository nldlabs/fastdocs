import test from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createTempProject, cleanupTempProject } from '../src/utils/tempProject.js'
import { loadConfig } from '../src/cli/config.js'

test('installed runtime serves generated pages and compiles the theme without npm on PATH', { timeout: 30000 }, async t => {
  const docs = mkdtempSync(join(tmpdir(), 'fastdocs-smoke-'))
  mkdirSync(join(docs, 'guide'))
  writeFileSync(join(docs, 'guide', 'hello.md'), '# Hello\n\n```mermaid\ngraph TD; A-->B;\n```\n')
  const project = createTempProject(docs, loadConfig(docs))
  const child = spawn(process.execPath, [join(project, 'node_modules/vitepress/bin/vitepress.js'), 'dev', '--port', '0'], {
    cwd: project,
    env: { ...process.env, PATH: '', FORCE_COLOR: '0' },
    stdio: ['ignore', 'pipe', 'pipe']
  })
  let output = ''
  child.stderr.on('data', chunk => { output += chunk })
  t.after(async () => {
    if (child.exitCode === null) {
      const closed = once(child, 'close')
      child.kill()
      await closed
    }
    cleanupTempProject(project)
    rmSync(docs, { recursive: true, force: true })
  })
  const url = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Server did not become ready: ${output}`)), 20000)
    child.on('error', err => { clearTimeout(timer); reject(err) })
    child.on('exit', code => { clearTimeout(timer); reject(new Error(`Server exited ${code}: ${output}`)) })
    child.stdout.on('data', chunk => {
      output += chunk.toString().replace(/\x1b\[[0-9;]*m/g, '')
      const match = output.match(/Local:\s+(http:\/\/\S+)/)
      if (match) { clearTimeout(timer); resolve(match[1]) }
    })
  })
  for (const path of ['', 'guide/', 'guide/hello', '.vitepress/theme/index.js', '.vitepress/theme/components/MermaidWrapper.vue']) {
    const response = await fetch(new URL(path, url))
    assert.equal(response.status, 200, `${path}: ${await response.text()}`)
  }
})
