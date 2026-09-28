import { seedDefaultUser, saveGithubData, saveRedditData } from './db.js';

export function runSeed() {
  const defaultUser = seedDefaultUser();

  const demoGithubData = {
    username: defaultUser.github_username,
    name: 'Aarav Sharma',
    bio: 'Full Stack Systems Engineer @ CloudScale. Building distributed Rust & Next.js web applications.',
    location: 'Bengaluru, India',
    company: 'CloudScale Technologies',
    website: 'https://aarav-sharma.dev',
    email: 'aarav.sharma.dev@gmail.com',
    repos: [
      { name: 'cloud-orchestrator', language: 'Rust', description: 'Distributed async microservice orchestrator' },
      { name: 'weblab-privacy', language: 'JavaScript', description: 'Privacy footprint auditor & OSINT scanner' },
      { name: 'dotfiles', language: 'Shell', description: 'Neovim + tmux developer environment configuration' }
    ],
    events: [
      { type: 'PushEvent', repo: 'weblab-privacy', commit_email: 'aarav.sharma.dev@gmail.com', created_at: new Date().toISOString() },
      { type: 'IssueCommentEvent', repo: 'rust-lang/rust', comment: 'Fixed channel dispatcher deadlocks in async worker pool', permalink: 'https://github.com/rust-lang/rust/issues/10482#issuecomment-991203' }
    ]
  };

  const demoRedditData = [
    {
      id: 'reddit_post_101',
      context: 'r/developersIndia',
      title: 'Switched from Bengaluru to remote work at CloudScale',
      body: 'Been working at CloudScale Technologies in Bengaluru for 3 years now. Drop your questions regarding system architecture.',
      permalink: 'https://reddit.com/r/developersIndia/comments/x9012a/bengaluru_cloudscale_engineer',
      createdUtc: Math.floor(Date.now() / 1000) - 86400 * 10
    },
    {
      id: 'reddit_comment_102',
      context: 'r/rust',
      title: 'Async channel dispatchers design',
      body: 'Check out my github repo aarav-sharma.dev or drop me an email at aarav.sharma.dev [at] gmail [dot] com if you want to collaborate on rust orchestrator benchmark!',
      permalink: 'https://reddit.com/r/rust/comments/z8821a/async_rust_benchmarks/c8812',
      createdUtc: Math.floor(Date.now() / 1000) - 86400 * 5
    },
    {
      id: 'reddit_comment_103',
      context: 'r/Neovim',
      title: 'My Neovim config setup',
      body: 'My dotfiles repository handles tmux and lua configs for neovim 0.10. I maintain it under aarav_dev handle on github.',
      permalink: 'https://reddit.com/r/Neovim/comments/a1029/neovim_lua_setup/e99120',
      createdUtc: Math.floor(Date.now() / 1000) - 86400 * 2
    }
  ];

  saveGithubData(defaultUser.id, demoGithubData);
  saveRedditData(defaultUser.id, demoRedditData);

  return defaultUser;
}
