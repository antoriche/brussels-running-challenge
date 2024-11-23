/* eslint-disable -- this file has been copied from a dark github repo */
(this && this.__extends) ||
  (function () {
    let extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (const p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
const __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))((resolve, reject) => {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P((resolve) => {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
const __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    let _ = {
      label: 0,
      sent() {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: [],
    };
    let f;
    let y;
    let t;
    let g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1), y && (t = op[0] & 2 ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
const __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const arm_appservice_1 = require("@azure/arm-appservice");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const functionApp_1 = require("../armTemplates/resources/functionApp");
const guard_1 = require("../shared/guard");
const utils_1 = require("../shared/utils");
const armService_1 = require("./armService");
const azureBlobStorageService_1 = require("./azureBlobStorageService");
const baseService_1 = require("./baseService");
const constants_1 = require("../shared/constants");
const runtime_1 = require("../config/runtime");
const packageJson = require("../../package.json");

const FunctionAppService = /** @class */ (function (_super) {
  __extends(FunctionAppService, _super);
  function FunctionAppService(serverless, options) {
    const _this = _super.call(this, serverless, options) || this;
    _this.webClient = new arm_appservice_1.WebSiteManagementClient(_this.credentials, _this.subscriptionId);
    _this.blobService = new azureBlobStorageService_1.AzureBlobStorageService(serverless, options);
    return _this;
  }
  FunctionAppService.prototype.get = function () {
    return __awaiter(this, void 0, void 0, function () {
      let response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /* yield */, this.webClient.webApps.get(this.resourceGroup, functionApp_1.FunctionAppResource.getResourceName(this.config))];
          case 1:
            response = _a.sent();
            if (response.error && (response.error.code === "ResourceNotFound" || response.error.code === "ResourceGroupNotFound")) {
              this.log(this.resourceGroup);
              this.log(functionApp_1.FunctionAppResource.getResourceName(this.config));
              this.log(JSON.stringify(response));
              return [2 /* return */, null];
            }
            return [2 /* return */, response];
        }
      });
    });
  };
  FunctionAppService.prototype.getMasterKey = function (functionApp) {
    return __awaiter(this, void 0, void 0, function () {
      let _a;
      let keyUrl;
      let response;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _a = functionApp;
            if (_a) return [3 /* break */, 2];
            return [4 /* yield */, this.get()];
          case 1:
            _a = _b.sent();
            _b.label = 2;
          case 2:
            functionApp = _a;
            keyUrl = `${this.baseUrl}${functionApp.id}/host/default/listkeys?api-version=2019-08-01`;
            return [4 /* yield */, this.sendApiRequest("POST", keyUrl)];
          case 3:
            response = _b.sent();
            return [2 /* return */, response.data.masterKey];
        }
      });
    });
  };
  FunctionAppService.prototype.deleteFunction = function (functionApp, functionName) {
    return __awaiter(this, void 0, void 0, function () {
      let deleteFunctionUrl;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            guard_1.Guard.null(functionApp);
            guard_1.Guard.empty(functionName);
            this.log(`-> Deleting function: ${functionName}`);
            deleteFunctionUrl = `${this.baseUrl}${functionApp.id}/functions/${functionName}?api-version=2016-08-01`;
            return [4 /* yield */, this.sendApiRequest("DELETE", deleteFunctionUrl)];
          case 1:
            return [2 /* return */, _a.sent()];
        }
      });
    });
  };
  FunctionAppService.prototype.syncTriggers = function (functionApp, properties) {
    return __awaiter(this, void 0, void 0, function () {
      let syncTriggersUrl;
      let err_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            guard_1.Guard.null(functionApp);
            this.log("Syncing function triggers");
            syncTriggersUrl =
              `${this.baseUrl}/subscriptions/${this.subscriptionId}/resourceGroups/${this.resourceGroup}/providers/Microsoft.Web/sites/${functionApp.name}` +
              `/syncfunctiontriggers?api-version=2016-08-01`;
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            return [4 /* yield */, this.sendApiRequest("POST", syncTriggersUrl, { data: { properties } })];
          case 2:
            return [2 /* return */, _a.sent()];
          case 3:
            err_1 = _a.sent();
            throw new Error(`Error syncing function app triggers: ${err_1}`);
          case 4:
            return [2 /* return */];
        }
      });
    });
  };
  FunctionAppService.prototype.cleanUp = function (functionApp) {
    return __awaiter(this, void 0, void 0, function () {
      let deleteTasks;
      let serviceFunctions;
      let deployedFunctions;
      const _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            guard_1.Guard.null(functionApp);
            this.log("Cleaning up existing functions");
            deleteTasks = [];
            serviceFunctions = this.serverless.service.getAllFunctions();
            return [4 /* yield */, this.listFunctions(functionApp)];
          case 1:
            deployedFunctions = _a.sent();
            deployedFunctions.forEach((func) => {
              if (serviceFunctions.includes(func.name)) {
                deleteTasks.push(_this.deleteFunction(functionApp, func.name));
              }
            });
            return [4 /* yield */, Promise.all(deleteTasks)];
          case 2:
            return [2 /* return */, _a.sent()];
        }
      });
    });
  };
  FunctionAppService.prototype.listFunctions = function (functionApp) {
    return __awaiter(this, void 0, void 0, function () {
      let getTokenUrl;
      let retries;
      let response;
      let e_1;
      const _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            guard_1.Guard.null(functionApp);
            getTokenUrl = `${this.baseUrl}${functionApp.id}/functions?api-version=2016-08-01`;
            retries = 0;
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            return [
              4 /* yield */,
              utils_1.Utils.runWithRetry(
                () =>
                  __awaiter(_this, void 0, void 0, function () {
                    let listFunctionsResponse;
                    let response_1;
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [4 /* yield */, this.sendApiRequest("GET", getTokenUrl)];
                        case 1:
                          listFunctionsResponse = _a.sent();
                          if (listFunctionsResponse.status !== 200 || listFunctionsResponse.data.value.length === 0) {
                            this.log(`-> Function App not ready. Retry ${retries++} of ${FunctionAppService.retryCount}...`);
                            response_1 = this.stringify(listFunctionsResponse.data);
                          }
                          return [2 /* return */, listFunctionsResponse];
                      }
                    });
                  }),
                FunctionAppService.retryCount,
                FunctionAppService.retryInterval,
              ),
            ];
          case 2:
            response = _a.sent();
            return [2 /* return */, response.data.value.map((functionConfig) => functionConfig.properties)];
          case 3:
            e_1 = _a.sent();
            this.log("-> Unable to retrieve function app list");
            throw e_1;
          case 4:
            return [2 /* return */];
        }
      });
    });
  };
  /**
   * Gets the configuration of the specified function within the function app
   * @param functionApp The parent function app
   * @param functionName The name of hte function
   */
  FunctionAppService.prototype.getFunction = function (functionApp, functionName) {
    return __awaiter(this, void 0, void 0, function () {
      let getFunctionUrl;
      let response_2;
      let e_2;
      const _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            guard_1.Guard.null(functionApp);
            guard_1.Guard.empty(functionName);
            getFunctionUrl = `${this.baseUrl}${functionApp.id}/functions/${functionName}?api-version=2016-08-01`;
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            return [
              4 /* yield */,
              utils_1.Utils.runWithRetry(
                () =>
                  __awaiter(_this, void 0, void 0, function () {
                    let getFunctionResponse;
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [4 /* yield */, this.sendApiRequest("GET", getFunctionUrl)];
                        case 1:
                          getFunctionResponse = _a.sent();
                          if (getFunctionResponse.status !== 200) {
                            this.log("-> Function app not ready. Retrying...");
                            throw new Error(this.stringify(response_2.data));
                          }
                          return [2 /* return */, getFunctionResponse];
                      }
                    });
                  }),
                FunctionAppService.retryCount,
                FunctionAppService.retryInterval,
              ),
            ];
          case 2:
            response_2 = _a.sent();
            return [2 /* return */, response_2.data.properties];
          case 3:
            e_2 = _a.sent();
            return [2 /* return */, null];
          case 4:
            return [2 /* return */];
        }
      });
    });
  };
  FunctionAppService.prototype.uploadFunctions = function (functionApp) {
    return __awaiter(this, void 0, void 0, function () {
      let functionZipFile;
      let sasUrl;
      let response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            guard_1.Guard.null(functionApp, "functionApp");
            functionZipFile = this.getFunctionZipFile();
            if (!this.config.provider.deployment.external) return [3 /* break */, 6];
            this.log("Updating function app setting to run from external package...");
            return [4 /* yield */, this.uploadZippedArtifactToBlobStorage(functionZipFile)];
          case 1:
            _a.sent();
            return [4 /* yield */, this.blobService.generateBlobSasTokenUrl(this.config.provider.deployment.container, this.artifactName)];
          case 2:
            sasUrl = _a.sent();
            return [4 /* yield */, this.updateFunctionAppSetting(functionApp, constants_1.constants.runFromPackageSetting, sasUrl)];
          case 3:
            response = _a.sent();
            return [4 /* yield */, this.syncTriggers(functionApp, response.properties)];
          case 4:
            _a.sent();
            return [4 /* yield */, this.logFunctions(functionApp)];
          case 5:
            _a.sent();
            return [3 /* break */, 8];
          case 6:
            return [
              4 /* yield */,
              Promise.all([
                // Uploaded to blob storage as artifact for future reference
                this.uploadZippedArtifactToBlobStorage(functionZipFile),
                this.publish(functionApp, functionZipFile),
              ]),
            ];
          case 7:
            _a.sent();
            _a.label = 8;
          case 8:
            return [2 /* return */];
        }
      });
    });
  };
  /**
   * create all necessary resources as defined in src/provider/armTemplates
   *    resource-group, storage account, app service plan, and app service at the minimum
   */
  FunctionAppService.prototype.deploy = async function () {
    this.log(`Creating function app: ${functionApp_1.FunctionAppResource.getResourceName(this.config)}`);

    const armService = new armService_1.ArmService(this.serverless, this.options);
    const { armTemplate, type } = this.config.provider;
    const deployment = await armService.createDeploymentFromType(type || "consumption");

    if (armTemplate) {
      const armDeployment = await armService.createDeploymentFromConfig(armTemplate);

      deployment.template.parameters = { ...deployment.template.parameters, ...armDeployment.template.parameters };
      deployment.template.resources = [...deployment.template.resources, ...armDeployment.template.resources];
      deployment.template.variables = { ...deployment.template.variables, ...armDeployment.template.variables };
      deployment.template.outputs = { ...deployment.template.outputs, ...armDeployment.template.outputs };
      deployment.parameters = { ...deployment.parameters, ...armDeployment.parameters };
    }

    this.log(JSON.stringify(deployment, null, 4));

    await armService.deployTemplate(deployment);

    // Return function app
    return await this.get();
  };
  FunctionAppService.prototype.uploadZippedArtifactToFunctionApp = function (functionApp, functionZipFile) {
    return __awaiter(this, void 0, void 0, function () {
      let scmDomain;
      let isLinux;
      let uri;
      let requestOptions;
      let _a;
      let _b;
      let _c;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            scmDomain = this.getScmDomain(functionApp);
            this.log(`Deploying zip file to function app: ${functionApp.name}`);
            if (!(functionZipFile && fs_1.default.existsSync(functionZipFile))) {
              throw new Error("No zip file found for function app");
            }
            this.log(`-> Deploying service package @ ${functionZipFile}`);
            isLinux = this.configService.getOs() === runtime_1.FunctionAppOS.LINUX;
            uri = `https://${scmDomain}/api/zipdeploy${isLinux ? "?syncTriggers=true" : ""}`;
            this.log(`Publishing to URI: ${uri}`);
            _a = {
              method: "POST",
              uri,
              json: true,
            };
            _b = {};
            _c = "Bearer ";
            return [4 /* yield */, this.getAccessToken()];
          case 1:
            requestOptions =
              ((_a.headers =
                ((_b.Authorization = _c + _d.sent()),
                (_b.Accept = "*/*"),
                (_b.ContentType = "application/octet-stream"),
                (_b["User-Agent"] = `serverless_framework/${this.serverless.version} serverless_azure_functions/${packageJson.version}`),
                _b)),
              _a);
            return [4 /* yield */, this.sendFile(requestOptions, functionZipFile)];
          case 2:
            _d.sent();
            this.log("-> Function package uploaded successfully");
            return [2 /* return */];
        }
      });
    });
  };
  /**
   * Gets local path of packaged function app
   */
  FunctionAppService.prototype.getFunctionZipFile = function () {
    let functionZipFile = this.getOption("package") || this.serverless.service.artifact;
    if (!functionZipFile) {
      functionZipFile = path_1.default.join(this.serverless.config.servicePath, ".serverless", `${this.serverless.service.getServiceName()}.zip`);
    }
    return functionZipFile;
  };
  FunctionAppService.prototype.getDeploymentName = function () {
    return this.configService.getDeploymentName();
  };
  FunctionAppService.prototype.updateFunctionAppSetting = function (functionApp, setting, value) {
    return __awaiter(this, void 0, void 0, function () {
      let properties;
      let url;
      let response;
      let err_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /* yield */, this.webClient.webApps.listApplicationSettings(this.resourceGroup, functionApp.name)];
          case 1:
            properties = _a.sent().properties;
            properties[setting] = value;
            _a.label = 2;
          case 2:
            _a.trys.push([2, 4, , 5]);
            url = `${this.baseUrl}/subscriptions/${this.subscriptionId}/resourceGroups/${this.resourceGroup}/providers/Microsoft.Web/sites/${functionApp.name}/config/appsettings?api-version=2016-08-01`;
            return [4 /* yield */, this.sendApiRequest("PUT", url, { data: { properties } })];
          case 3:
            response = _a.sent();
            return [2 /* return */, response.data];
          case 4:
            err_2 = _a.sent();
            throw new Error(`Failed to update function app settings: ${err_2}`);
          case 5:
            return [2 /* return */];
        }
      });
    });
  };
  FunctionAppService.prototype.getFunctionHttpTriggerConfig = function (functionApp, functionConfig) {
    const httpTrigger = functionConfig.config.bindings.find((binding) => binding.type === "httpTrigger");
    if (!httpTrigger) {
      return;
    }
    const route = httpTrigger.route || functionConfig.name;
    const url = `${functionApp.defaultHostName}/api/${route}`;
    return {
      authLevel: httpTrigger.authLevel,
      methods: httpTrigger.methods || ["*"],
      url,
      route: httpTrigger.route,
      name: functionConfig.name,
    };
  };
  /**
   * Publish function app
   * @param functionApp Function App
   * @param functionZipFile Path to zipped function app file
   */
  FunctionAppService.prototype.publish = function (functionApp, functionZipFile) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            this.log("Deploying serverless functions...");
            return [4 /* yield */, this.uploadZippedArtifactToFunctionApp(functionApp, functionZipFile)];
          case 1:
            _a.sent();
            return [4 /* yield */, this.logFunctions(functionApp)];
          case 2:
            _a.sent();
            return [2 /* return */];
        }
      });
    });
  };
  FunctionAppService.prototype.logFunctions = function (functionApp) {
    return __awaiter(this, void 0, void 0, function () {
      let serverlessFunctions;
      let deployedFunctions;
      const _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            this.log("Deployed serverless functions:");
            serverlessFunctions = this.serverless.service.getAllFunctions();
            return [4 /* yield */, this.listFunctions(functionApp)];
          case 1:
            deployedFunctions = _a.sent();
            // List functions that are part of the serverless yaml config
            deployedFunctions.forEach((functionConfig) => {
              if (serverlessFunctions.includes(functionConfig.name)) {
                const httpConfig = _this.getFunctionHttpTriggerConfig(functionApp, functionConfig);
                if (httpConfig) {
                  const method = httpConfig.methods[0].toUpperCase();
                  _this.log(`-> ${functionConfig.name}: [${method}] ${httpConfig.url}`);
                }
              }
            });
            return [2 /* return */];
        }
      });
    });
  };
  /**
   * Uploads artifact file to blob storage container
   */
  FunctionAppService.prototype.uploadZippedArtifactToBlobStorage = function (functionZipFile) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /* yield */, this.blobService.initialize()];
          case 1:
            _a.sent();
            return [4 /* yield */, this.blobService.createContainerIfNotExists(this.config.provider.deployment.container)];
          case 2:
            _a.sent();
            return [4 /* yield */, this.blobService.uploadFile(functionZipFile, this.config.provider.deployment.container, this.artifactName)];
          case 3:
            _a.sent();
            return [2 /* return */];
        }
      });
    });
  };
  /**
   * Retrieves the SCM domain from the list of enabled domains within the app
   * Note: The SCM domain exposes additional API calls from the standard REST APIs.
   * @param functionApp The function app / web site
   */
  FunctionAppService.prototype.getScmDomain = function (functionApp) {
    return functionApp.enabledHostNames.find((hostName) => hostName.includes(".scm.") && hostName.endsWith(".azurewebsites.net"));
  };
  FunctionAppService.retryCount = 30;
  FunctionAppService.retryInterval = 30000;
  return FunctionAppService;
})(baseService_1.BaseService);
exports.FunctionAppService = FunctionAppService;
