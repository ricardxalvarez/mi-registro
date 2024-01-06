import 'styled-components'
import { MyTheme } from './theme'

declare module 'styled-components' {
    export interface DefaultTheme extends MyTheme {}
}