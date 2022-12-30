export function hashCode(str: string) {
  let hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function bin2hex(s: string) {
  var i,
    l,
    o = '',
    n;

  s += '';

  for (i = 0, l = s.length; i < l; i++) {
    n = s.charCodeAt(i).toString(16);
    o += n.length < 2 ? '0' + n : n;
  }

  return o;
}

export function getUUID(domain: string) {
  var canvas = document.createElement('canvas');
  var ctx: any = canvas.getContext('2d');
  var txt = domain;
  ctx.textBaseline = 'top';
  ctx.font = "14px 'Arial'";
  ctx.textBaseline = 'tencent';
  ctx.fillStyle = '#f60';
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = '#069';
  ctx.fillText(txt, 2, 15);
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
  ctx.fillText(txt, 4, 17);

  var b64 = canvas.toDataURL().replace('data:image/png;base64,', '');
  // window.atob 用于解码使用 base-64 编码的字符串
  var bin = atob(b64);
  var crc = bin2hex(bin.slice(-16, -12));
  return crc;
}

// var http = require('http');

// /**
//  * 获取本机IP
//  * @return {String} 返回本机IP
//  */
// function getLocalIP() {
//     const os = require('os');
//     const ifaces = os.networkInterfaces();
//     let locatIp = '';
//     for (let dev in ifaces) {
//         if (dev === '本地连接' || dev === '以太网') {
//             for (let j = 0; j < ifaces[dev].length; j++) {
//                 if (ifaces[dev][j].family === 'IPv4') {
//                     locatIp = ifaces[dev][j].address;
//                     break;
//                 }
//             }
//         }
//     }
//     return locatIp;
// }

// function getIPAdress() {
//   let localhost = '';
//   var interfaces = require('os').networkInterfaces();
//   for (var devName in interfaces) {
//     var iface = interfaces[devName];
//     for (var i = 0; i < iface.length; i++) {
//       var alias = iface[i];
//       if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
//         localhost = alias.address;
//       }
//     }
//   }
//   return localhost;
// }
