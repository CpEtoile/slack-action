const { tag, slack_description } = process.env;
let description = slack_description;
let risk = "Low";

try {
  const { data: { body } } = await github.rest.repos.getReleaseByTag({
    owner: context.repo.owner,
    repo: context.repo.repo,
    tag,
  });
  const regex = /## BREAKING CHANGES:/g;
  const found = body.match(regex);
  if (found) {
    description = `⚠️ BREAKING CHANGES ⚠️\\n${description}`;
    risk = "High";
  }
} catch (error) {
  core.error(`Error: ${error}`);
  core.notice(`Release ${tag} not exists!`);
}
core.setOutput("description", description);
core.setOutput("risk", risk);