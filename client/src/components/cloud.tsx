import type { Theme } from "../types/theme"

interface CloudProps {
  currentTheme: Theme
}

export function Cloud({ currentTheme }: CloudProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Cloud Storage</h2>
      <p>This is where you can access your stored files and documents.</p>
      {/* Add more cloud-related content here */}
    </div>
  )
}


