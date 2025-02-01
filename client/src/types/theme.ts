export type Theme = {
  name: string
  value: string
  background: string
  text: string
  border: string
}

export const themes: Theme[] = [
  {
    name: "Black & White",
    value: "black-white",
    background: "bg-black",
    text: "text-white",
    border: "border-white/10",
  },
  {
    name: "Light",
    value: "light",
    background: "bg-white",
    text: "text-black",
    border: "border-black/10",
  },
  {
    name: "Dark Blue",
    value: "dark-blue",
    background: "bg-slate-900",
    text: "text-slate-100",
    border: "border-slate-700",
  },
  {
    name: "Forest",
    value: "forest",
    background: "bg-emerald-950",
    text: "text-emerald-50",
    border: "border-emerald-800",
  },
]


