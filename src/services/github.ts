import axios from 'axios';
import { GITHUB_API_URL } from '../config/env';
import db from '../db/db';

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
            per _page:100,
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
                per _page:100,
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
};