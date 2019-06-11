import { response, paramsFilter} from '../utils'
import { resolve } from 'dns';
import { rejects } from 'assert';
class BaseComponent {
  /** 
   * 公共addData方法 
   * @param model 要操作数据库的模型 
   * @param conditions 增加的条件,如{id:xxx} 
   * @param callback 
   */
  addData(model, conditions, options, callback) {
    model.findOne(options.params, function (err, doc) {
      if (doc && options.uniqueness) {
        callback(response({
          status: 201,
          message: options.errorMessage || "已存在"
        }));
        return false;
      }
      model.create(conditions, function (err, result) {
        console.log('创建成功: ', result)
        if (err) {
          console.log(err);
          callback(response({
            message: '服务器未知异常',
            status: 500

          }));
        } else {
          callback(response({
            body: {
              _id: result._id
            },
            message: '添加成功',
          }));
        }
      });
    });
  }
      
   
  /** 
   * 公共update方法 
   * @param model 要操作数据库的模型 
   * @param conditions 增加的条件,如{id:xxx} 
   * @param update 更新条件{set{id:xxx}} 
   * @param options  
   * @param callback 
   */
  updateData(model, conditions, update, options) {
    return new Promise((resolve, reject) => {
      model.updateOne(conditions, update, options)
      .exec()
      .then(result => {
        if (result.n != 0) {
          resolve(response({
            message: '修改成功'
          }))
        } else {
          resolve(response({
            message: '暂无数据',
            status: 204
          }))
        }
      }).catch(err => {
        console.log('updateData:',err);
        reject({
          message: '服务器未知异常',
          status: 500
        })
      })
    })
  }
  /** 
   * 公共remove方法 
   * @param model 
   * @param conditions 
   * @param callback 
   */
  async removeData(model, conditions) {
    return model.deleteOne(conditions)
      .exec()
      .then(result => {
        if (result.n != 0) {
          return response({
            message: "删除成功"
          })
        } else {
          return response({
            message: '暂无数据',
            status: 204
          })
        }
      })
      .catch(err => {
        console.log('removeData:',err);
        return response({
          message: '服务器未知异常',
          status: 500
        })
      })
  }
  async removeMultipleData(model, conditions) {
    return model.remove(conditions)
      .exec()
      .then(result => {
        if (result.n != 0) {
          return response({
            message: "删除成功"
          })
        } else {
          return response({
            message: '暂无数据',
            status: 204
          })
        }
      })
      .catch(err => {
        console.log('removeData:',err);
        return response({
          message: '服务器未知异常',
          status: 500
        })
      })
  }
  /** 
   * 公共find方法 非关联查找 
   * @param model 
   * @param conditions 
   * @param fields 查找时限定的条件，如顺序，某些字段不查找等 
   * @param options 
   * @param callback 
   */
  findData(model, conditions, fields, options, callback) {
    const _params = paramsFilter(conditions.params)
    model.countDocuments(_params)
      .exec()
      .then(total => {
        model.find(_params, fields, options)
          .exec()
          .then(result => {
              callback(response({
                body: {
                  total: total,
                  // pageNo: conditions.pagenation.pageNo,
                  list: result
                }
              }))
          }).catch(err => {
            console.log('findData:',err)
            callback(response({
              message: '服务器未知异常',
              status: 500
            }));
          })
      }).catch(err => {
        console.log('findData:',err)
        callback(response({
          message: '服务器未知异常',
          status: 500
        }));
      })
  }
  /** 
   * 公共populate find方法 
   * 是关联查找 
   * @param model 
   * @param conditions 
   * @param path :The field need to be refilled （需要覆盖的字段） 
   * @param fields :select fields (name -_id,Separated by a space field,In front of the field name plus "-"said not filled in) 
   * @param refmodel （关联的字段，有path可为null） 
   * @param options 
   * @param callback 
   */
  findDataPopulation(model, conditions, path, fields, refmodel, options, callback) {
    model.find(conditions)
      .populate(path, fields, refmodel, options)
      .exec()
      .then(result => {
        callback(response({
          body: result
        }))
      })
      .catch(err => {
        callback(response({
          message: '服务器未知异常',
          status: 500
        }));
        console.log('findDataPopulation:', err)
      })

    // model.find(conditions)
    //   .populate(path, fields, refmodel, options)
    //   .exec(function (err, result) {
    //     if (err) {
    //       console.log(error);
    //       let obj = response({
    //         message: '服务器未知异常',
    //         status: 500
    //       })
    //       callback(obj);
    //     } else {
    //       if (result.length != 0) {
    //         let filterParams = {
    //           values: result
    //         }
    //         if (conditions.pagenation) {
    //           filterParams.pagenation = {
    //             itemCount: total,
    //             pageNo: conditions.pagenation.pageNo,
    //             pageSize: conditions.pagenation.pageSize
    //           }
    //         }
    //         let obj = response(filterParams)
    //         callback(obj)
    //       } else {
    //         let obj = response({
    //           message: '暂无数据',
    //           status: 204
    //         })
    //         callback(obj);
    //       }

    //     }
    //   });
  }
}

export default BaseComponent