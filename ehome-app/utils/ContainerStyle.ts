import { makeStyles } from "@rneui/themed";
import { Platform } from "react-native";


const useScreenContainerStyle = makeStyles((theme) => ({
  container: {
    ...Platform.select({
      native: {
        width: '100%'
      },
      web: {
        width: 500,
        alignSelf: 'center'
      }
    }),
    height: '100%',
    backgroundColor: theme.colors.background,
    color: theme.colors.primary
  }
}));

export const useTabNavigationStyle = makeStyles((theme) => ({
  container: {
    ...Platform.select({
      native: {
        width: '100%'
      },
      web: {
        width: 500,
        alignSelf: 'center'
      }
    }),
    backgroundColor: theme.colors.background,
    borderTopColor: theme.colors.divider,
    borderTopWidth: 2
  }
}));

export default useScreenContainerStyle;