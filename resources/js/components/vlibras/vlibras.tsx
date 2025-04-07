import { useEffect } from 'react'

declare global {
  interface Window {
    VLibras: {
      Widget: new () => void
    }
  }
}

export default function VLibras() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '/build/vlibras.js'
    script.onload = () => {
      new window.VLibras.Widget()
    }
    console.log("VLIBRAS HERE")
    document.body.appendChild(script)
  }, [])

  return (
    <div data-vw className="enabled">
      <div data-vw-access-button className="active"></div>
      <div data-vw-plugin-wrapper>
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  )
}
