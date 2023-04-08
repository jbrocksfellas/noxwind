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
