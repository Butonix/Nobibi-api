import User from '../models/user'
import BaseComponent from './baseComponent'

class UserComponent extends BaseComponent {
    constructor() {
        super()
    }
    /**
     * 新增用户
     * @returns {Function}
     */
    addUser (conditions, options) {
        return new Promise(async (resolve, reject) =>  {
            try {
                super.addData(User, conditions, options, function (result) {
                    resolve(result);
                });
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 查找用户
     * @param conditions
     */
    findUser (conditions) {
        return new Promise((resolve, reject) => {
            try {
                let options = {}
                if (conditions.pagenation) {
                    options = {
                        sort: { _id: -1 },
                        limit: conditions.pagenation.pageSize,
                        skip: (conditions.pagenation.pageNo - 1) * conditions.pagenation.pageSize
                    }
                }
                super.findData(User, conditions, {}, options, function (result) {
                    resolve(result);
                });
            } catch (error) {
                reject(error)
            }
           
        })
       
    }
    /**
     * 删除用户
     * @param conditions
     */
    removeUser (conditions) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await super.removeData(User, conditions)
                resolve(result);
            } catch (error) {
                reject(error)
            }
        })
       
    }
    /**
     * 更新用户信息
     * @param conditions
     * @param update
     * @param options
     */
    updateUser (conditions, update, options) {
        return new Promise((resolve, reject) => {
            try {
                super.updateData(User, conditions, update, options, function (result) {
                    resolve(result);
                });
            } catch (error) {
                reject(error)
            }
        })
    }
};


export default UserComponent



