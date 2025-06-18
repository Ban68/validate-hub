import React from 'react'; // Required for JSX
import { NavItem } from './types';

// Heroicons (MIT License - https://github.com/tailwindlabs/heroicons)
// Using inline SVGs for simplicity and to avoid extra dependencies.

export const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

export const LightBulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3 .378A6.011 6.011 0 0 1 12 9.75c-2.636 0-4.922 1.603-5.757 3.839m5.757-.378a6.011 6.011 0 0 0 3.197 3.197m0 0c.237.025.478.042.723.054M12 18a6.009 6.009 0 0 1-3.197-3.197M12 18a6.009 6.009 0 0 0 3.197-3.197M14.25 21a2.233 2.233 0 0 1-4.5 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-3.741-5.138c.052-.08.114-.158.179-.237a3.024 3.024 0 0 0 .52-5.05A3.024 3.024 0 0 0 19.5 5.513c-.085-.091-.18-.175-.278-.25A3.024 3.024 0 0 0 16.03 3c-1.031 0-1.956.495-2.528 1.26C13.167 4.65 13 5.056 13 5.513a3.024 3.024 0 0 0 .52 5.05c.065.079.127.157.179.237a3 3 0 0 0-3.741 5.138 9.094 9.094 0 0 0 3.741.479Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3V5.513a3 3 0 0 0-1.26-2.528C17.044 2.495 16.119 2 15.088 2c-.624 0-1.205.162-1.728.455C12.833 2.162 12 2.785 12 3.513V4" />
  </svg>
);

export const BeakerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

export const PuzzlePieceIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const BriefcaseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075c0 1.313-.818 2.375-1.833 2.375H5.583c-1.015 0-1.833-1.062-1.833-2.375V14.15M15.75 7.5V4.875c0-.621-.504-1.125-1.125-1.125H9.375c-.621 0-1.125.504-1.125 1.125V7.5M21.75 7.5H2.25m19.5 0H2.25m0 0V5.25A2.25 2.25 0 0 1 4.5 3h15A2.25 2.25 0 0 1 21.75 5.25V7.5" />
  </svg>
);

export const ArrowPathIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

export const CogIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m18 0h-1.5m-15.036-7.026A7.5 7.5 0 0 0 4.5 12H3m18 0h-1.5m-1.5-1.5a7.5 7.5 0 0 0-12.536-4.474M6.964 4.974A7.5 7.5 0 0 1 12 4.5v1.5m0 15V12m0 0a7.5 7.5 0 0 0 5.036 7.026M12 19.5v-1.5m0-15V6m0 0a7.5 7.5 0 0 0-5.036-1.026A7.5 7.5 0 0 0 6.964 4.974M12 6a7.5 7.5 0 0 1 5.036 1.026A7.5 7.5 0 0 1 17.036 4.974" />
  </svg>
);

export const UserGroupIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-3.741-5.138c.052-.08.114-.158.179-.237a3.024 3.024 0 0 0 .52-5.05A3.024 3.024 0 0 0 19.5 5.513c-.085-.091-.18-.175-.278-.25A3.024 3.024 0 0 0 16.03 3c-1.031 0-1.956.495-2.528 1.26C13.167 4.65 13 5.056 13 5.513a3.024 3.024 0 0 0 .52 5.05c.065.079.127.157.179.237a3 3 0 0 0-3.741 5.138 9.094 9.094 0 0 0 3.741.479Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3V5.513a3 3 0 0 0-1.26-2.528C17.044 2.495 16.119 2 15.088 2c-.624 0-1.205.162-1.728.455C12.833 2.162 12 2.785 12 3.513V4m0 0A3.024 3.024 0 0 0 9.472 5.513c-.052.08-.114.158-.179.237a3 3 0 0 0-.52 5.05A3.024 3.024 0 0 0 7.5 13.513c.085.091.18.175.278.25A3.024 3.024 0 0 0 10.97 17c1.031 0 1.956-.495 2.528-1.26.333-.378.528-.85.528-1.353v-.002c0-.504-.195-.975-.528-1.353a3.024 3.024 0 0 0-2.528-1.26c-.49 0-.94.138-1.32.375M7.5 10.5h3.75m-3.75 3h3.75" />
  </svg>
);

export const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 7.5l.813 2.846a4.5 4.5 0 0 1 2.187 2.187L24 12l-2.846.813a4.5 4.5 0 0 1-2.187 2.187L18.25 18l-.813-2.846a4.5 4.5 0 0 1-2.187-2.187L12.75 12l2.846-.813a4.5 4.5 0 0 1 2.187-2.187L18.25 7.5Z" />
  </svg>
);

export const DocumentTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2Z" />
  </svg>
);

export const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


export const ROUTES = {
  DASHBOARD: '/dashboard',
  PROBLEM_DISCOVERY: '/problem-discovery',
  CUSTOMER_INSIGHTS: '/customer-insights',
  EXPERIMENTATION: '/experimentation',
  VALUE_PROPOSITION: '/value-proposition',
  BUSINESS_MODEL: '/business-model',
  LEARNING_ITERATION: '/learning-iteration',
  COLLABORATION: '/collaboration',
  SETTINGS: '/settings',
};

export const NAVIGATION_ITEMS: NavItem[] = [
  { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: ChartBarIcon },
  { name: 'Problem Discovery', path: ROUTES.PROBLEM_DISCOVERY, icon: LightBulbIcon },
  { name: 'Customer Insights', path: ROUTES.CUSTOMER_INSIGHTS, icon: UsersIcon },
  { name: 'Experimentation', path: ROUTES.EXPERIMENTATION, icon: BeakerIcon },
  { name: 'Value Proposition', path: ROUTES.VALUE_PROPOSITION, icon: PuzzlePieceIcon },
  { name: 'Business Model', path: ROUTES.BUSINESS_MODEL, icon: BriefcaseIcon },
  { name: 'Learning & Iteration', path: ROUTES.LEARNING_ITERATION, icon: ArrowPathIcon },
  { name: 'Collaboration', path: ROUTES.COLLABORATION, icon: UserGroupIcon },
  { name: 'Settings', path: ROUTES.SETTINGS, icon: CogIcon },
];

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
// export const GEMINI_MODEL_IMAGE = 'imagen-3.0-generate-002'; // If image generation is needed
