// const path = require("path");
const {alias, configPaths} = require("react-app-rewire-alias");

module.exports = function override(config, env) {
    alias(configPaths("./tsconfig.paths.json"))(config);

    // config.entry = path.resolve(__dirname, "src/site/index.tsx");
    // console.log(config);
    // config.paths = function (paths, env) {
    //     paths.appIndexJs = path.resolve(__dirname, 'mysrc/client.js');
    //     paths.appSrc = path.resolve(__dirname, 'mysrc');
    //     return paths;
    // }
    return config;
}
