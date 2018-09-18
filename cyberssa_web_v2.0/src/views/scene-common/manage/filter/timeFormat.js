/**
 * 
 * 时间过滤器
 * @param {*Date} date 
 * @param {*String} format 
 * 
 */

export default function (date = new Date(), format = 'YYYY-MM-DD HH:mm:ss') {
    const fn = d => {
        return ('0' + d).slice(-2);
    };
    const d = new Date(date);
    const formats = {
        YYYY: d.getFullYear(),
        MM: fn(d.getMonth() + 1),
        DD: fn(d.getDate()),
        HH: fn(d.getHours()),
        mm: fn(d.getMinutes()),
        ss: fn(d.getSeconds())
    };
    return format.replace(/([a-z])\1+/ig, a => {
        return formats[a] || a;
    });
}
