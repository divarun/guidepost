export interface TimelineEvent {
  grade: string;
  season: string;
  title: string;
  description: string;
  tasks: string[];
}

export const studentTimeline: TimelineEvent[] = [
  {
    grade: 'Freshman Year',
    season: 'Fall',
    title: 'Build Your Foundation',
    description: 'Focus on academic performance and exploring interests',
    tasks: [
      'Take challenging courses',
      'Join clubs and activities that interest you',
      'Build relationships with teachers',
      'Start a folder for achievements and awards',
    ],
  },
  {
    grade: 'Freshman Year',
    season: 'Spring',
    title: 'Continue Building',
    description: 'Maintain strong grades and deepen involvement',
    tasks: [
      'Reflect on first-year experiences',
      'Consider summer opportunities (camps, jobs, programs)',
      'Take on leadership roles in activities',
    ],
  },
  {
    grade: 'Sophomore Year',
    season: 'Fall',
    title: 'Increase Rigor',
    description: 'Challenge yourself academically and take on leadership',
    tasks: [
      'Take PSAT for practice',
      'Explore honors or AP courses',
      'Deepen commitment to key activities',
      'Begin researching colleges casually',
    ],
  },
  {
    grade: 'Sophomore Year',
    season: 'Spring',
    title: 'Build Your Profile',
    description: 'Continue strong performance and meaningful involvement',
    tasks: [
      'Plan summer activities (job, program, project)',
      'Meet with school counselor',
      'Start SAT/ACT preparation',
      'Visit nearby colleges if possible',
    ],
  },
  {
    grade: 'Junior Year',
    season: 'Fall',
    title: 'Critical Preparation',
    description: 'This is your most important academic year',
    tasks: [
      'Take the PSAT/NMSQT (for National Merit)',
      'Maximize academic performance',
      'Take leadership roles in activities',
      'Create preliminary college list',
      'Begin SAT/ACT preparation in earnest',
    ],
  },
  {
    grade: 'Junior Year',
    season: 'Winter',
    title: 'Testing Season',
    description: 'Complete standardized testing',
    tasks: [
      'Take SAT or ACT',
      'Continue strong grades',
      'Research colleges seriously',
      'Attend college fairs and information sessions',
    ],
  },
  {
    grade: 'Junior Year',
    season: 'Spring',
    title: 'Final Prep',
    description: 'Finish strong and plan for senior year',
    tasks: [
      'Retake SAT/ACT if needed',
      'Ask teachers for recommendation letters',
      'Visit colleges during spring break',
      'Plan productive summer',
      'Begin brainstorming essay topics',
    ],
  },
  {
    grade: 'Senior Year',
    season: 'Summer',
    title: 'Application Preparation',
    description: 'Get ahead on college applications',
    tasks: [
      'Finalize college list',
      'Draft Common App essay',
      'Complete activities section',
      'Schedule campus visits',
      'Prepare for interviews',
    ],
  },
  {
    grade: 'Senior Year',
    season: 'Fall',
    title: 'Application Season',
    description: 'Submit applications and stay focused',
    tasks: [
      'Submit Early Decision/Early Action applications (Nov 1)',
      'Complete Regular Decision applications',
      'Submit financial aid forms',
      'Maintain strong senior grades',
      'Update schools with new achievements',
    ],
  },
  {
    grade: 'Senior Year',
    season: 'Winter',
    title: 'Waiting Period',
    description: 'Complete remaining applications and wait for decisions',
    tasks: [
      'Submit Regular Decision applications (Jan 1)',
      'Complete FAFSA and CSS Profile',
      'Apply for scholarships',
      'Maintain grades (avoid senioritis!)',
    ],
  },
  {
    grade: 'Senior Year',
    season: 'Spring',
    title: 'Decision Time',
    description: 'Receive decisions and make your choice',
    tasks: [
      'Receive admission decisions (March-April)',
      'Compare financial aid packages',
      'Revisit top choice schools',
      'Make final decision by May 1',
      'Submit enrollment deposit',
    ],
  },
];

export const parentTimeline: TimelineEvent[] = [
  {
    grade: 'Freshman-Sophomore Year',
    season: 'Ongoing',
    title: 'Early Preparation',
    description: 'Support your student and begin financial planning',
    tasks: [
      'Encourage academic excellence',
      'Support extracurricular involvement',
      'Begin saving for college',
      'Research 529 plans and tax benefits',
    ],
  },
  {
    grade: 'Junior Year',
    season: 'Fall',
    title: 'Financial Planning',
    description: 'Get serious about college costs and funding',
    tasks: [
      'Use net price calculators',
      'Review financial situation',
      'Understand financial aid basics',
      'Discuss budget with family',
    ],
  },
  {
    grade: 'Junior Year',
    season: 'Spring',
    title: 'College Research',
    description: 'Help identify appropriate colleges',
    tasks: [
      'Visit colleges together',
      'Discuss college preferences',
      'Review academic and financial fit',
      'Create FSA ID for FAFSA',
    ],
  },
  {
    grade: 'Senior Year',
    season: 'Fall',
    title: 'Financial Aid Applications',
    description: 'Submit financial aid forms',
    tasks: [
      'Complete FAFSA (opens Oct 1)',
      'Submit CSS Profile if required',
      'Gather tax documents',
      'Research scholarship opportunities',
    ],
  },
  {
    grade: 'Senior Year',
    season: 'Winter',
    title: 'Deadline Management',
    description: 'Ensure all forms are submitted on time',
    tasks: [
      'Submit final FAFSA updates',
      'Complete school-specific forms',
      'Apply for external scholarships',
      'Track application requirements',
    ],
  },
  {
    grade: 'Senior Year',
    season: 'Spring',
    title: 'Compare and Decide',
    description: 'Evaluate offers and make informed decision',
    tasks: [
      'Review financial aid packages',
      'Appeal aid if necessary',
      'Compare net costs',
      'Help student make final decision',
      'Submit enrollment deposit',
    ],
  },
];