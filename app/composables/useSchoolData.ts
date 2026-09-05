import { eliteStudents } from '~/data/elite'
import { starTeachers } from '~/data/teachers'
import { staffMembers } from '~/data/staff'
import { branches, gradeOptionGroups } from '~/data/locations'
import { SITE, NAV_LINKS, REGISTER_LINK, IMAGES } from '~/data/site'
import { aboutContent, homeCopy } from '~/data/content'

export function useSchoolData() {
  return {
    site: SITE,
    navLinks: NAV_LINKS,
    registerLink: REGISTER_LINK,
    images: IMAGES,
    eliteStudents,
    starTeachers,
    staffMembers,
    branches,
    gradeOptionGroups,
    aboutContent,
    homeCopy,
  }
}
