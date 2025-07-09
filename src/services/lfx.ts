import { fetchIssuesForOrg } from "./github";
import {scrapeOrganizations} from '../utils/scraper'
import { db } from "../db/db";
import { GITHUB_API_URL } from "../config/env";
import axios from 'axios';

export const fetchLfxOrganizations=async():Promise<string[]>=>{
    const organizations=await db.collection('lfx_orgs').find().toArray();
    const orgs_github:string[]=[];
    for(const org of organizations){
        const url=new URL(org.github);
        const orgName = url.pathname.replace(/^\/|\/$/g, '');
        console.log(orgName)
        orgs_github.push(orgName);
    }
    return orgs_github;
};

export const getOrgName = async (github: string): Promise<string> => {
    const url = new URL(github);
    const orgName = url.pathname.replace(/^\/|\/$/g, '');
    return orgName;
};

export const fetchUnassignedIssues=async(organizations:string[])=>{
   const allIssues:any[]=[];
   for(const org of organizations){
    try{
        const reposResponse=await axios.get(`${GITHUB_API_URL}/orgs/${org}/repos`,{
           headers:{Authorization:`Bearer ${process.env.GITHUB_TOKEN}`},
        });
        const repos=reposResponse.data;
        for(const repo of repos){
            try {
                // Fetch issues for the repository
                const issuesResponse = await axios.get(
                    `${GITHUB_API_URL}/repos/${org}/${repo.name}/issues?state=open`,
                    { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
                );
                const issues = issuesResponse.data;

                // Filter for unassigned issues
                const unassignedIssues = issues.filter((issue: any) => !issue.assignee);

                // Add to the list of all issues
                allIssues.push(...unassignedIssues);
            } catch (issueError: any) {
                console.error(`Error fetching issues for repo ${repo.name}:`, issueError.message);
            }
        }
    } catch (repoError: any) {
        console.error(`Error fetching repositories for org ${org}:`, repoError.message);
    }
    }
   return allIssues;
   }
