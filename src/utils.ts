export function findViteTemplate(name: string, typescript: boolean): string {
  const templates: any = {
    React: "react",
    Vue: "vue",
    Vanilla: "vanilla",
  };

  if (typescript) return templates[name] + "-ts";
  return templates[name];
}

export function findFrontendFramework(stack: string): string {
  const stacks: any = {
    "MEAN Stack": "Angular",
    "MERN Stack": "React",
    "MEVN Stack": "Vue",
  };

  return stacks[stack];
}

export function findBackendLibraries(stack: string): Array<string> {
  const libraries: any = {
    "MEAN Stack": ["mongoose", "express"],
    "MERN Stack": ["mongoose", "express"],
    "MEVN Stack": ["mongoose", "express"],
  };

  return libraries[stack];
}

export function findTestingLibraries(stack: string): Array<string> {
  const stacks = {
    "Mocha + Chai": ["mocha", "chai"],
    Jest: ["jest"],
    "Mocha + Chai + Supertest": ["mocha", "chai", "supertest"],
    "Mocha + Chai + Sinon": ["mocha", "chai", "sinon"],
    "Jest + Enzyme": ["jest", "enzyme", "enzyme-adapter-react-16"],
    "Cypress + Mocha + Chai": ["cypress", "mocha", "chai"],
  };

  return (<any>stacks)[stack];
}

export function createPackageImport(packageName: string, variableName?: string): string {
  const varName = variableName ? variableName : packageName;
  const imp = `const ${varName} = require("${packageName}"})`;
  return imp;
}

export function findCommonBoilerplatePackages(dependencies: Array<string>): Array<string> {
  return [];
}

class NodeBoilerPlate {
  constructor(dependencies: Array<string>) {
    this.dependencies = dependencies;
  }

  private dependencies: Array<string>;
  private boilerPlate: string = "";

  private addImport(packageName: string, variableName?: string): string {
    const varName = variableName ? variableName : packageName;
    const imp = `const ${varName} = require("${packageName}"})`;
    return imp;
  }

  private addMiddlewareSetup(dependency: string): string {
    return "";
  }

  private addInitializer(dependency: string): string {
    return "";
  }

  public getBoilerplate() {
    let boilerPlateImports = "";
    let boilerPlateMiddlewares = "";
    let boilerPlateInitializers = "";
    // create imports
    const length = this.dependencies.length;
    this.dependencies.forEach((dependency: string, i) => {
      // create import
      const imp = this.addImport(dependency);
      boilerPlateImports += imp + "\n";

      // create middlewares
      const mid = this.addMiddlewareSetup(dependency);

      // create initializers
      const init = this.addInitializer(dependency);

      if (i === length - 1) {
        boilerPlateImports += "\n";
        boilerPlateMiddlewares += "\n";
        boilerPlateInitializers += "\n";
      }

      this.boilerPlate = boilerPlateImports + boilerPlateMiddlewares + boilerPlateInitializers;
    });
    return this.boilerPlate;
  }
}

function findBoilerplate(dependencyName: string, extension: string): string {
  const fullName = `${dependencyName}-${extension}`;
  return "";
}
