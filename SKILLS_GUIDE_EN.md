# Guide: How to install 85 skills for Claude Code

A step-by-step guide for students. When you're done, your repository will have a `.claude/skills/` directory with 85 ready-made skills from Anthropic, Vercel, Supabase and the community.

---

## What a Skill is

A **Skill** is a folder with a `SKILL.md` file that holds procedural knowledge: when to use it, what the logic is, and examples. Claude Code automatically loads the name and description into context, and reads the full text when a task matches the skill's triggers.

Not a plugin. Not an extension. Just Markdown with instructions.

---

## What you need before you start

1. **Node.js 18+** (check: `node -v`)
2. **Claude Code** installed and launched at least once
3. **A Git repository** — skills are installed into the project's `./.claude/skills/`

---

## Installation: one command per package

Skills are installed with the `npx skills` utility from the [skills.sh](https://skills.sh) catalog. Flags:

- `-y` — skip confirmation
- `-a claude-code` — for Claude Code only
- `-s '*'` — all skills from the package

Run these 8 commands one after another in the root of your project:

```bash
npx --yes skills add anthropics/skills                       -y -a claude-code -s '*'
npx --yes skills add vercel-labs/agent-skills                -y -a claude-code -s '*'
npx --yes skills add supabase/agent-skills                   -y -a claude-code -s '*'
npx --yes skills add obra/superpowers                        -y -a claude-code -s '*'
npx --yes skills add coreyhaines31/marketingskills           -y -a claude-code -s '*'
npx --yes skills add nextlevelbuilder/ui-ux-pro-max-skill    -y -a claude-code -s '*'
npx --yes skills add qwwiwi/skill-finder                     -y -a claude-code -s '*'
npx --yes skills add EveryInc/charlie-cfo-skill              -y -a claude-code -s '*'
```

After installation, Claude Code sees the skills right away. No restart needed.

Check:

```bash
ls .claude/skills/ | wc -l   # should be 85
npx skills list              # shows installed skills with their sources
```

## What exactly got installed: 85 skills by category

### Marketing and sales — 36 skills (coreyhaines31/marketingskills)

A complete turnkey marketing department: from customer research to retention.

| Skill | When to use |
|---|---|
| copywriting | Sales copy using the AIDA/PAS formulas |
| seo-audit | Full website audit for search engines |
| ai-seo | SEO for AI search (Perplexity, ChatGPT) |
| programmatic-seo | Mass generation of SEO pages |
| schema-markup | Structured data for Google |
| site-architecture | Site structure for SEO and UX |
| aso-audit | ASO audit of mobile apps |
| content-strategy | Content plan and strategy |
| social-content | Social media posts |
| copy-editing | Copy editing |
| email-sequence | Nurture and sales emails |
| cold-email | Cold emails |
| ad-creative | Ad creatives (including via Gemini) |
| paid-ads | Paid advertising setup |
| launch-strategy | Product launch strategy |
| lead-magnets | Lead magnets |
| free-tool-strategy | Free tools as an acquisition channel |
| referral-program | Referral programs |
| marketing-ideas | Marketing idea generation |
| marketing-psychology | Consumer psychology and triggers |
| pricing-strategy | Pricing |
| competitor-alternatives | "X alternative" pages |
| customer-research | Customer research, JTBD, interviews |
| product-marketing-context | Product marketing briefs |
| analytics-tracking | Setting up GA4, GTM, events |
| ab-test-setup | Planning A/B tests and calculating sample size |
| signup-flow-cro | Signup optimization |
| onboarding-cro | Onboarding optimization |
| page-cro | Landing page CRO |
| form-cro | Form optimization |
| popup-cro | Popup optimization |
| paywall-upgrade-cro | Paywall optimization |
| churn-prevention | Customer retention, dunning |
| revops | Revenue operations |
| sales-enablement | Materials for the sales team |

### Finance — 1 skill (EveryInc/charlie-cfo-skill)

| Skill | When to use |
|---|---|
| charlie | AI CFO for bootstrapped startups: unit economics (LTV:CAC), runway, burn multiple, Rule of 40, hiring ROI, working capital. Named after Charlie Munger. |

### Design and UI — 14 skills

Official from Anthropic and Vercel (8):

| Skill | Source | When to use |
|---|---|---|
| frontend-design | anthropics | Frontend design to Anthropic's standards |
| web-design-guidelines | vercel-labs | Web design from the creators of Next.js |
| brand-guidelines | anthropics | Creating a brand book |
| canvas-design | anthropics | Working with canvas graphics |
| theme-factory | anthropics | Generating themes and color schemes |
| algorithmic-art | anthropics | Generative art |
| slack-gif-creator | anthropics | Creating GIFs for Slack |
| web-artifacts-builder | anthropics | Interactive web artifacts |

The nextlevelbuilder/ui-ux-pro-max-skill package (7):

| Skill | When to use |
|---|---|
| ui-ux-pro-max | Advanced UI/UX design |
| ckm-design | General design for the CKM system |
| ckm-design-system | Building design systems |
| ckm-ui-styling | UI styling |
| ckm-brand | Brand context |
| ckm-banner-design | Banner design |
| ckm-slides | Presentations |

### Development and DevOps — 22 skills

Vercel (6):

| Skill | When to use |
|---|---|
| deploy-to-vercel | Deploying to Vercel |
| vercel-cli-with-tokens | Working with the Vercel CLI via tokens |
| vercel-composition-patterns | Component composition patterns |
| vercel-react-best-practices | React best practices from Vercel |
| vercel-react-native-skills | React Native recommendations |
| vercel-react-view-transitions | View Transitions API |

Supabase (2):

| Skill | When to use |
|---|---|
| supabase | General work with Supabase |
| supabase-postgres-best-practices | Postgres practices from Supabase |

Dev workflow from obra/superpowers (14):

| Skill | When to use |
|---|---|
| systematic-debugging | Scientific debugging methodology |
| test-driven-development | The TDD cycle |
| writing-plans | Writing implementation plans |
| executing-plans | Executing a plan step by step |
| brainstorming | Structured brainstorming |
| verification-before-completion | Verification before "done" |
| requesting-code-review | Requesting a review |
| receiving-code-review | Handling review comments |
| finishing-a-development-branch | Finishing a branch |
| using-git-worktrees | Git worktrees for parallel work |
| dispatching-parallel-agents | Parallel agents |
| subagent-driven-development | Development via subagents |
| using-superpowers | Meta-skill: how to combine superpowers |
| writing-skills | How to write high-quality skills (Anthropic best practices) |

### Working with documents — 4 skills (Anthropic)

| Skill | When to use |
|---|---|
| pdf | Reading and creating PDFs |
| pptx | PowerPoint presentations |
| docx | Word documents |
| xlsx | Excel spreadsheets |

### Claude API and infrastructure — 5 skills

| Skill | Source | When to use |
|---|---|---|
| claude-api | anthropics | Building apps on the Claude API with the SDK |
| mcp-builder | anthropics | Creating MCP servers |
| skill-creator | anthropics | Creating your own skills |
| template-skill | anthropics | Template for a new skill |
| webapp-testing | anthropics | Testing web applications |

### Communication — 2 skills

| Skill | When to use |
|---|---|
| internal-comms | Internal communications, announcements, reports |
| doc-coauthoring | Co-authoring documents |

### Skill search — 1 skill

| Skill | When to use |
|---|---|
| skill-finder | Finds new skills on skills.sh, runs a security audit, gives a verdict. You say: "find a skill for Stripe" and it gets to work. |

**Total:** 36 marketing + 14 design + 22 development + 4 office + 5 Claude/MCP + 2 communication + 1 finance + 1 search = **85 skills**.

## Security: 5 rules from the article

1. **Official comes first.** If there's a skill from the creators of the technology (Anthropic, Vercel, Supabase), take that one.
2. **Read SKILL.md before installing.** Red flags:
   - `curl`/`wget` to unknown URLs
   - Base64/hex-encoded strings
   - "Ignore the system prompt" instructions
   - Writing to `/etc`, `~/.ssh`, `~/.aws`
3. **Check the audit on skills.sh/audits:** Safe + Low Risk + 0 alerts.
4. **One at a time** — better to install gradually and check the effect.
5. **Look at the install count** — 50K+ means the skill has been vetted by the community.

## Audit results for these 85 skills (static grep)

Checked for: `curl`/`wget` to third-party URLs, prompt injection, `eval()`, base64 decoding, writes to system directories, exfiltration (.onion, telegram/discord webhooks, ngrok, pastebin).

**No critical threats found.** All `curl` calls go to documented official APIs (api.anthropic.com, Google Gemini, Supabase, ElevenLabs, Vercel). All `rm -rf` calls clean up temporary `dist`/`$TEMP_DIR`.

**One warning:** `deploy-to-vercel` uploads a project tarball to `https://claude-skills-deploy.vercel.com/api/deploy`. `.env` is excluded from the archive (line 204 of `deploy.sh`), but keep in mind that your project code goes to a third-party endpoint.

## How these skills work in practice

Skills aren't invoked manually: Claude Code picks the right skill on its own based on its description (`description:` in the YAML frontmatter of `SKILL.md`).

Trigger examples:

| Your request | Which skill kicks in |
|---|---|
| "Write a landing page for a SaaS" | copywriting, page-cro, frontend-design |
| "Run an SEO audit of domain.com" | seo-audit, schema-markup |
| "How much runway do we have left?" | charlie |
| "Create a PDF report" | pdf |
| "Help me debug this error" | systematic-debugging |
| "Deploy to Vercel" | deploy-to-vercel, vercel-cli-with-tokens |
| "Find a skill for Stripe" | skill-finder |

## How to remove a skill

```bash
npx skills remove                         # interactive
npx skills remove -s skill-finder -y      # a specific one
npx skills remove --all -y                # all of them
```

## Useful links

- Catalog: [skills.sh](https://skills.sh)
- Leaderboard: [skills.sh](https://skills.sh) (home page)
- Official skills: [skills.sh/official](https://skills.sh/official)
- Audit: [skills.sh/audits](https://skills.sh/audits)
- Claude Code Skills documentation: [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)

Questions go in the chat. Don't be afraid to experiment: skills can be removed with a single command.
