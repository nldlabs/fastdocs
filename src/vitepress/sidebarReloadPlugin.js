import { watch } from 'chokidar'
import { generateSidebar } from './sidebarGenerator.js'

/**
 * Vite plugin to reload sidebar when markdown files or config changes
 * @param {string} docsPath - Absolute path to docs directory
 * @returns {Object} Vite plugin
 */
export default function sidebarReloadPlugin(docsPath) {
  return {
    name: 'vitepress-sidebar-reload',
    configureServer(server) {
      console.log(`[Fast Docs] Watching for changes in: ${docsPath}`)
      
      const watcher = watch(['**/*.md', '.fastdocs'], {
        cwd: docsPath,
        ignoreInitial: true,
        ignored: ['**/node_modules/**', '**/.vitepress/**', '**/dist/**']
      })

      const reloadSidebar = (event, path) => {
        console.log(`[Fast Docs] File ${event}: ${path} - Regenerating sidebar...`)
        
        // Regenerate sidebar
        const newSidebar = generateSidebar(docsPath)
        
        // Update the VitePress config in memory
        const vitepressConfig = server.config.vitepress
        if (vitepressConfig?.site?.themeConfig) {
          vitepressConfig.site.themeConfig.sidebar = newSidebar
          console.log('[Fast Docs] Sidebar updated, triggering reload...')
        }
        
        // Force a full page reload
        server.ws.send({
          type: 'full-reload',
          path: '*'
        })
      }

      // Watch for file/folder additions and deletions (these affect sidebar)
      watcher.on('add', (path) => reloadSidebar('added', path))
      watcher.on('unlink', (path) => reloadSidebar('deleted', path))
      watcher.on('unlinkDir', (path) => reloadSidebar('deleted dir', path))
      watcher.on('addDir', (path) => reloadSidebar('added dir', path))
      
      // Watch for changes to markdown frontmatter (affects sidebar titles/order)
      watcher.on('change', (path) => {
        if (path.endsWith('.md') || path === '.fastdocs') {
          reloadSidebar('changed', path)
        }
      })

      // Cleanup watcher on server close
      server.httpServer?.on('close', () => {
        watcher.close()
      })
    }
  }
}
