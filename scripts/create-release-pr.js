// const core = require("@actions/core");
const github = require("@actions/github");

async function getContributions(octokit, pr, owner, repo) {
  const { data: [release] } = await octokit.repos.listReleases({ owner, repo, per_page: 1, page: 1 });
  const res = await octokit.repos.listCommits({ owner, repo, sha: "develop", since: release.published_at, per_page: 100 });
  return res.data;
}

// すでに "RLEASE PR" が開いているなら、bodyの更新、無いならPRの作成をする
async function upsertReleasePR(octokit, pr, owner, repo, title, body, head = "develop", base = "main") {
  if (pr) {
    const res = await octokit.pulls.update({ owner, repo, title, body, pull_number: pr.number });
    console.log("[INFO] RELEASE PR UPDATED:", res.data.html_url);
  } else {
    const res = await octokit.pulls.create({ owner, repo, title, body, head, base });
    console.log("[INFO] RELEASE PR CREATED:", res.data.html_url);
  }
}

async function main() {
  const { owner, repo } = { owner: "KanCraft", repo: "kanColleWidget" };
  const token = process.env.GITHUB_TOKEN;
  const octokit = github.getOctokit(token);
  const head = "develop", base = "main";

  const { data: [release] } = await octokit.repos.listReleases({ owner, repo, per_page: 1, page: 1 });
  const { data: contributions } = await octokit.repos.listCommits({ owner, repo, sha: "develop", since: release.published_at, per_page: 100 });

  const { data: [pr] } = await octokit.pulls.list({ owner, repo, head, base, state: "open" })

  const exp = /\/([a-z0-9]+)$/;
  const commits = contributions.map(({ commit }) => {
    const message = commit.message.split("\n")[0];
    if (message.startsWith("Merge pull request")) return null;
    if (message.match(/^[0-9]+\.[0-9]+\.[0-9]/)) return null;
    return { hash: exp.exec(commit.url)[1], author: commit.author.name, message, date: commit.committer.date };
  }).filter(c => !!c);

  const title = `RELEASE: ${process.env.NEW_TAG || (new Date()).toLocaleDateString()}`;
  let body = "このバージョンをリリースするには、コメント欄に `:+1:` とコメントしてください.\n----------\n"
  body += commits.map(c => `- ${c.hash} (${c.author}) ${c.message}`).join("\n");

  if (!process.env.GITHUB_WORKFLOW) {
    console.log("TITLE:\n", title);
    console.log("BODY:\n", body);
    console.log("[DEBUG]", "終了");
    return
  }

  upsertReleasePR(octokit, pr, owner, repo, title, body);
};

if (require.main === module) {
  main();
}