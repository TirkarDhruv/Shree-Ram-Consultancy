const serviceCategories = [
  {
    id: 'insurance',
    title: 'Insurance Services',
    description: 'Policy guidance, renewals, and claim-ready documentation.',
    services: ['Motor Insurance', 'Health Insurance', 'Fire Insurance']
  },
  {
    id: 'govt',
    title: 'Government ID & Cards',
    description: 'Application support for essential identity and benefit cards.',
    services: ['Aadhar Card', 'Pan Card', 'Election Card', 'Ayushman Card', 'E-shram Card', 'Abha Card', 'Passport']
  },
  {
    id: 'rto',
    title: 'RTO & Vehicle Works',
    description: 'Vehicle transfer, licence, and practical RTO advisory work.',
    services: ['Driving Licence', 'Vehicle Transfer', 'RTO Advisor']
  },
  {
    id: 'business',
    title: 'Business & Tax Registration',
    description: 'Registration and compliance help for small businesses.',
    services: ['IT Return', 'MSME Registration', 'FSSAI', 'PF']
  }
];

const serviceNames = serviceCategories.flatMap((category) => category.services);
const leadStatuses = ['New', 'Contacted', 'In Progress', 'Closed'];

module.exports = {
  serviceCategories,
  serviceNames,
  leadStatuses
};
