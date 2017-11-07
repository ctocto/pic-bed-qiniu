const qn = require('qn');
const qiniuConfig = require('./qiniuConfig');

const client = qn.create({
    accessKey : qiniuConfig.AccessKey,
    secretKey : qiniuConfig.SecretKey,
    bucket : qiniuConfig.bucket,
    origin : qiniuConfig.hostName,
});

const API = {
    uptoken: (key) => {
        return client.uploadToken();
    },
    uploadFile: (key, localFile, callback) => {
        console.log('key: ', key);
        console.log('localFille: ', localFile);
        
        client
            .uploadFile(localFile, {
                key: key
            }, function (err, result) {
                if (err) {
                    console.error('ERROR:', err);
                } else {
                    console.log(result);
                }
                callback && callback(err, result);
            });
    }
}

module.exports = API;