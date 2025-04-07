import { Router } from 'express';
import { getLfxOrganizations,getUnassignedIssues,getPopularIssues,getLfxOrganizationNames,getOrganizationDetails } from '../controllers//lfx';


const router: Router = Router();

router.get('/orgs', getLfxOrganizations);
router.get('/issues', getUnassignedIssues);
router.get('/issues/popular', getPopularIssues);
router.get('/orgs/name', getLfxOrganizationNames);
router.get('/orgs/details', getOrganizationDetails);

export default router;