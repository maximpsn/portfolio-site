import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync, rmSync, watch } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { createServer } from 'node:http'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const projectRoot = process.cwd()
const rootDir = join(projectRoot, 'dist')
const port = 4173
const host = '127.0.0.1'
const pidFile = join(projectRoot, '.qwen', 'local-preview.pid')
const rebuildFlag = { running: false, pending: false }

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const sendFile = (res, filePath) => {
  const extension = extname(filePath).toLowerCase()
  res.statusCode = 200
  res.setHeader('Content-Type', mimeTypes[extension] || 'application/octet-stream')
  createReadStream(filePath).pipe(res)
}

const resolveLocalPath = (urlPath) => {
  const localPath = urlPath.startsWith('/portfolio-site/')
    ? `/${urlPath.slice('/portfolio-site/'.length)}`
    : urlPath
  return normalize(decodeURIComponent(localPath)).replace(/^(\.\.(\/|\\|$))+/, '')
}

const server = createServer((req, res) => {
  const urlPath = new URL(req.url || '/', `http://${host}`).pathname
  const safeLocalPath = resolveLocalPath(urlPath)
  let filePath = join(rootDir, safeLocalPath)

  if (safeLocalPath === '/' || safeLocalPath === '/index.html') {
    filePath = join(rootDir, 'index.html')
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    sendFile(res, filePath)
    return
  }

  const indexPath = join(rootDir, 'index.html')
  if (existsSync(indexPath)) {
    sendFile(res, indexPath)
    return
  }

  res.statusCode = 404
  res.end('dist/index.html not found. Run the build first.')
})

const ensureBuildDrive = async () => {
  if (process.platform !== 'win32') {
    return
  }

  try {
    await execFileAsync('cmd.exe', ['/c', 'subst', 'Z:', projectRoot], {
      cwd: projectRoot,
      windowsHide: true,
    })
  } catch (error) {
    const output = `${error?.stdout || ''}\n${error?.stderr || ''}\n${error?.message || ''}`
    if (!output.includes('Drive already SUBSTed')) {
      throw error
    }
  }
}

const rebuild = async (reason) => {
  if (rebuildFlag.running) {
    rebuildFlag.pending = true
    return
  }

  rebuildFlag.running = true

  try {
    const buildCommand = 'pushd Z:\\ && npm.cmd run build'
    await execFileAsync('cmd.exe', ['/d', '/s', '/c', buildCommand], {
      cwd: projectRoot,
      windowsHide: true,
    })
    console.log(`Rebuilt after ${reason}`)
  } catch (error) {
    console.error(`Build failed after ${reason}`)
    console.error(error?.stderr || error?.message || error)
  } finally {
    rebuildFlag.running = false
    if (rebuildFlag.pending) {
      rebuildFlag.pending = false
      void rebuild('queued change')
    }
  }
}

const watchDirs = ['src', 'styles', 'public']
const watchers = []
const debounceTimers = new Map()

const scheduleRebuild = (reason) => {
  const key = 'default'
  if (debounceTimers.has(key)) {
    clearTimeout(debounceTimers.get(key))
  }
  debounceTimers.set(
    key,
    setTimeout(() => {
      debounceTimers.delete(key)
      void rebuild(reason)
    }, 300),
  )
}

for (const dir of watchDirs) {
  const fullPath = join(projectRoot, dir)
  if (!existsSync(fullPath)) continue

  watchers.push(
    watch(fullPath, { recursive: true }, (_eventType, filename) => {
      scheduleRebuild(`${dir}${filename ? `/${filename}` : ''}`)
    }),
  )
}

mkdirSync(join(projectRoot, '.qwen'), { recursive: true })
writeFileSync(pidFile, String(process.pid))

server.listen(port, host, () => {
  console.log(`Local preview is running at http://${host}:${port}/#components`)
})

await ensureBuildDrive()
await rebuild('startup')

process.on('SIGINT', () => {
  for (const watcher of watchers) {
    watcher.close()
  }
  rmSync(pidFile, { force: true })
  server.close(() => process.exit(0))
})
