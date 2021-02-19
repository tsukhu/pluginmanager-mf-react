const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { camelCase } = require("camel-case");
const LiveManager = require("live-plugin-manager");

const doAsync = async () => {
  const manager = new LiveManager.PluginManager();

  const federatedRemotes = {
    "jherr-mf-slider": "1.0.1",
  };
  const deps = {
    ...federatedRemotes,
    ...require("./package.json").dependencies,
  };
  
  const getRemote = async (name) => {
    await manager.install(name,deps[name]);
    return `${camelCase(name)}@./plugin_packages/${name}/dist/browser/remote-entry.js`;
  };
  
 
  const remotes = await Object.keys(federatedRemotes).reduce(
    async (remotes, lib) => ({
      ...remotes,
      [lib]: await getRemote(lib),
    }),
    {}
  );
  return {
    output: {
      publicPath: "http://localhost:8080/",
    },
  
    resolve: {
      extensions: [".jsx", ".js", ".json"]
    },
  
    devServer: {
      port: 8080,
    },
  
    module: {
      rules: [
        {
          test: /\.m?js/,
          type: "javascript/auto",
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
  
    plugins: [
      new ModuleFederationPlugin({
        remotes,
        shared: {
          ...deps,
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: deps["react-dom"],
          },
        },
      }),
      new HtmlWebPackPlugin({
        template: "./src/index.html",
      }),
    ],
  };
}

module.exports = doAsync;
