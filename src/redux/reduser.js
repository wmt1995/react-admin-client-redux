/*
* 用来根据现有的state和指定的action生成并返回新的state
* */
import storageUtils from "../utils/storageUtils";
import {combineReducers} from 'redux'

import {SET_HEAD_TITLE,RECEIVE_USER, SHOW_ERROR_MSG,RESET_USER} from './action-types'
const initHeadTitle='首页'
function headTitle(state=initHeadTitle,action) {
	switch (action.type){
		case SET_HEAD_TITLE:
			return action.data
		default:
			return state
	}

}


//用来管理当前登录用户的reducer函数
const initUser=storageUtils.getUser()

function user(state=initUser,action) {
	switch (action.type){
		case RECEIVE_USER:
			return action.user
		case SHOW_ERROR_MSG:
			const errorMsg=action.errorMsg //不要直接修改原本状态数据
			return {...state,errorMsg}
		case RESET_USER:
			return {state}
		default:
			return state
	}
}
/*
* 向外默认暴露的是合并生产的总的reducer函数
* 管理的总的state的结构：
* 	{
* 		headTitle:'首页',
* 		user：storageUtils.getUser():
* 	}
* */
//这里的headTitle、user为函数名
export default combineReducers({
	headTitle,
	user
})