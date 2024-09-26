'use client'

import { useEffect, useState } from 'react'

interface HtmlStripProps {
  html: string
  maxLength?: number
}

export function HtmlStrip({ html, maxLength }: HtmlStripProps) {
  const [strippedText, setStrippedText] = useState('')

  useEffect(() => {
    const stripHtmlTags = (html: string) => {
      const tmp = document.createElement('DIV')
      tmp.innerHTML = html
      return tmp.textContent || tmp.innerText || ''
    }

    const stripped = stripHtmlTags(html)
    if (maxLength && stripped.length > maxLength) {
      setStrippedText(stripped.substring(0, maxLength) + '...')
    } else {
      setStrippedText(stripped)
    }
  }, [html, maxLength])

  return <>{strippedText}</>
}