const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
    electronBuilder: {
      builderOptions: {
        publish: [
          {
            provider: "generic",
            url: "https://autoupdate-au.s3.ap-south-1.amazonaws.com",
          },
        ],
        // publish: [
        //   {
        //     provider: "github",
        //     owner: "prajapatidk",
        //     repo: "vuetify_au_app",
        //     token: "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",
        //     private: true,
        //   },
        // ],
        nsis: {
          oneClick: false,
          perMachine: true,
          allowToChangeInstallationDirectory: true,
          installerLanguages: "en_US",
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          menuCategory: true,
          include: undefined,
          license: undefined,
          allowElevation: false,
        },
      },
    },
  },
});
