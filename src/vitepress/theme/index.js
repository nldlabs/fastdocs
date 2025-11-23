import DefaultTheme from 'vitepress/theme'
import SubPages from './components/SubPages.vue'
import FullContents from './components/FullContents.vue'
import Logo from './components/Logo.vue'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-title-before': () => h(Logo)
    })
  },
  enhanceApp({ app }) {
    app.component('SubPages', SubPages)
    app.component('FullContents', FullContents)
  }
}
