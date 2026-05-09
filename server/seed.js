require('dotenv').config();
const mongoose = require('mongoose');
const Expert   = require('./models/Expert');
const connectDB = require('./config/db');

const generateSlots = () => {
  const slots = [];
  const times = ['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM'];
  for (let d = 1; d <= 7; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    times.forEach(time => slots.push({ date: dateStr, time, isBooked: false }));
  }
  return slots;
};

const experts = [
  { name: 'Dr. Ananya Sharma',  category: 'Technology', experience: 8,  rating: 4.8, bio: 'Full-stack developer & AI researcher with 8 years experience.', image: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Rahul Mehta',        category: 'Finance',    experience: 12, rating: 4.6, bio: 'Certified financial planner helping startups scale.', image: 'https://i.pravatar.cc/150?img=2' },
  { name: 'Priya Nair',         category: 'Design',     experience: 6,  rating: 4.9, bio: 'UX/UI designer with expertise in mobile-first design.', image: 'https://i.pravatar.cc/150?img=3' },
  { name: 'Vikram Singh',       category: 'Marketing',  experience: 10, rating: 4.5, bio: 'Growth hacker and digital marketing strategist.', image: 'https://i.pravatar.cc/150?img=4' },
  { name: 'Sneha Patel',        category: 'Technology', experience: 5,  rating: 4.7, bio: 'Cloud architect specializing in AWS and DevOps.', image: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Arjun Kapoor',       category: 'Finance',    experience: 9,  rating: 4.4, bio: 'Investment advisor and stock market expert.', image: 'https://i.pravatar.cc/150?img=6' },
  { name: 'Meera Iyer',         category: 'Design',     experience: 7,  rating: 4.8, bio: 'Brand designer with Fortune 500 experience.', image: 'https://i.pravatar.cc/150?img=7' },
  { name: 'Karan Joshi',        category: 'Marketing',  experience: 4,  rating: 4.3, bio: 'Social media and content marketing specialist.', image: 'https://i.pravatar.cc/150?img=8' },
  { name: 'Divya Reddy',        category: 'Technology', experience: 11, rating: 4.9, bio: 'Cybersecurity expert and ethical hacker.', image: 'https://i.pravatar.cc/150?img=9' },
  { name: 'Amit Bose',          category: 'Finance',    experience: 15, rating: 4.7, bio: 'Senior CA with expertise in tax planning.', image: 'https://i.pravatar.cc/150?img=10' },
];

const seed = async () => {
  await connectDB();
  await Expert.deleteMany();
  const withSlots = experts.map(e => ({ ...e, timeSlots: generateSlots() }));
  await Expert.insertMany(withSlots);
  console.log('✅ Database seeded successfully!');
  process.exit();
};

seed();