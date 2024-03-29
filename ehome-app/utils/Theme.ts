import { createTheme } from "@rneui/themed";
import '@rneui/themed';

declare module '@rneui/themed' {
  export interface Colors {
    connected: string;
    notconnected: string;
    headerBackground: string;
    active: string;
    sceneBackground: string;
  }
}

const theme = createTheme({
  lightColors: {
    connected: 'green',
    notconnected: 'red',

    background: '#bdc6cf',
    headerBackground: '#2089dc',
    sceneBackground: '#e1e8ee'
  },
  darkColors: {
    connected: '#09EB0F',
    notconnected: 'red',
    primary: '#54E262',
    background: '#090909',
    headerBackground: '#090909',
    active: '#3A6B3B',
    sceneBackground: '#2F4858',
    divider: '#439946'
  },
  mode: 'light',
  components: {
    CheckBox: (props, theme) => ({
      uncheckedColor: theme.colors.primary,
      textStyle: {
        color: theme.colors.primary
      }
    }),
    ListItem: (props, theme) => ({
      
      style: {
        
      },
      containerStyle: {
        
      }
    })
  }
});

export default theme;