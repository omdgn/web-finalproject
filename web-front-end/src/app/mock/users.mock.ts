import { User } from '../models/user.model';

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'ahmet.yilmaz@email.com',
    password: 'password123!',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    city: 'Istanbul',
    country: 'Turkey',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    registrationDate: '2024-01-15',
    isActive: true
  },
  {
    id: 'user-2',
    email: 'fatma.kaya@email.com',
    password: 'mypass456@',
    firstName: 'Fatma',
    lastName: 'Kaya',
    city: 'Ankara',
    country: 'Turkey',
    photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b742?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    registrationDate: '2024-02-20',
    isActive: true
  },
  {
    id: 'user-3',
    email: 'mehmet.oz@email.com',
    password: 'secure789#',
    firstName: 'Mehmet',
    lastName: 'Öz',
    city: 'Izmir',
    country: 'Turkey',
    registrationDate: '2024-03-10',
    isActive: true
  },
  {
    id: 'user-4',
    email: 'zeynep.demir@email.com',
    password: 'strong321$',
    firstName: 'Zeynep',
    lastName: 'Demir',
    city: 'Antalya',
    country: 'Turkey',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    registrationDate: '2024-04-05',
    isActive: true
  },
  {
    id: 'user-5',
    email: 'can.arslan@email.com',
    password: 'password999&',
    firstName: 'Can',
    lastName: 'Arslan',
    city: 'Bursa',
    country: 'Turkey',
    registrationDate: '2024-05-12',
    isActive: true
  },
  {
    id: 'user-6',
    email: 'elif.yildiz@email.com',
    password: 'elif2024!',
    firstName: 'Elif',
    lastName: 'Yıldız',
    city: 'Istanbul',
    country: 'Turkey',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    registrationDate: '2024-06-18',
    isActive: true
  },
  {
    id: 'user-7',
    email: 'oguz.kaan@email.com',
    password: 'kaan123@',
    firstName: 'Oğuz',
    lastName: 'Kaan',
    city: 'Ankara',
    country: 'Turkey',
    registrationDate: '2024-07-22',
    isActive: true
  },
  {
    id: 'user-8',
    email: 'selin.ozkan@email.com',
    password: 'selin456#',
    firstName: 'Selin',
    lastName: 'Özkan',
    city: 'Nevsehir',
    country: 'Turkey',
    photoUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    registrationDate: '2024-08-30',
    isActive: true
  },
  {
    id: 'google-user-1',
    email: 'test.google@gmail.com',
    password: 'google-mock-password',
    firstName: 'Google',
    lastName: 'Test User',
    city: 'Istanbul',
    country: 'Turkey',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    registrationDate: '2024-01-01',
    isActive: true
  }
];
