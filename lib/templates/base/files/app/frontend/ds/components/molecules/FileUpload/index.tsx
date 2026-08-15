import React, { useRef, useState } from 'react'
import { cn } from '../../../utils/cn'
import { Progress } from '../../atoms/Progress'

export interface UploadedFile {
  file: File
  progress: number
}

export interface FileUploadProps {
  onUpload: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // bytes
  className?: string
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function FileUpload({ onUpload, accept, multiple = false, maxSize, className }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return
    const arr = Array.from(incoming)

    if (maxSize) {
      const oversized = arr.find((f) => f.size > maxSize)
      if (oversized) {
        setError(`File "${oversized.name}" exceeds max size of ${formatSize(maxSize)}`)
        return
      }
    }

    setError(null)
    const newEntries: UploadedFile[] = arr.map((f) => ({ file: f, progress: 0 }))
    setFiles((prev) => (multiple ? [...prev, ...newEntries] : newEntries))
    onUpload(arr)

    // simulate progress
    newEntries.forEach((entry, i) => {
      let p = 0
      const timer = setInterval(() => {
        p += 20
        setFiles((prev) =>
          prev.map((f) => (f.file === entry.file ? { ...f, progress: Math.min(p, 100) } : f))
        )
        if (p >= 100) clearInterval(timer)
      }, 200 + i * 50)
    })
  }

  const removeFile = (target: File) => {
    setFiles((prev) => prev.filter((f) => f.file !== target))
  }

  return (
    <div className={cn('ds-file-upload', className)} style={{ fontFamily: 'var(--font-base)' }}>
      {/* drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload files"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          addFiles(e.dataTransfer.files)
        }}
        style={{
          border: `2px dashed ${dragging ? 'var(--color-info)' : 'var(--color-default)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? 'rgba(var(--color-accent-rgb), 0.05)' : 'var(--color-surface)',
          transition: 'border-color 0.2s, background 0.2s',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
        <p style={{ color: 'var(--color-gray-300)', fontSize: 'var(--font-size-base)', marginBottom: '0.25rem' }}>
          Drag & drop files here or <span style={{ color: 'var(--color-info)' }}>browse</span>
        </p>
        {maxSize && (
          <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)' }}>
            Max size: {formatSize(maxSize)}
          </p>
        )}
        {accept && (
          <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)' }}>
            Accepted: {accept}
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={(e) => addFiles(e.target.files)}
        aria-hidden="true"
      />

      {error && (
        <p style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)', marginTop: '0.5rem' }}>
          {error}
        </p>
      )}

      {/* file list */}
      {files.length > 0 && (
        <ul style={{ listStyle: 'none', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {files.map(({ file, progress }) => (
            <li
              key={file.name + file.size}
              style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--color-gray-300)', fontSize: 'var(--font-size-base)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                  {file.name}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>
                    {formatSize(file.size)}
                  </span>
                  <button
                    onClick={() => removeFile(file)}
                    aria-label={`Remove ${file.name}`}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-danger)',
                      fontSize: '1rem',
                      padding: '0',
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
              <Progress value={progress} variant={progress === 100 ? 'success' : 'info'} size="sm" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
