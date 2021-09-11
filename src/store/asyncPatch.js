// export const AppContext = createContext();

// 这里对dispatch函数进行一个封装，使其支持处理异步action
// 简而言之就是判断传进来的action是不是Promise对象，如果是的话
// 先执行loading_start，将loading置为true
// 然后执行完成Promise后，将获得的结果执行一次action
// 再执行loading_end（实际项目中请求失败也应该执行loading_end，因项目而异，不展开了）
// 注意：这个loading是我项目中喜欢用的一个标志位，用来记录当前是不是处于请求中
// 因为经常需要有如果在请求中，按钮需要禁用，防止用户再点击这种需求
// 另外实际项目中,loading可以扩展成对象，记录各种异步请求的状态
function isPromise(obj) {
    return (
        !!obj &&
        (typeof obj === "object" || typeof obj === "function") &&
        typeof obj.then === "function"
    );
}

export function wrapperDispatch(dispatch) {
    return function (action) {
        if (isPromise(action.payload)) {
            // dispatch({ type: "loading_start" }); //loading bar
            action.payload.then(v => {
                dispatch({ type: action.type, payload: v });
                // dispatch({ type: "loading_end" });
            });
        } else {
            dispatch(action);
        }
    };
}