import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Image as VanImage,ImagePreview,CountDown,Picker,Switch,Form, Field, CellGroup,Search,Rate,Progress,Popup,Toast,Loading,Sticky,List,Empty,Icon,DropdownMenu, DropdownItem,Button,Tabbar, TabbarItem } from 'vant';
import 'vant/lib/index.css';
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(Icon)
app.use(Popup)
app.use(Search)
app.use(Switch)
app.use(Picker)
app.use(Form)
app.use(VanImage)
app.use(ImagePreview)
app.use(Field)
app.use(CellGroup)
app.use(List)
app.use(Progress)
app.use(Toast)
app.use(Rate)
app.use(Sticky)
app.use(Loading)
app.use(Empty)
app.use(Tabbar)
app.use(TabbarItem)
app.use(router)
app.use(DropdownMenu);
app.use(DropdownItem);
app.use(Button)
app.use(CountDown)
app.mount('#app')
