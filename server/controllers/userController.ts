import { Response } from 'express';
import User from '../models/userModel';
import generateToken from '../config/generateToken';
import { AuthRequest } from '../middleware/authMiddleware';
import Job from '../models/jobModel';
import Candidate from '../models/candidateModel';

const generateMockData = async (userId: string) => {
    try {
        const jobsData = [
            {
                title: 'Senior Frontend Developer',
                description: 'We are looking for an experienced Frontend Developer to join our team.',
                skillsNeeded: ['React', 'TypeScript', 'Tailwind CSS'],
                experience: '5+ years',
                salaryRange: { min: 80000, max: 120000 },
                location: 'Remote',
                department: 'Engineering',
                recruiter: userId,
            },
            {
                title: 'Backend Node.js Engineer',
                description: 'Looking for a strong backend engineer with Node.js and MongoDB expertise.',
                skillsNeeded: ['Node.js', 'Express', 'MongoDB'],
                experience: '3+ years',
                salaryRange: { min: 70000, max: 110000 },
                location: 'New York, NY',
                department: 'Engineering',
                recruiter: userId,
            },
            {
                title: 'Senior Product Manager',
                description: 'We are looking for a strategic and data-driven Product Manager to lead our core product roadmap, working cross-functionally with engineering, design, and go-to-market teams.',
                skillsNeeded: ['Product Strategy', 'Roadmap Planning', 'Stakeholder Management'],
                experience: '4+ years',
                salaryRange: { min: 90000, max: 140000 },
                location: 'London, UK',
                department: 'Product',
                recruiter: userId,
            }
        ];

        const jobs = await Job.insertMany(jobsData);
        const [frontendJob, backendJob, pmJob] = jobs;

        const frontendCandidates = [
            {
                firstName: 'Aisha', lastName: 'Kamara',
                email: 'aisha.kamara@gmail.com',
                headline: 'Creative Frontend Engineer with a passion for design systems',
                bio: 'Aisha builds elegant UIs with React and loves crafting accessible, pixel-perfect interfaces.',
                location: 'San Francisco, CA',
                skills: [{ name: 'React', level: 'Expert', yearsOfExperience: 6 }, { name: 'TypeScript', level: 'Advanced', yearsOfExperience: 4 }, { name: 'Tailwind CSS', level: 'Expert', yearsOfExperience: 3 }],
                languages: [{ name: 'English', proficiency: 'Native' }, { name: 'French', proficiency: 'Conversational' }],
                experience: [{ company: 'Stripe', role: 'Senior UI Engineer', startDate: '2020-03', endDate: 'Present', description: 'Led design system adoption across 5 product teams.', technologies: ['React', 'TypeScript'], isCurrent: true }],
                education: [{ institution: 'UC Berkeley', degree: 'Bachelor of Science', fieldOfStudy: 'Computer Science', startYear: 2014, endYear: 2018 }],
                certifications: [{ name: 'AWS Certified Developer', issuer: 'Amazon', issueDate: '2022-06' }],
                projects: [{ name: 'DesignKit', description: 'Open-source component library', technologies: ['React', 'Storybook'], role: 'Lead Developer', link: 'https://github.com/aisha/designkit', startDate: '2021-01', endDate: '2022-06' }],
                availability: { status: 'Open to Opportunities', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/aishakamara', github: 'https://github.com/aisha' },
                job: frontendJob._id,
            },
            {
                firstName: 'Luca', lastName: 'Rossi',
                email: 'luca.rossi@outlook.com',
                headline: 'TypeScript zealot building blazing-fast SPAs',
                bio: 'Luca specializes in performance optimization and has shipped apps used by millions.',
                location: 'Milan, Italy',
                skills: [{ name: 'React', level: 'Advanced', yearsOfExperience: 5 }, { name: 'TypeScript', level: 'Expert', yearsOfExperience: 5 }, { name: 'Tailwind CSS', level: 'Intermediate', yearsOfExperience: 2 }],
                languages: [{ name: 'Italian', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }],
                experience: [{ company: 'Shopify', role: 'Frontend Developer', startDate: '2019-06', endDate: '2023-12', description: 'Rebuilt checkout flow reducing load time by 40%.', technologies: ['React', 'TypeScript'], isCurrent: false }],
                education: [{ institution: 'Politecnico di Milano', degree: 'Master of Engineering', fieldOfStudy: 'Software Engineering', startYear: 2013, endYear: 2018 }],
                availability: { status: 'Available', type: 'Full-time' },
                socialLinks: { github: 'https://github.com/lucarossi' },
                job: frontendJob._id,
            },
            {
                firstName: 'Priya', lastName: 'Nair',
                email: 'priya.nair@techmail.com',
                headline: 'Frontend architect with deep Tailwind and animation expertise',
                bio: 'Priya transforms Figma designs into production code with pixel-level accuracy.',
                location: 'Bangalore, India',
                skills: [{ name: 'React', level: 'Expert', yearsOfExperience: 7 }, { name: 'TypeScript', level: 'Advanced', yearsOfExperience: 3 }, { name: 'Tailwind CSS', level: 'Expert', yearsOfExperience: 4 }],
                languages: [{ name: 'Hindi', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }],
                experience: [{ company: 'Razorpay', role: 'Lead Frontend Engineer', startDate: '2018-01', endDate: 'Present', description: 'Architected the merchant dashboard used by 500k merchants.', technologies: ['React', 'Tailwind CSS'], isCurrent: true }],
                education: [{ institution: 'IIT Bombay', degree: 'Bachelor of Technology', fieldOfStudy: 'Computer Science', startYear: 2012, endYear: 2016 }],
                certifications: [{ name: 'Google UX Design Certificate', issuer: 'Google', issueDate: '2021-03' }],
                availability: { status: 'Open to Opportunities', type: 'Contract' },
                socialLinks: { linkedin: 'https://linkedin.com/in/priyanair', portfolio: 'https://priyanair.dev' },
                job: frontendJob._id,
            },
            {
                firstName: 'Ethan', lastName: 'Brooks',
                email: 'ethan.brooks@devmail.io',
                headline: 'React developer focused on micro-frontends and modular architecture',
                bio: 'Ethan has spent 5 years breaking monoliths into scalable micro-frontend systems.',
                location: 'Austin, TX',
                skills: [{ name: 'React', level: 'Expert', yearsOfExperience: 5 }, { name: 'TypeScript', level: 'Advanced', yearsOfExperience: 4 }, { name: 'Tailwind CSS', level: 'Advanced', yearsOfExperience: 3 }],
                languages: [{ name: 'English', proficiency: 'Native' }],
                experience: [{ company: 'Indeed', role: 'Software Engineer II', startDate: '2019-09', endDate: 'Present', description: 'Built micro-frontend shell orchestrating 12 product teams.', technologies: ['React', 'Webpack', 'TypeScript'], isCurrent: true }],
                education: [{ institution: 'University of Texas at Austin', degree: 'Bachelor of Science', fieldOfStudy: 'Electrical Engineering', startYear: 2013, endYear: 2017 }],
                availability: { status: 'Not Available', type: 'Full-time' },
                socialLinks: { github: 'https://github.com/ethanbrooks', linkedin: 'https://linkedin.com/in/ethanbrooks' },
                job: frontendJob._id,
            },
            {
                firstName: 'Sofia', lastName: 'Andersson',
                email: 'sofia.andersson@mail.se',
                headline: 'Accessibility-first frontend developer',
                bio: 'Sofia champions WCAG compliance and has made enterprise apps usable for everyone.',
                location: 'Stockholm, Sweden',
                skills: [{ name: 'React', level: 'Advanced', yearsOfExperience: 4 }, { name: 'TypeScript', level: 'Intermediate', yearsOfExperience: 2 }, { name: 'Tailwind CSS', level: 'Advanced', yearsOfExperience: 3 }],
                languages: [{ name: 'Swedish', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }, { name: 'German', proficiency: 'Basic' }],
                experience: [{ company: 'Klarna', role: 'Frontend Engineer', startDate: '2020-08', endDate: 'Present', description: 'Improved app accessibility score from 62 to 98 on Lighthouse.', technologies: ['React', 'TypeScript'], isCurrent: true }],
                education: [{ institution: 'KTH Royal Institute of Technology', degree: 'Master of Science', fieldOfStudy: 'Human-Computer Interaction', startYear: 2015, endYear: 2020 }],
                availability: { status: 'Open to Opportunities', type: 'Part-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/sofiaandersson' },
                job: frontendJob._id,
            },
            {
                firstName: 'Omar', lastName: 'Diallo',
                email: 'omar.diallo@webdev.africa',
                headline: 'Freelance React consultant with SaaS product experience',
                bio: 'Omar has built and launched 3 successful SaaS products as the solo frontend developer.',
                location: 'Dakar, Senegal',
                skills: [{ name: 'React', level: 'Expert', yearsOfExperience: 6 }, { name: 'TypeScript', level: 'Advanced', yearsOfExperience: 4 }, { name: 'Tailwind CSS', level: 'Expert', yearsOfExperience: 4 }],
                languages: [{ name: 'French', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }, { name: 'Wolof', proficiency: 'Native' }],
                experience: [{ company: 'Self-employed', role: 'Frontend Consultant', startDate: '2018-05', endDate: 'Present', description: 'Delivered 20+ client projects across fintech and edtech.', technologies: ['React', 'Next.js', 'Tailwind CSS'], isCurrent: true }],
                education: [{ institution: 'Université Cheikh Anta Diop', degree: 'Bachelor of Science', fieldOfStudy: 'Computer Science', startYear: 2013, endYear: 2017 }],
                projects: [{ name: 'PayTrack', description: 'Invoice & subscription SaaS', technologies: ['React', 'Stripe'], role: 'Founder & Developer', link: 'https://paytrack.app', startDate: '2020-01', endDate: '2022-12' }],
                availability: { status: 'Available', type: 'Contract' },
                socialLinks: { portfolio: 'https://omardiallo.dev', github: 'https://github.com/omardiallo' },
                job: frontendJob._id,
            },
            {
                firstName: 'Yuki', lastName: 'Tanaka',
                email: 'yuki.tanaka@jp-dev.com',
                headline: 'Animation & WebGL enthusiast with 5 years in frontend',
                bio: 'Yuki blends creative coding with engineering discipline to ship immersive web experiences.',
                location: 'Tokyo, Japan',
                skills: [{ name: 'React', level: 'Advanced', yearsOfExperience: 5 }, { name: 'TypeScript', level: 'Advanced', yearsOfExperience: 4 }, { name: 'Tailwind CSS', level: 'Intermediate', yearsOfExperience: 2 }],
                languages: [{ name: 'Japanese', proficiency: 'Native' }, { name: 'English', proficiency: 'Conversational' }],
                experience: [{ company: 'CyberAgent', role: 'UI Engineer', startDate: '2019-04', endDate: 'Present', description: 'Created interactive campaign pages averaging 2M monthly visits.', technologies: ['React', 'Three.js'], isCurrent: true }],
                education: [{ institution: 'Waseda University', degree: 'Bachelor of Engineering', fieldOfStudy: 'Information Science', startYear: 2014, endYear: 2018 }],
                availability: { status: 'Open to Opportunities', type: 'Full-time' },
                socialLinks: { github: 'https://github.com/yukitanaka', portfolio: 'https://yuki.codes' },
                job: frontendJob._id,
            },
            {
                firstName: 'Chloe', lastName: 'Dupont',
                email: 'chloe.dupont@frenchtech.fr',
                headline: 'Next.js & React expert focused on SSR and e-commerce',
                bio: 'Chloe has architected storefronts generating €10M+ in annual revenue.',
                location: 'Paris, France',
                skills: [{ name: 'React', level: 'Expert', yearsOfExperience: 6 }, { name: 'TypeScript', level: 'Expert', yearsOfExperience: 5 }, { name: 'Tailwind CSS', level: 'Advanced', yearsOfExperience: 3 }],
                languages: [{ name: 'French', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }],
                experience: [{ company: 'Decathlon Digital', role: 'Senior Frontend Developer', startDate: '2017-09', endDate: 'Present', description: 'Migrated legacy storefront to Next.js, improving SEO by 60%.', technologies: ['Next.js', 'React', 'TypeScript'], isCurrent: true }],
                education: [{ institution: 'École Polytechnique', degree: 'Master of Engineering', fieldOfStudy: 'Digital Innovation', startYear: 2012, endYear: 2017 }],
                certifications: [{ name: 'Meta Frontend Developer Certificate', issuer: 'Meta', issueDate: '2023-01' }],
                availability: { status: 'Available', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/chloe-dupont', github: 'https://github.com/chloedup' },
                job: frontendJob._id,
            },
            {
                firstName: 'Marcus', lastName: 'Osei',
                email: 'marcus.osei@ghanadev.com',
                headline: 'Performance-obsessed React developer',
                bio: 'Marcus reduces bundle sizes and optimizes Core Web Vitals for high-traffic platforms.',
                location: 'Accra, Ghana',
                skills: [{ name: 'React', level: 'Expert', yearsOfExperience: 5 }, { name: 'TypeScript', level: 'Advanced', yearsOfExperience: 3 }, { name: 'Tailwind CSS', level: 'Advanced', yearsOfExperience: 3 }],
                languages: [{ name: 'English', proficiency: 'Native' }, { name: 'Twi', proficiency: 'Native' }],
                experience: [{ company: 'Flutterwave', role: 'Frontend Engineer', startDate: '2020-01', endDate: 'Present', description: 'Optimized payment UI performance for 15M+ users across Africa.', technologies: ['React', 'TypeScript', 'Webpack'], isCurrent: true }],
                education: [{ institution: 'University of Ghana', degree: 'Bachelor of Science', fieldOfStudy: 'Computer Science', startYear: 2014, endYear: 2018 }],
                availability: { status: 'Open to Opportunities', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/marcosei', github: 'https://github.com/marcosei' },
                job: frontendJob._id,
            },
            {
                firstName: 'Isabella', lastName: 'Cruz',
                email: 'isabella.cruz@brcoder.com',
                headline: 'Senior React developer specializing in dashboards and data viz',
                bio: 'Isabella turns complex data into clear, interactive dashboards loved by stakeholders.',
                location: 'São Paulo, Brazil',
                skills: [{ name: 'React', level: 'Expert', yearsOfExperience: 7 }, { name: 'TypeScript', level: 'Advanced', yearsOfExperience: 4 }, { name: 'Tailwind CSS', level: 'Expert', yearsOfExperience: 3 }],
                languages: [{ name: 'Portuguese', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }, { name: 'Spanish', proficiency: 'Conversational' }],
                experience: [{ company: 'Nubank', role: 'Senior Frontend Engineer', startDate: '2017-03', endDate: 'Present', description: 'Built analytics dashboards serving 80M+ customers.', technologies: ['React', 'D3.js', 'TypeScript'], isCurrent: true }],
                education: [{ institution: 'Universidade de São Paulo', degree: 'Bachelor of Engineering', fieldOfStudy: 'Computer Engineering', startYear: 2011, endYear: 2016 }],
                projects: [{ name: 'ChartForge', description: 'Open-source React charting library', technologies: ['React', 'D3.js'], role: 'Maintainer', link: 'https://github.com/isabellacruz/chartforge', startDate: '2022-01', endDate: '2023-06' }],
                availability: { status: 'Open to Opportunities', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/isabellacruz', github: 'https://github.com/isabellacruz' },
                job: frontendJob._id,
            },
        ];

        const backendCandidates = [
            {
                firstName: 'Kwame', lastName: 'Mensah',
                email: 'kwame.mensah@backend.dev',
                headline: 'Node.js architect with expertise in high-throughput APIs',
                bio: 'Kwame designs systems that handle millions of requests per day without breaking a sweat.',
                location: 'Accra, Ghana',
                skills: [{ name: 'Node.js', level: 'Expert', yearsOfExperience: 7 }, { name: 'Express', level: 'Expert', yearsOfExperience: 6 }, { name: 'MongoDB', level: 'Advanced', yearsOfExperience: 5 }],
                languages: [{ name: 'English', proficiency: 'Native' }, { name: 'Twi', proficiency: 'Native' }],
                experience: [{ company: 'Jumia', role: 'Senior Backend Engineer', startDate: '2017-06', endDate: 'Present', description: 'Designed order processing API handling 500k req/day.', technologies: ['Node.js', 'MongoDB', 'Redis'], isCurrent: true }],
                education: [{ institution: 'KNUST', degree: 'Bachelor of Science', fieldOfStudy: 'Computer Engineering', startYear: 2011, endYear: 2015 }],
                certifications: [{ name: 'MongoDB Professional Developer', issuer: 'MongoDB University', issueDate: '2020-09' }],
                availability: { status: 'Open to Opportunities', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/kwamemensah', github: 'https://github.com/kwamemensah' },
                job: backendJob._id,
            },
            {
                firstName: 'Nina', lastName: 'Petrov',
                email: 'nina.petrov@serverdev.ru',
                headline: 'RESTful & GraphQL API specialist',
                bio: 'Nina designs clean API contracts and has migrated 4 REST services to GraphQL seamlessly.',
                location: 'Moscow, Russia',
                skills: [{ name: 'Node.js', level: 'Advanced', yearsOfExperience: 5 }, { name: 'Express', level: 'Advanced', yearsOfExperience: 5 }, { name: 'MongoDB', level: 'Expert', yearsOfExperience: 6 }],
                languages: [{ name: 'Russian', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }],
                experience: [{ company: 'Yandex', role: 'Backend Developer', startDate: '2018-07', endDate: 'Present', description: 'Built GraphQL gateway aggregating 12 microservices.', technologies: ['Node.js', 'GraphQL', 'Express'], isCurrent: true }],
                education: [{ institution: 'Moscow State University', degree: 'Master of Computer Science', fieldOfStudy: 'Distributed Systems', startYear: 2013, endYear: 2018 }],
                availability: { status: 'Available', type: 'Full-time' },
                socialLinks: { github: 'https://github.com/ninapetrov' },
                job: backendJob._id,
            },
            {
                firstName: 'Diego', lastName: 'Herrera',
                email: 'diego.herrera@devlatam.com',
                headline: 'Backend engineer passionate about microservices & DevOps',
                bio: 'Diego containerizes everything and ships Node.js services with zero-downtime deployments.',
                location: 'Bogotá, Colombia',
                skills: [{ name: 'Node.js', level: 'Expert', yearsOfExperience: 6 }, { name: 'Express', level: 'Advanced', yearsOfExperience: 5 }, { name: 'MongoDB', level: 'Advanced', yearsOfExperience: 4 }],
                languages: [{ name: 'Spanish', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }],
                experience: [{ company: 'Rappi', role: 'Software Engineer', startDate: '2019-02', endDate: 'Present', description: 'Containerised monolithic backend into 8 microservices.', technologies: ['Node.js', 'Docker', 'MongoDB'], isCurrent: true }],
                education: [{ institution: 'Universidad de los Andes', degree: 'Bachelor of Engineering', fieldOfStudy: 'Systems Engineering', startYear: 2013, endYear: 2018 }],
                availability: { status: 'Open to Opportunities', type: 'Full-time' },
                socialLinks: { github: 'https://github.com/diegoherrera', linkedin: 'https://linkedin.com/in/diegoherrera' },
                job: backendJob._id,
            },
            {
                firstName: 'Amara', lastName: 'Traoré',
                email: 'amara.traore@westafricatech.ml',
                headline: 'Full-stack leaning backend developer with MongoDB mastery',
                bio: 'Amara loves aggregation pipelines and has reduced query times by up to 90% through smart indexing.',
                location: 'Bamako, Mali',
                skills: [{ name: 'Node.js', level: 'Advanced', yearsOfExperience: 4 }, { name: 'Express', level: 'Advanced', yearsOfExperience: 4 }, { name: 'MongoDB', level: 'Expert', yearsOfExperience: 5 }],
                languages: [{ name: 'French', proficiency: 'Native' }, { name: 'English', proficiency: 'Conversational' }, { name: 'Bambara', proficiency: 'Native' }],
                experience: [{ company: 'Orange Mali', role: 'Backend Developer', startDate: '2020-03', endDate: 'Present', description: 'Optimised customer data pipelines cutting report generation time by 85%.', technologies: ['Node.js', 'MongoDB', 'Express'], isCurrent: true }],
                education: [{ institution: 'Université des Sciences de Bamako', degree: 'Bachelor of Science', fieldOfStudy: 'Computer Science', startYear: 2015, endYear: 2019 }],
                availability: { status: 'Available', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/amaratraore' },
                job: backendJob._id,
            },
            {
                firstName: 'Henrik', lastName: 'Lindqvist',
                email: 'henrik.lindqvist@nordic.dev',
                headline: 'Security-conscious backend engineer, Node.js & OAuth specialist',
                bio: 'Henrik implements rock-solid auth systems and keeps APIs safe from OWASP top-10 vulnerabilities.',
                location: 'Oslo, Norway',
                skills: [{ name: 'Node.js', level: 'Expert', yearsOfExperience: 8 }, { name: 'Express', level: 'Expert', yearsOfExperience: 7 }, { name: 'MongoDB', level: 'Advanced', yearsOfExperience: 5 }],
                languages: [{ name: 'Norwegian', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }, { name: 'Swedish', proficiency: 'Fluent' }],
                experience: [{ company: 'Telenor', role: 'Lead Backend Developer', startDate: '2016-01', endDate: 'Present', description: 'Designed OAuth 2.0 framework adopted across 6 internal products.', technologies: ['Node.js', 'Express', 'JWT'], isCurrent: true }],
                education: [{ institution: 'NTNU', degree: 'Master of Science', fieldOfStudy: 'Information Security', startYear: 2011, endYear: 2016 }],
                certifications: [{ name: 'Certified Information Systems Security Professional', issuer: 'ISC2', issueDate: '2019-05' }],
                availability: { status: 'Not Available', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/henriklindqvist' },
                job: backendJob._id,
            },
            {
                firstName: 'Fatima', lastName: 'Al-Hassan',
                email: 'fatima.alhassan@techmena.ae',
                headline: 'Backend developer with fintech and payment gateway expertise',
                bio: 'Fatima has integrated over 10 payment gateways and knows transaction integrity inside-out.',
                location: 'Dubai, UAE',
                skills: [{ name: 'Node.js', level: 'Advanced', yearsOfExperience: 5 }, { name: 'Express', level: 'Expert', yearsOfExperience: 5 }, { name: 'MongoDB', level: 'Advanced', yearsOfExperience: 4 }],
                languages: [{ name: 'Arabic', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }],
                experience: [{ company: 'PayTabs', role: 'Backend Engineer', startDate: '2019-10', endDate: 'Present', description: 'Integrated 12 payment providers into a unified gateway API.', technologies: ['Node.js', 'Express', 'Postgres'], isCurrent: true }],
                education: [{ institution: 'American University of Sharjah', degree: 'Bachelor of Engineering', fieldOfStudy: 'Computer Engineering', startYear: 2014, endYear: 2018 }],
                availability: { status: 'Open to Opportunities', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/fatimaAlhassan' },
                job: backendJob._id,
            },
            {
                firstName: 'Chen', lastName: 'Wei',
                email: 'chen.wei@cntech.com',
                headline: 'Scalable Node.js backend engineer with cloud-native experience',
                bio: 'Chen architects serverless and containerised Node.js solutions on AWS and Alibaba Cloud.',
                location: 'Shenzhen, China',
                skills: [{ name: 'Node.js', level: 'Expert', yearsOfExperience: 6 }, { name: 'Express', level: 'Advanced', yearsOfExperience: 5 }, { name: 'MongoDB', level: 'Advanced', yearsOfExperience: 4 }],
                languages: [{ name: 'Mandarin', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }],
                experience: [{ company: 'Alibaba Cloud', role: 'Senior Software Engineer', startDate: '2018-03', endDate: 'Present', description: 'Built serverless Node.js functions serving 10M+ daily active users.', technologies: ['Node.js', 'AWS Lambda', 'MongoDB'], isCurrent: true }],
                education: [{ institution: 'Tsinghua University', degree: 'Bachelor of Engineering', fieldOfStudy: 'Software Engineering', startYear: 2012, endYear: 2016 }],
                availability: { status: 'Open to Opportunities', type: 'Full-time' },
                socialLinks: { github: 'https://github.com/chenwei', linkedin: 'https://linkedin.com/in/chen-wei' },
                job: backendJob._id,
            },
            {
                firstName: 'Blessing', lastName: 'Nwosu',
                email: 'blessing.nwosu@ng-dev.com',
                headline: 'Backend developer building scalable APIs for African markets',
                bio: 'Blessing understands low-bandwidth environments and designs APIs that are resilient and efficient.',
                location: 'Lagos, Nigeria',
                skills: [{ name: 'Node.js', level: 'Advanced', yearsOfExperience: 4 }, { name: 'Express', level: 'Advanced', yearsOfExperience: 4 }, { name: 'MongoDB', level: 'Expert', yearsOfExperience: 5 }],
                languages: [{ name: 'English', proficiency: 'Native' }, { name: 'Igbo', proficiency: 'Fluent' }],
                experience: [{ company: 'Paystack', role: 'Backend Engineer', startDate: '2020-06', endDate: 'Present', description: 'Developed transaction reconciliation service with 99.99% accuracy.', technologies: ['Node.js', 'MongoDB', 'RabbitMQ'], isCurrent: true }],
                education: [{ institution: 'University of Lagos', degree: 'Bachelor of Science', fieldOfStudy: 'Computer Science', startYear: 2015, endYear: 2019 }],
                availability: { status: 'Available', type: 'Full-time' },
                socialLinks: { github: 'https://github.com/blessingnwosu', linkedin: 'https://linkedin.com/in/blessingnwosu' },
                job: backendJob._id,
            },
            {
                firstName: 'Valentina', lastName: 'Romano',
                email: 'valentina.romano@it-dev.it',
                headline: 'Event-driven backend architect with Node.js & Kafka',
                bio: 'Valentina designs event streaming pipelines and has replaced brittle polling with robust pub/sub systems.',
                location: 'Rome, Italy',
                skills: [{ name: 'Node.js', level: 'Expert', yearsOfExperience: 7 }, { name: 'Express', level: 'Advanced', yearsOfExperience: 6 }, { name: 'MongoDB', level: 'Advanced', yearsOfExperience: 5 }],
                languages: [{ name: 'Italian', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }, { name: 'Spanish', proficiency: 'Conversational' }],
                experience: [{ company: 'Mediaset', role: 'Senior Backend Engineer', startDate: '2017-11', endDate: 'Present', description: 'Implemented Kafka-based content delivery pipeline for streaming platform.', technologies: ['Node.js', 'Kafka', 'MongoDB'], isCurrent: true }],
                education: [{ institution: 'La Sapienza University of Rome', degree: 'Master of Engineering', fieldOfStudy: 'Computer Engineering', startYear: 2012, endYear: 2017 }],
                availability: { status: 'Open to Opportunities', type: 'Full-time' },
                socialLinks: { github: 'https://github.com/valentinaromano', linkedin: 'https://linkedin.com/in/valentinaromano' },
                job: backendJob._id,
            },
            {
                firstName: 'Tariq', lastName: 'Al-Rashid',
                email: 'tariq.alrashid@devkw.com',
                headline: 'Backend engineer specialising in real-time systems and WebSockets',
                bio: 'Tariq builds chat, notification, and live-tracking systems with ultra-low latency using Node.js.',
                location: 'Kuwait City, Kuwait',
                skills: [{ name: 'Node.js', level: 'Expert', yearsOfExperience: 6 }, { name: 'Express', level: 'Expert', yearsOfExperience: 5 }, { name: 'MongoDB', level: 'Advanced', yearsOfExperience: 4 }],
                languages: [{ name: 'Arabic', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }],
                experience: [{ company: 'KNET', role: 'Backend Developer', startDate: '2018-09', endDate: 'Present', description: 'Implemented real-time fraud detection alerting system using WebSockets.', technologies: ['Node.js', 'Socket.io', 'MongoDB'], isCurrent: true }],
                education: [{ institution: 'Kuwait University', degree: 'Bachelor of Science', fieldOfStudy: 'Computer Science', startYear: 2013, endYear: 2017 }],
                availability: { status: 'Open to Opportunities', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/tariqalrashid', github: 'https://github.com/tariqalrashid' },
                job: backendJob._id,
            },
        ];

        await Candidate.insertMany(frontendCandidates);
        await Candidate.insertMany(backendCandidates);

        const pmCandidates = [
            {
                firstName: 'Rachel', lastName: 'Kim',
                email: 'rachel.kim@productpros.io',
                headline: 'Product leader obsessed with user outcomes and data-driven decisions',
                bio: 'Rachel has shipped 12 major product features used by 5M+ users, always starting from deep customer empathy and ending with measurable business impact.',
                location: 'San Francisco, CA',
                skills: [{ name: 'Product Strategy', level: 'Expert', yearsOfExperience: 7 }, { name: 'Roadmap Planning', level: 'Expert', yearsOfExperience: 7 }, { name: 'Stakeholder Management', level: 'Advanced', yearsOfExperience: 6 }],
                languages: [{ name: 'English', proficiency: 'Native' }, { name: 'Korean', proficiency: 'Conversational' }],
                experience: [{ company: 'Airbnb', role: 'Senior Product Manager', startDate: '2019-04', endDate: 'Present', description: 'Led Search & Discovery product line, increasing booking conversion by 18%.', technologies: ['Amplitude', 'Figma', 'JIRA'], isCurrent: true }],
                education: [{ institution: 'Stanford University', degree: 'MBA', fieldOfStudy: 'Technology Management', startYear: 2014, endYear: 2016 }],
                certifications: [{ name: 'Certified Scrum Product Owner', issuer: 'Scrum Alliance', issueDate: '2020-03' }],
                projects: [{ name: 'SearchRebuild', description: 'Full redesign of search experience', technologies: ['A/B Testing', 'SQL'], role: 'PM Lead', startDate: '2020-06', endDate: '2021-06' }],
                availability: { status: 'Open to Opportunities', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/rachelkim', portfolio: 'https://rachelkim.pm' },
                job: pmJob._id,
            },
            {
                firstName: 'James', lastName: 'Okafor',
                email: 'james.okafor@pmng.co',
                headline: 'Growth-focused PM with a background in engineering',
                bio: 'James bridges the gap between technical teams and business stakeholders, having started his career as a software engineer before transitioning into product.',
                location: 'London, UK',
                skills: [{ name: 'Product Strategy', level: 'Advanced', yearsOfExperience: 5 }, { name: 'Roadmap Planning', level: 'Advanced', yearsOfExperience: 4 }, { name: 'Stakeholder Management', level: 'Expert', yearsOfExperience: 6 }],
                languages: [{ name: 'English', proficiency: 'Native' }, { name: 'Yoruba', proficiency: 'Fluent' }],
                experience: [{ company: 'Monzo', role: 'Product Manager', startDate: '2020-09', endDate: 'Present', description: 'Owned the lending product, growing loan book by £50M in 18 months.', technologies: ['Mixpanel', 'Notion', 'SQL'], isCurrent: true }],
                education: [{ institution: 'University of Cambridge', degree: 'Bachelor of Engineering', fieldOfStudy: 'Computer Science', startYear: 2013, endYear: 2016 }],
                availability: { status: 'Available', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/jamesokafor' },
                job: pmJob._id,
            },
            {
                firstName: 'Sofia', lastName: 'Menconi',
                email: 'sofia.menconi@prodstrategy.eu',
                headline: 'Enterprise SaaS product manager with B2B growth expertise',
                bio: 'Sofia has scaled B2B SaaS products from seed to Series C, mastering complex stakeholder landscapes across enterprise sales cycles.',
                location: 'Berlin, Germany',
                skills: [{ name: 'Product Strategy', level: 'Expert', yearsOfExperience: 8 }, { name: 'Roadmap Planning', level: 'Expert', yearsOfExperience: 7 }, { name: 'Stakeholder Management', level: 'Advanced', yearsOfExperience: 5 }],
                languages: [{ name: 'German', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }, { name: 'Italian', proficiency: 'Conversational' }],
                experience: [{ company: 'Personio', role: 'Senior Product Manager', startDate: '2018-01', endDate: 'Present', description: 'Led the onboarding product that reduced time-to-value from 90 to 30 days.', technologies: ['Pendo', 'Confluence', 'Looker'], isCurrent: true }],
                education: [{ institution: 'WHU – Otto Beisheim School of Management', degree: 'Master of Science', fieldOfStudy: 'Business Administration', startYear: 2012, endYear: 2017 }],
                certifications: [{ name: 'Product Management Certificate', issuer: 'Product School', issueDate: '2019-08' }],
                availability: { status: 'Open to Opportunities', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/sofiamenconi' },
                job: pmJob._id,
            },
            {
                firstName: 'Arjun', lastName: 'Sharma',
                email: 'arjun.sharma@pmind.in',
                headline: 'Consumer app PM with expertise in emerging markets',
                bio: 'Arjun has built and scaled mobile products for India\'s next billion internet users, optimising for low-connectivity and vernacular-language contexts.',
                location: 'Mumbai, India',
                skills: [{ name: 'Product Strategy', level: 'Advanced', yearsOfExperience: 6 }, { name: 'Roadmap Planning', level: 'Advanced', yearsOfExperience: 5 }, { name: 'Stakeholder Management', level: 'Advanced', yearsOfExperience: 5 }],
                languages: [{ name: 'Hindi', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }, { name: 'Marathi', proficiency: 'Fluent' }],
                experience: [{ company: 'Meesho', role: 'Product Manager II', startDate: '2020-07', endDate: 'Present', description: 'Led seller onboarding product, grew active sellers by 3x in 12 months.', technologies: ['CleverTap', 'Firebase', 'Google Analytics'], isCurrent: true }],
                education: [{ institution: 'IIM Bangalore', degree: 'MBA', fieldOfStudy: 'Marketing & Strategy', startYear: 2016, endYear: 2018 }],
                availability: { status: 'Open to Opportunities', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/arjunsharmapm', portfolio: 'https://arjunsharma.in' },
                job: pmJob._id,
            },
            {
                firstName: 'Amira', lastName: 'El-Sayed',
                email: 'amira.elsayed@pmcairo.com',
                headline: 'Fintech product manager driving financial inclusion across MENA',
                bio: 'Amira channels her economics background into building financial products that serve the underbanked population across the Middle East and North Africa.',
                location: 'Cairo, Egypt',
                skills: [{ name: 'Product Strategy', level: 'Expert', yearsOfExperience: 6 }, { name: 'Roadmap Planning', level: 'Advanced', yearsOfExperience: 5 }, { name: 'Stakeholder Management', level: 'Expert', yearsOfExperience: 7 }],
                languages: [{ name: 'Arabic', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }, { name: 'French', proficiency: 'Basic' }],
                experience: [{ company: 'Fawry', role: 'Senior Product Manager', startDate: '2017-03', endDate: 'Present', description: 'Launched digital wallet product reaching 2M users in the first year.', technologies: ['Tableau', 'JIRA', 'Heap'], isCurrent: true }],
                education: [{ institution: 'The American University in Cairo', degree: 'Bachelor of Arts', fieldOfStudy: 'Economics', startYear: 2011, endYear: 2015 }],
                certifications: [{ name: 'Professional Scrum Product Owner I', issuer: 'Scrum.org', issueDate: '2021-02' }],
                availability: { status: 'Available', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/amiraelsayed' },
                job: pmJob._id,
            },
            {
                firstName: 'Tobias', lastName: 'Brunner',
                email: 'tobias.brunner@productcraft.ch',
                headline: 'Platform PM specialising in developer tools and API products',
                bio: 'Tobias spent years as a developer before moving into product, giving him unique empathy for the teams building on platform products.',
                location: 'Zurich, Switzerland',
                skills: [{ name: 'Product Strategy', level: 'Advanced', yearsOfExperience: 5 }, { name: 'Roadmap Planning', level: 'Expert', yearsOfExperience: 6 }, { name: 'Stakeholder Management', level: 'Advanced', yearsOfExperience: 4 }],
                languages: [{ name: 'German', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }],
                experience: [{ company: 'Twilio', role: 'Product Manager', startDate: '2019-06', endDate: 'Present', description: 'Owned the Voice API product, improving developer onboarding NPS by 32 points.', technologies: ['Postman', 'Amplitude', 'Linear'], isCurrent: true }],
                education: [{ institution: 'ETH Zurich', degree: 'Master of Science', fieldOfStudy: 'Computer Science', startYear: 2012, endYear: 2017 }],
                availability: { status: 'Not Available', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/tobiasbrunner' },
                job: pmJob._id,
            },
            {
                firstName: 'Ngozi', lastName: 'Adeyemi',
                email: 'ngozi.adeyemi@productafrica.ng',
                headline: 'Marketplace PM passionate about creator and gig economy products',
                bio: 'Ngozi has launched two-sided marketplace products in Africa, balancing supply and demand growth in fast-moving, informal economies.',
                location: 'Abuja, Nigeria',
                skills: [{ name: 'Product Strategy', level: 'Advanced', yearsOfExperience: 5 }, { name: 'Roadmap Planning', level: 'Advanced', yearsOfExperience: 4 }, { name: 'Stakeholder Management', level: 'Expert', yearsOfExperience: 6 }],
                languages: [{ name: 'English', proficiency: 'Native' }, { name: 'Igbo', proficiency: 'Fluent' }, { name: 'Hausa', proficiency: 'Conversational' }],
                experience: [{ company: 'Bolt', role: 'Product Manager, Africa', startDate: '2020-02', endDate: 'Present', description: 'Scaled ride-hailing supply side in West Africa by 40% through driver incentives product.', technologies: ['Google Analytics', 'Metabase', 'Notion'], isCurrent: true }],
                education: [{ institution: 'University of Lagos', degree: 'Bachelor of Science', fieldOfStudy: 'Business Administration', startYear: 2013, endYear: 2017 }],
                availability: { status: 'Open to Opportunities', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/ngoziadeyemi' },
                job: pmJob._id,
            },
            {
                firstName: 'Lucas', lastName: 'Fontaine',
                email: 'lucas.fontaine@pmstrategy.fr',
                headline: 'Healthcare & medtech product manager focused on patient outcomes',
                bio: 'Lucas combines a background in biomedical engineering with product thinking to build healthcare tools that genuinely improve patient and clinician experiences.',
                location: 'Lyon, France',
                skills: [{ name: 'Product Strategy', level: 'Expert', yearsOfExperience: 7 }, { name: 'Roadmap Planning', level: 'Advanced', yearsOfExperience: 6 }, { name: 'Stakeholder Management', level: 'Advanced', yearsOfExperience: 6 }],
                languages: [{ name: 'French', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }, { name: 'Spanish', proficiency: 'Conversational' }],
                experience: [{ company: 'Doctolib', role: 'Senior Product Manager', startDate: '2018-05', endDate: 'Present', description: 'Led teleconsultation product from 0 to 1, now serving 12M patients/year.', technologies: ['Mixpanel', 'Jira', 'Figma'], isCurrent: true }],
                education: [{ institution: 'École Centrale de Lyon', degree: 'Master of Engineering', fieldOfStudy: 'Biomedical Engineering', startYear: 2011, endYear: 2016 }],
                availability: { status: 'Open to Opportunities', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/lucasfontainepm', portfolio: 'https://lucasfontaine.pm' },
                job: pmJob._id,
            },
            {
                firstName: 'Yuna', lastName: 'Park',
                email: 'yuna.park@productseoul.kr',
                headline: 'E-commerce & social commerce PM with a deep user research background',
                bio: 'Yuna has shaped viral social shopping features for millions of users by embedding continuous user research directly into the product development cycle.',
                location: 'Seoul, South Korea',
                skills: [{ name: 'Product Strategy', level: 'Advanced', yearsOfExperience: 5 }, { name: 'Roadmap Planning', level: 'Advanced', yearsOfExperience: 5 }, { name: 'Stakeholder Management', level: 'Advanced', yearsOfExperience: 4 }],
                languages: [{ name: 'Korean', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }, { name: 'Japanese', proficiency: 'Basic' }],
                experience: [{ company: 'Kakao Commerce', role: 'Product Manager', startDate: '2019-10', endDate: 'Present', description: 'Launched live-shopping feature that generated ₩80B in GMV in year one.', technologies: ['Firebase', 'UserTesting', 'Aha!'], isCurrent: true }],
                education: [{ institution: 'Yonsei University', degree: 'Bachelor of Arts', fieldOfStudy: 'Consumer Psychology', startYear: 2013, endYear: 2017 }],
                certifications: [{ name: 'Google Analytics Certified', issuer: 'Google', issueDate: '2022-05' }],
                availability: { status: 'Available', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/yunaparkpm' },
                job: pmJob._id,
            },
            {
                firstName: 'Carlos', lastName: 'Reyes',
                email: 'carlos.reyes@productmx.com',
                headline: 'Logistics & supply-chain PM driving operational efficiency',
                bio: 'Carlos translates complex operational workflows into elegant digital products, cutting logistics costs by millions for the companies he has worked with.',
                location: 'Mexico City, Mexico',
                skills: [{ name: 'Product Strategy', level: 'Advanced', yearsOfExperience: 6 }, { name: 'Roadmap Planning', level: 'Expert', yearsOfExperience: 5 }, { name: 'Stakeholder Management', level: 'Advanced', yearsOfExperience: 5 }],
                languages: [{ name: 'Spanish', proficiency: 'Native' }, { name: 'English', proficiency: 'Fluent' }],
                experience: [{ company: 'Linio', role: 'Product Manager, Logistics', startDate: '2019-01', endDate: 'Present', description: 'Built route-optimisation tool that reduced last-mile delivery cost by 22%.', technologies: ['Tableau', 'JIRA', 'SQL'], isCurrent: true }],
                education: [{ institution: 'ITAM', degree: 'Bachelor of Engineering', fieldOfStudy: 'Industrial Engineering', startYear: 2012, endYear: 2016 }],
                availability: { status: 'Open to Opportunities', type: 'Full-time' },
                socialLinks: { linkedin: 'https://linkedin.com/in/carlosreyespm', github: 'https://github.com/carlosreyes' },
                job: pmJob._id,
            },
        ];

        await Candidate.insertMany(pmCandidates);

    } catch (error) {
        console.error('Error generating mock data:', error);
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;

    const user: any = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'development' ? "lax" : "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            company: user.company,
            avatar: user.avatar,
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req: AuthRequest, res: Response) => {
    const { name, email, password, company, role } = req.body;

    if (password.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters long' });
        return;
    }

    if (password.length > 30) {
        res.status(400).json({ message: 'Password must be no more than 30 characters long' });
        return;
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
        company,
        role: role || 'recruiter',
    });

    if (user) {
        // Generate mock data in the background
        generateMockData(user._id as unknown as string);

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'development' ? "lax" : "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            company: user.company,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = async (req: AuthRequest, res: Response) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'development' ? "lax" : "none",
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            company: user.company,
            avatar: user.avatar,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Delete user account + all jobs & candidates
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = async (req: AuthRequest, res: Response) => {
    const userId = req.user._id;

    // 1. Find all jobs owned by the user
    const jobs = await Job.find({ recruiter: userId });
    const jobIds = jobs.map((j) => j._id);

    // 2. Delete all candidates linked to those jobs
    if (jobIds.length > 0) {
        await Candidate.deleteMany({ job: { $in: jobIds } });
    }

    // 3. Delete all the user's jobs
    await Job.deleteMany({ recruiter: userId });

    // 4. Delete the user
    await User.findByIdAndDelete(userId);

    // 5. Clear the auth cookie
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: 'Account and all associated data deleted successfully' });
};

export {
    authUser,
    registerUser,
    getUserProfile,
    logoutUser,
    deleteAccount,
};
