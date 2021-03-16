import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
  name: 'filecache'
});


export const fetchPlugin = (inputCode: string) => {
  return {
      name: 'fetch-plugin',
      setup(build: esbuild.PluginBuild) {
        build.onLoad({ filter: /(^index\.js$)/ }, () => {
            return {
                loader: 'jsx',
                contents: inputCode,
            };
        });

        build.onLoad({ filter: /.*/ }, async (args: any) => {
            //check to see if we have already fetched file and if it is in the cache.
            const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
            
            //if it is, return it immediately.
            if (cachedResult) {
                return cachedResult;
            }
        });

        build.onLoad({ filter: /.css$/ }, async (args: any) => {
            const { data, request } = await axios.get(args.path);
            
            const escaped = data
                .replace(/\n/g, '')
                .replace(/"/g, '\\"')
                .replace(/'/g, "\\'");
            
            //can't directly import CSS so we write JS block below to add CSS into a style element in the head tag.
            const contents =
                `
                    const style = document.createElement('style');
                    style.innerText = '${escaped}';
                    document.head.appendChild(style);
                `;

            const result: esbuild.OnLoadResult = {
                loader: 'jsx',
                contents: contents,
                resolveDir: new URL('./', request.responseURL).pathname //get path for nested packages
            };
        
            //otherwise store response in cache
            await fileCache.setItem(args.path, result);
        
            return result;
        });

        build.onLoad({ filter: /.*/ }, async (args: any) => {
            const { data, request } = await axios.get(args.path);

            const result: esbuild.OnLoadResult = {
                loader: 'jsx',
                contents: data,
                resolveDir: new URL('./', request.responseURL).pathname //get path for nested packages
            };
        
            //otherwise store response in cache
            await fileCache.setItem(args.path, result);
        
            return result;
        });
    }
  }  
};