;(() => {
  const link = document.querySelector<HTMLAnchorElement>(".not-found-lucky")
  if (!link) return

  const entries: string[] = JSON.parse(link.dataset.randomEntries ?? "[]")
  if (entries.length === 0) return

  const chooseEntry = () => {
    link.href = entries[Math.floor(Math.random() * entries.length)]
  }

  chooseEntry()
  link.addEventListener("click", chooseEntry)
})()
