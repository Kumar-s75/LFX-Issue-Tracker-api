import puppeteer from 'puppeteer';

export const scrapeOrganizations=async():Promise<string[]>=>{
    const url='https://lfx.linuxfoundation.org/organizations';

    try {
        
        const browser=await puppeteer.launch({
            executablePath:'/Applications/Google Chrome.app/Contents/',//replace with my chrome path
            headless:true,
        })
        const page=await browser.newPage();
        await page.goto(url,{waitUntil:'networkidle2'});
        await page.waitForSelector('.org-wrapper');
        const organizations=await page.evaluate(()=>{
            const orgElements=document.querySelectorAll('.name');
            const orgNames:string[]=[];
            orgElements.forEach((element)=>{
                orgNames.push(element.textContent?.trim()||'');
            });
            return orgNames;
        });
        await browser.close(); 

        console.log(`Found ${organizations.length} organizations.`, organizations);
        return organizations;
    } catch (error) {
        console.error('Error scraping the page with Puppeteer:', error);
        throw error;
    }
};

