import axios from 'axios';
import { GITHUB_API_URL } from '../config/env';
import { db } from '../db/db';

export const fetchGithubRepos=async(org:string):Promise<string[]>=>{
const url=`https://api.github.com/orgs/${org}/repos`;
let repos:string[]=[];
let page=1;

try {
   while(true){
    const response=await axios.get(url,{
        headers:{
            Authorization:`token ${process.env.GITHUB_TOKEN}`,
        },
        params:{
            per_page:100,
            page,
        },
    });

    const repoNames=response.data.map((repo:any)=>repo.name);
    repos=repos.concat(repoNames);

    if(repoNames.length<100) break;
    page++;
   } 
} catch (error:any) {
    console.error(`Error fetching repositories for organization ${org}:`,error.message);
    throw error;
}
return repos;
};

export const fetchGithubIssues=async(org:string,repo:string):Promise<any[]>=>{
   const url=`https://api.github.com/repos/${org}/${repo}/issues`;
   let issues:any[]=[];
   let page=1;
   try {
    while(true){
        const response=await axios.get(url,{
            headers:{
                Authorization:`token ${process.env.GITHUB_TOKEN}`,
            },
            params:{
                state:'open',
                per_page:100,
                page,
            },
        });
        issues=issues.concat(response.data);

        //Break if there are no more pages
        if(response.data.length<100) break;
        page++;
    }
   } catch (error:any) {
    console.error(`Error fetching issues for repository ${org}/${repo}:`,error.message);
    throw error;
   }
   return issues;
};

//Fetch all issues for all repositories in an organization
export const fetchIssuesForOrg=async(org:string,repo:string):Promise<any[]>=>{
  try {
    //step 1:fetch all repositories
    const repos=await fetchGithubRepos(org);
    //step 2:fetch issues for each repository
    const allIssues=[];
    for(const repo of repos){
        const issues=await fetchGithubIssues(org,repo);
        allIssues.push({
            repo,
            issues,
        });
    }
    return allIssues;
  } catch (error:any) {
    console.error(`Error fetching issues for organization ${org}:`,error.message);
    throw error;
  }
};


export const getOrgsUnassignedIssues = async (orgs: any[]): Promise<any[]> => { 
    try {
        const allUnassignedIssues: any[] = [];

        console.log("Fetching unassigned issues for organizations:", orgs);

        for (const org of orgs) {
            const reposResponse = await axios.get(`${GITHUB_API_URL}/orgs/${org}/repos`, {
                headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
            });

            const repos = reposResponse.data;

            const topRepos = repos
                .sort((a: { open_issues: number }, b: { open_issues: number }) => b.open_issues - a.open_issues)
                .slice(0, 5);

            for (const repo of topRepos) {
                const issuesResponse = await axios.get(
                    `${GITHUB_API_URL}/repos/${org}/${repo.name}/issues?state=open`,
                    { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
                );

                const issues = issuesResponse.data;
                
                for (const issue of issues) {
                    await db.collection('lfx_issues').updateOne(
                        { id: issue.id },
                        { $set: issue },
                        { upsert: true }
                    );

                    if (!issue.assignee) {
                        allUnassignedIssues.push(issue);
                    }
                }
            }
        }

        console.log("Fetched unassigned issues for organizations:", orgs);
        return allUnassignedIssues.slice(0, 50);
    } catch (error: any) {
        console.error("Error fetching unassigned issues:", error.message);
        return [];
    }
};
