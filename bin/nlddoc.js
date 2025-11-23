#!/usr/bin/env node

import { program } from 'commander'
import { serve } from '../src/cli/serve.js'
import { build } from '../src/cli/build.js'
import { init } from '../src/cli/init.js'
import { checkLinksCommand } from '../src/cli/check-links.js'

program
  .name('nlddoc')
  .description('Ultralight markdown documentation viewer and static site generator')
  .version('0.1.0')

program
  .command('init [path]')
  .description('Create a .nlddoc configuration file with defaults')
  .option('-f, --force', 'Overwrite existing configuration without confirmation')
  .action(init)

program
  .command('serve [path]')
  .description('Start development server for viewing documentation')
  .option('-p, --port <number>', 'Port number', '5173')
  .option('--no-open', 'Do not open browser automatically')
  .option('--host', 'Allow external access')
  .action(serve)

program
  .command('build [input] [output]')
  .description('Build static site from documentation')
  .option('--base <path>', 'Base URL path for deployment', '/')
  .option('--clean', 'Clean output directory without confirmation')
  .option('--skip-link-checking', 'Skip link validation (not recommended)')
  .action(build)

program
  .command('check-links [path]')
  .description('Check for broken local links in documentation')
  .action(checkLinksCommand)

program.parse()
