export type TAnalyticsSupplementalLink = {
  link: string;
  text: string;
  includedAppIds?: string[];
  excludedAppIds?: string[];
};

/** @description links to be shown "Others" tab of Analytics page */
const analyticsSupplementalLinks: TAnalyticsSupplementalLink[] = [
  {
    link: 'https://www.useblitz.com/',
    text: 'useblitz.com',
    // includedAppIds: ['9', '21'],
    // excludedAppIds: [],
  },
  {
    link: 'https://datastudio.google.com/u/0/reporting/413ab051-e1bf-4485-bfce-070595e416ec/page/oMZ8B',
    text: 'Visit Weekly Report',
    // includedAppIds: [],
    // excludedAppIds: ['22', '32'],
  },
  {
    link: 'https://datastudio.google.com/reporting/9447ee95-7cee-46cf-b089-85eaa943026c/page/iM94B',
    text: 'PvP Game Report',
    // includedAppIds: [],
    // excludedAppIds: [],
  },
  {
    link: 'https://datastudio.google.com/reporting/b8baa487-3000-4b19-bb39-d16d377f9a4e/page/ZWVDC',
    text: 'UA Report',
    // includedAppIds: [],
    // excludedAppIds: [],
  },
  {
    link: 'https://datastudio.google.com/reporting/b0ed751a-fbc6-4161-b408-3e39f9943a69/page/U6hEC',
    text: 'A/B Test Report',
    // includedAppIds: [],
    // excludedAppIds: [],
  },
  {
    link: 'https://datastudio.google.com/u/0/reporting/a36e9c24-ea23-43db-9b7f-47004cef77e7/page/MxxTC',
    text: 'TrueSkill Matchmaking Report',
    // includedAppIds: [],
    // excludedAppIds: [],
  },
  {
    link: 'https://datastudio.google.com/reporting/3fe29fe6-8f75-465f-85d2-ac43ad99d767/page/OU7OC',
    text: 'Content Report : Events Data',
    // includedAppIds: [],
    // excludedAppIds: [],
  },
  {
    link: 'https://datastudio.google.com/reporting/26f31aac-6769-475c-9f61-a0e4cecb40c8/page/p_bxxca4oenc',
    text: 'Cohort Report',
    // includedAppIds: [],
    // excludedAppIds: [],
  },
  {
    link: 'https://datastudio.google.com/u/0/reporting/cb299184-9f96-48e1-b9e2-526f3b9bffd4/page/wiMLC',
    text: 'XP Level Report',
    // includedAppIds: [],
    // excludedAppIds: [],
  },
  {
    link: 'https://datastudio.google.com/u/0/reporting/722ad7b4-22b5-411f-91b3-30d0eb9651bf/page/eu5PC',
    text: 'Daily Reward Report',
    // includedAppIds: [],
    // excludedAppIds: [],
  },
  {
    link: 'https://datastudio.google.com/u/0/reporting/73b34f34-e982-4749-9210-8acfbad38abe/page/p_ja4sliqzqc',
    text: 'Challenges Report',
    // includedAppIds: [],
    // excludedAppIds: [],
  },
  {
    link: 'https://datastudio.google.com/u/0/reporting/63cf01ab-645c-4eed-8cdd-afb9e20bdb41/page/nGKeC',
    text: 'Wallets Report',
    // includedAppIds: [],
    // excludedAppIds: [],
  },
  {
    link: 'https://datastudio.google.com/u/0/reporting/cde909dc-536d-4d23-8e69-0cea0256d949/page/pvRKC',
    text: 'Revenue Report (RMG Apps)',
    // includedAppIds: [],
    // excludedAppIds: [],
  },
  {
    link: 'https://datastudio.google.com/u/0/reporting/9463f84d-aa22-4811-a9fc-3352b844dc2e/page/ojjZC',
    text: 'First Cash Game Report (RMG Apps)',
    // includedAppIds: [],
    // excludedAppIds: [],
  },
  {
    link: 'https://datastudio.google.com/reporting/cdd628d1-53db-4a83-9cbb-9d9ae5a22326/page/fASGC',
    text: 'Match Quality and Skill Report',
    // includedAppIds: [],
    // excludedAppIds: [],
  },
];

export default analyticsSupplementalLinks;
