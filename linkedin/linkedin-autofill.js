const { chromium } = require("playwright");
const fs = require("fs");

const projects = JSON.parse(fs.readFileSync("./linkedin-projects.json", "utf8"));

(async () => {
  const browser = await chromium.launch({
    channel: "chrome",
    headless: false,
    slowMo: 250,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://www.linkedin.com/login", {
    waitUntil: "domcontentloaded",
  });

  console.log("Log in inside the Chrome window opened by this script.");
  console.log("Then go to your profile > Add profile section > Additional > Add projects.");
  console.log("Keep that browser open. When the Add Project modal is visible, press ENTER here.");

  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  process.stdin.on("data", async () => {
    try {
      if (page.isClosed()) {
        console.log("The LinkedIn tab was closed. Restart the script and keep the opened Chrome window alive.");
        return;
      }

      const project = projects.shift();

      if (!project) {
        console.log("All projects done.");
        return;
      }

      await fillProject(page, project);

      fs.writeFileSync(
        "./linkedin-projects-remaining.json",
        JSON.stringify(projects, null, 2)
      );

      console.log(`Filled: ${project.title}`);
      console.log("Click Save manually, open Add Project again, then press ENTER here.");
    } catch (err) {
      console.log("Autofill failed:");
      console.log(err.message);
      console.log("Make sure the Add Project modal is open before pressing ENTER.");
    }
  });
})();

async function fillProject(page, project) {
  await page.bringToFront();

  const titleInput = page.locator(
    'input[aria-label*="Project name"], input[name*="title"], input'
  ).first();

  await titleInput.waitFor({ state: "visible", timeout: 15000 });
  await titleInput.fill(project.title);

  const textareas = page.locator("textarea");
  if (await textareas.count()) {
    await textareas.first().fill(project.description);
  }

  if (project.url) {
    const urlInput = page.locator(
      'input[aria-label*="URL"], input[placeholder*="URL"], input[type="url"]'
    );

    if (await urlInput.count()) {
      await urlInput.first().fill(project.url);
    }
  }

  console.log(`Date to select manually: ${project.month}/${project.year}`);
}