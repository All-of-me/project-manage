// 桥梁
import axios from 'axios'
import http from '@/base/api/public'
let manageConfig = require('@/config/manageConfig')
let manUrl = manageConfig.ApiUrlPre

let upload = axios.create({
  baseURL: manUrl,
  timeout: 60000,
  headers: { 'Accept': '*/*' }
})

let getFile = (url) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
      responseType: 'blob'
    })
      .then((res) => {
        resolve(res.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 批量删除文件
export const delByIds = ids => {
  return http.requestQuickGet(manUrl + '/bridgeFile_a/delByIds/{ids}?ids=' + ids)
}
// 获取桥梁文件
export const findByBridgeId = bridgeId => {
  return http.requestQuickGet(manUrl + '/bridgeFile_a/findByBridgeId?bridgeId=' + bridgeId)
}
// 根据id查找文件
export const getById = id => {
  return http.requestQuickGet(manUrl + '/bridgeFile_a/getOne/' + id)
}
// 添加文件
// 1：勘察资料，2：地质资料，3：设计资料，4：程序文件，5：施工资料 10:项目通用文件  20：标段通用文件
export const addFile = (id,fileGroup,file,config={}) => {
  return upload.post('/bridgeFile_a/add?id='+id+'&fileGroup='+fileGroup,file,config)
}
// 下载文件
export const fileDownload = id => {
  return getFile(manUrl + '/bridgeFile_a/fileDownload?id=' + id)
}
// 预览文件
export const preview = id => {
  return getFile(manUrl + '/bridgeFile_a/filePreviewOrPdf?id=' + id)
}
// 模糊查询文件
export const getByCondition = param => {
  var query = '?'
  if (param.fileGroupList) query += 'fileGroupList='+param.fileGroupList+'pageNumber='+param.pageNumber+'&pageSize='+param.pageSize
  else query += 'pageNumber='+param.pageNumber+'&pageSize='+param.pageSize
  return http.requestPost(manUrl + '/bridgeFile_a/getByCondition' + query, param)
}

// 下载标段模板文件
export const getSectionExcelTemplate = () => {
  return getFile(manUrl + '/section_a/getExcelTemplate')
}

// 下载桥梁模板文件
export const getBridgeExcelTemplate = () => {
  return getFile(manUrl + '/bridge_a/getExcelTemplate')
}

// 下载桥墩模板文件
export const getPierExcelTemplate = () => {
  return getFile(manUrl + '/pier_a/getExcelTemplate')
}

// 下载梁模板文件
export const getBeamExcelTemplate = () => {
  return getFile(manUrl + '/girder_a/getExcelTemplate')
}

// 批量上传标段模板文件 项目id
export const addSectionFile = (id,file) => {
  return upload.post('/section_a/excelAdd?itemId='+id,file)
}

// 批量上传桥梁模板文件 项目id
export const addBridgeFile = (id,file) => {
  return upload.post('/bridge_a/excelAdd?itemId='+id,file)
}

// 批量上传桥墩模板文件 桥梁id
export const addPierFile = (id,file) => {
  return upload.post('/pier_a/excelAdd?itemId='+id,file)
}

// 批量上传梁模板文件 桥梁id
export const addBeamFile = (id,file) => {
  return upload.post('/girder_a/excelAdd?itemId='+id,file)
}