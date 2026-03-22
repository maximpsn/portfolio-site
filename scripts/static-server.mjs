import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { createServer } from 'node:http'

const rootDir = join(process.cwd(), 'dist')
const port = 4173
const host = '127.0.0.1'
const pidFile = join(process.cwd(), '.qwen', 'local-preview.pid')

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

const server = createServer((req, res) => {
  const urlPath = new URL(req.url || '/', `http://${host}`).pathname
  const localPath = urlPath.startsWith('/portfolio-site/')
    ? `/${urlPath.slice('/portfolio-site/'.length)}`
    : urlPath
  const safePath = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.(\/|\\|$))+/, '')
  const safeLocalPath = normalize(decodeURIComponent(localPath)).replace(/^(\.\.(\/|\\|$))+/, '')
  let filePath = join(rootDir, safeLocalPath)

  if (localPath.startsWith('/assets/') || localPath === '/' || localPath.endsWith('.html')) {
    if (localPath === '/' || localPath === '/index.html') {
      filePath = join(rootDir, 'index.html')
    }
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

server.listen(port, host, () => {
  mkdirSync(join(process.cwd(), '.qwen'), { recursive: true })
  writeFileSync(pidFile, String(process.pid))
  console.log(`Static preview is running at http://${host}:${port}/#components`)
})
