import { AppShell } from './components/layout/AppShell'
import { ThemeProvider } from './components/themes/ThemeProvider'

function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  )
}

export default App