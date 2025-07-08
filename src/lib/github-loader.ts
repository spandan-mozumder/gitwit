import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github'

export const loadGithubRepo = async (githubUrl: string, githubToken?: string): Promise<any> => {
    const loader = new GithubRepoLoader(githubUrl,{
        accessToken: githubToken || '',
        branch: 'main',
        ignoreFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'],
        recursive: true,
        unknown: 'warn',
        maxConcurrency:5
    })
    const docs = await loader.load()
    return docs
}

console.log(
  await loadGithubRepo("https://github.com/spandan-mozumder/spandan-mozumder"),
);