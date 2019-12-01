/*
* 包含应用中所有接口请求函数的模块
* 返回promise函数
* */
import ajax from './ajax'
import jsonp from 'jsonp'
import {message} from 'antd'
const BASE=''
//1.登录
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST')

//添加用户
// export const regAddUser = (user) => ajax(BASE+'/manage/user/add',user,'POST')

//4.获取所有用户列表
export const reqUsers=()=>ajax(BASE+'/manage/user/list')

//2.3.添加/更新用户
export const reqAddOrUpdateUser = (user) =>ajax(BASE+'/manage/user/'+(user._id ? 'update':'add'),user,'POST')

//5.删除用户
export const reqDeleteUser = (userId) =>ajax(BASE+'/manage/user/delete',{userId},'POST')


//6.获取一级/二级分类的列表，参数只能是对象，即使只有一个参数
export const reqCategorys = (parentId) =>ajax(BASE+'/manage/category/list',{parentId})
//7.添加分类
export const reqAddCategorys = ({categoryName,parentId}) =>ajax(BASE+'/manage/category/add',{categoryName,parentId}, 'POST')
//8.更新分类
export const reqUpdateCategorys = (categoryName,categoryId) =>ajax(BASE+'/manage/category/update',{categoryName,categoryId}, 'POST')


//10.获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE+'/manage/product/list',{pageNum, pageSize})

//11.根据ID/Name搜索产品分页列表
//searchType:productName/productDesc
export  const reqSearchProducts=({pageNum, pageSize, searchType, searchName})=>ajax(BASE+'/manage/product/search',{
																																																											pageNum,
																																																											pageSize,
																																																											[searchType]:searchName,
																																																											})

//9.根据分类ID获取分类
export const reqCategory= (categoryId) => ajax(BASE+'/manage/category/info',{categoryId})

//14.对商品进行上架/下架处理
export const reqUpdateStatus =(productId,status)=> ajax(BASE+'/manage/product/updateStatus',{productId,status}, 'POST')


//12.添加商品
//export const reqAddProduct = ({categoryId,pCategoryId,name,desc,price,detail,imgs})=>ajax(BASE+'/manage/product/add',{categoryId,pCategoryId,name,desc,price,detail,imgs},'POST')
//13.更新商品
//export const reqUpdateProduct = ({_id,categoryId,pCategoryId,name,desc,price,detail,imgs})=>ajax(BASE+'/manage/product/update',{_id,categoryId,pCategoryId,name,desc,price,detail,imgs},'POST')


//12.13.添加或更新商品
export const reqAddOrUpdateProduct = (product)=>ajax(BASE+'/manage/product/'+(product._id ? 'update':'add') ,product,'POST')

//16.删除图片
export const reqDeleteImg =(name)=>ajax(BASE+'/manage/img/delete',{name},'POST')


//18.获取所有角色列表
export const reqRoles=()=>ajax(BASE+'/manage/role/list')
//17.添加角色
export const reqAddRole=(roleName)=>ajax(BASE+'/manage/role/add',{roleName},'POST')
//19.更新角色(给角色设置权限)
export const reqUpdateRole=(role)=>ajax(BASE+'/manage/role/update',role,'POST')

//20.jsonp请求的接口函数(天气)
export const reqWeather = (city) => {
	return new Promise((resolve, reject) => {
		const url=`http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
		//发送jsonp请求
		jsonp(url,{},(err,data)=>{
			//如果成功
			if(!err &&data.status==='success') {
				//取出需要的数据
				const {dayPictureUrl, weather}=data.results[0].weather_data[0]
				resolve({dayPictureUrl, weather})
			} else {
				message.error('获取天气失败')
			}
	})



	})
}