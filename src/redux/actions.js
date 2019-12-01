/*
* 包含n个action creator函数的模块
* 同步action：对象{type:'',data:''}
* 异步action：函数 dipatch => {}
* */
import {SET_HEAD_TITLE,RECEIVE_USER,SHOW_ERROR_MSG, RESET_USER} from './action-types'
import {reqLogin} from '../api'
import storageUtils from "../utils/storageUtils";

export const setHeadTitle = (headTitle) =>({type:SET_HEAD_TITLE,data:headTitle})

//接受用户的同步action
export const receiveUser = (user)=>({type:RECEIVE_USER,user})

//显示错误信息的同步action
export const showErrorMsg = (errorMsg) =>({type:SHOW_ERROR_MSG,errorMsg})

//登录的异步action
export const login =(username,password)=>{
	return async dispatch =>{
		//1.执行异步ajax请求
		const result = await reqLogin(username,password)
		//2.1成功，分发成功的同步action
		if(result.status===0){
			const user = result.data
			//保存到local中
			storageUtils.saveUser(user)
			//分发接受用户的同步action
			dispatch(receiveUser(user))
		}else {//2.2失败，分发成功的同步action
			const msg = result.msg
			// message.error(msg)
			dispatch(showErrorMsg(msg))
		}

	}
}

//退出登录同步action
export const logout=()=>{
	//删除local中的user
	storageUtils.removeUser()
	//返回action对象
	return {type:RESET_USER}
}