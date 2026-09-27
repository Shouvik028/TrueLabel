export interface LabSource {
  id: string;
  name: string;
  accreditation: string;
  contact: string;
}

/** Fictional lab partners — no real accredited lab is named here. */
export const LABS: LabSource[] = [
  {
    id: 'lab-northstar',
    name: 'Northstar Analytical Labs',
    accreditation: 'NABL',
    contact: 'labs@northstar-analytical.example',
  },
  {
    id: 'lab-clearpath',
    name: 'Clearpath Testing Services',
    accreditation: 'NABL',
    contact: 'contact@clearpath-testing.example',
  },
];
