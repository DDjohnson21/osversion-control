import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: '#7C4DFF' },
    secondary: { main: '#FFCA28' },
    background:{ default: '#121212', paper: '#1E1E1E' },
    text:      { primary: '#ECECEC', secondary: '#888888' },
    divider:   '#333333'
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    button:     { textTransform: 'none' }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { backgroundColor: '#1E1E1E', color: '#ECECEC' }
      }
    }
  }
})

export default theme
