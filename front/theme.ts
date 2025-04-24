import { createTheme, PaletteOptions } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface PaletteOptions {
    black?: {
      500: string
    }
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#547792',
    },
    secondary: {
      main: '#ECEFCA',
    },
    text: {
      primary: '#383838', // Black for primary text
      secondary: '#B8B8B8', // Gray for secondary text
    },
    black: {
      500: '#383838',
    },
    grey: {
      500: '#B8B8B8',
      200: '#EEEEEE',
    },
  },
})

export default theme
