/*
能发布异步ajax请求的函数模块
封装axios库
返回值是promise对象
优化：
	1.统一处理请求异常
		在外层包一个自己创建的promise对象
		在请求出错时，不reject(error)，而是显示错误信息
	2.异步直接得到response.data
* */
import axios from 'axios'
import {message} from 'antd'


export default function ajax(url, data={},type='GET') {
	return new Promise((resolve, reject) => {
		let promise
		//1.执行异步ajax请求
		if (type === 'GET') {
			promise = axios.get(url, {//配置对象
				params: data  //指定请求参数
			})
		} else {
			promise = axios.post(url, data)
		}
		//2.成功,调用resolve（value)
		promise.then(response => {
			resolve(response.data)
			//3.失败,不调用reject（reason），而是提示错误信息
		}).catch(error => {
			message.error('出错啦' + error.message)

		})


	})
}