const express = require('express');
const md5 = require('md5');
const mime = require('mime-types');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const sizeOf = require('image-size');
const qiniu = require('qiniu');
const API = require('./qiniuApi');

const app = express();

app.get('/upload', (req, res) => {
	const url = req.query.url;
	const localURL = decodeURI(url.replace('file://', ''));
	const size = fs.statSync(localURL).size / (1024 * 1024);
	const dimensions = sizeOf(localURL);
	// 用 mime 判断文件类型
	let format = mime.extension(mime.lookup(localURL));
	console.log('file type: ', mime.lookup(localURL));
	
	format === 'jpeg' && (format = 'jpg');
	
	if(mime.lookup(localURL).indexOf('image/') > -1){
		/**
		 * console.log
		 */
		console.log('image type: ', format);
		console.log('image dimensions:', dimensions);
		console.log('image size', size);

		if (size < 5) {
			const qiniuURL = `static/${md5(localURL)}_${dimensions.width}x${dimensions.height}.${format || ''}`;
			API.uploadFile(qiniuURL, localURL, (err, result) => {
				if (err) {
					res.send(err);
				} else {
					res.send(result);
				}
			});
		}
	}else{
		if (size < 20) {
			const qiniuURL = `static/${md5(localURL)}_${dimensions.width}x${dimensions.height}.${format || ''}`;
			API.uploadFile(qiniuURL, localURL, (err, result) => {
				if (err) {
					res.send(err);
				} else {
					res.send(result);
				}
			});
		}
	}
	
	
})

app.listen(3000, () => {
	console.log('listening on port 3000!');
})

