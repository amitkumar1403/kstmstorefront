
export const generateUri = (uri: string, qs: string) => {
   if (uri) {
      return uri.indexOf("?") == -1 ? sanitizeUri(`${uri}?${qs}`) : sanitizeUri(`${uri}&${qs}`);
   }
   return null;
};

export const sanitizeUri = (uri: string) => {
   const params = uriParams(uri);
   if (params) {
      var qs;
      for(let key in params) {
         if (!qs) {
            qs = `?${key}=${params[key]}`;
         } else {
            qs = qs + `&${key}=${params[key]}`;
         }
      }
      return `${uri.substring(0, uri.indexOf("?"))}${qs}`;
   }
   return uri;
};

export const uriParams = (uri: string) => {
   let url = decodeURI(uri);
   url = url.substring(url.indexOf("?") + 1);
   const params = url.replace('?', '')
      .split('&')
      .map(param => param.split('='))
      .reduce((values: any, [key, value]) => {
         values[key] = value;
         return values;
      }, {});

   return params;
}