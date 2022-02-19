module.exports=(()=>{"use strict";var e={912:(e,r)=>{Object.defineProperty(r,"__esModule",{value:true});r.default=void 0;var t=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;r.default=t},551:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:true});r.default=rng;var u=_interopRequireDefault(t(417));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}const a=new Uint8Array(256);let i=a.length;function rng(){if(i>a.length-16){u.default.randomFillSync(a);i=0}return a.slice(i,i+=16)}},467:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:true});r.default=void 0;var u=_interopRequireDefault(t(436));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}const a=[];for(let e=0;e<256;++e){a.push((e+256).toString(16).substr(1))}function stringify(e,r=0){const t=(a[e[r+0]]+a[e[r+1]]+a[e[r+2]]+a[e[r+3]]+"-"+a[e[r+4]]+a[e[r+5]]+"-"+a[e[r+6]]+a[e[r+7]]+"-"+a[e[r+8]]+a[e[r+9]]+"-"+a[e[r+10]]+a[e[r+11]]+a[e[r+12]]+a[e[r+13]]+a[e[r+14]]+a[e[r+15]]).toLowerCase();if(!(0,u.default)(t)){throw TypeError("Stringified UUID is invalid")}return t}var i=stringify;r.default=i},586:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:true});r.default=void 0;var u=_interopRequireDefault(t(551));var a=_interopRequireDefault(t(467));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function v4(e,r,t){e=e||{};const i=e.random||(e.rng||u.default)();i[6]=i[6]&15|64;i[8]=i[8]&63|128;if(r){t=t||0;for(let e=0;e<16;++e){r[t+e]=i[e]}return r}return(0,a.default)(i)}var i=v4;r.default=i},436:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:true});r.default=void 0;var u=_interopRequireDefault(t(912));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function validate(e){return typeof e==="string"&&u.default.test(e)}var a=validate;r.default=a},417:e=>{e.exports=require("crypto")}};var r={};function __nccwpck_require__(t){if(r[t]){return r[t].exports}var u=r[t]={exports:{}};var a=true;try{e[t](u,u.exports,__nccwpck_require__);a=false}finally{if(a)delete r[t]}return u.exports}__nccwpck_require__.ab=__dirname+"/";return __nccwpck_require__(586)})();