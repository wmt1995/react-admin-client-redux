/*入口JS*/
import React from 'react'
import ReactDom from 'react-dom'
import {Provider} from 'react-redux'

import store from './redux/store'
import App from './App'


//将App组件标签渲染到index页面的div上
ReactDom.render((
		<Provider store={store}>
			<App/>
		</Provider>
		),document.getElementById('root'))