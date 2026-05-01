const fs = require("fs");
const vm = require("vm");

const code = fs.readFileSync("./projects.js", "utf8");

const sandbox = {
  window: {},
};

vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const projects = sandbox.window.PROJECTS_DATA.RAW_PROJECTS;

const linkedinProjects = projects.map((p) => {
  const bestUrl =
    p.links?.live ||
    p.links?.github ||
    p.links?.docs ||
    p.links?.uiMockup ||
    p.links?.apk ||
    "";

  return {
    title: p.title,
    month: p.month,
    year: p.year,
    description: [
      p.description,
      p.context ? `\n\nContext: ${p.context}` : "",
      p.language ? `\n\nTech: ${p.language}` : "",
      p.icons?.length ? `\nTools: ${p.icons.join(", ")}` : "",
    ].join(""),
    url: bestUrl,
  };
});

fs.writeFileSync(
  "./linkedin-projects.json",
  JSON.stringify(linkedinProjects, null, 2)
);

console.log(`Exported ${linkedinProjects.length} LinkedIn projects.`);