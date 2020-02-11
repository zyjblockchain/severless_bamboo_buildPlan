const Bamboo = require('bamboo-api')
const bamboo = new Bamboo('http://samyh.f3322.net:8085','root','123456')

// webHook: https://1822159629234303.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/severless_bamboo_buildPlan/severless_bamboo_buildPlan/?project_key=GSSBED&plan_key=PAYDEV
module.exports.handler = function(req, resp, context) {
    // 从请求参数中获取project key和plan key
    const urlQuery = req.queries
    console.log('打印出该仓库配置对应的bamboo的project_key和plan_key：', urlQuery.project_key,urlQuery.plan_key)
    // 调用自动build方法，启动对应的plan
    buildPlan(urlQuery.project_key,urlQuery.plan_key, resp)
}

/**
 * 调用bamboo api 触发build plan
 * @param PROJECT_KEY bamboo中的项目KEY == GSSBED
 * @param PLAN_KEY 项目下的plan的KEY == PAYDEV
 */
async function buildPlan(PROJECT_KEY, PLAN_KEY, resp) {
    const urlParams = {"os_authType": "basic"};
    const buildParams = {"executeAllStages": true};
    const buildDetails = PROJECT_KEY + '-' + PLAN_KEY
    await bamboo.buildPlan(buildDetails, function(error, result) {
        resp.setHeader('content-type', 'application/json')
        resp.send('success')
        // todo 调用结果可以转发到钉钉群通知
        if (error) {
            console.log(error);
            return;
        }
        console.log("Result:", result);
    }, urlParams, buildParams);
}
