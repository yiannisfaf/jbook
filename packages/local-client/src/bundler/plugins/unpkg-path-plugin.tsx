import * as esbuild from 'esbuild-wasm';
 
export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) { //setup called by esbuild automatically
      
      //looks for index.js file 
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: 'index.js', namespace: 'a' };
      });

      //look for files with ./ or ../
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: 'a',
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href
        };
      });
      
      //handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => { //filter is a regex - looks for any file with extension of .* 
        console.log('onResolve', args);
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' }; //namespace specifies which category file is in.
        }
        
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`
        };
      });
      //two event listeners - onResolve and onLoad
      //onResolve overrides EsBuilds normal process of finding where a file is.
      //We want to define our own file we don't want ESBuild to get a file from our local system.
      //onLoad loads the file to ESBuild instead. 
    },
  };
};